# Implementation Procedures Specification

## Overview

This document provides step-by-step procedures for implementing, configuring, and deploying the OpenCode-Zed ACP integration, ensuring consistent and reliable setup across different environments.

## Pre-Implementation Preparation

### 1. Environment Assessment

#### System Requirements Check

**Hardware Requirements**:

- **CPU**: 4+ cores recommended, 2+ cores minimum
- **Memory**: 8GB+ recommended, 4GB minimum
- **Storage**: 10GB+ free space for installation and data
- **Network**: Stable internet connection for MCP servers

**Software Requirements**:

- **Operating System**: macOS 12+, Linux (Ubuntu 20.04+), Windows 10+
- **Node.js**: Version 18+ (for OpenCode)
- **Rust**: Version 1.70+ (for Zed plugin)
- **Git**: Version 2.30+

#### Compatibility Verification

```bash
# Check Node.js version
node --version

# Check npm/yarn/bun
npm --version

# Check Rust (if building from source)
cargo --version

# Check Zed version
zed --version

# Check available ports
netstat -an | grep :3000 || echo "Port 3000 available"
```

### 2. Dependency Installation

#### OpenCode Installation

```bash
# Install OpenCode globally
npm install -g opencode-ai@latest

# Verify installation
opencode --version

# Login to OpenCode (if required)
opencode auth login
```

#### Zed Plugin Installation

**Option 1: Pre-built Plugin**

```bash
# Download from releases
curl -L https://github.com/opencode/zed-acp/releases/latest/download/zed-acp-plugin.tar.gz | tar xz
cp zed-acp-plugin ~/.config/zed/plugins/
```

**Option 2: Build from Source**

```bash
# Clone repository
git clone https://github.com/opencode/zed-acp.git
cd zed-acp

# Build plugin
cargo build --release

# Install plugin
cp target/release/libzed_acp.dylib ~/.config/zed/plugins/
```

### 3. Configuration Preparation

#### OpenCode Configuration

**Create opencode.json**:

```bash
# Create configuration directory
mkdir -p ~/.opencode

# Create basic configuration
cat > ~/.opencode/config.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "acp": {
    "enableStreaming": true,
    "logLevel": "info"
  },
  "mcp": {
    "weather": {
      "type": "local",
      "command": ["bun", "x", "@h1deya/mcp-server-weather"]
    }
  }
}
EOF
```

#### Zed Configuration

**Update settings.json**:

```bash
# Create Zed config directory
mkdir -p ~/.config/zed

# Configure agent servers
cat >> ~/.config/zed/settings.json << 'EOF'
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"],
      "env": {
        "OPENCODE_CONFIG_DIR": "~/.opencode"
      }
    }
  },
  "agent": {
    "enabled": true
  }
}
EOF
```

**Update keymap.json**:

```bash
cat >> ~/.config/zed/keymap.json << 'EOF'
[
  {
    "bindings": {
      "ctrl-alt-o": "agent:togglePanel",
      "ctrl-alt-n": "agent:newSession"
    }
  }
]
EOF
```

## Implementation Procedures

### Phase 1: Core ACP Setup

#### Step 1: OpenCode ACP Server Setup

```bash
# 1. Start OpenCode ACP server manually for testing
opencode acp --cwd /path/to/project

# Expected output: Server starts and waits for connections
# Should see: "ACP server started on stdio"
```

#### Step 2: Zed Client Configuration

```bash
# 1. Open Zed
zed

# 2. Open settings (Cmd/Ctrl + ,)
# 3. Add agent server configuration (see above)
# 4. Restart Zed or reload configuration

# 3. Verify configuration
cat ~/.config/zed/settings.json | jq '.agent_servers'
```

#### Step 3: Initial Connection Test

```bash
# 1. Start OpenCode ACP server in background
opencode acp --cwd /tmp &
ACP_PID=$!

# 2. Test connection with simple client
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1}}' | opencode acp

# 3. Verify response contains protocolVersion and capabilities
# 4. Kill test server
kill $ACP_PID
```

### Phase 2: Session Management Setup

#### Step 1: Create Test Session

```bash
# 1. Start ACP server
opencode acp --cwd /tmp &
ACP_PID=$!

# 2. Send session creation request
SESSION_REQUEST='{
  "jsonrpc":"2.0",
  "id":2,
  "method":"session/new",
  "params":{"cwd":"/tmp"}
}'

echo $SESSION_REQUEST | opencode acp

# 3. Capture session ID from response
# Expected: {"jsonrpc":"2.0","id":2,"result":{"sessionId":"session-xxx",...}}
```

#### Step 2: Test Message Exchange

```bash
# 1. Send a test prompt
PROMPT_REQUEST='{
  "jsonrpc":"2.0",
  "id":3,
  "method":"session/prompt",
  "params":{
    "sessionId":"session-xxx",
    "prompt":[{"type":"text","text":"Hello ACP!"}]
  }
}'

echo $PROMPT_REQUEST | opencode acp

# 2. Verify streaming responses
# Expected: Multiple messages with agent_message_chunk updates
```

#### Step 3: Test File Operations

```bash
# 1. Create test file
echo "test content" > /tmp/test.txt

# 2. Send file read request
READ_REQUEST='{
  "jsonrpc":"2.0",
  "id":4,
  "method":"fs/read_text_file",
  "params":{
    "sessionId":"session-xxx",
    "path":"/tmp/test.txt"
  }
}'

echo $READ_REQUEST | opencode acp

# 3. Verify file content returned
# 4. Test file write operation
```

### Phase 3: Zed UI Integration

#### Step 1: Agent Panel Setup

```bash
# 1. Open Zed with ACP plugin loaded
zed

# 2. Open agent panel (Ctrl/Cmd + Alt + O)
# 3. Verify panel appears with:
#    - Session selector
#    - Model selector
#    - Message history area
#    - Prompt input field
```

#### Step 2: Session Creation in Zed

```bash
# 1. Click "New Session" button
# 2. Verify session appears in selector
# 3. Check that model/mode selectors populate
# 4. Verify connection status shows "Connected"
```

#### Step 3: Message Exchange Test

```bash
# 1. Type "Hello from Zed!" in prompt input
# 2. Press Enter or click Send
# 3. Verify message appears in history
# 4. Wait for agent response
# 5. Verify streaming text appears progressively
```

#### Step 4: Tool Execution Test

```bash
# 1. Send prompt that requires tool use
#    Example: "Create a file called test.js with a hello world function"

# 2. Verify tool call appears in UI
# 3. Check permission prompt (if applicable)
# 4. Verify tool execution progress
# 5. Confirm file creation
```

### Phase 4: MCP Server Integration

#### Step 1: MCP Server Setup

```bash
# 1. Install MCP server dependency
npm install -g @h1deya/mcp-server-weather

# 2. Update OpenCode configuration
cat >> ~/.opencode/config.json << 'EOF'
{
  "mcp": {
    "weather": {
      "type": "local",
      "command": ["bun", "x", "@h1deya/mcp-server-weather"]
    }
  }
}
EOF
```

#### Step 2: MCP Server Testing

```bash
# 1. Restart ACP server to load MCP config
kill $ACP_PID
opencode acp --cwd /tmp &
ACP_PID=$!

# 2. Test MCP tool availability
# Send prompt: "What's the weather like?"
# Verify MCP server is called and responds
```

#### Step 3: Zed MCP Integration

```bash
# 1. Create new session in Zed
# 2. Send MCP-enabled prompt
# 3. Verify MCP tools appear in available commands
# 4. Test MCP tool execution through UI
```

### Phase 5: Production Deployment

#### Step 1: Production Configuration

```bash
# 1. Create production configuration
cat > /etc/opencode/config.json << 'EOF'
{
  "acp": {
    "defaultModel": "anthropic/claude-3-5-sonnet-20241022",
    "maxContextLength": 100000,
    "maxToolExecutionTime": 20000,
    "enableStreaming": true,
    "logLevel": "warn",
    "session": {
      "maxSessions": 50,
      "sessionTimeout": 7200000
    }
  },
  "providers": {
    "anthropic": {
      "apiKey": "${ANTHROPIC_API_KEY}"
    }
  }
}
EOF

# 2. Set environment variables
export ANTHROPIC_API_KEY="your-api-key"
export OPENCODE_CONFIG_DIR="/etc/opencode"
```

#### Step 2: Service Setup

**Systemd Service (Linux)**:

```bash
# Create systemd service
cat > /etc/systemd/system/opencode-acp.service << 'EOF'
[Unit]
Description=OpenCode ACP Server
After=network.target

[Service]
Type=simple
User=opencode
Environment=OPENCODE_CONFIG_DIR=/etc/opencode
ExecStart=/usr/local/bin/opencode acp
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable opencode-acp
systemctl start opencode-acp
```

**LaunchDaemon (macOS)**:

```bash
# Create launch daemon
cat > /Library/LaunchDaemons/com.opencode.acp.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.opencode.acp</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/opencode</string>
        <string>acp</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OPENCODE_CONFIG_DIR</key>
        <string>/etc/opencode</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load service
launchctl load /Library/LaunchDaemons/com.opencode.acp.plist
```

#### Step 3: Monitoring Setup

```bash
# 1. Install monitoring
npm install -g pm2

# 2. Configure PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'opencode-acp',
    script: 'opencode',
    args: 'acp',
    env: {
      OPENCODE_CONFIG_DIR: '/etc/opencode'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    log_file: '/var/log/opencode-acp.log',
    out_file: '/var/log/opencode-acp-out.log',
    error_file: '/var/log/opencode-acp-error.log'
  }]
}
EOF

# 3. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 4: Load Balancing (Advanced)

```bash
# 1. Install load balancer
npm install -g http-proxy

# 2. Configure multiple ACP instances
cat > load-balancer.js << 'EOF'
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer({})

const servers = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
]

let current = 0
const server = require('http').createServer((req, res) => {
  const target = servers[current]
  current = (current + 1) % servers.length
  proxy.web(req, res, { target })
})

server.listen(3000)
EOF

# 3. Start load balancer
node load-balancer.js &
```

## Troubleshooting Procedures

### Common Issues and Solutions

#### Issue 1: Connection Refused

**Symptoms**: "Connection refused" error

**Diagnosis**:

```bash
# Check if OpenCode is running
ps aux | grep opencode

# Check port availability
netstat -an | grep :3000

# Test manual connection
echo '{"jsonrpc":"2.0","id":1,"method":"initialize"}' | nc localhost 3000
```

**Solutions**:

1. Start OpenCode ACP server
2. Check firewall settings
3. Verify configuration paths
4. Check environment variables

#### Issue 2: Protocol Errors

**Symptoms**: Invalid protocol version, method not found

**Diagnosis**:

```bash
# Check protocol versions
opencode --version
zed --version

# Validate message format
cat > test-message.json << 'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1}}
EOF

jq . test-message.json  # Should be valid JSON
```

**Solutions**:

1. Update to compatible versions
2. Check message format
3. Validate configuration
4. Review error logs

#### Issue 3: Tool Execution Failures

**Symptoms**: Tools fail to execute, permission errors

**Diagnosis**:

```bash
# Check tool permissions
ls -la /usr/local/bin/opencode

# Test tool execution manually
opencode run "echo 'test'"

# Check MCP server status
ps aux | grep mcp-server
```

**Solutions**:

1. Fix file permissions
2. Update PATH environment
3. Restart MCP servers
4. Check tool configurations

#### Issue 4: Performance Issues

**Symptoms**: Slow responses, high memory usage

**Diagnosis**:

```bash
# Monitor system resources
top -p $(pgrep opencode)

# Check memory usage
ps aux --sort=-%mem | head

# Monitor network
iftop -i eth0

# Check logs for bottlenecks
tail -f /var/log/opencode-acp.log
```

**Solutions**:

1. Increase system resources
2. Optimize configuration
3. Implement caching
4. Scale horizontally

### Diagnostic Tools

#### Health Check Script

```bash
#!/bin/bash
# ACP Health Check Script

echo "=== ACP Health Check ==="

# Check OpenCode installation
if command -v opencode &> /dev/null; then
    echo "✓ OpenCode installed: $(opencode --version)"
else
    echo "✗ OpenCode not found"
    exit 1
fi

# Check Zed installation
if command -v zed &> /dev/null; then
    echo "✓ Zed installed: $(zed --version)"
else
    echo "✗ Zed not found"
    exit 1
fi

# Check configuration files
if [ -f ~/.opencode/config.json ]; then
    echo "✓ OpenCode config exists"
else
    echo "✗ OpenCode config missing"
fi

if [ -f ~/.config/zed/settings.json ]; then
    echo "✓ Zed config exists"
else
    echo "✗ Zed config missing"
fi

# Test ACP server startup
echo "Testing ACP server startup..."
timeout 10 opencode acp --help &> /dev/null
if [ $? -eq 0 ]; then
    echo "✓ ACP server starts successfully"
else
    echo "✗ ACP server failed to start"
fi

echo "=== Health Check Complete ==="
```

#### Log Analysis Script

```bash
#!/bin/bash
# ACP Log Analysis Script

LOG_FILE="/var/log/opencode-acp.log"

echo "=== ACP Log Analysis ==="

# Count errors
error_count=$(grep -c "ERROR" "$LOG_FILE")
echo "Error count: $error_count"

# Count warnings
warn_count=$(grep -c "WARN" "$LOG_FILE")
echo "Warning count: $warn_count"

# Recent errors
echo "Recent errors:"
tail -20 "$LOG_FILE" | grep "ERROR" | tail -5

# Connection status
echo "Connection events:"
grep -E "(connected|disconnected|reconnecting)" "$LOG_FILE" | tail -5

# Performance metrics
echo "Response times (last 10):"
grep "duration" "$LOG_FILE" | tail -10 | awk '{print $NF}'
```

## Validation Procedures

### Post-Implementation Validation

#### Functional Validation

```bash
# 1. Test basic ACP connection
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1}}' | opencode acp

# 2. Test session creation
# 3. Test message exchange
# 4. Test file operations
# 5. Test tool execution
```

#### Performance Validation

```bash
# 1. Run performance benchmarks
npm run performance:test

# 2. Check resource usage
top -p $(pgrep opencode)

# 3. Validate response times
# 4. Check memory usage
```

#### Integration Validation

```bash
# 1. Test Zed UI integration
# 2. Test MCP server integration
# 3. Test multi-session handling
# 4. Test error recovery
```

### Success Criteria Checklist

- [ ] OpenCode ACP server starts successfully
- [ ] Zed connects to ACP server
- [ ] Agent panel displays correctly
- [ ] Message exchange works
- [ ] File operations function
- [ ] Tool execution succeeds
- [ ] MCP servers integrate
- [ ] Performance meets targets
- [ ] Error handling works
- [ ] Configuration persists

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Implementation Procedures Specification Team
