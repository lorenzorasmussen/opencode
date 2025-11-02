# Zed Integration Specification

## Overview

This document specifies how Zed editor integrates with OpenCode's ACP (Agent Client Protocol) server, defining the configuration, UI components, and interaction patterns for seamless agent collaboration.

## Zed Configuration Architecture

### Configuration Files

#### settings.json Configuration

**Location**: `~/.config/zed/settings.json`

**Complete ACP Configuration**:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"],
      "env": {
        "OPENCODE_CONFIG_DIR": "/path/to/config",
        "OPENCODE_LOG_LEVEL": "info"
      }
    }
  },
  "agent": {
    "enabled": true,
    "button": true,
    "default_model": {
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022"
    }
  }
}
```

#### keymap.json Configuration

**Location**: `~/.config/zed/keymap.json`

**Agent Keyboard Shortcuts**:

```json
[
  {
    "context": "AgentPanel",
    "bindings": {
      "enter": "agent:submitPrompt",
      "shift-enter": "agent:newLine",
      "ctrl-c": "agent:cancelPrompt",
      "ctrl-l": "agent:clearHistory",
      "up": "agent:previousPrompt",
      "down": "agent:nextPrompt",
      "ctrl-shift-c": "agent:copyLastMessage"
    }
  },
  {
    "bindings": {
      "ctrl-alt-o": "agent:togglePanel",
      "ctrl-alt-n": "agent:newSession",
      "ctrl-alt-s": "agent:switchSession",
      "ctrl-alt-m": "agent:switchModel",
      "ctrl-alt-r": "agent:restartServer"
    }
  }
]
```

### Configuration Schema

#### agent_servers Object

```typescript
interface AgentServersConfig {
  [serverName: string]: {
    command: string
    args?: string[]
    env?: Record<string, string>
  }
}
```

**Validation Rules**:

- `command`: Must be executable path or command name
- `args`: Optional array of string arguments
- `env`: Optional environment variables object

#### agent Object

```typescript
interface AgentConfig {
  enabled?: boolean
  button?: boolean
  default_model?: {
    provider: string
    model: string
  }
}
```

## UI Integration Components

### Agent Panel

#### Panel Structure

```
┌─ Agent Panel ──────────────────────────────────────┐
│ ┌─ Session Selector ─┬─ Model Selector ─┬─ [X] ─┐ │
│ └────────────────────┴─────────────────┴─────────┘ │
│ ┌─ Message History ──────────────────────────────┐ │
│ │                                               │ │
│ │ User: How do I create a React component?      │ │
│ │                                               │ │
│ │ Assistant: Here's how to create a React...    │ │
│ │   ✓ Created src/components/MyComponent.tsx    │ │
│ │                                               │ │
│ └───────────────────────────────────────────────┘ │
│ ┌─ Prompt Input ────────────────────────────────┐ │
│ │ Type your message...                         │ │
│ └───────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

#### Panel Components

**Session Selector**:

- Dropdown showing active sessions
- New session button
- Session management options

**Model Selector**:

- Available models dropdown
- Current model indicator
- Model switching capability

**Message History**:

- Scrollable message list
- Syntax highlighting for code
- Tool execution status indicators
- File references with click-to-open

**Prompt Input**:

- Multi-line text input
- Command completion
- File attachment support
- Send/cancel buttons

### Status Indicators

#### Connection Status

- **Connected**: Green indicator
- **Connecting**: Yellow indicator with spinner
- **Disconnected**: Red indicator with retry button
- **Error**: Red indicator with error details

#### Agent Status

- **Idle**: Ready for input
- **Thinking**: Processing prompt
- **Executing Tools**: Running tool operations
- **Streaming**: Receiving response

### Tool Execution Visualization

#### Tool Call Display

```
🔧 Edit package.json
├── 📝 Reading current content...
├── ✏️ Applying changes...
└── ✅ Updated dependencies
```

#### File Operation Indicators

```
📁 Reading src/main.js (245 bytes)
📝 Writing src/utils.js (1.2 KB)
🔍 Searching for "TODO" in src/
```

#### Permission Prompts

```
⚠️  Agent wants to modify package.json

This will update your project dependencies.

[Allow once] [Always allow] [Reject]
```

## Interaction Patterns

### Session Management

#### Creating Sessions

1. User clicks "New Session" button
2. Zed sends `session/new` request
3. Panel updates with new session
4. Model/mode selectors populate

#### Switching Sessions

1. User selects session from dropdown
2. Zed sends `session/load` request
3. Message history loads
4. Context restores

#### Session Persistence

- Sessions persist across Zed restarts
- Message history maintained
- Working directory context preserved
- MCP server connections restored

### Prompt Submission

#### Text Input Flow

1. User types message in input field
2. User presses Enter or clicks Send
3. Message added to history
4. `session/prompt` request sent
5. Response streaming begins

#### File Attachment Flow

1. User drags files into input area
2. Files processed and attached
3. Visual indicators show attachments
4. Files included in prompt request

#### Command Processing

1. User types `/command args`
2. Command recognized and highlighted
3. Special UI for command parameters
4. Command executed via prompt

### Real-time Updates

#### Response Streaming

- Text appears progressively
- Code syntax highlighting updates
- Tool calls appear as they execute
- File changes reflected immediately

#### Tool Execution Monitoring

- Progress indicators for long operations
- File change previews
- Error highlighting
- Success confirmations

### Error Handling

#### Connection Errors

- Automatic reconnection attempts
- User notification of disconnection
- Manual reconnect option
- Error details in debug panel

#### Protocol Errors

- Clear error messages
- Recovery suggestions
- Retry mechanisms
- Session state preservation

## File Integration

### File Operations

#### Reading Files

- Click file references to open
- Syntax highlighting in messages
- Diff display for changes
- File size indicators

#### Writing Files

- Permission prompts for modifications
- Change previews
- Undo capability (future)
- Conflict resolution

#### File Watching

- Automatic updates for changed files
- Notification of external changes
- Merge conflict handling
- Version control integration

### Project Context

#### Working Directory

- Project root detection
- Relative path resolution
- Multi-workspace support
- Path completion in prompts

#### LSP Integration

- Symbol information in context
- Diagnostic display
- Code action suggestions
- Definition/jump-to functionality

## Performance Optimization

### UI Responsiveness

#### Message Rendering

- Virtual scrolling for long histories
- Progressive loading of content
- Background syntax highlighting
- Lazy image loading

#### Input Handling

- Debounced input processing
- Predictive text completion
- Command suggestion system
- File path auto-completion

### Resource Management

#### Memory Usage

- Message history pagination
- Image size limits
- Cache management
- Garbage collection hints

#### Network Efficiency

- Message batching
- Compression for large payloads
- Connection pooling
- Request deduplication

## Accessibility Features

### Keyboard Navigation

- Full keyboard control
- Screen reader support
- High contrast mode
- Focus management

### Visual Design

- Consistent with Zed themes
- Clear visual hierarchy
- Readable typography
- Intuitive iconography

## Debugging and Monitoring

### Debug Panel

#### Connection Debug

```
ACP Connection Status
├── State: Connected
├── Server: OpenCode v0.1.0
├── Protocol: v1
├── Uptime: 2h 15m
└── Messages: 1,247 sent, 1,189 received
```

#### Performance Metrics

```
Performance
├── Avg response time: 245ms
├── Messages/minute: 12.3
├── Tool executions: 45
├── Errors: 2 (last 24h)
└── Memory usage: 89MB
```

#### Message Log

```
Message Log (last 50)
├── 14:32:15 → session/prompt
├── 14:32:16 ← agent_message_chunk
├── 14:32:17 ← tool_call (edit)
├── 14:32:18 → permission_response
└── 14:32:19 ← tool_call_update
```

### Logging Integration

#### Log Levels

- **Error**: Connection failures, protocol errors
- **Warn**: Retries, permission denials
- **Info**: Session events, tool executions
- **Debug**: Message details, performance metrics

#### Log Export

- Save logs to file
- Share debug information
- Integration with Zed's logging system

## Extension Points

### Plugin Architecture

#### Custom Message Handlers

```typescript
interface AgentMessageHandler {
  canHandle(message: ACPMessage): boolean
  handle(message: ACPMessage): void
}
```

#### UI Customizations

- Custom panel layouts
- Theme extensions
- Keyboard shortcut overrides
- Status indicator customizations

#### Tool Integrations

- Custom tool visualizations
- File type handlers
- Command extensions
- Permission policies

## Testing Requirements

### UI Testing

#### Component Tests

- Panel rendering
- Message display
- Input handling
- Status indicators

#### Integration Tests

- Full conversation flows
- File operations
- Error scenarios
- Performance under load

### End-to-End Testing

#### User Journeys

1. **New User Setup**
   - Configuration creation
   - First conversation
   - Basic file operations

2. **Power User Workflow**
   - Multiple sessions
   - Complex tool usage
   - Performance testing

3. **Error Recovery**
   - Connection loss
   - Invalid operations
   - System recovery

## Migration and Compatibility

### Version Compatibility

#### Zed Version Support

- **Minimum**: Zed 0.150.0 (ACP support)
- **Recommended**: Latest stable
- **Legacy**: Graceful degradation for older versions

#### Configuration Migration

- Automatic config updates
- Backward compatibility
- Migration wizards
- Clear error messages

### OpenCode Compatibility

#### Version Matrix

| OpenCode | Zed    | Features              |
| -------- | ------ | --------------------- |
| 0.1.x    | 0.150+ | Full ACP support      |
| 0.0.x    | 0.150+ | Limited compatibility |
| Any      | <0.150 | Not supported         |

## Success Metrics

### User Experience

- **Setup Time**: < 5 minutes
- **Task Completion**: > 90% success rate
- **Error Recovery**: < 2 minutes average
- **Performance**: < 500ms response time

### Technical Metrics

- **Connection Stability**: > 99% uptime
- **Message Success**: > 99% delivery rate
- **UI Responsiveness**: < 100ms interactions
- **Memory Usage**: < 100MB per session

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Zed Integration Specification Team
