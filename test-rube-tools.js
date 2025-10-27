#!/usr/bin/env node

/**
 * Test Rube MCP Tools - Sample Tool Calls
 * Tests a representative sample of tools from different categories
 */

import https from 'https';

async function testRubeTools() {
  console.log('🧪 Testing Rube MCP Tools - Sample Calls\n');

  const apiKey = process.env.RUBE_AUTH;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH not set');
    console.log('💡 Set it with: export RUBE_AUTH=your_token_here');
    return;
  }

  const endpointUrl = process.env.RUBE_ENDPOINT || 'https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472';

  // Test cases - safe, read-only operations
  const testCases = [
    {
      name: 'tools/list',
      description: 'List all available tools',
      params: {}
    },
    {
      name: 'COMPOSIO_LIST_TOOLKITS',
      description: 'List available toolkits',
      params: {}
    },
    {
      name: 'OPENROUTER_LIST_AVAILABLE_MODELS',
      description: 'List available AI models',
      params: {}
    },
    {
      name: 'GMAIL_GET_PROFILE',
      description: 'Get Gmail profile (read-only)',
      params: {}
    },
    {
      name: 'GOOGLEDRIVE_GET_ABOUT',
      description: 'Get Drive information (read-only)',
      params: {}
    },
    {
      name: 'NOTION_LIST_USERS',
      description: 'List Notion users (read-only)',
      params: {}
    },
    {
      name: 'TELEGRAM_GET_ME',
      description: 'Get bot information (read-only)',
      params: {}
    },
    {
      name: 'SUPABASE_LIST_ALL_PROJECTS',
      description: 'List Supabase projects (read-only)',
      params: {}
    },
    {
      name: 'NOTION_SEARCH_NOTION_PAGE',
      description: 'Search Notion pages to find parent ID',
      params: { query: 'test' }
    },
    {
      name: 'NOTION_CREATE_NOTION_PAGE',
      description: 'Create a new Notion page using Rube',
      params: {
        parent_id: '272cc32a-94ae-806f-8b47-dc1da7234fdb',
        title: 'Test Page Created by Rube',
        content: [
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'This page was created using the Rube MCP server integration with OpenCode!'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔧 Testing: ${testCase.name}`);
    console.log(`📝 ${testCase.description}`);

    try {
      const result = await callTool(testCase.name, testCase.params);
      console.log('✅ Success: Response received');
      if (testCase.name === 'NOTION_SEARCH_NOTION_PAGE' && result) {
        console.log('📄 Found pages:', JSON.stringify(result, null, 2).substring(0, 500) + '...');
      }
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎉 Tool testing complete!');
  console.log('Note: Some tools may fail due to missing authentication or configuration for specific services.');
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
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${process.env.RUBE_AUTH}`,
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
            // Parse SSE response
            const lines = body.trim().split('\n');
            let dataLine = '';
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                dataLine = line.substring(6);
                break;
              }
            }
            if (dataLine) {
              const response = JSON.parse(dataLine);
              if (response.result) {
                if (toolName === 'NOTION_SEARCH_NOTION_PAGE') {
                  console.log('🔍 Notion search result:', JSON.stringify(response.result, null, 2).substring(0, 1000));
                }
                resolve(response.result);
              } else if (response.error) {
                reject(new Error(response.error.message || 'Tool call failed'));
              } else {
                resolve(null);
              }
            } else {
              reject(new Error('No data in SSE response'));
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

// Run the tests
testRubeTools().then(() => {
  console.log('\n✅ All tests completed');
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});