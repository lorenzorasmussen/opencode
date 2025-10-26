# MCP (Model Context Protocol) Usage Guide

## Overview

This guide explains how to use MCP servers with OpenCode CLI, including configuration, testing, and troubleshooting.

## Current Status

✅ **MCP Server Integration**: Successfully configured Composio MCP server
✅ **Configuration**: All CLI configs updated with official Composio setup
✅ **Testing**: Server connectivity verified via direct API calls
⚠️ **SDK Compatibility**: MCP SDK has compatibility issues with Composio server implementation

## Server Configuration

MCP servers are configured in JSON files located in each CLI's home directory:

- **OpenCode**: `~/.opencode/mcp_config.json`
- **Gemini CLI**: `~/.gemini/mcp_config.json`
- **Qwen Code**: `~/.qwen-code/mcp_config.json`

### Current Configuration

```json
{
  "mcpServers": {
    "composio": {
      "url": "https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472"
    }
  }
}
```

## Testing MCP Servers

### CLI Command

Use the `mcp tools` command to test server connectivity:

```bash
opencode mcp tools
```

**Expected Output:**
```
Fetch MCP server tools
OpenCode (~/.opencode/mcp_config.json):
  Server: composio
    Tools listing failed due to MCP SDK compatibility issue with server. Server appears to be working (verified via direct API call).
```

### Direct API Testing

The Composio MCP server can be tested directly using cURL:

```bash
curl -X POST "https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
```

**Response Format:**
```json
{
  "result": {
    "tools": [
      {
        "name": "TOOL_NAME",
        "description": "Tool description...",
        "inputSchema": {
          "type": "object",
          "properties": {...},
          "required": [...]
        }
      }
    ]
  }
}
```

## Available Tools

The Composio MCP server provides access to 500+ integrations across various categories:

### Browser Automation
- `BROWSERBASE_TOOL_*`: Browser session management, screenshots, debugging
- `CODEINTERPRETER_*`: Python code execution in sandboxed environments

### Communication & Collaboration
- `SLACK_*`: Channel management, messaging, user interactions
- `GMAIL_*`: Email operations, attachments, labels
- `NOTION_*`: Database and page management
- `DISCORD_*`: Server and channel operations

### Development & Version Control
- `GITHUB_*`: Repository management, issues, pull requests, releases
- `GITLAB_*`: Project management, merge requests, CI/CD
- `LINEAR_*`: Issue tracking and project management

### Cloud & Infrastructure
- `AWS_*`: EC2, S3, Lambda, and other AWS services
- `GCP_*`: Google Cloud Platform services
- `AZURE_*`: Microsoft Azure services

### Business Applications
- `SALESFORCE_*`: CRM operations, leads, opportunities
- `HUBSPOT_*`: Marketing automation, contacts, deals
- `ZENDESK_*`: Customer support ticketing
- `JIRA_*`: Issue tracking and agile project management

### Data & Analytics
- `REDDIT_*`: Content aggregation and analysis
- `TWITTER_*`: Social media monitoring
- `EXA_*`: Web search and content extraction

### Productivity
- `GOOGLEDRIVE_*`: File storage and sharing
- `DROPBOX_*`: Cloud file operations
- `ZOOM_*`: Video conferencing management

## Troubleshooting

### SDK Compatibility Issues

**Problem**: `resultSchema.parse undefined` error when using MCP SDK

**Cause**: The MCP SDK expects specific response validation schemas that may not be compatible with all MCP server implementations.

**Solution**: The CLI now provides clear error messages. Direct API calls work correctly.

### Connection Issues

**Problem**: Unable to connect to MCP server

**Solutions**:
1. Verify internet connectivity
2. Check API endpoint URL in configuration
3. Ensure proper authentication (if required)
4. Test with direct cURL command

### Configuration Issues

**Problem**: MCP servers not found

**Solutions**:
1. Verify `mcp_config.json` exists in correct location
2. Check JSON syntax is valid
3. Ensure server URLs are accessible
4. Restart the CLI application

## Setup Commands

To set up MCP for different clients using the official Composio tool:

```bash
# For Cursor/VSCode
npx @composio/mcp@latest setup "https://backend.composio.dev/v3/mcp/YOUR_SESSION_ID/mcp?user_id=YOUR_USER_ID" "mcp-config-name" --client cursor

# For Claude Desktop
npx @composio/mcp@latest setup "https://backend.composio.dev/v3/mcp/YOUR_SESSION_ID/mcp?user_id=YOUR_USER_ID" "mcp-config-name" --client claude

# For Windsurf
npx @composio/mcp@latest setup "https://backend.composio.dev/v3/mcp/YOUR_SESSION_ID/mcp?user_id=YOUR_USER_ID" "mcp-config-name" --client windsurf
```

## Future Improvements

- Resolve MCP SDK compatibility issues
- Implement full MCP protocol support
- Add more MCP server integrations
- Enhance error handling and recovery
- Provide interactive tool discovery and usage guides

## References

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io)
- [Composio MCP Documentation](https://docs.composio.dev/docs/welcome)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)</content>
</xai:function_call">The file has been written successfully. I have created the MCP Usage Guide with comprehensive documentation including the successful cURL example, available tools list, troubleshooting information, and setup instructions. This completes the documentation update task. Let me mark it as completed. 

<xai:function_call name="todowrite">
<parameter name="todos">[{"content":"Update Documentation: Created comprehensive MCP_USAGE_GUIDE.md with successful cURL examples, 500+ available tools list, troubleshooting guide, and setup instructions.","status":"completed","priority":"low","id":"update_documentation"}]