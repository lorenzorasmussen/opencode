# ACP Protocol Specification for OpenCode-Zed Integration

## Overview

This specification defines the Agent Client Protocol (ACP) implementation for OpenCode's integration with Zed editor. The ACP protocol enables standardized communication between code editors and AI-powered coding agents, providing a consistent interface for tool execution, session management, and real-time updates.

## Protocol Version

- **ACP Protocol Version**: 1
- **Transport Layer**: JSON-RPC 2.0 over stdio
- **Message Format**: NDJSON (Newline Delimited JSON)

## Core Protocol Components

### 1. Connection Establishment

#### Initialize Handshake

**Request (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": 1,
    "clientCapabilities": {
      "fs": {
        "readTextFile": true,
        "writeTextFile": true
      },
      "terminal": true
    },
    "clientInfo": {
      "name": "zed",
      "version": "0.1.0"
    }
  }
}
```

**Response (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": 1,
    "agentCapabilities": {
      "loadSession": true,
      "mcpCapabilities": {
        "http": true,
        "sse": true
      },
      "promptCapabilities": {
        "embeddedContext": true,
        "image": true
      }
    },
    "agentInfo": {
      "name": "opencode",
      "version": "0.1.0"
    },
    "authMethods": [
      {
        "id": "opencode-login",
        "name": "Login with opencode",
        "description": "Run `opencode auth login` in the terminal"
      }
    ]
  }
}
```

### 2. Session Management

#### Session Creation

**Request (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "session/new",
  "params": {
    "cwd": "/path/to/project",
    "mcpServers": [
      {
        "name": "weather",
        "type": "local",
        "command": ["bun", "x", "@h1deya/mcp-server-weather"],
        "args": [],
        "env": []
      }
    ]
  }
}
```

**Response (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "sessionId": "session-uuid",
    "models": {
      "currentModelId": "anthropic/claude-3-5-sonnet-20241022",
      "availableModels": [
        {
          "modelId": "anthropic/claude-3-5-sonnet-20241022",
          "name": "Claude 3.5 Sonnet"
        }
      ]
    },
    "modes": {
      "availableModes": [
        {
          "id": "build",
          "name": "Build",
          "description": "General purpose coding assistant"
        }
      ],
      "currentModeId": "build"
    }
  }
}
```

#### Session Loading

**Request (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "session/load",
  "params": {
    "sessionId": "session-uuid",
    "cwd": "/path/to/project",
    "mcpServers": []
  }
}
```

### 3. Prompt Processing

#### User Message Submission

**Request (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "session/prompt",
  "params": {
    "sessionId": "session-uuid",
    "prompt": [
      {
        "type": "text",
        "text": "Create a function to calculate fibonacci numbers"
      }
    ]
  }
}
```

#### Real-time Streaming Updates

**Notification (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-uuid",
    "update": {
      "sessionUpdate": "agent_message_chunk",
      "content": {
        "type": "text",
        "text": "Here's a recursive function to calculate fibonacci numbers:"
      }
    }
  }
}
```

#### Tool Call Execution

**Notification (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-uuid",
    "update": {
      "sessionUpdate": "tool_call",
      "toolCallId": "tool-123",
      "title": "Write fibonacci function",
      "kind": "edit",
      "status": "pending",
      "locations": [
        {
          "path": "fibonacci.js"
        }
      ]
    }
  }
}
```

#### Tool Call Progress Updates

**Notification (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-uuid",
    "update": {
      "sessionUpdate": "tool_call_update",
      "toolCallId": "tool-123",
      "status": "completed",
      "content": [
        {
          "type": "diff",
          "path": "fibonacci.js",
          "oldText": "",
          "newText": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}"
        }
      ]
    }
  }
}
```

#### Prompt Completion

**Response (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "stopReason": "end_turn"
  }
}
```

### 4. Client-Side Operations

#### File System Operations

**Read File Request (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "fs/read_text_file",
  "params": {
    "sessionId": "session-uuid",
    "path": "fibonacci.js",
    "limit": null,
    "line": null
  }
}
```

**Read File Response (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "content": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}"
  }
}
```

**Write File Request (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "fs/write_text_file",
  "params": {
    "sessionId": "session-uuid",
    "path": "fibonacci.js",
    "content": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nmodule.exports = fibonacci;"
  }
}
```

#### Permission Requests

**Permission Request (Agent → Client):**

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "session/request_permission",
  "params": {
    "sessionId": "session-uuid",
    "toolCall": {
      "toolCallId": "tool-124",
      "title": "Install npm package",
      "status": "pending",
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

**Permission Response (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {
    "outcome": {
      "outcome": "selected",
      "optionId": "once"
    }
  }
}
```

### 5. Error Handling

#### Standard Error Response

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {
      "details": "Session not found"
    }
  }
}
```

#### Error Codes

| Code   | Meaning          |
| ------ | ---------------- |
| -32700 | Parse error      |
| -32600 | Invalid Request  |
| -32601 | Method not found |
| -32602 | Invalid params   |
| -32603 | Internal error   |
| -32000 | Server error     |

### 6. Session Control

#### Mode Switching

**Request (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "session/set_mode",
  "params": {
    "sessionId": "session-uuid",
    "modeId": "architect"
  }
}
```

#### Model Switching

**Request (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "session/set_model",
  "params": {
    "sessionId": "session-uuid",
    "modelId": "openai/gpt-4"
  }
}
```

#### Cancellation

**Notification (Client → Agent):**

```json
{
  "jsonrpc": "2.0",
  "method": "session/cancel",
  "params": {
    "sessionId": "session-uuid"
  }
}
```

## Message Flow Diagrams

### Complete Session Flow

```
Client                  Agent
  |                       |
  |--- initialize ------->|
  |<-- initialize --------|
  |                       |
  |--- session/new ------>|
  |<-- session/new -------|
  |                       |
  |--- session/prompt --->|
  |<-- tool_call ----------|
  |--- permission request-|
  |<-- permission response|
  |<-- tool_call_update --|
  |<-- agent_message_chunk|
  |<-- prompt response ---|
  |                       |
```

### Tool Execution Flow

```
Agent                   Client
  |                       |
  |--- tool_call -------->|
  |                       |
  |--- request_permission>|
  |<-- permission --------|
  |                       |
  |--- fs/write_text_file>|
  |<-- write response ----|
  |                       |
  |--- tool_call_update ->|
  |                       |
```

## Protocol Compliance Requirements

### Required Capabilities

1. **Protocol Version Negotiation**: Must support version 1
2. **JSON-RPC 2.0**: All messages must conform to JSON-RPC 2.0 specification
3. **Stdio Transport**: Communication must use stdin/stdout with NDJSON
4. **Session Management**: Must support session/new and session/load
5. **Prompt Processing**: Must support session/prompt with streaming
6. **File Operations**: Must support fs/read_text_file and fs/write_text_file
7. **Permission System**: Must request permission for sensitive operations

### Optional Capabilities

1. **MCP Support**: May support MCP server connections
2. **Terminal Operations**: May support terminal/create and related methods
3. **Authentication**: May require authentication before session creation
4. **Model Switching**: May allow dynamic model changes
5. **Mode Switching**: May support different operational modes

## Implementation Notes

### Connection Lifecycle

1. **Startup**: Agent starts and waits for initialize request
2. **Handshake**: Protocol version and capabilities negotiation
3. **Session Creation**: Client creates sessions as needed
4. **Active Operation**: Bidirectional message exchange during sessions
5. **Shutdown**: Clean termination on stdin close or SIGTERM

### Error Recovery

1. **Transient Failures**: Automatic retry for network-related errors
2. **Invalid Messages**: Log and continue processing other messages
3. **Session Errors**: Isolate failures to specific sessions
4. **Connection Loss**: Graceful reconnection if supported

### Performance Considerations

1. **Message Size**: Keep individual messages under 1MB
2. **Streaming**: Use chunked updates for large responses
3. **Buffering**: Implement proper buffering for stdio communication
4. **Concurrency**: Handle multiple concurrent sessions efficiently

## Testing Requirements

### Protocol Compliance Tests

1. **Message Format**: Validate all messages conform to schema
2. **Method Support**: Test all required methods are implemented
3. **Error Handling**: Verify proper error responses
4. **Session Isolation**: Ensure sessions don't interfere with each other

### Integration Tests

1. **End-to-End Flow**: Complete session creation to completion
2. **Tool Execution**: Test file operations and permission flows
3. **Streaming**: Validate real-time updates work correctly
4. **Error Scenarios**: Test various failure conditions

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: ACP Integration Specification Team
