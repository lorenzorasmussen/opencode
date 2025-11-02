# Tool Invocation Specification

## Overview

This document specifies how tools are invoked and executed within the OpenCode-Zed ACP integration, defining the complete lifecycle from tool discovery to result processing.

## Tool Architecture

### Tool Registry

#### Tool Categories

OpenCode provides the following tool categories via ACP:

| Category           | Description               | Examples                       |
| ------------------ | ------------------------- | ------------------------------ |
| File Operations    | Read, write, modify files | `read`, `edit`, `write`        |
| Search & Find      | Text and pattern search   | `grep`, `glob`                 |
| Code Analysis      | LSP-based analysis        | `lsp-diagnostics`, `lsp-hover` |
| Development        | Build, test, run commands | `bash`, `run`                  |
| Project Management | Todo, planning tools      | `todo`, `plan`                 |
| External Services  | MCP server tools          | Weather, GitHub API            |

#### Tool Metadata

Each tool exposes the following metadata:

```typescript
interface ToolInfo {
  name: string
  description: string
  inputSchema: JSONSchema
  outputSchema: JSONSchema
  categories: string[]
  permissions: PermissionRequirement[]
}
```

### Tool Discovery

#### Available Commands Update

When a session is created or loaded, Zed receives available commands:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "available_commands_update",
      "availableCommands": [
        {
          "name": "init",
          "description": "create/update a AGENTS.md"
        },
        {
          "name": "compact",
          "description": "compact the session"
        }
      ]
    }
  }
}
```

#### Dynamic Tool Availability

Tools may become available/unavailable based on:

- MCP server connections
- File system permissions
- Project configuration
- Session state

## Tool Invocation Lifecycle

### 1. Tool Call Initiation

#### From Agent Prompt Processing

```
User Prompt
     |
     v
Agent analyzes request
     |
     v
Identifies required tools
     |
     v
Sends tool_call notification
```

**Tool Call Notification**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "tool_call",
      "toolCallId": "tool-456",
      "title": "Search for React components",
      "kind": "search",
      "status": "pending",
      "locations": [
        {
          "path": "src/components"
        }
      ]
    }
  }
}
```

### 2. Permission Checking

#### Permission Assessment

Tools are categorized by risk level:

| Risk Level | Description            | Examples                    | Default Permission |
| ---------- | ---------------------- | --------------------------- | ------------------ |
| Low        | Read-only operations   | `read`, `grep`, `lsp-hover` | Auto-allow         |
| Medium     | Local modifications    | `edit`, `write`             | User prompt        |
| High       | System operations      | `bash`, `run`               | User prompt        |
| Critical   | Destructive operations | `rm`, `format`              | Always prompt      |

#### Permission Request Flow

For tools requiring permission:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "session/request_permission",
  "params": {
    "sessionId": "session-123",
    "toolCall": {
      "toolCallId": "tool-456",
      "status": "pending",
      "title": "Install npm dependencies",
      "kind": "execute",
      "locations": []
    },
    "options": [
      {
        "optionId": "once",
        "kind": "allow_once",
        "name": "Allow once"
      },
      {
        "optionId": "always",
        "kind": "allow_always",
        "name": "Always allow"
      },
      {
        "optionId": "reject",
        "kind": "reject_once",
        "name": "Reject"
      }
    ]
  }
}
```

### 3. Tool Execution

#### Execution Context

Tools execute with the following context:

- **Working Directory**: Session's `cwd`
- **Environment**: Inherited from OpenCode process
- **Permissions**: Granted by user or configuration
- **Timeout**: Configurable per tool type
- **Resource Limits**: Memory, CPU, I/O constraints

#### Progress Reporting

**Execution Start**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "tool_call_update",
      "toolCallId": "tool-456",
      "status": "in_progress",
      "locations": [
        {
          "path": "package.json"
        }
      ]
    }
  }
}
```

**Progress Updates** (for long-running tools):

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "tool_call_update",
      "toolCallId": "tool-456",
      "status": "in_progress",
      "progress": {
        "percentage": 75,
        "message": "Installing dependencies..."
      }
    }
  }
}
```

### 4. Result Processing

#### Success Result

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "tool_call_update",
      "toolCallId": "tool-456",
      "status": "completed",
      "kind": "edit",
      "content": [
        {
          "type": "diff",
          "path": "src/App.js",
          "oldText": "function App() {",
          "newText": "import React from 'react';\n\nfunction App() {"
        }
      ],
      "title": "Add React import",
      "rawOutput": {
        "output": "Successfully added import statement",
        "metadata": {
          "linesChanged": 2,
          "backupCreated": true
        }
      }
    }
  }
}
```

#### Error Result

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "tool_call_update",
      "toolCallId": "tool-456",
      "status": "failed",
      "content": [
        {
          "type": "content",
          "content": {
            "type": "text",
            "text": "Error: File not found"
          }
        }
      ],
      "rawOutput": {
        "error": "ENOENT: no such file or directory",
        "metadata": {
          "errorCode": "ENOENT",
          "attemptedPath": "/invalid/path"
        }
      }
    }
  }
}
```

### 5. Result Integration

#### Content Types

Tools can return different content types:

| Content Type | Description                | Example Use                 |
| ------------ | -------------------------- | --------------------------- |
| `content`    | General text/image content | Tool output, error messages |
| `diff`       | File modification details  | Edit operations             |
| `terminal`   | Terminal session reference | Long-running commands       |

#### Content Processing in Zed

- **Text Content**: Display in message history
- **Diff Content**: Show as file changes with syntax highlighting
- **Terminal Content**: Link to terminal output panel
- **Image Content**: Display inline or as attachments

## Tool-Specific Specifications

### File Operations

#### Read Text File

**Input Schema**:

```json
{
  "type": "object",
  "properties": {
    "path": { "type": "string" },
    "limit": { "type": "number" },
    "line": { "type": "number" }
  },
  "required": ["path"]
}
```

**Execution Flow**:

1. Validate file path and permissions
2. Check file size limits
3. Read content with optional line/byte limits
4. Return content or error

#### Write Text File

**Input Schema**:

```json
{
  "type": "object",
  "properties": {
    "path": { "type": "string" },
    "content": { "type": "string" }
  },
  "required": ["path", "content"]
}
```

**Execution Flow**:

1. Validate file path and permissions
2. Create backup if configured
3. Write content atomically
4. Verify write success
5. Return diff information

### Search Operations

#### Grep Search

**Input Schema**:

```json
{
  "type": "object",
  "properties": {
    "pattern": { "type": "string" },
    "path": { "type": "string" },
    "include": { "type": "string" },
    "exclude": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["pattern"]
}
```

**Execution Flow**:

1. Compile regex pattern
2. Apply include/exclude filters
3. Search files with ripgrep
4. Limit results to prevent overload
5. Return matches with context

#### Glob Pattern Matching

**Input Schema**:

```json
{
  "type": "object",
  "properties": {
    "pattern": { "type": "string" },
    "path": { "type": "string" }
  },
  "required": ["pattern"]
}
```

**Execution Flow**:

1. Parse glob pattern
2. Search filesystem
3. Apply permission checks
4. Return matching paths

### Development Tools

#### Bash Command Execution

**Input Schema**:

```json
{
  "type": "object",
  "properties": {
    "command": { "type": "string" },
    "args": { "type": "array", "items": { "type": "string" } },
    "cwd": { "type": "string" },
    "env": { "type": "object" }
  },
  "required": ["command"]
}
```

**Execution Flow**:

1. Validate command safety
2. Set up execution environment
3. Execute with timeout
4. Capture stdout/stderr
5. Return results or terminal reference

### MCP Server Tools

#### External Tool Invocation

MCP server tools follow the same lifecycle but are routed to external servers:

1. **Discovery**: Tools advertised by MCP server
2. **Invocation**: Parameters forwarded to MCP server
3. **Execution**: Handled by MCP server
4. **Results**: Returned via MCP protocol
5. **Integration**: Processed same as local tools

## Performance and Reliability

### Execution Timeouts

| Tool Category     | Default Timeout | Configurable |
| ----------------- | --------------- | ------------ |
| File operations   | 30 seconds      | Yes          |
| Search operations | 60 seconds      | Yes          |
| Development tools | 300 seconds     | Yes          |
| MCP tools         | 120 seconds     | Per server   |

### Resource Limits

| Resource        | Limit | Enforcement    |
| --------------- | ----- | -------------- |
| Memory per tool | 500MB | Process limits |
| CPU per tool    | 50%   | CPU quotas     |
| File size       | 100MB | Size checks    |
| Result size     | 10MB  | Truncation     |

### Error Handling

#### Tool Execution Errors

- **Timeout**: Cancel execution, return timeout error
- **Resource Exhaustion**: Kill process, return resource error
- **Permission Denied**: Return permission error
- **Invalid Input**: Validate and return validation error
- **System Errors**: Log and return system error

#### Recovery Mechanisms

- **Retry Logic**: Automatic retry for transient failures
- **Circuit Breaker**: Disable failing tools temporarily
- **Fallbacks**: Alternative implementations for critical tools
- **Cleanup**: Ensure proper resource cleanup on errors

## Security Considerations

### Input Validation

- **Path Traversal**: Prevent `../` in file paths
- **Command Injection**: Sanitize shell commands
- **Size Limits**: Prevent resource exhaustion
- **Type Validation**: Strict schema validation

### Permission System

- **Granular Permissions**: Per-tool, per-operation control
- **Session Scoping**: Permissions don't persist across sessions
- **Audit Logging**: All permission decisions logged
- **User Consent**: Clear permission prompts with context

### Safe Execution

- **Sandboxing**: Tools run in restricted environment
- **Resource Monitoring**: Prevent resource abuse
- **Timeout Enforcement**: Prevent hanging operations
- **Cleanup**: Proper process and file cleanup

## Testing and Validation

### Tool Testing Framework

#### Unit Tests

- Tool input validation
- Mock execution results
- Error condition handling
- Permission logic testing

#### Integration Tests

- End-to-end tool execution
- Permission workflow testing
- Resource limit enforcement
- Error recovery validation

#### Performance Tests

- Tool execution timing
- Resource usage monitoring
- Concurrent execution testing
- Load testing under stress

### Validation Criteria

#### Functional Validation

- [ ] All tools execute successfully
- [ ] Permission prompts work correctly
- [ ] Error handling is robust
- [ ] Results integrate properly in UI

#### Performance Validation

- [ ] Tools complete within timeouts
- [ ] Resource usage stays within limits
- [ ] Concurrent execution works
- [ ] Memory leaks prevented

#### Security Validation

- [ ] Input validation prevents attacks
- [ ] Permissions properly enforced
- [ ] Safe execution environment
- [ ] Audit logging functional

## Monitoring and Observability

### Tool Metrics

- **Execution Count**: Tools used per session
- **Success Rate**: Percentage of successful executions
- **Average Duration**: Time spent in tool execution
- **Error Rate**: Failures by tool and error type

### Performance Monitoring

- **Resource Usage**: CPU, memory, I/O per tool
- **Queue Depth**: Tools waiting for execution
- **Timeout Rate**: Tools exceeding time limits
- **Concurrent Load**: Number of simultaneous executions

### Error Tracking

- **Error Classification**: Categorize by type and severity
- **Root Cause Analysis**: Identify common failure patterns
- **Recovery Success**: Rate of successful error recovery
- **User Impact**: Errors affecting user experience

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Tool Invocation Specification Team
