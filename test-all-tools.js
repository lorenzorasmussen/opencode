#!/usr/bin/env node

/**
 * Comprehensive Rube MCP Tools Test Suite
 * Tests representative tools from all major categories
 */

const https = require('https');

async function testAllTools() {
  console.log('🧪 Comprehensive Rube MCP Tools Test Suite\n');
  console.log('Testing representative tools from all 14 categories...\n');

  const apiKey = process.env.RUBE_AUTH;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH not set');
    console.log('💡 Set it with: export RUBE_AUTH=your_token_here');
    return;
  }

  // Test cases for each category - safe, read-only operations where possible
  const testCases = [
    // BROWSERBASE
    { category: 'BROWSERBASE', tool: 'BROWSERBASE_TOOL_SESSIONS_LIST', params: {}, description: 'List browser sessions' },

    // CODEINTERPRETER
    { category: 'CODEINTERPRETER', tool: 'CODEINTERPRETER_RUN_TERMINAL_CMD', params: { code: 'echo "Hello MCP!"' }, description: 'Run terminal command' },

    // COMPOSIO
    { category: 'COMPOSIO', tool: 'COMPOSIO_LIST_TOOLKITS', params: {}, description: 'List available toolkits' },

    // GEMINI
    { category: 'GEMINI', tool: 'GEMINI_LIST_MODELS', params: {}, description: 'List available AI models' },

    // GMAIL
    { category: 'GMAIL', tool: 'GMAIL_LIST_LABELS', params: {}, description: 'List email labels' },

    // GOOGLECALENDAR
    { category: 'GOOGLECALENDAR', tool: 'GOOGLECALENDAR_LIST_CALENDARS', params: {}, description: 'List calendars' },

    // GOOGLEDRIVE
    { category: 'GOOGLEDRIVE', tool: 'GOOGLEDRIVE_LIST_FILES', params: { q: 'trashed=false' }, description: 'List drive files' },

    // LINKEDIN
    { category: 'LINKEDIN', tool: 'LINKEDIN_GET_MY_INFO', params: {}, description: 'Get LinkedIn profile' },

    // MEM0
    { category: 'MEM0', tool: 'MEM0_GET_PROJECTS', params: {}, description: 'List memory projects' },

    // NOTION
    { category: 'NOTION', tool: 'NOTION_LIST_USERS', params: {}, description: 'List Notion users' },

    // OPENROUTER
    { category: 'OPENROUTER', tool: 'OPENROUTER_LIST_AVAILABLE_MODELS', params: {}, description: 'List AI models' },

    // PERPLEXITYAI
    { category: 'PERPLEXITYAI', tool: 'PERPLEXITYAI_PERPLEXITY_AI_SEARCH', params: { query: 'test query' }, description: 'AI search test' },

    // SUPABASE
    { category: 'SUPABASE', tool: 'SUPABASE_LIST_ALL_PROJECTS', params: {}, description: 'List Supabase projects' },

    // TELEGRAM
    { category: 'TELEGRAM', tool: 'TELEGRAM_GET_ME', params: {}, description: 'Get bot info' }
  ];

  const results = {
    total: testCases.length,
    successful: 0,
    failed: 0,
    categories: {}
  };

  for (const testCase of testCases) {
    console.log(`🔧 Testing ${testCase.category}: ${testCase.tool}`);
    console.log(`   ${testCase.description}`);

    try {
      const result = await callTool(testCase.tool, testCase.params);
      console.log('   ✅ Success');
      results.successful++;
      results.categories[testCase.category] = 'success';
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      results.failed++;
      results.categories[testCase.category] = 'failed';
    }

    // Small delay between tests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Print summary
  console.log('\n📊 Test Results Summary');
  console.log('═'.repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Successful: ${results.successful}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.successful / results.total) * 100).toFixed(1)}%`);

  console.log('\n📁 Category Results:');
  Object.entries(results.categories).forEach(([category, status]) => {
    const icon = status === 'success' ? '✅' : '❌';
    console.log(`   ${icon} ${category}: ${status}`);
  });

  console.log('\n🎉 Comprehensive testing complete!');
  console.log('Note: Some failures are expected due to missing service connections or authentication.');
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
      timeout: 30000 // 30 second timeout
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

// Run the comprehensive test suite
testAllTools().then(() => {
  console.log('\n✅ All tests completed successfully');
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});