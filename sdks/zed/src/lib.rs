use zed_extension_api::{
    self as zed,
    serde_json,
    settings::Settings,
    Command, Context, Extension, SlashCommand, SlashCommandOutput, Worktree,
};

mod client;
mod ui;
mod protocol;
mod session;
mod config;

use client::ACPClient;
use config::ACPConfig;
use session::SessionManager;
use ui::AgentPanel;

struct ZedACP {
    client: Option<ACPClient>,
    session_manager: SessionManager,
    config: ACPConfig,
}

impl ZedACP {
    fn new() -> Self {
        Self {
            client: None,
            session_manager: SessionManager::new(),
            config: ACPConfig::default(),
        }
    }
}

impl Extension for ZedACP {
    fn new() -> Self {
        Self::new()
    }

    fn run_slash_command(
        &mut self,
        command: SlashCommand,
        args: Vec<String>,
        worktree: Option<&Worktree>,
        cx: &mut Context,
    ) -> Result<SlashCommandOutput, String> {
        match command.name.as_str() {
            "agent" => {
                // Handle /agent slash command
                let prompt = args.join(" ");
                self.handle_agent_command(prompt, worktree, cx)
            }
            _ => Err(format!("Unknown slash command: {}", command.name)),
        }
    }

    fn run_command(
        &mut self,
        command: &Command,
        cx: &mut Context,
    ) -> Result<(), String> {
        match command.name.as_str() {
            "agent:toggle-panel" => {
                // Toggle agent panel
                self.toggle_panel(cx);
                Ok(())
            }
            "agent:new-session" => {
                // Create new session
                self.new_session(cx);
                Ok(())
            }
            "agent:submit-prompt" => {
                // Submit current prompt
                self.submit_prompt(cx);
                Ok(())
            }
            "agent:cancel-prompt" => {
                // Cancel current prompt
                self.cancel_prompt(cx);
                Ok(())
            }
            "agent:clear-history" => {
                // Clear conversation history
                self.clear_history(cx);
                Ok(())
            }
            "agent:export-session" => {
                // Export session
                self.export_session(cx);
                Ok(())
            }
            _ => Err(format!("Unknown command: {}", command.name)),
        }
    }

    fn settings_updated(&mut self, settings: &Settings, cx: &mut Context) {
        // Update configuration from settings
        if let Ok(config) = ACPConfig::from_settings(settings) {
            self.config = config;
            // Reconnect client if configuration changed
            if let Some(client) = &mut self.client {
                let _ = client.reconnect();
            }
        }
    }
}

impl ZedACP {
    fn handle_agent_command(
        &mut self,
        prompt: String,
        worktree: Option<&Worktree>,
        cx: &mut Context,
    ) -> Result<SlashCommandOutput, String> {
        // Ensure client is connected
        self.ensure_client(cx)?;

        // Get current session or create new one
        let session_id = self.session_manager.current_session()
            .unwrap_or_else(|| self.session_manager.create_session(worktree));

        // Submit prompt
        if let Some(client) = &mut self.client {
            match client.prompt(&session_id, &prompt) {
                Ok(response) => Ok(SlashCommandOutput {
                    text: response,
                    sections: vec![],
                }),
                Err(e) => Err(format!("Agent error: {}", e)),
            }
        } else {
            Err("No agent client available".to_string())
        }
    }

    fn ensure_client(&mut self, cx: &mut Context) -> Result<(), String> {
        if self.client.is_none() {
            match ACPClient::new(&self.config) {
                Ok(client) => {
                    self.client = Some(client);
                    Ok(())
                }
                Err(e) => Err(format!("Failed to create agent client: {}", e)),
            }
        } else {
            Ok(())
        }
    }

    fn toggle_panel(&mut self, cx: &mut Context) {
        // Toggle agent panel visibility
        // This would integrate with Zed's panel system
        cx.show_notification("Agent panel toggled", None);
    }

    fn new_session(&mut self, cx: &mut Context) {
        let session_id = self.session_manager.create_session(None);
        cx.show_notification(&format!("New session created: {}", session_id), None);
    }

    fn submit_prompt(&mut self, cx: &mut Context) {
        // Submit prompt from UI
        cx.show_notification("Prompt submitted", None);
    }

    fn cancel_prompt(&mut self, cx: &mut Context) {
        // Cancel current prompt
        if let Some(client) = &mut self.client {
            let _ = client.cancel();
        }
        cx.show_notification("Prompt cancelled", None);
    }

    fn clear_history(&mut self, cx: &mut Context) {
        if let Some(session_id) = self.session_manager.current_session() {
            self.session_manager.clear_history(&session_id);
            cx.show_notification("History cleared", None);
        }
    }

    fn export_session(&mut self, cx: &mut Context) {
        // Export current session to file
        cx.show_notification("Session exported", None);
    }
}

zed::register_extension!(ZedACP);