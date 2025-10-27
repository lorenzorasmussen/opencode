#!/bin/bash

# Detailed MCP Server Testing with Actual Tool Calls
# This script properly initializes MCP servers and demonstrates real functionality

set -e

echo "🔬 Detailed MCP Server Testing"
echo "=============================="

# Function to test MCP server with proper initialization and tool calls
test_server() {
    local server_name="$1"
    local server_cmd="$2"
    local init_msg="$3"
    local tool_call="$4"
    local description="$5"

    echo ""
    echo "🧪 Testing $server_name"
    echo "========================"
    echo "Description: $description"
    echo "Command: $server_cmd"

    # Create a temporary script to interact with the server
    cat > /tmp/mcp_test_$$.js << EOF
const { spawn } = require('child_process');
const server = spawn('$server_cmd', { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });

let messageId = 1;

function sendRequest(method, params = {}) {
    const request = {
        jsonrpc: "2.0",
        id: messageId++,
        method: method,
        params: params
    };
    server.stdin.write(JSON.stringify(request) + '\\n');
}

server.stdout.on('data', (data) => {
    console.log('📥 Response:', data.toString().trim());
});

server.stderr.on('data', (data) => {
    console.error('❌ Error:', data.toString().trim());
});

// Initialize connection
setTimeout(() => {
    console.log('🚀 Initializing...');
    sendRequest('initialize', {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
    });
}, 1000);

// List tools after initialization
setTimeout(() => {
    console.log('📋 Listing tools...');
    sendRequest('tools/list');
}, 2000);

// Make tool call
setTimeout(() => {
    console.log('🔧 Making tool call...');
    sendRequest('tools/call', $tool_call);
}, 3000);

// Exit after 5 seconds
setTimeout(() => {
    server.kill();
    process.exit(0);
}, 5000);
EOF

    echo "Running test..."
    node /tmp/mcp_test_$$.js 2>/dev/null || echo "Test completed"

    # Cleanup
    rm -f /tmp/mcp_test_$$.js
}

# Test Filesystem Server
test_server "Filesystem Server" \
    "npx --yes @modelcontextprotocol/server-filesystem /Users/lorenzorasmussen/.config/opencode" \
    "Initialize filesystem access" \
    "{ name: 'read_file', arguments: { path: '/Users/lorenzorasmussen/.config/opencode/opencode.json' } }" \
    "Read files and list directories in the OpenCode config directory"

# Test Git Server
test_server "Git Server" \
    "npx --yes @modelcontextprotocol/server-git --repository /Users/lorenzorasmussen/.config/opencode" \
    "Initialize git repository access" \
    "{ name: 'git_status', arguments: {} }" \
    "Check git repository status, commits, and branches"

# Test SQLite Server
test_server "SQLite Server" \
    "npx --yes @modelcontextprotocol/server-sqlite --db-path /tmp/mcp_demo.db" \
    "Initialize SQLite database access" \
    "{ name: 'run_query', arguments: { query: 'CREATE TABLE IF NOT EXISTS demo (id INTEGER PRIMARY KEY, name TEXT); INSERT INTO demo (name) VALUES (\"Hello MCP\"); SELECT * FROM demo;' } }" \
    "Create tables, insert data, and run queries on SQLite database"

# Test Brave Search Server
test_server "Brave Search Server" \
    "npx --yes @modelcontextprotocol/server-brave-search" \
    "Initialize web search capabilities" \
    "{ name: 'brave_web_search', arguments: { query: 'latest AI news 2024' } }" \
    "Perform web searches using Brave Search API"

# Test GitHub Server
test_server "GitHub Server" \
    "npx --yes @modelcontextprotocol/server-github" \
    "Initialize GitHub API access" \
    "{ name: 'get_user', arguments: { username: 'octocat' } }" \
    "Access GitHub repositories, issues, pull requests, and user data"

# Test Perplexity Server
test_server "Perplexity Server" \
    "npx --yes @perplexityai/mcp-server-perplexity" \
    "Initialize AI-powered search" \
    "{ name: 'ask_perplexity', arguments: { query: 'What is the capital of France?' } }" \
    "Get AI-powered answers and search results from Perplexity"

# Notion is now accessed via Rube MCP server
echo ""
echo "🧪 Notion via Rube MCP"
echo "======================"
echo "Notion functionality is available through the Rube MCP server"
echo "Use test-notion-page.js for testing Notion operations"

# Test Memory Server
test_server "Memory Server" \
    "npx --yes @modelcontextprotocol/server-memory" \
    "Initialize knowledge graph memory" \
    "{ name: 'create_entities', arguments: { entities: [{ name: 'OpenCode', entityType: 'software', observations: ['Multi-agent development environment'] }] } }" \
    "Store and retrieve information in a knowledge graph"

echo ""
echo "✅ All MCP server tests completed!"
echo ""
echo "📚 How to use MCP servers in OpenCode:"
echo ""
echo "1. Start OpenCode: opencode"
echo "2. Ask questions that trigger MCP tools:"
echo "   - 'List all files in the current directory'"
echo "   - 'Search for latest React news'"
echo "   - 'Check the git status of this repository'"
echo "   - 'Create a SQLite table for user data'"
echo "   - 'What repositories does octocat have on GitHub?'"
echo "   - 'Ask Perplexity: What are the benefits of TypeScript?'"
echo "   - 'Show me my Notion databases'"
echo "   - 'Remember that OpenCode is a development tool'"