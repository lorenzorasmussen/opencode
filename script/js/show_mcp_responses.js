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

// Show response and test Notion
setTimeout(() => {
    perplexity.kill();
    console.log('Perplexity Response:', perplexityResponse.substring(0, 500) + '...\n');

    console.log('📝 Testing Notion Server - Getting Workspace Data\n');

    const notion = spawn('npx', ['--yes', '@notionhq/mcp-server-notion'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let notionResponse = '';

    notion.stdout.on('data', (data) => {
        notionResponse += data.toString();
    });

    notion.stderr.on('data', (data) => {
        console.log('Notion Error:', data.toString());
    });

    // Send initialize request
    setTimeout(() => {
        notion.stdin.write(JSON.stringify({
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
        notion.stdin.write(JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
                name: "list_databases",
                arguments: {}
            }
        }) + '\n');
    }, 2000);

    // Show final response
    setTimeout(() => {
        notion.kill();
        console.log('Notion Response:', notionResponse.substring(0, 500) + '...');
        console.log('\n✅ Data retrieval test complete!');
    }, 4000);

}, 4000);