#!/usr/bin/env node

/**
 * Test script for Composio MCP server connection
 * Usage: node test-mcp.js
 */

async function testMcpConnection() {
  console.log("🧪 Testing Composio MCP server connection...");

  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    console.error("❌ COMPOSIO_API_KEY environment variable not set");
    console.log("📝 Get your API key from: https://app.composio.dev/");
    console.log("💡 Set it with: export COMPOSIO_API_KEY='your-key-here'");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to Composio MCP server...");

    // Test with direct HTTP request (Server-Sent Events)
    const response = await fetch("https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {}
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log("✅ Successfully connected to MCP server");

    // Read the Server-Sent Events response
    console.log("🔧 Fetching available tools...");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let toolsFound = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.result && data.result.tools) {
              const tools = data.result.tools;
              console.log(`📋 Found ${tools.length} tools:`);
              tools.slice(0, 10).forEach((tool, index) => {
                console.log(`  ${index + 1}. ${tool.name}: ${tool.description || 'No description'}`);
              });

              if (tools.length > 10) {
                console.log(`  ... and ${tools.length - 10} more tools`);
              }

              toolsFound = true;
              break;
            }
          } catch (e) {
            // Ignore parsing errors for non-JSON lines
          }
        }
      }

      if (toolsFound) break;
    }

    if (!toolsFound) {
      console.log("⚠️  Tools data not found in response");
    }

    console.log("✅ Test completed successfully!");

  } catch (error) {
    console.error("❌ MCP connection test failed:", error.message);
    if (error.message.includes("401")) {
      console.log("💡 This might be an invalid API key. Check your COMPOSIO_API_KEY.");
    } else if (error.message.includes("403")) {
      console.log("💡 This might be a permissions issue. Check your Composio account settings.");
    }
    process.exit(1);
  }
}

testMcpConnection();