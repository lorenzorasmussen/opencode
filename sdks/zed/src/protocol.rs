use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "jsonrpc", rename = "2.0")]
pub enum ACPMessage {
    #[serde(rename = "request")]
    Request {
        id: MessageId,
        method: String,
        params: serde_json::Value,
    },
    #[serde(rename = "response")]
    Response {
        id: MessageId,
        #[serde(flatten)]
        result: ResponseResult,
    },
    #[serde(rename = "notification")]
    Notification {
        method: String,
        params: serde_json::Value,
    },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MessageId {
    Number(i64),
    String(String),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ResponseResult {
    Success { result: serde_json::Value },
    Error { error: ACPError },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ACPError {
    pub code: i64,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
}

// Initialize method types
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct InitializeRequest {
    pub protocol_version: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<ClientCapabilities>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub client_info: Option<ClientInfo>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct InitializeResponse {
    pub protocol_version: u32,
    pub capabilities: ServerCapabilities,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub server_info: Option<ServerInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub instructions: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ClientCapabilities {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sampling: Option<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ServerCapabilities {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub experimental: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub logging: Option<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ClientInfo {
    pub name: String,
    pub version: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ServerInfo {
    pub name: String,
    pub version: String,
}

// Session management types
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NewSessionRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cwd: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mcp_servers: Option<Vec<McpServer>>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NewSessionResponse {
    pub session_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub models: Option<ModelsInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub modes: Option<ModesInfo>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoadSessionRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cwd: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mcp_servers: Option<Vec<McpServer>>,
    pub session_id: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoadSessionResponse {
    pub session_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub models: Option<ModelsInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub modes: Option<ModesInfo>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ModelsInfo {
    pub current_model_id: Option<String>,
    pub available_models: Vec<ModelInfo>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ModelInfo {
    pub model_id: String,
    pub name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ModesInfo {
    pub available_modes: Vec<ModeInfo>,
    pub current_mode_id: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ModeInfo {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct McpServer {
    pub name: String,
    #[serde(flatten)]
    pub config: McpServerConfig,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum McpServerConfig {
    Local {
        command: Vec<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        env: Option<HashMap<String, String>>,
    },
    Remote {
        url: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        headers: Option<HashMap<String, String>>,
    },
}

// Prompt types
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PromptRequest {
    pub session_id: String,
    pub prompt: Vec<ContentBlock>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<Vec<ContentBlock>>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PromptResponse {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_reason: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub meta: Option<HashMap<String, serde_json::Value>>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ContentBlock {
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "image")]
    Image {
        mime_type: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        data: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        uri: Option<String>,
    },
    #[serde(rename = "resource_link")]
    ResourceLink { uri: String },
    #[serde(rename = "resource")]
    Resource { resource: ResourceContent },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ResourceContent {
    Text { text: String },
    Blob { blob: String, mime_type: String },
}

// Streaming types
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "session_update")]
pub enum SessionUpdate {
    #[serde(rename = "agent_message_chunk")]
    AgentMessageChunk { content: ContentBlock },
    #[serde(rename = "agent_thought_chunk")]
    AgentThoughtChunk { content: ContentBlock },
    #[serde(rename = "tool_call")]
    ToolCall {
        tool_call_id: String,
        title: String,
        kind: String,
        status: String,
        locations: Vec<Location>,
        raw_input: serde_json::Value,
    },
    #[serde(rename = "tool_call_update")]
    ToolCallUpdate {
        tool_call_id: String,
        status: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        kind: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        content: Option<Vec<ToolCallContent>>,
        #[serde(skip_serializing_if = "Option::is_none")]
        title: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        raw_output: Option<serde_json::Value>,
    },
    #[serde(rename = "plan")]
    Plan { entries: Vec<PlanEntry> },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Location {
    pub path: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ToolCallContent {
    Content { content: ContentBlock },
    Diff { path: String, old_text: String, new_text: String },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PlanEntry {
    pub priority: String,
    pub status: String,
    pub content: String,
}