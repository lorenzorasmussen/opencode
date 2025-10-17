#!/bin/bash

# MCP Server Testing Script
# This script demonstrates how to query each MCP server and see actual results

set -e

echo "🔧 MCP Server Testing Guide"
echo "============================"

# Function to send JSON-RPC request to MCP server
send_request() {
    local server_cmd="$1"
    local request="$2"
    local description="$3"

    echo ""
    echo "📡 $description"
    echo "Command: $server_cmd"
    echo "Request: $request"

    # Start server and send request
    echo "$request" | timeout 10s $server_cmd 2>/dev/null | head -5
}

echo ""
echo "1️⃣ FILESYSTEM SERVER"
echo "===================="
send_request "npx --yes @modelcontextprotocol/server-filesystem /Users/lorenzorasmussen/.config/opencode" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available filesystem tools"

echo ""
echo "2️⃣ GIT SERVER"
echo "============="
send_request "npx --yes @modelcontextprotocol/server-git --repository /Users/lorenzorasmussen/.config/opencode" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available git tools"

echo ""
echo "3️⃣ SQLITE SERVER"
echo "================="
send_request "npx --yes @modelcontextprotocol/server-sqlite --db-path /tmp/test_mcp.db" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available SQLite tools"

echo ""
echo "4️⃣ BRAVE SEARCH SERVER"
echo "======================"
send_request "npx --yes @modelcontextprotocol/server-brave-search" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available Brave Search tools"

echo ""
echo "5️⃣ GITHUB SERVER"
echo "================="
send_request "npx --yes @modelcontextprotocol/server-github" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available GitHub tools"

echo ""
echo "6️⃣ PERPLEXITY SERVER"
echo "====================="
send_request "npx --yes @perplexityai/mcp-server-perplexity" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available Perplexity tools"

echo ""
echo "7️⃣ NOTION SERVER"
echo "================="
send_request "npx --yes @notionhq/mcp-server-notion" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available Notion tools"

echo ""
echo "8️⃣ MEMORY SERVER"
echo "================="
send_request "npx --yes @modelcontextprotocol/server-memory" \
    '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' \
    "List available Memory tools"

echo ""
echo "✅ Testing complete!"
echo ""
echo "💡 To run actual tool calls, use OpenCode:"
echo "   opencode run 'list files in current directory'"
echo "   opencode run 'search for AI news on Brave'"
echo "   opencode run 'check git status'"