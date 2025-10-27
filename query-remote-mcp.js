#!/usr/bin/env node

/**
 * Query Remote Rube MCP Server for Tools
 * Uses MCP over HTTP to get the complete tool list
 */

const https = require('https');

async function queryRemoteMcp() {
  console.log('🌐 Querying remote Rube MCP server at https://rube.app/mcp...\n');

  const apiKey = process.env.RUBE_AUTH || process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH or COMPOSIO_API_KEY not set');
    console.log('💡 Set it with: export RUBE_AUTH=your_token_here');
    return;
  }

  try {
    // First, try to initialize the MCP session
    console.log('📤 Sending MCP initialize request...');

    const initData = JSON.stringify({
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
    });

    const initResponse = await makeMcpRequest(initData);
    console.log('✅ Initialize response received');

    // Now request the tools list
    console.log('📤 Requesting tools list...');

    const toolsData = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    });

    const toolsResponse = await makeMcpRequest(toolsData);

    if (toolsResponse && toolsResponse.result && toolsResponse.result.tools) {
      const tools = toolsResponse.result.tools;
      console.log(`\n🎯 Found ${tools.length} tools available:\n`);

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
        categories[category].slice(0, 3).forEach(tool => {
          console.log(`   • ${tool.name}: ${tool.description || 'No description'}`);
        });
        if (categories[category].length > 3) {
          console.log(`   ... and ${categories[category].length - 3} more`);
        }
        console.log('');
      });

      console.log(`\n📊 Total: ${tools.length} tools across ${Object.keys(categories).length} categories`);

      return tools;
    } else {
      console.log('❌ No tools found in response');
      console.log('Response:', JSON.stringify(toolsResponse, null, 2));
    }

  } catch (error) {
    console.error('❌ Error querying remote MCP:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

function makeMcpRequest(data) {
  return new Promise((resolve, reject) => {
    const endpointUrl = process.env.RUBE_ENDPOINT || 'https://rube.app/mcp';
    const url = new URL(endpointUrl);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RUBE_AUTH || process.env.COMPOSIO_API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const response = JSON.parse(body);
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the query
queryRemoteMcp().then(tools => {
  if (tools) {
    console.log(`\n✅ Successfully retrieved ${tools.length} tools from Rube MCP server!`);
  }
}).catch(error => {
  console.error('❌ Query failed:', error);
  process.exit(1);
});