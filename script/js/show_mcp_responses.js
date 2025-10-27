const { spawn } = require('child_process');
const fs = require('fs');

// Test Perplexity Server
console.log('🧠 Testing Perplexity Server - Getting AI Answer\n');

const perplexity = spawn('npx', ['--yes', '@perplexityai/mcp-server-perplexity'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let perplexityResponse = '';

perplexity.stdout.on('data', (data) => {
    perplexityResponse += data.toString();
});

perplexity.stderr.on('data', (data) => {
    console.log('Perplexity Error:', data.toString());
});

// Send initialize request
setTimeout(() => {
    perplexity.stdin.write(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "test-client", version: "1.0.0" }
        }
    }) + '\n');
}, 1000);

// Send tool call
setTimeout(() => {
    perplexity.stdin.write(JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "ask_perplexity",
            arguments: {
                query: "What are the main challenges in AI safety?"
            }
        }
    }) + '\n');
}, 2000);

// Show response
setTimeout(() => {
    perplexity.kill();
    console.log('Perplexity Response:', perplexityResponse.substring(0, 500) + '...\n');

    console.log('📝 Notion access is now through Rube MCP server');
    console.log('Use test-notion-page.js for Notion testing\n');

    console.log('\n✅ Data retrieval test complete!');
}, 4000);