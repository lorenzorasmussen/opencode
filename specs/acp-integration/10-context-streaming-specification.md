# Context & Streaming Specification

## Overview

This document specifies how context management and real-time streaming work within the OpenCode-Zed ACP integration, defining how conversation history, working context, and progressive responses are handled.

## Context Management Architecture

### Session Context

#### Session State Structure

Each ACP session maintains the following context:

```typescript
interface SessionContext {
  // Session metadata
  id: string
  cwd: string
  createdAt: Date
  model: {
    providerID: string
    modelID: string
  }
  modeId?: string

  // Conversation context
  messages: Message[]
  tokenCount: number
  maxTokens: number

  // Working context
  openFiles: FileContext[]
  recentFiles: FileContext[]
  projectStructure: ProjectContext

  // Tool context
  activeTools: ToolExecution[]
  toolHistory: ToolResult[]

  // MCP context
  mcpServers: McpServer[]
  mcpTools: McpTool[]
}
```

#### Message Context

Messages maintain full conversation history:

```typescript
interface Message {
  id: string
  role: "user" | "assistant"
  content: ContentBlock[]
  timestamp: Date
  tokenCount: number
  metadata: {
    model?: string
    mode?: string
    tools?: ToolCall[]
  }
}
```

### Context Window Management

#### Token Limits

**Context Window Constraints**:

- **Default Limit**: 128,000 tokens
- **Configurable**: Via `maxContextLength` setting
- **Buffer**: 10% reserved for response generation
- **Overflow Handling**: Automatic compaction

#### Compaction Strategies

**Message Compaction**:

1. **Summarization**: Replace old messages with summaries
2. **Truncation**: Remove middle portions of long messages
3. **Aggregation**: Combine related messages
4. **Archival**: Move old context to external storage

**Automatic Compaction Triggers**:

- Token limit exceeded (90% utilization)
- Manual `/compact` command
- Session inactivity timeout
- Memory pressure

### Working Context

#### File Context

**Open Files Tracking**:

```typescript
interface FileContext {
  path: string
  content?: string
  lastModified: Date
  isModified: boolean
  lineCount: number
  language?: string
}
```

**File Context Management**:

- Track currently open files in Zed
- Maintain file content snapshots
- Monitor file changes
- Provide file references in prompts

#### Project Context

**Project Structure Awareness**:

```typescript
interface ProjectContext {
  rootPath: string
  structure: FileTree
  dependencies: DependencyInfo[]
  scripts: ScriptInfo[]
  configuration: ProjectConfig
}
```

**Context Gathering**:

- Parse `package.json`, `Cargo.toml`, etc.
- Analyze project structure
- Identify key files and directories
- Track dependency relationships

## Streaming Architecture

### Response Streaming

#### Streaming Types

**Agent Message Streaming**:

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

**Tool Execution Streaming**:

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
        "message": "Processing files..."
      }
    }
  }
}
```

**Reasoning Streaming** (Future):

```json
{
  "jsonrpc": "2.0",
  "method": "session/update",
  "params": {
    "sessionId": "session-123",
    "update": {
      "sessionUpdate": "agent_thought_chunk",
      "content": {
        "type": "text",
        "text": "Let me analyze this problem..."
      }
    }
  }
}
```

### Streaming Flow Control

#### Client-Side Buffering

**Buffer Management**:

- Accumulate chunks until complete message
- Apply syntax highlighting progressively
- Handle out-of-order delivery
- Provide visual feedback for streaming

#### Server-Side Rate Limiting

**Streaming Controls**:

- Chunk size: 50-200 characters
- Frequency: 10-50ms between chunks
- Backpressure: Respect client processing capacity
- Cancellation: Immediate stop on user cancel

### Progressive UI Updates

#### Message Rendering

**Streaming Display**:

```
Assistant: Here's how to implement the feature:

1. First, we'll need to [streaming...]
2. Then, create the component [streaming...]
3. Finally, add the styling [complete]
```

**Visual Indicators**:

- Typing cursor animation
- Progressive syntax highlighting
- Tool execution progress bars
- Completion checkmarks

## Context Preservation

### Session Persistence

#### Session State Storage

**Persistence Strategy**:

- Store session metadata in database
- Maintain message history
- Preserve working context
- Restore on session load

**Persistence Triggers**:

- Message completion
- Tool execution results
- File changes
- Manual save points

#### Session Recovery

**Recovery Process**:

1. Load session metadata
2. Restore message history
3. Reconnect MCP servers
4. Validate working context
5. Resume conversation

### Cross-Session Context

#### Shared Context

**Project-Level Context**:

- Project structure
- Common dependencies
- Team conventions
- Shared knowledge base

**User-Level Context**:

- Personal preferences
- Frequently used tools
- Custom instructions
- Learning history

#### Context Inheritance

**New Session Context**:

- Inherit project context
- Copy relevant message history
- Maintain working directory
- Preserve tool permissions

## Content Processing

### Content Block Handling

#### Text Content

**Processing Pipeline**:

1. Receive text chunks
2. Accumulate in buffer
3. Apply markdown parsing
4. Syntax highlighting
5. Render in UI

#### File Content

**File Reference Handling**:

```json
{
  "type": "resource_link",
  "uri": "file:///path/to/file.js",
  "mimeType": "text/javascript",
  "name": "utils.js",
  "size": 1024
}
```

**File Content Integration**:

- Display file previews
- Enable click-to-open
- Show diff visualizations
- Track file changes

#### Image Content

**Image Processing**:

- Base64 decoding
- Size optimization
- Format conversion
- Progressive loading

### Metadata Enrichment

#### Message Metadata

**Enrichment Sources**:

- Model information
- Token usage statistics
- Execution timing
- Tool call details
- Error information

**Metadata Usage**:

- Performance monitoring
- Cost tracking
- Quality analysis
- Debugging support

## Performance Optimization

### Context Optimization

#### Memory Management

**Context Size Control**:

- Token-based limits
- Message age-based cleanup
- Least-recently-used eviction
- Compression for old messages

**Memory Monitoring**:

- Track context size
- Monitor memory usage
- Automatic cleanup triggers
- User notifications for large contexts

#### Caching Strategies

**Content Caching**:

- File content snapshots
- Tool result caching
- MCP response caching
- Project structure caching

**Cache Invalidation**:

- File system change detection
- Time-based expiration
- Manual cache clearing
- Memory pressure triggers

### Streaming Performance

#### Network Optimization

**Connection Efficiency**:

- Message batching
- Compression
- Keep-alive connections
- Request pipelining

**Latency Reduction**:

- Server-side processing optimization
- Chunk size tuning
- Parallel processing
- Predictive loading

## Error Handling in Context

### Context Corruption Recovery

#### Corruption Detection

**Detection Methods**:

- Schema validation failures
- Inconsistent state
- Missing references
- Token count mismatches

**Recovery Strategies**:

- Automatic repair attempts
- Fallback to clean state
- User notification
- Manual recovery options

### Streaming Error Recovery

#### Stream Interruption

**Interruption Handling**:

- Detect connection loss
- Buffer incomplete messages
- Attempt reconnection
- Resume streaming or restart

**Error Propagation**:

- Clear error messages
- Recovery suggestions
- Alternative execution paths
- User choice for continuation

## Testing and Validation

### Context Testing

#### State Consistency Tests

- Session save/load cycles
- Context compaction accuracy
- Message ordering preservation
- Reference integrity

#### Performance Tests

- Large context handling
- Streaming throughput
- Memory usage under load
- Recovery time measurement

### Streaming Testing

#### Streaming Quality Tests

- Chunk delivery ordering
- Content completeness
- UI update smoothness
- Error recovery success

#### Load Tests

- High-frequency streaming
- Large message handling
- Concurrent session streaming
- Network condition simulation

## Monitoring and Observability

### Context Metrics

#### Usage Metrics

- Context size distribution
- Compaction frequency
- Session persistence success
- Recovery operation counts

#### Performance Metrics

- Context loading time
- Streaming latency
- Memory usage trends
- Cache hit rates

### Streaming Metrics

#### Quality Metrics

- Message completeness rate
- Streaming interruption frequency
- UI update responsiveness
- User-perceived latency

#### System Metrics

- Network throughput
- Server processing load
- Client rendering performance
- Error rates by component

## Future Enhancements

### Advanced Context Features

#### Semantic Context

- Code understanding
- Relationship mapping
- Intent recognition
- Contextual suggestions

#### Collaborative Context

- Multi-user sessions
- Context sharing
- Version control integration
- Team knowledge base

### Enhanced Streaming

#### Bidirectional Streaming

- User input streaming
- Real-time collaboration
- Live debugging
- Interactive tools

#### Rich Media Streaming

- Video content
- Audio processing
- Interactive diagrams
- Real-time code execution

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Context & Streaming Specification Team
