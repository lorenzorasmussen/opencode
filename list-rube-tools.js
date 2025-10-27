#!/usr/bin/env node

/**
 * List all tools from Rube MCP server
 */

import https from 'https';

async function listRubeTools() {
  console.log('🔧 Listing all tools from Rube MCP server...\n');

  const apiKey = process.env.RUBE_AUTH;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH not set');
    return;
  }

  try {
    const tools = await callRubeTool('tools/list', {});

    if (tools && tools.tools) {
      console.log(`📋 Found ${tools.tools.length} tools:\n`);

      // Group by service
      const byService = {};
      tools.tools.forEach(tool => {
        const service = tool.name.split('_')[0];
        if (!byService[service]) byService[service] = [];
        byService[service].push(tool);
      });

      Object.keys(byService).sort().forEach(service => {
        console.log(`${service} (${byService[service].length} tools):`);
        byService[service].forEach(tool => {
          console.log(`  - ${tool.name}`);
        });
        console.log('');
      });

      // Specifically list Notion tools
      const notionTools = tools.tools.filter(tool => tool.name.startsWith('NOTION_'));
      console.log(`📝 Notion Tools (${notionTools.length}):`);
      notionTools.forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description || 'No description'}`);
      });

    } else {
      console.log('❌ Failed to get tools list');
    }

  } catch (error) {
    console.error('❌ Failed to list tools:', error.message);
  }
}

async function callRubeTool(method, params) {
  return new Promise((resolve, reject) => {
    const endpointUrl = process.env.RUBE_ENDPOINT || 'https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472';
    const url = new URL(endpointUrl);

    const requestData = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: method,
      params: params
    };

    const data = JSON.stringify(requestData);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${process.env.RUBE_AUTH}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk.toString();
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            let jsonBody = body;
            if (body.startsWith('event: message\ndata: ')) {
              jsonBody = body.replace('event: message\ndata: ', '');
            }
            const response = JSON.parse(jsonBody);
            if (response.result) {
              resolve(response.result);
            } else if (response.error) {
              reject(new Error(response.error.message || 'Tool call failed'));
            } else {
              resolve(null);
            }
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

// Run the tool listing
listRubeTools().then(() => {
  console.log('\n✅ Tool listing completed');
}).catch(error => {
  console.error('❌ Tool listing failed:', error);
  process.exit(1);
});