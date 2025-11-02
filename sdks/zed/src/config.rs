use zed_extension_api::settings::Settings;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AgentServerConfig {
    pub command: String,
    pub args: Vec<String>,
    pub env: HashMap<String, String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AgentConfig {
    pub enabled: bool,
    pub default_server: Option<String>,
    pub auto_start: bool,
    pub streaming: bool,
    pub max_history: usize,
}

impl Default for AgentConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            default_server: None,
            auto_start: false,
            streaming: true,
            max_history: 100,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UiConfig {
    pub panel_position: String,
    pub panel_width: u32,
    pub font_size: f32,
    pub theme: String,
}

impl Default for UiConfig {
    fn default() -> Self {
        Self {
            panel_position: "right".to_string(),
            panel_width: 400,
            font_size: 12.0,
            theme: "auto".to_string(),
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PerformanceConfig {
    pub max_concurrent_requests: usize,
    pub request_timeout: u64,
    pub cache_size: usize,
}

impl Default for PerformanceConfig {
    fn default() -> Self {
        Self {
            max_concurrent_requests: 3,
            request_timeout: 30000,
            cache_size: 50,
        }
    }
}

#[derive(Clone, Debug)]
pub struct ACPConfig {
    pub agent_servers: HashMap<String, AgentServerConfig>,
    pub agent: AgentConfig,
    pub ui: UiConfig,
    pub performance: PerformanceConfig,
}

impl Default for ACPConfig {
    fn default() -> Self {
        Self {
            agent_servers: HashMap::new(),
            agent: AgentConfig::default(),
            ui: UiConfig::default(),
            performance: PerformanceConfig::default(),
        }
    }
}

impl ACPConfig {
    pub fn from_settings(settings: &Settings) -> Result<Self, String> {
        let agent_servers = settings
            .get("agent_servers")
            .and_then(|v| serde_json::from_value(v.clone()).ok())
            .unwrap_or_default();

        let agent = settings
            .get("agent")
            .and_then(|v| serde_json::from_value(v.clone()).ok())
            .unwrap_or_default();

        let ui = settings
            .get("ui")
            .and_then(|v| serde_json::from_value(v.clone()).ok())
            .unwrap_or_default();

        let performance = settings
            .get("performance")
            .and_then(|v| serde_json::from_value(v.clone()).ok())
            .unwrap_or_default();

        Ok(Self {
            agent_servers,
            agent,
            ui,
            performance,
        })
    }
}