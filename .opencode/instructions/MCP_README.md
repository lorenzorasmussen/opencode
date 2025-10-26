# OpenCode MCP Integration

This document describes the Model Context Protocol (MCP) integration in OpenCode, providing external tool access for enhanced AI capabilities.

## Overview

OpenCode integrates MCP servers to extend agent capabilities with external tools and data sources. This enables agents to perform web searches, access databases, manage files, and interact with various APIs.

## MCP Servers

**Current Status**: Due to package availability issues, only 2 of 8 planned MCP servers are currently functional.

### ✅ Available Servers
- **filesystem**: Local file system operations
- **memory**: Knowledge graph storage and retrieval

### ⚠️ Deprecated Servers
- **brave-search**: Package deprecated by Anthropic (no longer maintained)
- **github**: Package deprecated by Anthropic (no longer maintained)

### ❌ Unavailable Servers
- **git**: Package never published to npm
- **sqlite**: Package never published to npm
- **perplexity-ask**: Package doesn't exist on npm
- **notion**: Package doesn't exist on npm

### Future Plans
The MCP integration will be expanded as more servers become available or alternative implementations are developed.

### Server Management

MCP servers are managed using PM2 for reliable process management:

```bash
# Start all MCP servers
./manage-mcp.sh start

# Check server status
./manage-mcp.sh status

# View server logs
./manage-mcp.sh logs

# Stop servers
./manage-mcp.sh stop

# Restart servers
./manage-mcp.sh restart
```

### Environment Variables

Required API keys are loaded from `.env`:

- `PERPLEXITY_API_KEY`: For Perplexity Ask server
- `BRAVE_API_KEY`: For Brave Search server
- `GITHUB_PERSONAL_ACCESS_TOKEN`: For GitHub server
- `NOTION_TOKEN`: For Notion server
- `NOTION_WORKSPACE_ID`: For Notion workspace access

## Agent Integration

### MCP-Enabled Agents
The following agents have MCP tool access:
- **orchestrator**: Coordinates MCP-based workflows
- **research**: Leverages search and external data
- **build**: Uses filesystem and git operations
- **tests**: Accesses data for testing scenarios

### Tool Usage
Agents automatically use appropriate MCP tools based on tasks:
- Research agent uses `brave-search` and `perplexity-ask` for information gathering
- Build agent uses `filesystem` and `git` for file operations
- Documentation agent uses `notion` for knowledge base management

## Testing

Run MCP integration tests:

```bash
# Run all MCP tests
npx vitest run src/mcp.test.ts

# Run with coverage
npx vitest run --coverage src/mcp.test.ts
```

Tests verify:
- Server configurations
- Environment variable loading
- Agent MCP tool assignments
- Tool execution capabilities

## Configuration

### Adding New Servers
1. Add server configuration to `opencode.json` under `mcp.servers`
2. Add required environment variables to `.env`
3. Update `ecosystem.config.js` for PM2 management
4. Add tests in `src/mcp.test.ts`

### Server Dependencies
MCP servers are installed via npm/pnpm:
- `@modelcontextprotocol/server-*`: Official MCP servers
- `@perplexityai/mcp-server-perplexity`: Perplexity integration
- `@notionhq/mcp-server-notion`: Notion integration

## Security

- API keys are stored securely in `.env` (gitignored)
- Environment variables are validated on startup
- PM2 manages server processes with auto-restart
- Servers run with minimal required permissions

## Troubleshooting

### Server Not Starting
1. Check environment variables in `.env`
2. Verify PM2 status: `./manage-mcp.sh status`
3. Check logs: `./manage-mcp.sh logs`

### Agent Not Using Tools
1. Ensure agent has `"mcp": true` in `opencode.json`
2. Check server connectivity
3. Verify API key validity

### Performance Issues
1. Monitor server resource usage: `./manage-mcp.sh status`
2. Restart servers: `./manage-mcp.sh restart`
3. Check for memory leaks in logs

## Development

### Adding MCP Tools
1. Identify required MCP server
2. Add to `opencode.json` configuration
3. Update agent tool permissions
4. Add integration tests
5. Update documentation

### Server Maintenance
- Regularly update MCP server packages
- Monitor API rate limits
- Rotate API keys as needed
- Backup server configurations

## Support

For MCP integration issues:
1. Check server logs via PM2
2. Verify API key validity
3. Test server connectivity independently
4. Review OpenCode agent configurations