# Zed ACP Plugin

This is the Zed editor plugin for OpenCode ACP (Agent Client Protocol) integration, enabling AI-powered coding assistance directly within Zed.

## Features

- **Agent Integration**: Connect to OpenCode agents for AI-powered coding assistance
- **Session Management**: Create and manage conversation sessions
- **Streaming Responses**: Real-time streaming of agent responses
- **Tool Execution**: Execute tools and view results in the editor
- **Permission Management**: Control tool execution permissions
- **File Operations**: Read and write files through the agent

## Installation

### From Source

1. **Prerequisites**:
   - Rust 1.70+
   - Zed editor

2. **Build the plugin**:

   ```bash
   cd sdks/zed
   cargo build --release
   ```

3. **Install the plugin**:
   ```bash
   cp target/release/libzed_acp.dylib ~/.config/zed/plugins/
   ```

### Configuration

Add to your `~/.config/zed/settings.json`:

```json
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
    "enabled": true,
    "streaming": true
  }
}
```

Add keyboard shortcuts to `~/.config/zed/keymap.json`:

```json
[
  {
    "bindings": {
      "ctrl-alt-o": "agent:toggle-panel",
      "ctrl-alt-n": "agent:new-session",
      "ctrl-enter": "agent:submit-prompt"
    }
  }
]
```

## Usage

### Basic Usage

1. **Toggle Agent Panel**: `Ctrl+Alt+O`
2. **Create New Session**: `Ctrl+Alt+N`
3. **Submit Prompt**: `Ctrl+Enter` (when in prompt input)

### Slash Commands

Use `/agent <prompt>` in any file to send a prompt to the agent.

### Sessions

- Sessions maintain conversation context
- Switch between sessions to work on different tasks
- Sessions persist across Zed restarts

## Architecture

### Components

- **ACP Client**: Handles protocol communication with OpenCode
- **Session Manager**: Manages conversation sessions
- **UI Components**: Agent panel and message display
- **Configuration**: Settings and keymap management

### Protocol

Implements the Agent Client Protocol (ACP) v1 for standardized communication with AI agents.

## Development

### Building

```bash
cargo build
```

### Testing

```bash
cargo test
```

### Debugging

Enable debug logging in Zed's developer console.

## Configuration Options

### Agent Servers

Configure multiple agent servers:

```json
{
  "agent_servers": {
    "server1": {
      "command": "opencode",
      "args": ["acp", "--config", "config1.json"],
      "env": { "ENV_VAR": "value" }
    },
    "server2": {
      "command": "custom-agent",
      "args": ["--port", "3000"]
    }
  }
}
```

### UI Settings

Customize the agent panel appearance:

```json
{
  "ui": {
    "panel_position": "right",
    "panel_width": 400,
    "font_size": 12,
    "theme": "auto"
  }
}
```

### Performance Settings

Tune performance characteristics:

```json
{
  "performance": {
    "max_concurrent_requests": 3,
    "request_timeout": 30000,
    "cache_size": 50
  }
}
```

## Troubleshooting

### Connection Issues

1. Verify OpenCode is installed and accessible
2. Check agent server configuration
3. Ensure proper permissions for file operations

### Performance Issues

1. Reduce `max_concurrent_requests`
2. Increase `request_timeout`
3. Clear response cache

### UI Issues

1. Restart Zed
2. Check Zed version compatibility
3. Verify plugin installation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the same license as OpenCode.
