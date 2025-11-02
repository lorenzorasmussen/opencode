# Zed Integration Implementation Specification

## Overview

This document specifies the implementation details for Zed editor's ACP (Agent Client Protocol) client integration, including UI components, protocol handling, and operational procedures.

## Zed Architecture Integration

### Plugin Architecture

#### Zed Plugin Structure

```
zed-acp-plugin/
├── src/
│   ├── client.ts          # ACP client implementation
│   ├── ui/
│   │   ├── agent_panel.rs # Main agent panel UI
│   │   ├── message_view.rs# Message display components
│   │   └── tool_view.rs   # Tool execution visualization
│   ├── protocol/
│   │   ├── messages.rs    # Message serialization
│   │   ├── streaming.rs   # Streaming response handling
│   │   └── error.rs       # Error handling
│   ├── session/
│   │   ├── manager.rs     # Session management
│   │   ├── state.rs       # Session state tracking
│   │   └── persistence.rs # Session persistence
│   └── config.rs          # Configuration handling
├── Cargo.toml
└── plugin.json
```

#### Plugin Registration

**plugin.json**:

```json
{
  "name": "zed-acp",
  "version": "0.1.0",
  "description": "OpenCode ACP integration for Zed",
  "authors": ["Zed Team"],
  "languages": [],
  "grammars": [],
  "themes": [],
  "keymaps": ["keymap.json"],
  "settings": ["settings.json"],
  "commands": {
    "agent:toggle-panel": "Toggle agent panel",
    "agent:new-session": "Create new agent session",
    "agent:submit-prompt": "Submit prompt to agent",
    "agent:cancel-prompt": "Cancel current prompt"
  }
}
```

### Component Architecture

#### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                 Zed ACP Integration                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   ACP Client    │  │  Session Mgr    │  │  UI Manager │ │
│  │                 │  │                 │  │             │ │
│  │ • Connection    │  │ • State         │  │ • Panels    │ │
│  │ • Messaging     │  │ • Persistence   │  │ • Rendering │ │
│  │ • Streaming     │  │ • Switching     │  │ • Updates   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Message       │  │   Tool Handler  │  │   Config    │ │
│  │   Processor     │  │                 │  │   Manager   │ │
│  │                 │  │ • Execution     │  │             │ │
│  │ • Parsing       │  │ • Visualization │  │ • Settings  │ │
│  │ • Validation    │  │ • Progress      │  │ • Validation│ │
│  │ • Formatting    │  │ • Results       │  │ • Hot Reload│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   File System   │  │   Permission    │  │   Logging   │ │
│  │   Integration   │  │   Manager       │  │   System    │ │
│  │                 │  │                 │  │             │ │
│  │ • Read/Write    │  │ • User Consent  │  │ • Structured│ │
│  │ • Diff Display  │  │ • Policy        │  │ • Metrics   │ │
│  │ • Change Track  │  │ • Audit         │  │ • Tracing   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## ACP Client Implementation

### Connection Management

#### Client Structure

```rust
pub struct ACPClient {
    connection: Arc<Mutex<Option<ChildProcess>>>,
    message_sender: mpsc::Sender<ACPMessage>,
    message_receiver: mpsc::Receiver<ACPMessage>,
    session_manager: Arc<SessionManager>,
    config: Arc<ConfigManager>,
}

impl ACPClient {
    pub async fn new(config: &Config) -> Result<Self> {
        // Initialize connection
        // Set up message channels
        // Start background processing
    }

    pub async fn connect(&self) -> Result<()> {
        // Spawn OpenCode process
        // Establish stdio communication
        // Perform handshake
    }

    pub async fn disconnect(&self) -> Result<()> {
        // Close connection
        // Cleanup resources
    }
}
```

#### Connection Lifecycle

**Connection States**:

- `Disconnected`: No active connection
- `Connecting`: Establishing connection
- `Handshaking`: Performing protocol handshake
- `Connected`: Active and ready
- `Reconnecting`: Attempting reconnection
- `Failed`: Connection failed

#### Message Processing

```rust
impl ACPClient {
    async fn process_messages(&self) -> Result<()> {
        loop {
            match self.message_receiver.recv().await {
                Ok(message) => self.handle_message(message).await?,
                Err(_) => break, // Channel closed
            }
        }
        Ok(())
    }

    async fn handle_message(&self, message: ACPMessage) -> Result<()> {
        match message {
            ACPMessage::Response(response) => self.handle_response(response).await,
            ACPMessage::Notification(notification) => self.handle_notification(notification).await,
            ACPMessage::Error(error) => self.handle_error(error).await,
        }
    }
}
```

### Message Serialization

#### JSON-RPC Message Handling

```rust
#[derive(Serialize, Deserialize)]
#[serde(tag = "jsonrpc", rename = "2.0")]
pub enum ACPMessage {
    Request {
        id: MessageId,
        method: String,
        params: serde_json::Value,
    },
    Response {
        id: MessageId,
        #[serde(flatten)]
        result: ResponseResult,
    },
    Notification {
        method: String,
        params: serde_json::Value,
    },
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum ResponseResult {
    Success { result: serde_json::Value },
    Error { error: ACPError },
}
```

#### Streaming Message Processing

```rust
pub struct StreamingProcessor {
    buffer: String,
    current_message: Option<StreamingMessage>,
}

impl StreamingProcessor {
    pub fn process_chunk(&mut self, chunk: &str) -> Vec<StreamingUpdate> {
        // Accumulate chunks
        // Parse complete messages
        // Handle partial messages
        // Return updates for UI
    }
}
```

## UI Implementation

### Agent Panel

#### Panel Structure

```rust
pub struct AgentPanel {
    session_selector: SessionSelector,
    model_selector: ModelSelector,
    message_history: MessageHistory,
    prompt_input: PromptInput,
    status_bar: StatusBar,
}

impl AgentPanel {
    pub fn new(cx: &mut ViewContext<Self>) -> Self {
        // Initialize components
        // Set up event handlers
        // Configure layout
    }

    fn render(&self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        // Render panel layout
        // Position components
        // Apply styling
    }
}
```

#### Message Display

```rust
pub struct MessageView {
    content: SharedString,
    message_type: MessageType,
    timestamp: DateTime<Utc>,
    metadata: MessageMetadata,
}

impl MessageView {
    pub fn render(&self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        match self.message_type {
            MessageType::User => self.render_user_message(cx),
            MessageType::Assistant => self.render_assistant_message(cx),
            MessageType::Tool => self.render_tool_message(cx),
            MessageType::System => self.render_system_message(cx),
        }
    }

    fn render_assistant_message(&self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        // Render with syntax highlighting
        // Handle code blocks
        // Display tool calls
    }
}
```

### Tool Visualization

#### Tool Call Display

```rust
pub struct ToolCallView {
    tool_call: ToolCall,
    status: ToolStatus,
    progress: Option<f32>,
    result: Option<ToolResult>,
}

impl ToolCallView {
    pub fn render(&self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        // Render tool header
        // Show status indicator
        // Display progress
        // Show results or errors
    }
}
```

#### Progress Indicators

```rust
pub enum ToolStatus {
    Pending,
    InProgress { progress: Option<f32> },
    Completed { result: ToolResult },
    Failed { error: String },
}

impl ToolStatus {
    pub fn indicator(&self) -> impl IntoElement {
        match self {
            ToolStatus::Pending => Icon::new(IconName::Clock),
            ToolStatus::InProgress { .. } => Icon::new(IconName::ArrowCircle),
            ToolStatus::Completed { .. } => Icon::new(IconName::Check),
            ToolStatus::Failed { .. } => Icon::new(IconName::ExclamationTriangle),
        }
    }
}
```

## Session Management

### Session State

```rust
#[derive(Clone)]
pub struct Session {
    pub id: String,
    pub cwd: PathBuf,
    pub model: Option<ModelInfo>,
    pub mode: Option<ModeInfo>,
    pub created_at: DateTime<Utc>,
    pub messages: Vec<Message>,
    pub status: SessionStatus,
}

#[derive(Clone)]
pub enum SessionStatus {
    Active,
    Loading,
    Error(String),
    Disconnected,
}
```

### Session Persistence

```rust
pub struct SessionStore {
    storage: Arc<dyn SessionStorage>,
}

#[async_trait]
pub trait SessionStorage {
    async fn save_session(&self, session: &Session) -> Result<()>;
    async fn load_session(&self, session_id: &str) -> Result<Option<Session>>;
    async fn list_sessions(&self) -> Result<Vec<SessionInfo>>;
    async fn delete_session(&self, session_id: &str) -> Result<()>;
}
```

### Session Switching

```rust
impl SessionManager {
    pub async fn switch_session(&self, session_id: &str) -> Result<()> {
        // Validate session exists
        // Save current session state
        // Load new session
        // Update UI
        // Notify components
    }

    pub async fn create_session(&self, cwd: PathBuf) -> Result<String> {
        // Generate session ID
        // Create session record
        // Send session/new request
        // Store session info
    }
}
```

## Configuration Management

### Configuration Loading

```rust
pub struct ConfigManager {
    settings: Settings,
    keymap: Keymap,
}

impl ConfigManager {
    pub fn load() -> Result<Self> {
        // Load settings.json
        // Load keymap.json
        // Validate configuration
        // Set up watchers
    }

    pub fn watch_changes(&self) -> impl Stream<Item = ConfigChange> {
        // Watch for file changes
        // Parse updates
        // Validate changes
        // Emit change events
    }
}
```

### Runtime Configuration

```rust
pub struct RuntimeConfig {
    pub agent_servers: HashMap<String, AgentServerConfig>,
    pub current_server: Option<String>,
    pub ui_settings: UiSettings,
    pub performance_settings: PerformanceSettings,
}

impl RuntimeConfig {
    pub fn update(&mut self, change: ConfigChange) -> Result<()> {
        // Apply configuration change
        // Validate new settings
        // Update components
        // Persist changes
    }
}
```

## File System Integration

### File Operations

#### File Reading

```rust
impl ACPClient {
    pub async fn read_file(&self, path: &Path, options: ReadOptions) -> Result<String> {
        let request = ACPRequest::ReadTextFile {
            session_id: self.current_session()?,
            path: path.to_string_lossy().to_string(),
            limit: options.limit,
            line: options.line,
        };

        let response = self.send_request(request).await?;
        match response {
            ACPResponse::ReadTextFile { content } => Ok(content),
            _ => Err(Error::UnexpectedResponse),
        }
    }
}
```

#### File Writing

```rust
impl ACPClient {
    pub async fn write_file(&self, path: &Path, content: &str) -> Result<()> {
        let request = ACPRequest::WriteTextFile {
            session_id: self.current_session()?,
            path: path.to_string_lossy().to_string(),
            content: content.to_string(),
        };

        let response = self.send_request(request).await?;
        match response {
            ACPResponse::WriteTextFile => Ok(()),
            _ => Err(Error::UnexpectedResponse),
        }
    }
}
```

### File Change Tracking

```rust
pub struct FileWatcher {
    watched_files: HashSet<PathBuf>,
    change_tx: mpsc::Sender<FileChange>,
}

impl FileWatcher {
    pub async fn watch_file(&mut self, path: PathBuf) -> Result<()> {
        // Add to watch list
        // Set up file system monitoring
        // Send change notifications
    }

    pub async fn unwatch_file(&mut self, path: &Path) -> Result<()> {
        // Remove from watch list
        // Clean up monitoring
    }
}
```

## Permission System

### Permission Management

```rust
pub struct PermissionManager {
    policies: HashMap<String, PermissionPolicy>,
    decisions: HashMap<String, PermissionDecision>,
}

#[derive(Clone)]
pub enum PermissionDecision {
    AllowOnce,
    AllowAlways,
    RejectOnce,
    RejectAlways,
}

impl PermissionManager {
    pub async fn request_permission(&self, tool_call: &ToolCall) -> Result<PermissionDecision> {
        // Check existing decisions
        // Evaluate policies
        // Show permission dialog
        // Store decision
    }

    pub fn remember_decision(&mut self, tool_call: &ToolCall, decision: PermissionDecision) {
        // Store decision for future use
        // Update policies if needed
    }
}
```

### Permission Dialog

```rust
pub struct PermissionDialog {
    tool_call: ToolCall,
    options: Vec<PermissionOption>,
}

impl PermissionDialog {
    pub fn render(&self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        // Display tool information
        // Show affected resources
        // Present options
        // Handle user selection
    }
}
```

## Error Handling

### Error Classification

```rust
#[derive(Debug)]
pub enum ACPError {
    Connection(ConnectionError),
    Protocol(ProtocolError),
    Session(SessionError),
    Tool(ToolError),
    FileSystem(FileSystemError),
    Permission(PermissionError),
    Configuration(ConfigurationError),
}

impl ACPError {
    pub fn user_message(&self) -> String {
        match self {
            ACPError::Connection(_) => "Lost connection to agent. Trying to reconnect...",
            ACPError::Protocol(_) => "Protocol error occurred. Please try again.",
            ACPError::Session(_) => "Session error. Creating new session...",
            // ... other cases
        }
    }

    pub fn recovery_action(&self) -> Option<RecoveryAction> {
        match self {
            ACPError::Connection(_) => Some(RecoveryAction::Reconnect),
            ACPError::Session(_) => Some(RecoveryAction::NewSession),
            // ... other cases
        }
    }
}
```

### Error Recovery

```rust
pub enum RecoveryAction {
    Reconnect,
    Retry,
    NewSession,
    ShowError,
    Ignore,
}

impl ACPClient {
    pub async fn handle_error(&self, error: ACPError) -> Result<()> {
        // Log error
        // Determine recovery action
        // Execute recovery
        // Update UI
    }
}
```

## Performance Optimization

### UI Rendering

#### Virtual Scrolling

```rust
pub struct VirtualMessageList {
    messages: Vec<Message>,
    visible_range: Range<usize>,
    item_height: f32,
}

impl VirtualMessageList {
    pub fn render(&self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        // Calculate visible range
        // Render only visible messages
        // Handle scrolling
    }
}
```

#### Background Processing

```rust
pub struct BackgroundProcessor {
    work_queue: mpsc::Sender<BackgroundWork>,
    result_tx: mpsc::Sender<BackgroundResult>,
}

impl BackgroundProcessor {
    pub async fn process(&self) -> Result<()> {
        // Process work items
        // Syntax highlighting
        // Image processing
        // Send results to UI
    }
}
```

### Memory Management

#### Message Caching

```rust
pub struct MessageCache {
    messages: LruCache<String, CachedMessage>,
    max_memory: usize,
}

impl MessageCache {
    pub fn get_or_render(&mut self, message: &Message) -> Result<RenderedMessage> {
        // Check cache
        // Render if needed
        // Store in cache
        // Manage memory usage
    }
}
```

## Testing Implementation

### Unit Testing

#### Component Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_message_parsing() {
        let json = r#"{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}"#;
        let message: ACPMessage = serde_json::from_str(json).unwrap();
        match message {
            ACPMessage::Request { id, method, .. } => {
                assert_eq!(id, MessageId::Number(1));
                assert_eq!(method, "initialize");
            }
            _ => panic!("Expected request"),
        }
    }

    #[test]
    fn test_streaming_processor() {
        let mut processor = StreamingProcessor::new();
        let updates = processor.process_chunk("Hello");
        assert!(updates.is_empty()); // Partial message

        let updates = processor.process_chunk("\n");
        assert_eq!(updates.len(), 1); // Complete message
    }
}
```

### Integration Testing

#### End-to-End Testing

```rust
#[cfg(test)]
mod integration_tests {
    use super::*;

    #[tokio::test]
    async fn test_full_conversation() {
        let client = TestACPClient::new().await;

        // Initialize
        client.initialize().await.unwrap();

        // Create session
        let session_id = client.new_session("/tmp").await.unwrap();

        // Send prompt
        let response = client.prompt(&session_id, "Hello").await.unwrap();

        // Verify response
        assert!(response.contains("Hi"));
    }
}
```

### Performance Testing

#### Benchmarking

```rust
#[cfg(test)]
mod benchmarks {
    use super::*;
    use criterion::{black_box, criterion_group, criterion_main, Criterion};

    fn bench_message_parsing(c: &mut Criterion) {
        let json = r#"{"jsonrpc":"2.0","id":1,"method":"session/prompt","params":{...}}"#;

        c.bench_function("parse_acp_message", |b| {
            b.iter(|| {
                let _: ACPMessage = serde_json::from_str(black_box(json)).unwrap();
            })
        });
    }

    criterion_group!(benches, bench_message_parsing);
    criterion_main!(benches);
}
```

## Operational Procedures

### Startup Procedure

1. **Plugin Loading**
   - Load plugin configuration
   - Initialize components
   - Set up event handlers

2. **Configuration Validation**
   - Validate settings.json
   - Check agent server availability
   - Load keymap configuration

3. **UI Initialization**
   - Create agent panel
   - Set up command handlers
   - Register menu items

### Connection Procedure

1. **Agent Server Selection**
   - Check configured servers
   - Validate executables
   - Select default server

2. **Process Launch**
   - Spawn OpenCode process
   - Establish stdio pipes
   - Set up message processing

3. **Protocol Handshake**
   - Send initialize request
   - Validate response
   - Set up session management

### Shutdown Procedure

1. **UI Cleanup**
   - Hide agent panel
   - Cancel pending operations
   - Save session state

2. **Connection Cleanup**
   - Send termination signals
   - Close stdio pipes
   - Wait for process exit

3. **Resource Cleanup**
   - Clear caches
   - Save configuration
   - Log final statistics

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Zed Integration Implementation Specification Team
