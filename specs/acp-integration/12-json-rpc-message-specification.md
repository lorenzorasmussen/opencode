# JSON-RPC Message Specification

## Overview

This document provides a complete reference for all JSON-RPC messages used in the OpenCode-Zed ACP integration, including request/response formats, notification structures, and error handling.

## JSON-RPC 2.0 Compliance

### Message Structure

All messages follow JSON-RPC 2.0 specification:

```json
{
  "jsonrpc": "2.0",
  "id": null, // Number, String, or null for notifications
  "method": "method_name", // Required for requests/notifications
  "params": {}, // Optional parameters object
  "result": {}, // Required for responses (success)
  "error": {} // Required for responses (error)
}
```

### Transport Layer

- **Protocol**: JSON-RPC 2.0
- **Encoding**: UTF-8
- **Framing**: NDJSON (Newline Delimited JSON)
- **Connection**: Stdio (stdin/stdout)

## Agent-to-Client Messages

### Requests

#### 1. fs/read_text_file

Reads content from a text file.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "fs/read_text_file",
  "params": {
    "sessionId": "session-123",
    "path": "src/main.js",
    "limit": 1000,
    "line": 1
  }
}
```

**Parameters**:

- `sessionId` (string, required): Session identifier
- `path` (string, required): Absolute file path
- `limit` (number, optional): Maximum lines to read
- `line` (number, optional): Starting line number (1-based)

**Success Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": "console.log('Hello World');\n"
  }
}
```

**Error Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -31700,
    "message": "File not found",
    "data": {
      "path": "src/main.js"
    }
  }
}
```

#### 2. fs/write_text_file

Writes content to a text file.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "fs/write_text_file",
  "params": {
    "sessionId": "session-123",
    "path": "src/main.js",
    "content": "console.log('Updated content');\n"
  }
}
```

**Parameters**:

- `sessionId` (string, required): Session identifier
- `path` (string, required): Absolute file path
- `content` (string, required): Text content to write

**Success Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {}
}
```

#### 3. session/request_permission

Requests user permission for a tool operation.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "session/request_permission",
  "params": {
    "sessionId": "session-123",
    "toolCall": {
      "toolCallId": "tool-456",
      "title": "Run npm install",
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

**Success Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "outcome": {
      "outcome": "selected",
      "optionId": "once"
    }
  }
}
```

### Notifications

#### 1. session/update

Sends real-time updates about session progress.

**Notification**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "agent_message_chunk",
      "content": {
        "type": "text",
        "text": "Here's the solution:"
      }
    }
  }
}
```

**Update Types**:

**agent_message_chunk**:

```json
{
  "sessionUpdate": "agent_message_chunk",
  "content": {
    "type": "text",
    "text": "Chunk of response text"
  }
}
```

**tool_call**:

```json
{
  "sessionUpdate": "tool_call",
  "toolCallId": "tool-456",
  "title": "Execute command",
  "kind": "execute",
  "status": "pending",
  "locations": []
}
```

**tool_call_update**:

```json
{
  "sessionUpdate": "tool_call_update",
  "toolCallId": "tool-456",
  "status": "completed",
  "content": [
    {
      "type": "content",
      "content": {
        "type": "text",
        "text": "Command completed successfully"
      }
    }
  ]
}
```

**plan**:

```json
{
  "sessionUpdate": "plan",
  "entries": [
    {
      "content": "Create React component",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**available_commands_update**:

```json
{
  "sessionUpdate": "available_commands_update",
  "availableCommands": [
    {
      "name": "init",
      "description": "Initialize project"
    }
  ]
}
```

## Client-to-Agent Messages

### Requests

#### 1. initialize

Initializes the ACP connection.

**Request**:

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

**Success Response**:

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
    "authMethods": []
  }
}
```

#### 2. session/new

Creates a new conversation session.

**Request**:

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
        "command": ["bun", "x", "@h1deya/mcp-server-weather"]
      }
    ]
  }
}
```

**Success Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "sessionId": "session-abc123",
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

#### 3. session/load

Loads an existing session.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "session/load",
  "params": {
    "sessionId": "session-abc123",
    "cwd": "/path/to/project",
    "mcpServers": []
  }
}
```

#### 4. session/prompt

Submits a user prompt for processing.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "session/prompt",
  "params": {
    "sessionId": "session-abc123",
    "prompt": [
      {
        "type": "text",
        "text": "Create a function to calculate fibonacci numbers"
      }
    ]
  }
}
```

**Success Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "stopReason": "end_turn"
  }
}
```

#### 5. session/set_mode

Changes the session mode.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "session/set_mode",
  "params": {
    "sessionId": "session-abc123",
    "modeId": "architect"
  }
}
```

**Success Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {}
}
```

#### 6. session/set_model

Changes the session model.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "session/set_model",
  "params": {
    "sessionId": "session-abc123",
    "modelId": "openai/gpt-4"
  }
}
```

### Notifications

#### 1. session/cancel

Cancels ongoing session operations.

**Notification**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/cancel",
  "params": {
    "sessionId": "session-abc123"
  }
}
```

## Error Codes and Messages

### Standard JSON-RPC Errors

| Code   | Message          | Description                             |
| ------ | ---------------- | --------------------------------------- |
| -32700 | Parse error      | Invalid JSON received                   |
| -32600 | Invalid Request  | Request is not a valid JSON-RPC request |
| -32601 | Method not found | Method does not exist                   |
| -32602 | Invalid params   | Invalid method parameter(s)             |
| -32603 | Internal error   | Internal JSON-RPC error                 |

### ACP-Specific Errors

| Code   | Message                | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| -32000 | Connection lost        | Network connection lost                |
| -32001 | Timeout                | Operation timed out                    |
| -31900 | Session not found      | Specified session does not exist       |
| -31901 | Session expired        | Session has expired                    |
| -31902 | Session locked         | Session is locked by another operation |
| -31800 | Tool not found         | Specified tool does not exist          |
| -31801 | Tool disabled          | Tool is currently disabled             |
| -31802 | Tool timeout           | Tool execution exceeded timeout        |
| -31700 | File not found         | Specified file does not exist          |
| -31701 | Permission denied      | File access permission denied          |
| -31702 | File too large         | File exceeds size limits               |
| -31600 | MCP server error       | MCP server communication failed        |
| -31601 | MCP server unavailable | MCP server is not responding           |

## Message Validation

### Schema Validation

All messages are validated against JSON schemas:

**Request Validation**:

- Required fields present
- Data types correct
- Value ranges valid
- String formats valid

**Response Validation**:

- ID matches request
- Result or error present (not both)
- Error format correct
- Result format matches method

### Content Validation

**Text Content**:

- UTF-8 encoding
- Reasonable size limits
- No null bytes

**File Paths**:

- Absolute paths only
- Path traversal prevention
- Platform-appropriate separators

**IDs and Tokens**:

- UUID format for session IDs
- Reasonable length limits
- No special characters

## Message Ordering and Sequencing

### Request-Response Correlation

- Each request has unique ID
- Response ID matches request ID
- Notifications have no ID (null)
- Out-of-order responses allowed

### Session State Consistency

- Messages for same session processed in order
- State changes atomic
- Concurrent operations prevented
- Rollback on failures

### Streaming Message Ordering

- Chunks delivered in order
- Tool updates may interleave with text
- Completion notifications after all chunks
- Error notifications terminate streams

## Performance Considerations

### Message Size Limits

| Message Type   | Max Size | Rationale              |
| -------------- | -------- | ---------------------- |
| initialize     | 10KB     | Simple handshake       |
| session/new    | 50KB     | MCP server configs     |
| session/prompt | 1MB      | Large file attachments |
| session/update | 100KB    | Streaming chunks       |
| fs/\*          | 10MB     | Large file contents    |

### Rate Limiting

| Operation          | Rate Limit  | Window      |
| ------------------ | ----------- | ----------- |
| session/prompt     | 10/minute   | Per session |
| fs/read_text_file  | 100/minute  | Per session |
| fs/write_text_file | 50/minute   | Per session |
| session/update     | 1000/minute | Per session |

### Timeout Specifications

| Operation          | Timeout | Retry |
| ------------------ | ------- | ----- |
| initialize         | 30s     | No    |
| session/new        | 60s     | No    |
| session/prompt     | 300s    | No    |
| fs/read_text_file  | 30s     | Yes   |
| fs/write_text_file | 60s     | Yes   |

## Testing Message Examples

### Complete Conversation Flow

1. **Initialize**:

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1}}
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":1,"agentCapabilities":{...}}}
```

2. **Create Session**:

```json
{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp"}}
{"jsonrpc":"2.0","id":2,"result":{"sessionId":"session-123",...}}
```

3. **Send Prompt**:

```json
{"jsonrpc":"2.0","id":3,"method":"session/prompt","params":{"sessionId":"session-123","prompt":[{"type":"text","text":"Hello"}]}}
{"jsonrpc":"2.0","method":"session/update","params":{"sessionId":"session-123","update":{"sessionUpdate":"agent_message_chunk","content":{"type":"text","text":"Hi there!"}}}}
{"jsonrpc":"2.0","id":3,"result":{"stopReason":"end_turn"}}
```

### Error Scenarios

1. **Invalid Session**:

```json
{"jsonrpc":"2.0","id":4,"method":"session/prompt","params":{"sessionId":"invalid","prompt":[...]}}
{"jsonrpc":"2.0","id":4,"error":{"code":-31900,"message":"Session not found"}}
```

2. **File Not Found**:

```json
{"jsonrpc":"2.0","id":5,"method":"fs/read_text_file","params":{"sessionId":"session-123","path":"/nonexistent"}}
{"jsonrpc":"2.0","id":5,"error":{"code":-31700,"message":"File not found"}}
```

## Implementation Notes

### Message Parsing

- Use streaming JSON parser for large messages
- Validate messages before processing
- Handle malformed JSON gracefully
- Log invalid messages for debugging

### Error Handling

- Always respond to requests (success or error)
- Include helpful error details
- Don't expose internal system information
- Rate limit error responses

### Logging

- Log all incoming requests
- Log all outgoing responses
- Include session context
- Mask sensitive information

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: JSON-RPC Message Specification Team
