# OpenCode ACP Implementation Specification

## Overview

This document specifies the implementation details for OpenCode's ACP (Agent Client Protocol) server, including architecture, components, data flow, and operational procedures.

## Architecture Overview

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenCode ACP Server                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   ACP Agent     │  │  Session Mgr    │  │  Tool Reg   │ │
│  │                 │  │                 │  │             │ │
│  │ • Protocol      │  │ • State         │  │ • Registry  │ │
│  │ • Handshake     │  │ • Persistence   │  │ • Execution │ │
│  │ • Streaming     │  │ • MCP Servers   │  │ • Results   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Provider      │  │   Permission    │  │   Config    │ │
│  │   System        │  │   System        │  │   System    │ │
│  │                 │  │                 │  │             │ │
│  │ • Model Mgmt    │  │ • Access Ctrl   │  │ • Settings  │ │
│  │ • API Clients   │  │ • User Consent  │  │ • Validation│ │
│  │ • Rate Limiting │  │ • Audit Log     │  │ • Hot Reload│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   File System   │  │   MCP System    │  │   Logging   │ │
│  │   Operations    │  │                 │  │   System    │ │
│  │                 │  │ • Server Mgmt   │  │             │ │
│  │ • Read/Write    │  │ • Tool Routing  │  │ • Structured│ │
│  │ • Permissions   │  │ • Health Check  │  │ • Metrics   │ │
│  │ • Atomic Ops    │  │ • Load Balance  │  │ • Tracing   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

#### Request Processing Flow

```
Client Request
       │
       ▼
   ACP Agent
       │
       ▼
  Protocol Validation
       │
       ▼
  Session Lookup
       │
       ▼
  Permission Check
       │
       ▼
  Tool Execution
       │
       ▼
  Result Processing
       │
       ▼
  Response Generation
       │
       ▼
Client Response
```

#### Streaming Data Flow

```
User Prompt
     │
     ▼
Session Prompt
     │
     ▼
Model Processing
     │
     ├─ Text Chunk ──► Stream to Client
     │
     ├─ Tool Call ──► Permission Request
     │                │
     │                ▼
     │           Tool Execution
     │                │
     │                ▼
     └─ Tool Result ─► Stream to Client
                      │
                      ▼
                 Final Response
```

## Core Components

### 1. ACP Agent Component

#### Agent Class Structure

```typescript
export class Agent implements ACPAgent {
  private connection: AgentSideConnection
  private sessionManager: ACPSessionManager
  private config: ACPConfig

  // Protocol methods
  async initialize(params: InitializeRequest): Promise<InitializeResponse>
  async newSession(params: NewSessionRequest): Promise<NewSessionResponse>
  async loadSession(params: LoadSessionRequest): Promise<LoadSessionResponse>
  async prompt(params: PromptRequest): Promise<PromptResponse>
  async setSessionModel(params: SetSessionModelRequest): Promise<SetSessionModelResponse>
  async setSessionMode(params: SetSessionModeRequest): Promise<SetSessionModeResponse | void>

  // Event handling
  private setupEventSubscriptions(): void
}
```

#### Protocol Implementation

**Initialize Method**:

- Negotiate protocol version
- Advertise capabilities
- Provide authentication methods
- Return agent information

**Session Management**:

- Create new sessions with MCP server setup
- Load existing sessions with state restoration
- Manage session lifecycle and cleanup

**Prompt Processing**:

- Parse content blocks (text, images, resources)
- Handle command shortcuts (/init, /compact)
- Execute prompts through SessionPrompt
- Manage streaming responses

### 2. Session Manager Component

#### Session State Management

```typescript
export class ACPSessionManager {
  private sessions = new Map<string, ACPSessionState>()

  async create(cwd: string, mcpServers: McpServer[], model?: Model): Promise<ACPSessionState>
  get(sessionId: string): ACPSessionState | undefined
  async remove(sessionId: string): Promise<void>
  setModel(sessionId: string, model: Model): void
  setMode(sessionId: string, modeId: string): void
}
```

#### Session State Structure

```typescript
interface ACPSessionState {
  id: string
  cwd: string
  mcpServers: McpServer[]
  createdAt: Date
  model?: {
    providerID: string
    modelID: string
  }
  modeId?: string
}
```

#### Session Persistence

- Sessions stored in OpenCode's database
- Automatic cleanup of expired sessions
- State restoration on load
- MCP server reconnection

### 3. Tool Registry Integration

#### Tool Execution Flow

```
Tool Call Request
       │
       ▼
  Permission Check
       │
       ▼
  Tool Lookup
       │
       ▼
  Parameter Validation
       │
       ▼
  Execution Context Setup
       │
       ▼
  Tool Execution
       │
       ▼
  Result Processing
       │
       ▼
  Response Generation
```

#### Tool Result Streaming

- Tool call initiation notifications
- Progress updates during execution
- Completion notifications with results
- Error notifications with details
- Diff generation for file changes

## Configuration System

### Configuration Loading

#### Configuration Sources (Priority Order)

1. **Command-line arguments**
2. **Environment variables**
3. **opencode.json file**
4. **Built-in defaults**

#### Configuration Validation

```typescript
interface ConfigValidator {
  validate(config: any): ValidationResult
  migrate(config: any): any
  getDefaults(): any
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}
```

### Runtime Configuration

#### Hot Reload Capability

- Configuration changes detected
- Graceful reconfiguration
- Session preservation during reload
- Rollback on configuration errors

#### Configuration Scopes

- **Global**: System-wide settings
- **Project**: Per-project overrides
- **Session**: Per-session customization
- **User**: User-specific preferences

## MCP Server Integration

### MCP Server Management

#### Server Lifecycle

```
Server Configuration
        │
        ▼
   Server Discovery
        │
        ▼
  Process Launch/Connection
        │
        ▼
   Capability Negotiation
        │
        ▼
     Tool Registration
        │
        ▼
    Health Monitoring
```

#### Server Types

**Local MCP Servers**:

- Process spawning and management
- Stdio communication
- Environment variable setup
- Automatic restart on failure

**Remote MCP Servers**:

- HTTP/SSE connection establishment
- Authentication handling
- Connection pooling
- Failover support

### Tool Routing

#### MCP Tool Execution

- Tool discovery from MCP servers
- Parameter mapping and validation
- Request forwarding to appropriate server
- Response processing and formatting
- Error handling and retry logic

## Streaming Implementation

### Response Streaming

#### Chunk Generation

```typescript
interface StreamingController {
  startStreaming(sessionId: string): Promise<void>
  sendChunk(sessionId: string, content: ContentBlock): Promise<void>
  sendToolCall(sessionId: string, toolCall: ToolCall): Promise<void>
  sendToolUpdate(sessionId: string, update: ToolCallUpdate): Promise<void>
  endStreaming(sessionId: string, stopReason: StopReason): Promise<void>
}
```

#### Streaming States

- **Idle**: Ready for new prompt
- **Streaming**: Actively sending chunks
- **Tool_Waiting**: Waiting for tool permission
- **Tool_Executing**: Tool running
- **Completed**: Response finished
- **Error**: Streaming failed

### Backpressure Handling

#### Client Flow Control

- Monitor client processing capacity
- Adjust chunk size and frequency
- Buffer management for slow clients
- Graceful degradation under load

## Error Handling Implementation

### Error Classification

#### Error Types

- **Protocol Errors**: ACP protocol violations
- **System Errors**: Internal system failures
- **Tool Errors**: Tool execution failures
- **Network Errors**: Connection and communication issues
- **Configuration Errors**: Invalid settings

#### Error Recovery

```typescript
interface ErrorHandler {
  classify(error: Error): ErrorCategory
  recover(error: Error, context: ErrorContext): RecoveryAction
  log(error: Error, context: ErrorContext): void
  notify(error: Error, context: ErrorContext): void
}
```

### Recovery Strategies

#### Automatic Recovery

- Connection reconnection with exponential backoff
- Tool retry with different parameters
- Session state repair
- Resource cleanup and reallocation

#### Manual Recovery

- Configuration correction
- Server restart procedures
- Session recreation
- User-guided troubleshooting

## Performance Optimization

### Resource Management

#### Memory Optimization

- Session state compression
- Message history truncation
- Cache management for frequent operations
- Garbage collection hints

#### CPU Optimization

- Asynchronous processing
- Worker thread utilization
- Request batching
- Algorithm optimization

### Caching Strategies

#### Content Caching

- File content snapshots
- Tool result caching
- MCP response caching
- Configuration caching

#### Cache Invalidation

- File system change detection
- Time-based expiration
- Memory pressure triggers
- Manual cache clearing

## Security Implementation

### Permission System

#### Permission Checking

```typescript
interface PermissionChecker {
  check(sessionId: string, tool: Tool, params: any): Promise<PermissionResult>
  request(sessionId: string, toolCall: ToolCall): Promise<PermissionDecision>
  remember(sessionId: string, decision: PermissionDecision): void
}
```

#### Security Controls

- Input validation and sanitization
- Path traversal prevention
- Command injection protection
- Resource usage limits
- Audit logging

### Authentication

#### Auth Method Support

- API key authentication
- OAuth integration
- Custom authentication providers
- Session-based authentication

## Monitoring and Observability

### Metrics Collection

#### Performance Metrics

- Response times by operation
- Throughput measurements
- Error rates and types
- Resource utilization

#### Business Metrics

- Session creation rate
- Tool usage statistics
- User engagement metrics
- Feature adoption rates

### Logging Implementation

#### Structured Logging

```json
{
  "timestamp": "2025-11-02T14:32:15Z",
  "level": "info",
  "service": "acp-agent",
  "sessionId": "session-123",
  "operation": "session/prompt",
  "duration": 2450,
  "metadata": {
    "model": "claude-3-5-sonnet",
    "tokens": 1500
  }
}
```

#### Log Levels

- **ERROR**: System errors and failures
- **WARN**: Potential issues and retries
- **INFO**: Normal operations and state changes
- **DEBUG**: Detailed execution information

## Operational Procedures

### Startup Procedure

1. **Configuration Loading**
   - Load and validate configuration
   - Initialize logging system
   - Set up signal handlers

2. **Component Initialization**
   - Initialize session manager
   - Set up tool registry
   - Configure MCP servers
   - Start ACP agent

3. **Connection Establishment**
   - Wait for stdin/stdout connection
   - Perform protocol handshake
   - Enter request processing loop

### Shutdown Procedure

1. **Graceful Shutdown Signal**
   - Receive SIGTERM/SIGINT
   - Stop accepting new requests
   - Complete ongoing operations

2. **Resource Cleanup**
   - Close MCP server connections
   - Save session state
   - Flush pending operations
   - Clean up temporary files

3. **Finalization**
   - Log shutdown statistics
   - Exit with appropriate code

### Health Checks

#### Health Check Endpoints

- **Process Health**: Basic liveness check
- **Service Health**: ACP protocol responsiveness
- **Dependency Health**: MCP server availability
- **Resource Health**: Memory and disk space checks

#### Health Check Implementation

```typescript
interface HealthChecker {
  check(): Promise<HealthStatus>
  detailedCheck(): Promise<DetailedHealthStatus>
}

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  checks: HealthCheck[]
}
```

## Testing Implementation

### Unit Testing

#### Component Testing

- ACP agent protocol compliance
- Session manager state transitions
- Tool execution flows
- Configuration validation

#### Mock Testing

- Mock ACP client for testing
- Mock MCP servers
- Mock file system operations
- Mock provider APIs

### Integration Testing

#### End-to-End Testing

- Complete conversation flows
- Tool execution with permissions
- Streaming response handling
- Error recovery scenarios

#### Load Testing

- Concurrent session handling
- High-frequency message processing
- Large file operations
- Memory pressure testing

### Performance Testing

#### Benchmarking

- Response time measurements
- Throughput testing
- Resource utilization monitoring
- Scalability testing

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: OpenCode ACP Implementation Specification Team
