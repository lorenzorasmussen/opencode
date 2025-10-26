# Global MCP Server Setup Plan for OpenCode

## Objective
Configure global MCP (Model Context Protocol) servers for OpenCode using the `~/.config/opencode/` directory.

## Prerequisites
- OpenCode installed and running
- Access to MCP server endpoints (URLs or command configurations)
- API keys or authentication tokens for MCP services

## Step 1: Create Global Configuration Directory
```bash
mkdir -p ~/.config/opencode/
```

## Step 2: Create Global Configuration File
Create `~/.config/opencode/opencode.json` with MCP configuration:

```json
{
  "permission": {
    "edit": "allow",
    "bash": "ask"
  },
  "mcp": {
    "servers": {
      "rube": {
        "type": "remote",
        "url": "https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp",
        "env": {
          "COMPOSIO_API_KEY": "your-api-key-here",
          "COMPOSIO_USER_ID": "your-user-id-here"
        }
      }
    }
  },
  "agent": {
    "build": {
      "description": "Implements features and runs tests",
      "mode": "primary",
      "model": "opencode/code-supernova",
      "tools": {
        "write": true,
        "edit": true,
        "bash": true
      }
    }
  }
}
```

## Step 3: Alternative MCP Server Configuration
If using local MCP servers, add them to the configuration:

```json
{
  "mcp": {
    "servers": {
      "local-server": {
        "type": "local",
        "command": "node",
        "args": [
          "-e",
          "const http = require('http'); const readline = require('readline'); const MCP_URL = process.env.COMPOSIO_MCP_URL; const USER_ID = process.env.COMPOSIO_USER_ID; const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false }); rl.on('line', async (line) => { try { const request = JSON.parse(line); const data = JSON.stringify({ ...request, user_id: USER_ID }); const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }; const req = http.request(MCP_URL, options, (res) => { let body = ''; res.on('data', chunk => body += chunk); res.on('end', () => process.stdout.write(body + '\\n')); }); req.on('error', (e) => { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: e.message }, id: request.id }) + '\\n'); }); req.write(data); req.end(); } catch (e) { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }) + '\\n'); } });"
        ],
        "env": {
          "COMPOSIO_API_KEY": "your-api-key-here",
          "COMPOSIO_USER_ID": "your-user-id-here",
          "COMPOSIO_MCP_URL": "https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp"
        }
      }
    }
  }
}
```

## Step 4: Create MCP-Specific Configuration (Alternative Approach)
If using a dedicated MCP configuration file, create `~/.config/opencode/mcp.json`:

```json
{
  "mcpServers": {
    "rube": {
      "command": "node",
      "args": [
        "-e",
        "const http = require('http'); const readline = require('readline'); const MCP_URL = process.env.COMPOSIO_MCP_URL; const USER_ID = process.env.COMPOSIO_USER_ID; const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false }); rl.on('line', async (line) => { try { const request = JSON.parse(line); const data = JSON.stringify({ ...request, user_id: USER_ID }); const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }; const req = http.request(MCP_URL, options, (res) => { let body = ''; res.on('data', chunk => body += chunk); res.on('end', () => process.stdout.write(body + '\\n')); }); req.on('error', (e) => { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: e.message }, id: request.id }) + '\\n'); }); req.write(data); req.end(); } catch (e) { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }) + '\\n'); } });"
      ],
      "env": {
        "COMPOSIO_API_KEY": "your-api-key-here",
        "COMPOSIO_USER_ID": "your-user-id-here",
        "COMPOSIO_MCP_URL": "https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp"
      }
    }
  }
}
```

## Step 5: Security Considerations
- Store API keys securely and avoid committing configuration files with secrets to version control
- Use environment variables where possible for sensitive data
- Consider using credential managers for storing API keys

## Step 6: Verify Configuration
After setting up the global MCP configuration:

1. Restart OpenCode to load the new configuration
2. Check MCP server status:
   ```bash
   opencode mcp list
   ```
3. Test that the MCP server is accessible and functioning:
   ```bash
   opencode mcp tools
   ```

## Step 7: Project-Specific Overrides (Optional)
Note that project-specific configurations will override global settings. If you need project-specific MCP settings, create an `opencode.json` file in your project directory with MCP configurations that will take precedence over the global ones.

## Best Practices
- Always backup existing configurations before making changes
- Test MCP connectivity before relying on the configuration
- Document your MCP servers and their purposes
- Keep global configurations minimal and focused on commonly used servers
- Use global MCP settings for services that are relevant across multiple projects