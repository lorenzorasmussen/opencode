# OpenCode Configuration Specification

## Overview

This document specifies the configuration requirements and schema for OpenCode's ACP (Agent Client Protocol) mode, defining how OpenCode is configured to operate as an ACP agent server.

## Configuration Architecture

### Configuration Sources

OpenCode ACP configuration is sourced from multiple locations in priority order:

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **opencode.json configuration file**
4. **Built-in defaults** (lowest priority)

### Configuration File Location

**Primary Location**: `./opencode.json` (project root)

**Alternative Locations**:

- `$HOME/.opencode/config.json`
- `$XDG_CONFIG_HOME/opencode/config.json`
- Custom path via `--config` flag

## Configuration Schema

### Complete opencode.json Schema

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-openai-codex-auth"],
  "mcp": {
    "weather": {
      "type": "local",
      "command": ["bun", "x", "@h1deya/mcp-server-weather"],
      "args": [],
      "env": {}
    },
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  },
  "acp": {
    "defaultModel": "anthropic/claude-3-5-sonnet-20241022",
    "maxContextLength": 128000,
    "maxToolExecutionTime": 30000,
    "enableStreaming": true,
    "logLevel": "info",
    "permissionDefaults": {
      "allowFileRead": true,
      "allowFileWrite": false,
      "allowCommandExecution": false
    }
  },
  "providers": {
    "anthropic": {
      "apiKey": "{env:ANTHROPIC_API_KEY}"
    }
  }
}
```

### ACP-Specific Configuration Section

#### acp Object Schema

```typescript
interface ACPConfig {
  // Default model for new sessions
  defaultModel?: string

  // Maximum context length in tokens
  maxContextLength?: number

  // Maximum tool execution time in milliseconds
  maxToolExecutionTime?: number

  // Enable real-time streaming responses
  enableStreaming?: boolean

  // Logging level for ACP operations
  logLevel?: "debug" | "info" | "warn" | "error"

  // Default permission settings
  permissionDefaults?: {
    allowFileRead?: boolean
    allowFileWrite?: boolean
    allowCommandExecution?: boolean
  }

  // Session management settings
  session?: {
    maxSessions?: number
    sessionTimeout?: number
    cleanupInterval?: number
  }

  // Performance tuning
  performance?: {
    maxConcurrentTools?: number
    messageQueueSize?: number
    fileReadChunkSize?: number
  }
}
```

## Configuration Options Detail

### Core ACP Settings

#### defaultModel

- **Type**: `string`
- **Default**: Auto-selected based on available providers
- **Description**: Default model identifier for new ACP sessions
- **Example**: `"anthropic/claude-3-5-sonnet-20241022"`
- **Impact**: Affects response quality and cost

#### maxContextLength

- **Type**: `number`
- **Default**: `128000` (128K tokens)
- **Description**: Maximum context window size in tokens
- **Example**: `256000`
- **Impact**: Limits conversation history size

#### maxToolExecutionTime

- **Type**: `number`
- **Default**: `30000` (30 seconds)
- **Description**: Maximum time allowed for tool execution in milliseconds
- **Example**: `60000`
- **Impact**: Prevents hanging operations, affects user experience

#### enableStreaming

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable real-time streaming of responses
- **Example**: `false`
- **Impact**: Controls responsiveness vs. batch processing

#### logLevel

- **Type**: `string`
- **Default**: `"info"`
- **Description**: Logging verbosity for ACP operations
- **Options**: `"debug"`, `"info"`, `"warn"`, `"error"`
- **Impact**: Affects log file size and debugging capability

### Permission Configuration

#### permissionDefaults

- **Type**: `object`
- **Default**: All `false`
- **Description**: Default permission settings for tool execution
- **Properties**:
  - `allowFileRead`: Auto-approve file read operations
  - `allowFileWrite`: Auto-approve file write operations
  - `allowCommandExecution`: Auto-approve command execution

**Security Impact**: Reduces user prompts but increases risk

### Session Management

#### session.maxSessions

- **Type**: `number`
- **Default**: `10`
- **Description**: Maximum concurrent ACP sessions
- **Example**: `50`
- **Impact**: Resource usage vs. scalability

#### session.sessionTimeout

- **Type**: `number`
- **Default**: `3600000` (1 hour)
- **Description**: Session inactivity timeout in milliseconds
- **Example**: `7200000`
- **Impact**: Memory usage vs. convenience

#### session.cleanupInterval

- **Type**: `number`
- **Default**: `300000` (5 minutes)
- **Description**: Interval for cleaning up expired sessions
- **Example**: `600000`
- **Impact**: Resource cleanup frequency

### Performance Tuning

#### performance.maxConcurrentTools

- **Type**: `number`
- **Default**: `3`
- **Description**: Maximum concurrent tool executions
- **Example**: `10`
- **Impact**: Parallel processing vs. resource contention

#### performance.messageQueueSize

- **Type**: `number`
- **Default**: `100`
- **Description**: Maximum queued messages per session
- **Example**: `1000`
- **Impact**: Memory usage vs. throughput

#### performance.fileReadChunkSize

- **Type**: `number`
- **Default**: `65536` (64KB)
- **Description**: Chunk size for large file reads
- **Example**: `131072`
- **Impact**: Memory efficiency vs. I/O performance

## MCP Server Configuration

### MCP Server Types

#### Local MCP Servers

```json
{
  "weather": {
    "type": "local",
    "command": ["bun", "x", "@h1deya/mcp-server-weather"],
    "args": ["--port", "3000"],
    "env": {
      "API_KEY": "{env:WEATHER_API_KEY}",
      "DEBUG": "true"
    }
  }
}
```

**Properties**:

- `type`: Must be `"local"`
- `command`: Executable command array
- `args`: Additional command arguments
- `env`: Environment variables (supports `{env:VARIABLE}` syntax)

#### Remote MCP Servers

```json
{
  "context7": {
    "type": "remote",
    "url": "https://mcp.context7.com/mcp",
    "headers": {
      "Authorization": "Bearer {env:CONTEXT7_TOKEN}",
      "Content-Type": "application/json"
    }
  }
}
```

**Properties**:

- `type`: Must be `"remote"`
- `url`: Server endpoint URL
- `headers`: HTTP headers (supports `{env:VARIABLE}` syntax)

### MCP Configuration Validation

**Requirements**:

- Unique server names across configuration
- Valid command paths for local servers
- Accessible URLs for remote servers
- Proper environment variable resolution

## Provider Configuration

### Provider Setup

```json
{
  "providers": {
    "anthropic": {
      "apiKey": "{env:ANTHROPIC_API_KEY}",
      "modelOverrides": {
        "claude-3-5-sonnet": "claude-3-5-sonnet-20241022"
      }
    },
    "openai": {
      "apiKey": "{env:OPENAI_API_KEY}",
      "organization": "{env:OPENAI_ORG_ID}"
    }
  }
}
```

### Environment Variable Resolution

**Syntax**: `{env:VARIABLE_NAME}`

**Resolution Rules**:

1. Check process environment
2. Check `.env` file in project root
3. Use default value if specified: `{env:VARIABLE_NAME:default}`
4. Fail with clear error if not found

## Command-Line Configuration

### ACP Command Options

```bash
opencode acp [options]

Options:
  --cwd <path>           Working directory for sessions
  --config <path>        Path to configuration file
  --model <model>        Override default model
  --log-level <level>    Override log level
  --max-sessions <num>   Override max sessions
  --help                 Show help
```

### Environment Variables

| Variable                | Description               | Example                |
| ----------------------- | ------------------------- | ---------------------- |
| `OPENCODE_CONFIG`       | Configuration file path   | `/path/to/config.json` |
| `OPENCODE_CWD`          | Default working directory | `/projects/myapp`      |
| `OPENCODE_LOG_LEVEL`    | Default log level         | `debug`                |
| `OPENCODE_MAX_SESSIONS` | Default max sessions      | `20`                   |

## Configuration Validation

### Schema Validation

**Validation Rules**:

- JSON syntax correctness
- Required field presence
- Type correctness
- Value range validation
- Cross-reference validation

**Error Reporting**:

- Clear error messages with file locations
- Suggestions for fixes
- Validation continues after first error

### Runtime Validation

**Startup Checks**:

- Configuration file accessibility
- Environment variable availability
- Provider API key validation
- MCP server connectivity tests

**Graceful Degradation**:

- Invalid sections logged and ignored
- Default values used for missing options
- Non-critical failures don't prevent startup

## Configuration Examples

### Minimal Configuration

```json
{
  "acp": {
    "enableStreaming": true
  }
}
```

### Development Configuration

```json
{
  "acp": {
    "defaultModel": "anthropic/claude-3-5-sonnet-20241022",
    "logLevel": "debug",
    "enableStreaming": true,
    "maxToolExecutionTime": 60000,
    "permissionDefaults": {
      "allowFileRead": true
    }
  },
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "@modelcontextprotocol/server-filesystem", "/tmp"]
    }
  }
}
```

### Production Configuration

```json
{
  "acp": {
    "defaultModel": "anthropic/claude-3-5-haiku-20241022",
    "maxContextLength": 100000,
    "maxToolExecutionTime": 20000,
    "enableStreaming": true,
    "logLevel": "warn",
    "session": {
      "maxSessions": 50,
      "sessionTimeout": 7200000
    },
    "performance": {
      "maxConcurrentTools": 5,
      "messageQueueSize": 200
    }
  },
  "mcp": {
    "github": {
      "type": "remote",
      "url": "https://api.github.com/graphql",
      "headers": {
        "Authorization": "Bearer {env:GITHUB_TOKEN}"
      }
    }
  },
  "providers": {
    "anthropic": {
      "apiKey": "{env:ANTHROPIC_API_KEY}"
    }
  }
}
```

## Configuration Management

### Version Control

**Recommended .gitignore**:

```
opencode.json
.env
.env.local
```

**Template Files**:

- `opencode.json.example`: Template with placeholders
- `.env.example`: Environment variable template

### Configuration Updates

**Hot Reloading**: Not supported - requires restart

**Migration Path**:

1. Backup current configuration
2. Update to new schema
3. Validate configuration
4. Restart ACP server
5. Test functionality

### Troubleshooting

**Common Issues**:

- Missing environment variables
- Invalid MCP server configurations
- Permission denied for file access
- Provider API key issues

**Debug Commands**:

```bash
# Validate configuration
opencode config validate

# Test MCP servers
opencode mcp test

# Check provider connectivity
opencode providers test
```

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: OpenCode Configuration Specification Team
