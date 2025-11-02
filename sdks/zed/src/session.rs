use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub role: MessageRole,
    pub content: String,
    pub timestamp: DateTime<Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum MessageRole {
    User,
    Assistant,
    System,
    Tool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Session {
    pub id: String,
    pub cwd: Option<String>,
    pub messages: Vec<Message>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
}

impl Session {
    pub fn new(cwd: Option<String>) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            cwd,
            messages: Vec::new(),
            created_at: now,
            updated_at: now,
            metadata: HashMap::new(),
        }
    }

    pub fn add_message(&mut self, role: MessageRole, content: String) {
        let message = Message {
            id: Uuid::new_v4().to_string(),
            role,
            content,
            timestamp: Utc::now(),
            metadata: HashMap::new(),
        };
        self.messages.push(message);
        self.updated_at = Utc::now();

        // Trim history if needed
        if self.messages.len() > 100 {
            self.messages.remove(0);
        }
    }

    pub fn clear_history(&mut self) {
        self.messages.clear();
        self.updated_at = Utc::now();
    }
}

pub struct SessionManager {
    sessions: HashMap<String, Session>,
    current_session: Option<String>,
}

impl SessionManager {
    pub fn new() -> Self {
        Self {
            sessions: HashMap::new(),
            current_session: None,
        }
    }

    pub fn create_session(&mut self, cwd: Option<String>) -> String {
        let session = Session::new(cwd);
        let session_id = session.id.clone();
        self.sessions.insert(session_id.clone(), session);
        self.current_session = Some(session_id.clone());
        session_id
    }

    pub fn get_session(&self, session_id: &str) -> Option<&Session> {
        self.sessions.get(session_id)
    }

    pub fn get_session_mut(&mut self, session_id: &str) -> Option<&mut Session> {
        self.sessions.get_mut(session_id)
    }

    pub fn current_session(&self) -> Option<String> {
        self.current_session.clone()
    }

    pub fn set_current_session(&mut self, session_id: String) {
        self.current_session = Some(session_id);
    }

    pub fn clear_history(&mut self, session_id: &str) {
        if let Some(session) = self.sessions.get_mut(session_id) {
            session.clear_history();
        }
    }

    pub fn add_message(&mut self, session_id: &str, role: MessageRole, content: String) {
        if let Some(session) = self.sessions.get_mut(session_id) {
            session.add_message(role, content);
        }
    }

    pub fn list_sessions(&self) -> Vec<&Session> {
        self.sessions.values().collect()
    }

    pub fn delete_session(&mut self, session_id: &str) -> bool {
        let removed = self.sessions.remove(session_id).is_some();
        if self.current_session.as_ref() == Some(session_id) {
            self.current_session = None;
        }
        removed
    }

    pub fn export_session(&self, session_id: &str) -> Option<String> {
        self.get_session(session_id)
            .map(|session| serde_json::to_string_pretty(session).unwrap_or_default())
    }
}