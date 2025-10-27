#!/bin/bash

# Script to demonstrate getting actual data from Perplexity and Notion MCP servers

echo "🔍 Getting Data from Perplexity and Notion Servers"
echo "================================================="

# Function to make JSON-RPC call and show response
make_rpc_call() {
    local server_cmd="$1"
    local method="$2"
    local params="$3"
    local description="$4"

    echo ""
    echo "📡 $description"
    echo "Server: $server_cmd"
    echo "Method: $method"
    echo "Params: $params"

    # Create temporary files for the conversation
    local init_file=$(mktemp)
    local call_file=$(mktemp)

    # Initialize request
    cat > "$init_file" << EOF
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}
EOF

    # Tool call request
    cat > "$call_file" << EOF
{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "$method", "arguments": $params}}
EOF

    echo "🔄 Making requests..."

    # Start server and send requests
    (
        cat "$init_file"
        sleep 1
        cat "$call_file"
    ) | timeout 15s $server_cmd 2>/dev/null | head -10

    # Cleanup
    rm -f "$init_file" "$call_file"
}

echo ""
echo "🧠 PERPLEXITY SERVER - AI-Powered Answers"
echo "========================================"

# Test Perplexity with a simple question
make_rpc_call \
    "npx --yes @perplexityai/mcp-server-perplexity" \
    "ask_perplexity" \
    '{"query": "What is the current state of AI safety research?"}' \
    "Getting AI safety research information from Perplexity"

echo ""
echo "📝 NOTION SERVER - Workspace Data"
echo "================================="

# Test Notion by listing databases
make_rpc_call \
    "npx --yes @notionhq/mcp-server-notion" \
    "list_databases" \
    '{}' \
    "Listing Notion databases in workspace"

echo ""
echo "✅ Data retrieval demonstration complete!"
echo ""
echo "💡 To get more data, use OpenCode:"
echo "   opencode run 'explain quantum computing'"
echo "   opencode run 'show my notion pages'"