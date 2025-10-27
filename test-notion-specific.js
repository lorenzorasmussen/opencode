#!/usr/bin/env node

/**
 * Test Notion Tools Specifically via Rube-Composio
 * Tests various Notion operations to see what's available
 */

const https = require('https');

async function testNotionTools() {
  console.log('📝 Testing Notion Tools via Rube-Composio MCP...\n');

  const apiKey = process.env.RUBE_AUTH;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH not set');
    console.log('💡 This is your Rube MCP server token, not individual service tokens');
    console.log('💡 Rube handles authentication to Notion, Gmail, etc. automatically');
    return;
  }

  // Test different Notion operations
  const notionTests = [
    {
      tool: 'NOTION_LIST_USERS',
      params: {},
      description: 'List workspace users (should work if Notion is connected)'
    },
    {
      tool: 'NOTION_SEARCH_NOTION_PAGE',
      params: { query: 'test' },
      description: 'Search for pages (tests search functionality)'
    },
    {
      tool: 'NOTION_GET_ABOUT_ME',
      params: {},
      description: 'Get current user info (tests basic auth)'
    }
  ];

  for (const test of notionTests) {
    console.log(`🔧 Testing: ${test.tool}`);
    console.log(`   ${test.description}`);

    try {
      const result = await callTool(test.tool, test.params);
      if (result) {
        console.log('   ✅ Success!');
        if (Array.isArray(result)) {
          console.log(`   📊 Found ${result.length} items`);
        } else {
          console.log(`   📊 Result type: ${typeof result}`);
        }
      } else {
        console.log('   ⚠️  No result returned');
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      if (error.message.includes('auth') || error.message.includes('token')) {
        console.log('   💡 This suggests Notion integration is not connected in Rube');
      }
    }

    console.log('');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('🔍 Notion Integration Status:');
  console.log('If all tests fail with auth errors, you need to:');
  console.log('1. Go to https://rube.app/');
  console.log('2. Connect your Notion account');
  console.log('3. Grant necessary permissions');
  console.log('4. Try the tests again');
}

async function callTool(toolName, params) {
  return new Promise((resolve, reject) => {
    const endpointUrl = process.env.RUBE_ENDPOINT || 'https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472';
    const url = new URL(endpointUrl);

    const requestData = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    };

    const data = JSON.stringify(requestData);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RUBE_AUTH}`,
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
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
            if (response.result !== undefined) {
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

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run Notion-specific tests
testNotionTools().then(() => {
  console.log('\n✅ Notion tool testing completed');
}).catch(error => {
  console.error('❌ Notion testing failed:', error);
  process.exit(1);
});