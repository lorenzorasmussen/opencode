#!/usr/bin/env node

/**
 * Get ALL Tools from Composio MCP Server
 * Enhanced version that handles streaming and gets complete tool list
 */

const { spawn } = require('child_process');

async function getAllMcpTools() {
  console.log('🔧 Getting ALL tools from Composio MCP Server...\n');

  return new Promise((resolve, reject) => {
    try {
      // Start the MCP server
      const server = spawn('composio-mcp-server', [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      let serverOutput = '';
      let serverError = '';
      let responses = [];

      server.stdout.on('data', (data) => {
        const chunk = data.toString();
        serverOutput += chunk;

        // Try to parse JSON responses as they come
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              const response = JSON.parse(line.trim());
              responses.push(response);
            } catch (e) {
              // Not a complete JSON object yet
            }
          }
        }
      });

      server.stderr.on('data', (data) => {
        serverError += data.toString();
      });

      server.on('close', (code) => {
        processResponses();
      });

      // Wait for server to initialize
      setTimeout(() => {
        if (serverError.includes('Error') || serverError.includes('COMPOSIO_API_KEY is not set')) {
          console.error('❌ Server failed to start:', serverError);
          server.kill();
          reject(new Error('Server startup failed'));
          return;
        }

        console.log('✅ MCP server started successfully');

        // Send initialize message
        const initMessage = {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'opencode-tools-query',
              version: '1.0.0'
            }
          }
        };

        console.log('📤 Sending initialize request...');
        server.stdin.write(JSON.stringify(initMessage) + '\n');

        // Wait and send tools/list request
        setTimeout(() => {
          const toolsMessage = {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list',
            params: {}
          };

          console.log('📤 Requesting complete tools list...');
          server.stdin.write(JSON.stringify(toolsMessage) + '\n');

          // Wait for response and then close
          setTimeout(() => {
            server.kill();
          }, 8000);
        }, 2000);
      }, 3000);

      function processResponses() {
        console.log('\n📋 Processing server responses...\n');

        let tools = [];
        let serverInfo = null;

        for (const response of responses) {
          if (response.id === 1 && response.result) {
            serverInfo = response.result;
            console.log('✅ Server initialized:', serverInfo.serverInfo?.name || 'Unknown');
          } else if (response.id === 2 && response.result && response.result.tools) {
            tools = response.result.tools;
          }
        }

        if (tools.length === 0) {
          console.log('❌ No tools found in responses');
          console.log('Total responses received:', responses.length);
          console.log('Raw output length:', serverOutput.length);
          if (serverError) {
            console.log('Server errors:', serverError);
          }
          resolve([]);
          return;
        }

        console.log(`🎯 Found ${tools.length} tools available:\n`);

        // Group tools by category
        const categories = {};
        tools.forEach(tool => {
          const parts = tool.name.split('_');
          const category = parts.length > 1 ? parts[0].toUpperCase() : 'OTHER';
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(tool);
        });

        // Display tools by category
        Object.keys(categories).sort().forEach(category => {
          console.log(`📁 ${category} (${categories[category].length} tools):`);
          categories[category].forEach(tool => {
            console.log(`   • ${tool.name}: ${tool.description || 'No description'}`);
          });
          console.log('');
        });

        console.log(`\n📊 Total: ${tools.length} tools across ${Object.keys(categories).length} categories`);

        // Show detailed info for first tool
        if (tools.length > 0) {
          console.log('\n🔍 Sample tool details:');
          const sampleTool = tools[0];
          console.log(`Name: ${sampleTool.name}`);
          console.log(`Description: ${sampleTool.description}`);
          if (sampleTool.inputSchema && sampleTool.inputSchema.properties) {
            console.log('Input Parameters:');
            Object.keys(sampleTool.inputSchema.properties).forEach(param => {
              const prop = sampleTool.inputSchema.properties[param];
              console.log(`  - ${param}: ${prop.description || prop.type || 'Unknown'}`);
            });
          }
        }

        resolve(tools);
      }

    } catch (error) {
      console.error('❌ Error getting MCP tools:', error.message);
      reject(error);
    }
  });
}

// Run the tool discovery
getAllMcpTools().then(tools => {
  console.log(`\n✅ Tool discovery complete! Found ${tools.length} tools.`);
}).catch(error => {
  console.error('❌ Tool discovery failed:', error);
  process.exit(1);
});