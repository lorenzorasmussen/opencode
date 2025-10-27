#!/usr/bin/env node

/**
 * Test Real Tool Calls - Actual API Operations
 * Tests tools that perform real operations (read-only where possible)
 */

const https = require('https');

async function testRealTools() {
  console.log('🔥 Testing Real Tool Calls - Actual API Operations\n');
  console.log('⚠️  These tests make real API calls to connected services\n');

  const apiKey = process.env.RUBE_AUTH;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH not set');
    console.log('💡 Set it with: export RUBE_AUTH=your_token_here');
    return;
  }

  // Real test cases - actual API operations
  const testCases = [
    {
      category: 'GMAIL',
      tool: 'GMAIL_LIST_EMAILS',
      params: { maxResults: 5 },
      description: 'List recent emails from inbox',
      expected: 'Should return email list or auth error'
    },
    {
      category: 'GOOGLEDRIVE',
      tool: 'GOOGLEDRIVE_LIST_FILES',
      params: { pageSize: 10, orderBy: 'modifiedTime desc' },
      description: 'List recent Google Drive files',
      expected: 'Should return file list or auth error'
    },
    {
      category: 'NOTION',
      tool: 'NOTION_LIST_USERS',
      params: {},
      description: 'List Notion workspace users',
      expected: 'Should return user list or auth error'
    },
    {
      category: 'SUPABASE',
      tool: 'SUPABASE_LIST_ALL_PROJECTS',
      params: {},
      description: 'List Supabase projects',
      expected: 'Should return project list or auth error'
    },
    {
      category: 'TELEGRAM',
      tool: 'TELEGRAM_GET_ME',
      params: {},
      description: 'Get Telegram bot information',
      expected: 'Should return bot info or auth error'
    },
    {
      category: 'GOOGLECALENDAR',
      tool: 'GOOGLECALENDAR_LIST_CALENDARS',
      params: {},
      description: 'List Google Calendar calendars',
      expected: 'Should return calendar list or auth error'
    },
    {
      category: 'MEM0',
      tool: 'MEM0_GET_PROJECTS',
      params: {},
      description: 'List Mem0 projects',
      expected: 'Should return project list or auth error'
    },
    {
      category: 'OPENROUTER',
      tool: 'OPENROUTER_LIST_AVAILABLE_MODELS',
      params: {},
      description: 'List available AI models',
      expected: 'Should return model list'
    }
  ];

  console.log('📋 Test Plan:');
  testCases.forEach((test, index) => {
    console.log(`${index + 1}. ${test.category}: ${test.description}`);
  });
  console.log('');

  for (const testCase of testCases) {
    console.log(`🔧 Testing ${testCase.category}: ${testCase.tool}`);
    console.log(`   ${testCase.description}`);
    console.log(`   Expected: ${testCase.expected}`);

    try {
      const startTime = Date.now();
      const result = await callTool(testCase.tool, testCase.params);
      const duration = Date.now() - startTime;

      if (result !== null && result !== undefined) {
        console.log(`   ✅ Success (${duration}ms)`);

        // Show sample of results
        if (Array.isArray(result)) {
          console.log(`   📊 Returned ${result.length} items`);
          if (result.length > 0) {
            console.log(`   🔍 Sample: ${JSON.stringify(result[0]).substring(0, 100)}...`);
          }
        } else if (typeof result === 'object') {
          const keys = Object.keys(result);
          console.log(`   📊 Returned object with keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
        } else {
          console.log(`   📊 Result: ${JSON.stringify(result).substring(0, 100)}`);
        }
      } else {
        console.log(`   ⚠️  No result returned (${duration}ms)`);
      }

    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }

    console.log('');
    // Longer delay between real API calls
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('🎉 Real tool testing complete!');
  console.log('Note: Some services may require additional setup or authentication.');
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
      timeout: 45000 // 45 second timeout for real API calls
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
      reject(new Error('Request timeout - API may be slow or unresponsive'));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the real tool tests
testRealTools().then(() => {
  console.log('\n✅ All real tool tests completed');
}).catch(error => {
  console.error('❌ Real tool testing failed:', error);
  process.exit(1);
});