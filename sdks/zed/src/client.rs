use crate::config::{ACPConfig, AgentServerConfig};
use crate::protocol::*;
use std::collections::HashMap;
use std::io::{BufRead, BufReader, Write};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc;
use tokio::time::{timeout, Duration};

#[derive(thiserror::Error, Debug)]
pub enum ACPClientError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
    #[error("Protocol error: {0}")]
    Protocol(String),
    #[error("Timeout error")]
    Timeout,
    #[error("Server not configured")]
    ServerNotConfigured,
}

pub type Result<T> = std::result::Result<T, ACPClientError>;

pub struct ACPClient {
    config: ACPConfig,
    process: Arc<Mutex<Option<Child>>>,
    next_id: Arc<Mutex<i64>>,
    pending_requests: Arc<Mutex<HashMap<MessageId, mpsc::Sender<ACPMessage>>>>,
}

impl ACPClient {
    pub fn new(config: &ACPConfig) -> Result<Self> {
        Ok(Self {
            config: config.clone(),
            process: Arc::new(Mutex::new(None)),
            next_id: Arc::new(Mutex::new(1)),
            pending_requests: Arc::new(Mutex::new(HashMap::new())),
        })
    }

    pub async fn connect(&mut self) -> Result<()> {
        let server_config = self.get_server_config()?;
        self.start_process(&server_config)?;
        self.initialize().await?;
        Ok(())
    }

    pub fn reconnect(&mut self) -> Result<()> {
        // Kill existing process
        if let Some(mut child) = self.process.lock().unwrap().take() {
            let _ = child.kill();
        }
        // Connect again
        // Note: This is synchronous, actual reconnection would be async
        Ok(())
    }

    pub async fn prompt(&mut self, session_id: &str, prompt: &str) -> Result<String> {
        self.ensure_connected().await?;

        let content_blocks = vec![ContentBlock::Text {
            text: prompt.to_string(),
        }];

        let request = PromptRequest {
            session_id: session_id.to_string(),
            prompt: content_blocks,
            system: None,
        };

        let response = self.send_request("session/prompt", request).await?;
        // Parse response and collect streaming updates
        self.collect_response(response).await
    }

    pub async fn new_session(&mut self, cwd: Option<String>) -> Result<String> {
        self.ensure_connected().await?;

        let request = NewSessionRequest {
            cwd,
            mcp_servers: None, // TODO: Add MCP server support
        };

        let response: NewSessionResponse = self.send_request("session/new", request).await?;
        Ok(response.session_id)
    }

    pub async fn cancel(&mut self) -> Result<()> {
        // Send cancel notification
        self.send_notification("session/cancel", serde_json::Value::Null).await
    }

    async fn initialize(&mut self) -> Result<()> {
        let request = InitializeRequest {
            protocol_version: 1,
            capabilities: None,
            client_info: Some(ClientInfo {
                name: "Zed ACP Client".to_string(),
                version: env!("CARGO_PKG_VERSION").to_string(),
            }),
        };

        let _response: InitializeResponse = self.send_request("initialize", request).await?;
        Ok(())
    }

    async fn send_request<T, R>(&mut self, method: &str, params: T) -> Result<R>
    where
        T: serde::Serialize,
        R: serde::DeserializeOwned,
    {
        let id = self.next_message_id();
        let message = ACPMessage::Request {
            id: id.clone(),
            method: method.to_string(),
            params: serde_json::to_value(params)?,
        };

        let (tx, mut rx) = mpsc::channel(1);
        self.pending_requests.lock().unwrap().insert(id.clone(), tx);

        self.send_message(message).await?;

        // Wait for response with timeout
        match timeout(Duration::from_secs(30), rx.recv()).await {
            Ok(Some(response)) => {
                self.pending_requests.lock().unwrap().remove(&id);
                match response {
                    ACPMessage::Response { result: ResponseResult::Success { result }, .. } => {
                        Ok(serde_json::from_value(result)?)
                    }
                    ACPMessage::Response { result: ResponseResult::Error { error }, .. } => {
                        Err(ACPClientError::Protocol(error.message))
                    }
                    _ => Err(ACPClientError::Protocol("Unexpected response type".to_string())),
                }
            }
            _ => {
                self.pending_requests.lock().unwrap().remove(&id);
                Err(ACPClientError::Timeout)
            }
        }
    }

    async fn send_notification(&mut self, method: &str, params: serde_json::Value) -> Result<()> {
        let message = ACPMessage::Notification {
            method: method.to_string(),
            params,
        };
        self.send_message(message).await
    }

    async fn send_message(&mut self, message: ACPMessage) -> Result<()> {
        let json = serde_json::to_string(&message)?;
        let mut process = self.process.lock().unwrap();
        if let Some(child) = process.as_mut() {
            if let Some(stdin) = child.stdin.as_mut() {
                writeln!(stdin, "{}", json)?;
                stdin.flush()?;
                Ok(())
            } else {
                Err(ACPClientError::Protocol("No stdin available".to_string()))
            }
        } else {
            Err(ACPClientError::Protocol("No process running".to_string()))
        }
    }

    async fn collect_response(&mut self, initial_response: PromptResponse) -> Result<String> {
        // For now, just return empty string as streaming is not implemented
        // In full implementation, would collect streaming updates
        Ok(String::new())
    }

    async fn ensure_connected(&mut self) -> Result<()> {
        if self.process.lock().unwrap().is_none() {
            self.connect().await?;
        }
        Ok(())
    }

    fn get_server_config(&self) -> Result<AgentServerConfig> {
        let server_name = self.config.agent.default_server
            .as_ref()
            .and_then(|name| self.config.agent_servers.get(name))
            .or_else(|| self.config.agent_servers.values().next())
            .ok_or(ACPClientError::ServerNotConfigured)?;

        Ok(server_name.clone())
    }

    fn start_process(&mut self, config: &AgentServerConfig) -> Result<()> {
        let mut command = Command::new(&config.command);
        command.args(&config.args);
        command.envs(&config.env);
        command.stdin(Stdio::piped());
        command.stdout(Stdio::piped());
        command.stderr(Stdio::piped());

        let child = command.spawn()?;
        *self.process.lock().unwrap() = Some(child);

        // Start background reader
        self.start_message_reader();

        Ok(())
    }

    fn start_message_reader(&self) {
        let process = Arc::clone(&self.process);
        let pending_requests = Arc::clone(&self.pending_requests);

        tokio::spawn(async move {
            let mut reader = {
                let process_guard = process.lock().unwrap();
                if let Some(child) = process_guard.as_ref() {
                    if let Some(stdout) = child.stdout.as_ref() {
                        BufReader::new(stdout)
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            };

            let mut line = String::new();
            loop {
                line.clear();
                match reader.read_line(&mut line) {
                    Ok(0) => break, // EOF
                    Ok(_) => {
                        if let Ok(message) = serde_json::from_str::<ACPMessage>(&line.trim()) {
                            if let ACPMessage::Response { id, .. } = &message {
                                if let Some(tx) = pending_requests.lock().unwrap().remove(id) {
                                    let _ = tx.send(message).await;
                                }
                            }
                            // Handle notifications here if needed
                        }
                    }
                    Err(_) => break,
                }
            }
        });
    }

    fn next_message_id(&mut self) -> MessageId {
        let mut id = self.next_id.lock().unwrap();
        let current = *id;
        *id += 1;
        MessageId::Number(current)
    }
}

impl Drop for ACPClient {
    fn drop(&mut self) {
        if let Some(mut child) = self.process.lock().unwrap().take() {
            let _ = child.kill();
        }
    }
}