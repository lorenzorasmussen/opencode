# Error Handling Specification

## Overview

This document specifies comprehensive error handling for the OpenCode-Zed ACP integration, defining error categories, handling strategies, recovery mechanisms, and user communication patterns.

## Error Classification

### Error Categories

#### Protocol Errors

**Connection Errors**:

- Network disconnection
- Timeout errors
- Invalid protocol version
- Message format errors

**Message Errors**:

- Invalid JSON-RPC format
- Missing required fields
- Schema validation failures
- Unsupported method calls

#### Application Errors

**Session Errors**:

- Session not found
- Session creation failure
- Session state corruption
- Concurrent access conflicts

**Tool Execution Errors**:

- Tool not found
- Invalid tool parameters
- Tool execution timeout
- Tool permission denied

**File System Errors**:

- File not found
- Permission denied
- Disk space exhausted
- File lock conflicts

### Error Severity Levels

| Level        | Description          | User Impact            | Recovery               |
| ------------ | -------------------- | ---------------------- | ---------------------- |
| **Critical** | System unusable      | Blocks all operations  | Immediate intervention |
| **High**     | Major feature broken | Significant disruption | User action required   |
| **Medium**   | Feature degraded     | Minor inconvenience    | Automatic recovery     |
| **Low**      | Minor issue          | No functional impact   | Silent handling        |

## Error Response Format

### JSON-RPC Error Structure

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {
      "details": "Missing required field 'sessionId'",
      "field": "sessionId",
      "suggestion": "Ensure sessionId is provided in all requests"
    }
  }
}
```

### Error Code Ranges

| Range            | Category     | Description                  |
| ---------------- | ------------ | ---------------------------- |
| -32768 to -32000 | JSON-RPC     | Standard JSON-RPC errors     |
| -32000 to -31900 | ACP Protocol | ACP-specific protocol errors |
| -31900 to -31800 | Session      | Session management errors    |
| -31800 to -31700 | Tool         | Tool execution errors        |
| -31700 to -31600 | File System  | File operation errors        |
| -31600 to -31500 | MCP          | MCP server errors            |
| -31500 to -31000 | Application  | General application errors   |

### Common Error Codes

| Code   | Name              | Description           |
| ------ | ----------------- | --------------------- |
| -32600 | Invalid Request   | Malformed request     |
| -32601 | Method not found  | Unknown method        |
| -32602 | Invalid params    | Invalid parameters    |
| -32603 | Internal error    | Server internal error |
| -32000 | Connection lost   | Network disconnection |
| -32001 | Timeout           | Operation timeout     |
| -31900 | Session not found | Invalid session ID    |
| -31901 | Session expired   | Session timeout       |
| -31800 | Tool not found    | Unknown tool          |
| -31801 | Tool disabled     | Tool unavailable      |
| -31700 | File not found    | File doesn't exist    |
| -31701 | Permission denied | Access denied         |

## Error Handling Strategies

### Connection Error Handling

#### Automatic Reconnection

**Reconnection Flow**:

```
Connection lost
     |
     v
Detect disconnection (timeout)
     |
     v
Wait exponential backoff (1s, 2s, 4s...)
     |
     v
Attempt reconnection (up to 5 times)
     |
     v
Success: Resume session
     |
     v
Failure: Notify user, allow manual reconnect
```

**Reconnection Parameters**:

- Initial delay: 1 second
- Max delay: 30 seconds
- Max attempts: 5
- Timeout per attempt: 10 seconds

#### Connection State Management

**States**:

- `connecting`: Establishing connection
- `connected`: Active connection
- `reconnecting`: Attempting reconnection
- `disconnected`: Connection lost
- `failed`: Reconnection failed

### Session Error Handling

#### Session Recovery

**Recovery Strategies**:

1. **State Validation**: Check session integrity
2. **Automatic Repair**: Fix corrupted state
3. **Fallback Creation**: Create new session if needed
4. **User Notification**: Inform about recovery actions

**Session Error Scenarios**:

| Error             | Recovery Action          | User Notification                      |
| ----------------- | ------------------------ | -------------------------------------- |
| Session not found | Create new session       | "Session expired, created new session" |
| State corruption  | Restore from backup      | "Session recovered from backup"        |
| Concurrent access | Lock conflict resolution | "Session in use by another client"     |

### Tool Execution Error Handling

#### Tool Error Classification

**Retryable Errors**:

- Network timeouts
- Temporary file locks
- Resource contention
- MCP server unavailability

**Non-retryable Errors**:

- Invalid parameters
- File not found
- Permission denied
- Tool not available

#### Tool Error Recovery

**Recovery Flow**:

```
Tool execution fails
     |
     v
Classify error type
     |
     +-> Retryable
     |    |
     |    v
     |   Wait backoff period
     |    |
     |    v
     |   Retry execution (up to 3 times)
     |
     +-> Non-retryable
          |
          v
         Report error to user
          |
          v
         Suggest alternatives
```

### File System Error Handling

#### File Operation Errors

**Common File Errors**:

| Error  | Cause               | Recovery                                   |
| ------ | ------------------- | ------------------------------------------ |
| ENOENT | File not found      | Check path, suggest alternatives           |
| EACCES | Permission denied   | Request permissions, show location         |
| ENOSPC | Disk full           | Clean up space, suggest smaller operations |
| EMFILE | Too many open files | Close unused files, reduce scope           |

#### File Error Recovery

**Recovery Strategies**:

- **Path Correction**: Suggest correct paths
- **Permission Elevation**: Guide through permission fixes
- **Space Management**: Help free up disk space
- **Alternative Operations**: Suggest different approaches

## User Communication

### Error Message Format

#### User-Friendly Messages

**Structure**:

```
[Error Type] Brief description

Detailed explanation of what went wrong and why.

[Suggestion] What the user can do to fix it.

[Alternative] If applicable, alternative approaches.
```

**Example**:

```
Connection Error: Unable to connect to OpenCode

The connection to the OpenCode agent server was lost. This might be due to network issues or the server being unavailable.

Suggestion: Check your internet connection and ensure OpenCode is running.

Alternative: Try restarting the agent server or check the configuration.
```

### Error Notification Types

#### UI Notifications

**Toast Notifications**:

- Short-lived for minor errors
- Action buttons for recovery
- Dismissible by user

**Modal Dialogs**:

- For critical errors
- Detailed information
- Multiple action options

**Status Indicators**:

- Connection status in UI
- Error badges on components
- Progress indicators for recovery

#### Error Details Panel

**Comprehensive Error Display**:

```
Error Details
├── Type: Connection Error
├── Code: -32000
├── Message: Connection timeout
├── Timestamp: 2025-11-02 14:32:15
├── Session: session-abc123
├── Action Taken: Auto-reconnecting
└── Suggested Actions:
    ├── Check network connection
    ├── Restart OpenCode server
    └── View logs for more details
```

## Recovery Mechanisms

### Automatic Recovery

#### Self-Healing Systems

**Connection Recovery**:

- Automatic reconnection with backoff
- Session state preservation
- Message queue replay
- Silent recovery when possible

**Tool Recovery**:

- Automatic retry for transient failures
- Alternative tool selection
- Partial result handling
- Resource cleanup

#### Recovery Monitoring

**Recovery Metrics**:

- Recovery success rate
- Average recovery time
- Recovery attempt frequency
- User intervention rate

### Manual Recovery

#### User-Initiated Recovery

**Recovery Actions**:

- **Reconnect**: Manual connection attempt
- **Restart Session**: Create new session
- **Clear Cache**: Reset cached data
- **Reset Configuration**: Reconfigure settings

**Recovery UI**:

- Recovery action buttons
- Progress indicators
- Status updates
- Success confirmations

### Fallback Systems

#### Graceful Degradation

**Fallback Strategies**:

- **Reduced Functionality**: Continue with limited features
- **Offline Mode**: Basic operations without server
- **Local Processing**: Client-side alternatives
- **Cached Results**: Use previously cached data

**Degradation Levels**:

1. **Full Functionality**: All features available
2. **Degraded**: Some features unavailable
3. **Limited**: Core features only
4. **Offline**: Read-only mode

## Logging and Monitoring

### Error Logging

#### Log Structure

**Error Log Entry**:

```json
{
  "timestamp": "2025-11-02T14:32:15Z",
  "level": "error",
  "service": "acp-agent",
  "sessionId": "session-abc123",
  "error": {
    "code": -32000,
    "message": "Connection timeout",
    "data": {
      "attempts": 3,
      "lastAttempt": "2025-11-02T14:32:10Z"
    }
  },
  "context": {
    "userId": "user-123",
    "operation": "session/prompt",
    "tool": null
  },
  "stack": "..."
}
```

#### Log Levels

- **ERROR**: User-impacting errors
- **WARN**: Potential issues, automatic recovery
- **INFO**: Recovery actions, state changes
- **DEBUG**: Detailed error context

### Error Monitoring

#### Metrics Collection

**Error Metrics**:

- Error rate by category
- Recovery success rate
- User-reported issues
- System availability

**Alerting**:

- High error rates
- Failed recoveries
- Critical system errors
- User impact thresholds

#### Error Analysis

**Root Cause Analysis**:

- Error pattern detection
- Correlation with system events
- Performance impact assessment
- User experience impact

## Testing and Validation

### Error Testing

#### Error Injection Testing

**Test Scenarios**:

- Network disconnection
- Server crashes
- Invalid messages
- Resource exhaustion
- Permission failures

#### Recovery Testing

**Recovery Validation**:

- Automatic reconnection
- Session restoration
- Data integrity
- User experience continuity

### Error Handling Validation

#### Validation Criteria

- [ ] All error paths tested
- [ ] Recovery mechanisms functional
- [ ] User communication clear
- [ ] Logging comprehensive
- [ ] Monitoring alerts working

## Best Practices

### Error Prevention

#### Input Validation

- Strict schema validation
- Sanitize all inputs
- Bounds checking
- Type safety

#### Resource Management

- Proper cleanup
- Resource limits
- Timeout enforcement
- Memory management

### Error Communication

#### User-Centric Messages

- Avoid technical jargon
- Provide actionable advice
- Include context
- Suggest alternatives

#### Developer Support

- Detailed technical logs
- Error correlation IDs
- Debug information
- Support contact information

### Continuous Improvement

#### Error Analysis

- Regular error review
- Pattern identification
- Prevention implementation
- User feedback integration

#### System Resilience

- Redundancy design
- Failure isolation
- Graceful degradation
- Recovery automation

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Error Handling Specification Team
