# ACP Message Flow Specification

## Overview

This document specifies the complete message flows for the Agent Client Protocol (ACP) implementation in OpenCode-Zed integration, detailing the sequence, timing, and error handling for all protocol interactions.

## Core Message Flow Patterns

### 1. Connection Establishment Flow

#### Initialize Handshake

```
Client (Zed)              Agent (OpenCode)
     |                          |
     |--- initialize ---------->|
     |                          | Validate protocol version
     |                          | Load capabilities
     |                          | Prepare auth methods
     |<-- initialize -----------|
     |                          |
     | Validate response        |
     | Check protocol version   |
     | Store capabilities       |
     |                          |
```

**Sequence Diagram**:

```
sequenceDiagram
    participant Z as Zed
    participant O as OpenCode

    Z->>O: initialize {protocolVersion: 1}
    O->>O: Validate protocol version
    O->>O: Load agent capabilities
    O->>O: Prepare authentication methods
    O-->>Z: initialize response {protocolVersion: 1, capabilities, authMethods}
    Z->>Z: Validate response
    Z->>Z: Store capabilities for future use
```

**Timing Requirements**:

- Initialize request: Immediate after connection
- Response timeout: 5 seconds
- Total handshake: < 2 seconds

**Error Handling**:

- Invalid protocol version: Disconnect with error
- Capability mismatch: Log warning, continue with available features
- Authentication required: Prompt user for auth

### 2. Session Creation Flow

#### New Session Establishment

```
Client (Zed)              Agent (OpenCode)
     |                          |
     |--- session/new --------->|
     |                          | Create internal session
     |                          | Set working directory
     |                          | Initialize MCP servers
     |                          | Load default model
     |<-- session/new ----------|
     |                          |
     | Store session info       |
     | Update UI state         |
     |                          |
```

**Detailed Flow**:

1. **Client Request**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "session/new",
  "params": {
    "cwd": "/Users/user/project",
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

2. **Agent Processing**:
   - Create internal OpenCode session
   - Set working directory context
   - Initialize MCP server connections
   - Load default model and mode
   - Prepare available commands list

3. **Agent Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "sessionId": "session-abc123",
    "models": {
      "currentModelId": "anthropic/claude-3-5-sonnet-20241022",
      "availableModels": [...]
    },
    "modes": {
      "availableModes": [...],
      "currentModeId": "build"
    }
  }
}
```

4. **Client Processing**:
   - Store session ID for future requests
   - Update UI with model/mode selectors
   - Enable prompt input

**Timing Requirements**:

- Session creation: < 2 seconds
- MCP server initialization: < 5 seconds per server
- Total setup: < 10 seconds

### 3. Prompt Processing Flow

#### User Message Submission

```
Client (Zed)              Agent (OpenCode)
     |                          |
     |--- session/prompt ------>|
     |                          | Parse prompt content
     |                          | Check for commands
     |                          | Process prompt
     |                          | Start response generation
     |<-- session/prompt -------|
     |                          |
     |<-- session/update -------| (streaming)
     |<-- session/update -------| (streaming)
     |                          |
     |<-- session/prompt -------| (completion)
     |                          |
```

**Streaming Response Flow**:

1. **Initial Response** (Immediate):

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "stopReason": "end_turn"
  }
}
```

2. **Streaming Updates** (Progressive):

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-abc123",
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

3. **Tool Execution Updates**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-abc123",
    "update": {
      "sessionUpdate": "tool_call",
      "toolCallId": "tool-123",
      "title": "Create fibonacci function",
      "kind": "edit",
      "status": "pending"
    }
  }
}
```

**Command Processing Flow**:

```
User Input: "/init Create a React component"
     |
     v
Agent detects command prefix "/"
     |
     v
Parse command: name="init", args="Create a React component"
     |
     v
Execute command via Command.get("init")
     |
     v
Return success/failure
```

### 4. Tool Execution Flow

#### File Operation Example

```
Agent                      Client (Zed)
     |                          |
     |--- fs/read_text_file --->|
     |                          | Validate permissions
     |                          | Read file content
     |<-- file content ---------|
     |                          |
     | Process content          |
     | Generate response        |
     |                          |
```

**Permission Flow**:

```
Agent                      Client (Zed)
     |                          |
     | Detect tool requiring    |
     | permission               |
     |                          |
     |--- session/request_perm->|
     |                          | Display permission dialog
     |                          | User makes choice
     |<-- permission response --|
     |                          |
     | Proceed based on choice  |
     |                          |
```

**Complete Tool Execution**:

1. **Tool Call Notification**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-abc123",
    "update": {
      "sessionUpdate": "tool_call",
      "toolCallId": "tool-456",
      "title": "Edit package.json",
      "kind": "edit",
      "status": "pending",
      "locations": [{ "path": "package.json" }]
    }
  }
}
```

2. **Permission Request** (if needed):

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "session/request_permission",
  "params": {
    "sessionId": "session-abc123",
    "toolCall": {...},
    "options": [...]
  }
}
```

3. **File Operation**:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "fs/write_text_file",
  "params": {
    "sessionId": "session-abc123",
    "path": "package.json",
    "content": "{...}"
  }
}
```

4. **Tool Completion**:

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-abc123",
    "update": {
      "sessionUpdate": "tool_call_update",
      "toolCallId": "tool-456",
      "status": "completed",
      "content": [...]
    }
  }
}
```

### 5. Error Handling Flows

#### Protocol Error Flow

```
Client                    Agent
     |                        |
     |--- invalid request --->|
     |                        | Validate message
     |                        | Detect error
     |<-- error response ------|
     |                        |
     | Handle error           |
     | Retry or abort         |
```

**Error Response Format**:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {
      "details": "Missing required field 'sessionId'"
    }
  }
}
```

#### Connection Error Recovery

```
Connection lost
     |
     v
Detect disconnection
     |
     v
Attempt reconnection (up to 3 times)
     |
     v
Success: Resume session
     |
     v
Failure: Notify user, allow manual reconnect
```

#### Session Error Recovery

```
Session error occurs
     |
     v
Log error details
     |
     v
Attempt recovery (if possible)
     |
     v
Notify user of issue
     |
     v
Allow session restart
```

## Advanced Message Flows

### 6. MCP Server Integration Flow

#### Server Connection Establishment

```
Agent Startup
     |
     v
Parse MCP server configs from opencode.json
     |
     v
For each server:
     |
     +-> Local: Spawn process
     |    |
     |    v
     |   Monitor process health
     |
     +-> Remote: Establish HTTP connection
          |
          v
         Monitor connection health
     |
     v
MCP servers ready for tool calls
```

#### MCP Tool Execution

```
User prompt requires external tool
     |
     v
Agent identifies MCP server capability
     |
     v
Route tool call to MCP server
     |
     v
MCP server processes request
     |
     v
Return results to agent
     |
     v
Agent incorporates results into response
```

### 7. Streaming and Real-time Updates

#### Progressive Response Streaming

```
Prompt submitted
     |
     v
Agent begins processing
     |
     v
Send initial response (empty)
     |
     v
Start response generation
     |
     +-> Text chunk ready
     |    |
     |    v
     |   Send agent_message_chunk
     |    |
     |    +-> More chunks...
     |
     +-> Tool call needed
          |
          v
         Send tool_call notification
          |
          v
         Execute tool
          |
          v
         Send tool_call_update
          |
          v
         Continue with text
```

#### Plan Updates

```
Agent decides on multi-step plan
     |
     v
Send plan notification
     |
     v
Execute first step
     |
     v
Send tool updates for progress
     |
     v
Update plan status
     |
     v
Continue with next steps
```

### 8. Cancellation Flow

#### Prompt Cancellation

```
User cancels prompt
     |
     v
Client sends session/cancel
     |
     v
Agent receives cancellation
     |
     v
Stop current processing
     |
     v
Send final updates if any
     |
     v
Respond with cancelled stop_reason
```

#### Tool Cancellation

```
Tool execution in progress
     |
     v
User cancels (if supported)
     |
     v
Agent attempts to stop tool
     |
     v
Send tool_call_update with error
     |
     v
Continue with alternative approach
```

## Performance and Timing Specifications

### Message Timing Requirements

| Operation            | Target Time | Criticality |
| -------------------- | ----------- | ----------- |
| Connection handshake | < 2 seconds | Critical    |
| Session creation     | < 2 seconds | Critical    |
| Message round-trip   | < 500ms     | High        |
| File read (1MB)      | < 1 second  | High        |
| File write (1MB)     | < 2 seconds | High        |
| Tool execution       | < 5 seconds | Medium      |
| MCP server init      | < 5 seconds | Medium      |

### Flow Control Mechanisms

#### Message Batching

- Batch small updates when possible
- Respect client's processing capacity
- Implement backpressure handling

#### Rate Limiting

- Limit message frequency to prevent overload
- Queue messages during high load
- Provide progress indicators for long operations

### Error Recovery Timing

| Error Type             | Retry Strategy      | Max Attempts |
| ---------------------- | ------------------- | ------------ |
| Network timeout        | Exponential backoff | 3            |
| Server error           | Immediate retry     | 2            |
| Authentication failure | User intervention   | 1            |
| Protocol error         | Log and abort       | 0            |

## Message Flow Testing

### Unit Test Scenarios

1. **Normal Flow Testing**:
   - Happy path message exchanges
   - All required fields present
   - Expected response formats

2. **Error Flow Testing**:
   - Invalid message formats
   - Missing required fields
   - Unexpected error conditions

3. **Performance Testing**:
   - High-frequency message exchanges
   - Large message payloads
   - Concurrent session handling

### Integration Test Scenarios

1. **End-to-End Conversations**:
   - Complete user interaction flows
   - Multi-turn conversations
   - Tool execution workflows

2. **Failure Recovery**:
   - Connection interruptions
   - Server restarts
   - Invalid state recovery

3. **Load Testing**:
   - Multiple concurrent sessions
   - Large file operations
   - Extended conversation history

## Monitoring and Debugging

### Message Flow Logging

**Log Levels**:

- DEBUG: All message details
- INFO: Flow start/completion
- WARN: Retries and recovery
- ERROR: Failures and exceptions

**Log Context**:

- Session ID
- Message ID
- Timestamp
- Operation type
- Performance metrics

### Flow Visualization

**Debug Tools**:

- Message sequence diagrams
- Timing charts
- Error flow tracking
- Performance profiling

**Monitoring Dashboard**:

- Real-time message rates
- Error rates by flow type
- Performance histograms
- Session health status

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: ACP Message Flow Specification Team
