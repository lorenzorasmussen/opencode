# MCP Server Usage Guide

This guide shows how to query each MCP server and see actual results using OpenCode.

## 🚀 Quick Start

All MCP servers are configured and ready to use. Start OpenCode and ask questions that trigger the servers:

```bash
opencode
```

## 📋 Server Capabilities & Example Queries

### 1. Filesystem Server
**Capabilities:** Read/write files, list directories, search files
**Example Queries:**
- "List all files in the current directory"
- "Read the contents of opencode.json"
- "Find all TypeScript files in the project"
- "Show me the directory structure"

### 2. Git Server
**Capabilities:** Repository status, commits, branches, diffs
**Example Queries:**
- "Check git status"
- "Show recent commits"
- "List all branches"
- "Show changes in the last commit"

### 3. SQLite Server
**Capabilities:** Create tables, run queries, manage databases
**Example Queries:**
- "Create a users table with id, name, and email columns"
- "Insert some sample data into the users table"
- "Show me all users in the database"
- "Run a query to find users with gmail addresses"

### 4. Brave Search Server
**Capabilities:** Web search with Brave Search API
**Example Queries:**
- "Search for latest AI news"
- "Find tutorials on React hooks"
- "Search for TypeScript best practices"
- "What's the weather in San Francisco?"

### 5. GitHub Server
**Capabilities:** Access repositories, issues, PRs, user data
**Example Queries:**
- "Show me the octocat user's repositories"
- "Find issues in the facebook/react repository"
- "Show pull requests for microsoft/vscode"
- "Get information about the torvalds/linux repository"

### 6. Perplexity Server
**Capabilities:** AI-powered search and answers
**Example Queries:**
- "What is the capital of France?"
- "Explain quantum computing in simple terms"
- "How does machine learning work?"
- "What are the benefits of functional programming?"

### 7. Notion Server
**Capabilities:** Access databases, pages, workspace content
**Example Queries:**
- "Show me my Notion databases"
- "List all pages in my workspace"
- "Find pages containing 'project'"
- "Show database structure"

### 8. Memory Server
**Capabilities:** Knowledge graph storage and retrieval
**Example Queries:**
- "Remember that OpenCode is a multi-agent development environment"
- "What do you know about OpenCode?"
- "Store this information: MCP stands for Model Context Protocol"
- "Recall what MCP stands for"

## 🔧 Direct Server Testing

If you want to test servers directly (not recommended for normal use):

### Filesystem Server
```bash
# List directory contents
npx --yes @modelcontextprotocol/server-filesystem /Users/lorenzorasmussen/.config/opencode
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### Git Server
```bash
# Check repository status
npx --yes @modelcontextprotocol/server-git --repository /Users/lorenzorasmussen/.config/opencode
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### SQLite Server
```bash
# Run database queries
npx --yes @modelcontextprotocol/server-sqlite --db-path /tmp/test.db
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### Brave Search Server
```bash
# Web search capabilities
npx --yes @modelcontextprotocol/server-brave-search
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### GitHub Server
```bash
# GitHub API access
npx --yes @modelcontextprotocol/server-github
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### Perplexity Server
```bash
# AI-powered search
npx --yes @perplexityai/mcp-server-perplexity
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### Notion Server
```bash
# Notion workspace access
npx --yes @notionhq/mcp-server-notion
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

### Memory Server
```bash
# Knowledge graph memory
npx --yes @modelcontextprotocol/server-memory
# Then send: {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

## 🧪 Testing with OpenCode

**Current Status**: Only Filesystem and Memory MCP servers are currently available and functional.

### Available MCP Servers

#### Filesystem Server ✅
- **Status**: Available and working
- **Capabilities**: File operations, directory listing, search
- **Example**: "List all files in the current directory"

#### Memory Server ✅
- **Status**: Available and working
- **Capabilities**: Knowledge graph storage and retrieval
- **Example**: "Remember that OpenCode is a multi-agent system"

### Deprecated/Unavailable Servers

#### Brave Search Server ⚠️
- **Status**: Deprecated (package discontinued)
- **Issue**: Package no longer maintained by Anthropic

#### GitHub Server ⚠️
- **Status**: Deprecated (package discontinued)
- **Issue**: Package no longer maintained by Anthropic

#### Git Server ❌
- **Status**: Not available
- **Issue**: Package never published to npm

#### SQLite Server ❌
- **Status**: Not available
- **Issue**: Package never published to npm

#### Perplexity Server ❌
- **Status**: Not available
- **Issue**: Package doesn't exist on npm

#### Notion Server ❌
- **Status**: Not available
- **Issue**: Package doesn't exist on npm

### Example Usage (Available Servers)

#### Filesystem Operations
```
User: List all files in the current directory
OpenCode: [Uses filesystem server to list files]
Result: Shows directory contents
```

#### Memory Operations
```
User: Remember that OpenCode supports MCP servers
OpenCode: [Stores information in knowledge graph]
Result: Information stored for future reference

User: What does OpenCode support?
OpenCode: [Retrieves from memory server]
Result: OpenCode supports MCP servers
```

## 🔍 Troubleshooting

### Server Won't Start
- Check API keys are set: `env | grep -E "(BRAVE|GITHUB|PERPLEXITY|NOTION)"`
- Verify server package is installed: `npm list -g | grep mcp-server`

### No Response from Server
- Check server logs for errors
- Verify correct parameters are being sent
- Ensure network connectivity for external APIs

### OpenCode Not Using Servers
- Confirm MCP configuration in `opencode.json`
- Check that servers are enabled: `"enabled": true`
- Restart OpenCode after configuration changes

## 📊 Server Status Check

Run this command to verify all servers are working:

```bash
cd /Users/lorenzorasmussen/.config/opencode
./test_mcp_servers.sh
```

This will test basic connectivity to each server and report any issues.