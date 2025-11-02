# Zed ACP Client Requirements

## Overview

This document specifies the requirements for Zed editor's ACP (Agent Client Protocol) client implementation to integrate with OpenCode agent.

## Zed Architecture Requirements

### 1. Agent Server Configuration

#### Settings.json Configuration

**Location**: `~/.config/zed/settings.json`

**Required Structure**:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"],
      "env": {
        "OPENCODE_CONFIG_DIR": "/path/to/config"
      }
    }
  }
}
```

**Requirements**:

- Support for command and args array
- Environment variable configuration
- Working directory specification
- Multiple agent server support

#### Configuration Validation

| Requirement ID | Description            | Implementation             | Status   |
| -------------- | ---------------------- | -------------------------- | -------- |
| ZED-CONFIG-001 | JSON schema validation | Built-in Zed validation    | Required |
| ZED-CONFIG-002 | Path resolution        | Absolute path handling     | Required |
| ZED-CONFIG-003 | Environment variables  | env object support         | Required |
| ZED-CONFIG-004 | Command validation     | Executable existence check | Required |
| ZED-CONFIG-005 | Error reporting        | Clear configuration errors | Required |

### 2. Keyboard Shortcut Integration

#### Keymap.json Configuration

**Location**: `~/.config/zed/keymap.json`

**Example Configuration**:

```json
[
  {
    "context": "AgentPanel",
    "bindings": {
      "enter": "agent:submitPrompt",
      "ctrl-c": "agent:cancelPrompt",
      "ctrl-l": "agent:clearHistory"
    }
  },
  {
    "bindings": {
      "ctrl-alt-o": "agent:togglePanel",
      "ctrl-alt-n": "agent:newSession"
    }
  }
]
```

**Required Bindings**:

- Agent panel toggle
- Prompt submission
- Prompt cancellation
- Session management
- History navigation

### 3. Agent Panel UI

#### Panel Components

**Required UI Elements**:

- Message input area
- Message history display
- Agent status indicator
- Session selector
- Model/mode selector
- Tool execution status
- Error display area

#### UI Requirements

| Requirement ID | Description             | Implementation         | Status   |
| -------------- | ----------------------- | ---------------------- | -------- |
| ZED-UI-001     | Message threading       | Conversation display   | Required |
| ZED-UI-002     | Syntax highlighting     | Code block rendering   | Required |
| ZED-UI-003     | Streaming display       | Real-time text updates | Required |
| ZED-UI-004     | Tool call visualization | Progress indicators    | Required |
| ZED-UI-005     | Error formatting        | Clear error messages   | Required |
| ZED-UI-006     | File references         | Clickable file links   | Required |

### 4. Protocol Implementation

#### Connection Management

**Requirements**:

- Stdio process spawning
- NDJSON message parsing
- Connection lifecycle management
- Automatic reconnection on failure
- Graceful shutdown handling

#### Message Handling

| Message Type               | Handling Requirement | Implementation       |
| -------------------------- | -------------------- | -------------------- |
| initialize                 | Protocol negotiation | Synchronous request  |
| session/new                | Session creation     | Async with response  |
| session/prompt             | Prompt submission    | Async with streaming |
| session/update             | Real-time updates    | Event-driven         |
| fs/\*                      | File operations      | Permission-based     |
| session/request_permission | User interaction     | Modal dialog         |

### 5. File System Integration

#### File Operations

**Supported Operations**:

- Read text files
- Write text files
- Directory listing (future)
- File watching (future)

**Security Considerations**:

- User permission prompts
- Path validation
- File size limits
- Binary file handling

#### Permission System

**Permission Dialog Requirements**:

- Clear tool description
- File paths affected
- Permission options (Allow once, Always, Reject)
- Persistent preferences
- Audit logging

### 6. Session Management

#### Session Lifecycle

**States**: Created → Active → Completed → Archived

**Operations**:

- Create new session
- Load existing session
- Switch between sessions
- Delete session
- Export session history

#### Context Management

**Working Directory**:

- Project root detection
- Relative path resolution
- Multi-workspace support

**MCP Servers**:

- Configuration loading
- Server process management
- Connection health monitoring

### 7. Streaming and Real-time Updates

#### Message Streaming

**Content Types**:

- Text chunks
- Code blocks
- File diffs
- Tool execution status
- Plan updates

**Display Requirements**:

- Progressive rendering
- Syntax highlighting
- Diff visualization
- Progress indicators
- Error highlighting

#### Tool Call Visualization

**Status Indicators**:

- Pending: Spinner/loading
- In Progress: Progress bar
- Completed: Check mark
- Failed: Error icon

**Information Display**:

- Tool name and description
- Affected files
- Execution time
- Output preview

### 8. Error Handling and Recovery

#### Error Categories

**Protocol Errors**:

- Connection failures
- Invalid messages
- Timeout errors
- Authentication failures

**Application Errors**:

- Tool execution failures
- File system errors
- Permission denied
- Resource exhaustion

#### Recovery Mechanisms

**Automatic Recovery**:

- Connection reconnection
- Message retry
- Session restoration

**User Interaction**:

- Error notifications
- Retry options
- Configuration fixes
- Manual reconnection

### 9. Performance Requirements

#### Latency Targets

| Operation      | Target      | Priority |
| -------------- | ----------- | -------- |
| Agent startup  | < 2 seconds | High     |
| Message send   | < 100ms     | High     |
| First response | < 500ms     | High     |
| File read      | < 200ms     | Medium   |
| File write     | < 500ms     | Medium   |

#### Resource Usage

**Memory**: < 100MB per session
**CPU**: < 10% average usage
**Network**: Minimal bandwidth usage
**Storage**: < 10MB per session history

### 10. Debugging and Monitoring

#### Debug Features

**Logging Levels**:

- ERROR: Protocol errors
- WARN: Recovery actions
- INFO: Session events
- DEBUG: Message details

**Debug Panel**:

- Connection status
- Message history
- Performance metrics
- Error logs

#### Health Monitoring

**Health Checks**:

- Connection status
- Message throughput
- Error rates
- Memory usage
- Response times

### 11. Extension Points

#### Plugin Architecture

**Extension Types**:

- Custom message handlers
- UI theme customization
- Tool integrations
- Authentication providers

**API Surface**:

- Zed plugin API
- ACP protocol extensions
- Configuration hooks

### 12. Testing Requirements

#### Unit Tests

**Coverage Areas**:

- Message parsing/serialization
- Connection management
- UI component rendering
- Error handling

#### Integration Tests

**Test Scenarios**:

- Full conversation flow
- Tool execution
- Error recovery
- Performance benchmarks

#### End-to-End Tests

**User Journeys**:

- Agent panel interaction
- File editing workflow
- Multi-session management
- Error scenarios

## Zed-Specific Implementation Notes

### Platform Support

**Supported Platforms**:

- macOS (primary)
- Linux
- Windows (future)

**Architecture Considerations**:

- Native process spawning
- File system permissions
- UI thread management

### Zed Version Compatibility

**Minimum Version**: Zed 0.150.0 (ACP support)
**Recommended Version**: Latest stable

**Feature Flags**:

- ACP protocol support
- Agent panel UI
- File system integration

### Configuration Migration

**Legacy Support**:

- Import existing configurations
- Migration wizards
- Backward compatibility

## Success Criteria

### Functional Completeness

- [ ] Agent server configuration working
- [ ] Keyboard shortcuts functional
- [ ] Agent panel fully operational
- [ ] File operations working
- [ ] Streaming updates displayed
- [ ] Error handling robust

### Performance Targets

- [ ] Startup time < 2 seconds
- [ ] UI responsiveness < 100ms
- [ ] Memory usage < 100MB
- [ ] Error rate < 0.1%

### User Experience

- [ ] Intuitive agent panel
- [ ] Clear error messages
- [ ] Responsive interactions
- [ ] Accessible keyboard shortcuts

## Risk Assessment

### High Risk Items

| Risk                   | Impact | Mitigation             |
| ---------------------- | ------ | ---------------------- |
| Protocol compatibility | High   | Comprehensive testing  |
| UI performance         | Medium | Performance monitoring |
| File system security   | High   | Permission system      |

### Dependencies

**External Dependencies**:

- Zed editor with ACP support
- OpenCode ACP server
- System file permissions

**Internal Dependencies**:

- Zed plugin system
- ACP protocol library
- UI component library

## Implementation Roadmap

### Phase 1: Core Protocol (Week 1-2)

- Basic ACP connection
- Message parsing
- Session management
- Simple UI

### Phase 2: File Integration (Week 3-4)

- File operations
- Permission system
- Error handling

### Phase 3: Advanced Features (Week 5-6)

- Streaming updates
- Tool visualization
- Performance optimization

### Phase 4: Polish and Testing (Week 7-8)

- UI improvements
- Comprehensive testing
- Documentation

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Zed ACP Integration Team
