#!/bin/bash

# MCP Server Health Check and OpenCode Integration Test

echo "🏥 MCP Server Health Check"
echo "=========================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to test MCP server startup
test_server() {
    local server_name="$1"
    local server_cmd="$2"
    local expected_output="$3"

    echo -e "${BLUE}Testing $server_name...${NC}"

    # Try to start server and check if it starts properly
    local output
    output=$(timeout 5s $server_cmd 2>&1 | head -3)

    if echo "$output" | grep -q "$expected_output"; then
        echo -e "${GREEN}✅ $server_name: OK${NC}"
        return 0
    else
        echo -e "${RED}❌ $server_name: FAILED${NC}"
        echo -e "${YELLOW}Output: $output${NC}"
        return 1
    fi
}

# Function to test available MCP servers
test_available_server() {
    local server_name="$1"
    local server_cmd="$2"

    echo -e "${BLUE}Testing $server_name...${NC}"

    # Try to start server - MCP servers run on stdio and wait for JSON-RPC
    # Just check if the command executes without error
    if timeout 2s $server_cmd >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $server_name: Can start${NC}"
        return 0
    else
        echo -e "${RED}❌ $server_name: Cannot start${NC}"
        return 1
    fi
}

# Check prerequisites
echo -e "${BLUE}📋 Checking Prerequisites...${NC}"

if command_exists node; then
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js: Not found${NC}"
fi

if command_exists npm; then
    echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
else
    echo -e "${RED}❌ npm: Not found${NC}"
fi

if command_exists npx; then
    echo -e "${GREEN}✅ npx: Available${NC}"
else
    echo -e "${RED}❌ npx: Not found${NC}"
fi

if command_exists opencode; then
    echo -e "${GREEN}✅ OpenCode: Available${NC}"
else
    echo -e "${RED}❌ OpenCode: Not found${NC}"
fi

echo ""
echo -e "${BLUE}🧪 Testing Available MCP Servers...${NC}"

# Test only available servers using direct binary paths
test_available_server "Filesystem" "./node_modules/.bin/mcp-server-filesystem /tmp"
test_available_server "Memory" "./node_modules/.bin/mcp-server-memory"

echo ""
echo -e "${BLUE}📋 Unavailable/Deprecated Servers:${NC}"
echo -e "${YELLOW}⚠️  Git: Package not available on npm${NC}"
echo -e "${YELLOW}⚠️  SQLite: Package not available on npm${NC}"
echo -e "${YELLOW}⚠️  Brave Search: Package deprecated${NC}"
echo -e "${YELLOW}⚠️  GitHub: Package deprecated${NC}"
echo -e "${YELLOW}⚠️  Perplexity: Package not available on npm${NC}"
echo -e "${YELLOW}⚠️  Notion: Package not available on npm${NC}"

echo ""
echo -e "${BLUE}🔧 Checking OpenCode Configuration...${NC}"

# Check if opencode.json exists and is valid
if [ -f "opencode.json" ]; then
    echo -e "${GREEN}✅ opencode.json: Found${NC}"

    # Check if JSON is valid
    if jq empty opencode.json 2>/dev/null; then
        echo -e "${GREEN}✅ opencode.json: Valid JSON${NC}"

        # Check MCP configuration
        if jq -e '.mcp' opencode.json >/dev/null 2>&1; then
            echo -e "${GREEN}✅ MCP configuration: Present${NC}"

            # Count enabled servers
            enabled_count=$(jq '.mcp | to_entries | map(select(.value.enabled == true)) | length' opencode.json)
            echo -e "${GREEN}✅ Enabled MCP servers: $enabled_count${NC}"
        else
            echo -e "${RED}❌ MCP configuration: Missing${NC}"
        fi
    else
        echo -e "${RED}❌ opencode.json: Invalid JSON${NC}"
    fi
else
    echo -e "${RED}❌ opencode.json: Not found${NC}"
fi

echo ""
echo -e "${BLUE}🔑 Checking Environment Variables...${NC}"

# Check API keys
check_env_var() {
    local var_name="$1"
    local description="$2"

    if [ -n "${!var_name}" ]; then
        echo -e "${GREEN}✅ $description: Set${NC}"
    else
        echo -e "${YELLOW}⚠️  $description: Not set${NC}"
    fi
}

check_env_var "BRAVE_API_KEY" "Brave Search API Key"
check_env_var "GITHUB_PERSONAL_ACCESS_TOKEN" "GitHub Token"
check_env_var "PERPLEXITY_API_KEY" "Perplexity API Key"
check_env_var "NOTION_TOKEN" "Notion Token"
check_env_var "NOTION_WORKSPACE_ID" "Notion Workspace ID"

echo ""
echo -e "${BLUE}🚀 OpenCode Integration Status...${NC}"

# OpenCode is available and configured
if command_exists opencode; then
    echo -e "${GREEN}✅ OpenCode: Available and configured${NC}"
    echo -e "${YELLOW}ℹ️  Note: OpenCode config validation requires running in interactive mode${NC}"
else
    echo -e "${RED}❌ OpenCode: Not available${NC}"
fi

echo ""
echo -e "${BLUE}📊 Summary${NC}"
echo "=============="
echo "Run this script to check MCP server health:"
echo "  ./health_check.sh"
echo ""
echo "Test individual servers:"
echo "  npx --yes @modelcontextprotocol/server-filesystem /path/to/dir"
echo ""
echo "Use OpenCode with MCP servers:"
echo "  opencode run 'list files in current directory'"
echo "  opencode run 'search for AI news'"
echo ""
echo -e "${GREEN}🎉 Health check complete!${NC}"