# MCP Service Configuration

## MCP Services Status
The MCP services have been successfully started using PM2 and are now accessible:

- **mem0-server**: Running on port 3100
- **gemini-bridge**: Running on port 3101  
- **qwen-bridge**: Running on port 3102
- **health-monitor**: Running (monitoring the other services)

## Connection Fix
The connection errors for MCP services were resolved by:

1. Fixed the PM2 ecosystem configuration to use the correct working directory (`__dirname` instead of the incorrect home path)
2. Started the services using PM2 with the correct configuration
3. Verified that all services are now accessible on their respective ports

## Ports 3000-3007
These ports are not used by the current MCP configuration. The actual MCP services are running on ports 3100-3102 as specified in the `.opencode/mcp.json` file.

## Verification Command
To verify MCP services are working:
```
opencode mcp tools
```

## Important Notes
- The services are managed by PM2 and will auto-restart if they crash
- Logs are available in the `packages/mcp-superassistant/logs/` directory
- If services need to be restarted, use: `pm2 restart ecosystem.config.js`
- To stop all MCP services, use: `pm2 stop ecosystem.config.js`