#!/bin/bash

# Improved MCP Server Testing with Real Data Retrieval
# This script properly tests each MCP server and shows actual responses

set -e

echo "🔬 Improved MCP Server Testing"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test server with proper JSON-RPC protocol
test_server() {
    local server_name="$1"
    local server_cmd="$2"
    local test_description="$3"

    echo ""
    echo -e "${BLUE}🧪 Testing $server_name${NC}"
    echo -e "${BLUE}$(printf '%.0s=' {1..50})${NC}"
    echo "Description: $test_description"
    echo "Command: $server_cmd"

    # Create temporary files for the conversation
    local init_file=$(mktemp)
    local list_tools_file=$(mktemp)
    local test_call_file=$(mktemp)
    local response_file=$(mktemp)

    # Initialize request
    cat > "$init_file" << EOF
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}
EOF

    # List tools request
    cat > "$list_tools_file" << EOF
{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}
EOF

    # Test tool call (customized per server)
    case "$server_name" in
        "Filesystem")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "list_dir", "arguments": {"path": "/Users/lorenzorasmussen/.config/opencode"}}}
EOF
            ;;
        "Git")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "git_status", "arguments": {}}}
EOF
            ;;
        "SQLite")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "run_query", "arguments": {"query": "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT); INSERT INTO test (name) VALUES ('Hello MCP'); SELECT * FROM test;"}}}
EOF
            ;;
        "Brave Search")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "brave_web_search", "arguments": {"query": "latest AI news"}}}
EOF
            ;;
        "GitHub")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "get_user", "arguments": {"username": "octocat"}}}
EOF
            ;;
        "Perplexity")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "ask_perplexity", "arguments": {"query": "What is the capital of France?"}}}
EOF
            ;;
        "Notion")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "list_databases", "arguments": {}}}
EOF
            ;;
        "Memory")
            cat > "$test_call_file" << EOF
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "create_entities", "arguments": {"entities": [{"name": "TestEntity", "entityType": "test", "observations": ["This is a test entity for MCP"]}]}}}
EOF
            ;;
    esac

    echo ""
    echo -e "${YELLOW}🚀 Starting server and sending requests...${NC}"

    # Run the server with all requests and capture output
    {
        cat "$init_file"
        sleep 2
        cat "$list_tools_file"
        sleep 2
        cat "$test_call_file"
    } | timeout 30s $server_cmd 2>"$response_file.stderr" > "$response_file" || true

    # Check if server started successfully
    if grep -q "Server started" "$response_file" 2>/dev/null; then
        echo -e "${GREEN}✅ Server started successfully${NC}"
    else
        echo -e "${RED}❌ Server failed to start${NC}"
        if [ -s "$response_file.stderr" ]; then
            echo -e "${RED}Error output:${NC}"
            cat "$response_file.stderr"
        fi
    fi

    # Show available tools
    if grep -q '"method": "tools/list"' "$list_tools_file" 2>/dev/null; then
        echo ""
        echo -e "${GREEN}📋 Available Tools:${NC}"
        # Extract tools from response (this is a simplified extraction)
        grep -A 50 '"tools"' "$response_file" 2>/dev/null | head -20 || echo "Could not parse tools list"
    fi

    # Show test results
    echo ""
    echo -e "${GREEN}📊 Test Results:${NC}"
    if [ -s "$response_file" ]; then
        # Show last few lines of response (likely the actual data)
        tail -10 "$response_file" | grep -v "Server started" | grep -v "Listening on stdio" || echo "No response data captured"
    else
        echo -e "${RED}No response data received${NC}"
    fi

    # Cleanup
    rm -f "$init_file" "$list_tools_file" "$test_call_file" "$response_file" "$response_file.stderr"

    echo -e "${BLUE}$(printf '%.0s=' {1..50})${NC}"
}

# Test each server
test_server "Filesystem" \
    "npx --yes @modelcontextprotocol/server-filesystem /Users/lorenzorasmussen/.config/opencode" \
    "Test file system operations - list directories and read files"

test_server "Git" \
    "npx --yes @modelcontextprotocol/server-git --repository /Users/lorenzorasmussen/.config/opencode" \
    "Test git repository operations - status, commits, branches"

test_server "SQLite" \
    "npx --yes @modelcontextprotocol/server-sqlite --db-path /tmp/mcp_test.db" \
    "Test database operations - create tables, insert/query data"

test_server "Brave Search" \
    "npx --yes @modelcontextprotocol/server-brave-search" \
    "Test web search capabilities using Brave Search API"

test_server "GitHub" \
    "npx --yes @modelcontextprotocol/server-github" \
    "Test GitHub API access - users, repos, issues"

test_server "Perplexity" \
    "npx --yes @perplexityai/mcp-server-perplexity" \
    "Test AI-powered search and answers from Perplexity"

test_server "Notion" \
    "npx --yes @notionhq/mcp-server-notion" \
    "Test Notion workspace access - databases and pages"

test_server "Memory" \
    "npx --yes @modelcontextprotocol/server-memory" \
    "Test knowledge graph memory - store and retrieve information"

echo ""
echo -e "${GREEN}🎉 MCP Server Testing Complete!${NC}"
echo ""
echo -e "${BLUE}💡 Next Steps:${NC}"
echo "1. Check which servers started successfully (✅)"
echo "2. Review error messages for failed servers (❌)"
echo "3. Use OpenCode for interactive testing: opencode run 'your query here'"
echo "4. Check MCP_USAGE_GUIDE.md for detailed usage examples"