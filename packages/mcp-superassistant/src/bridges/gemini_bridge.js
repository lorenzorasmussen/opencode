/**
 * Gemini CLI Bridge - OAuth Authentication
 * Wraps gemini-cli command for MCP integration
 * No API keys needed - uses OAuth 2.0 flow
 */

const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3101;
const GEMINI_CLI = process.env.GEMINI_CLI_PATH || 'gemini';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(express.json());

// Check if gemini-cli is authenticated
function checkGeminiAuth() {
  const oauthCredsPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
  return fs.existsSync(oauthCredsPath);
}

// Health check with auth status
app.get('/health', (req, res) => {
  const authenticated = checkGeminiAuth();
  res.json({
    status: authenticated ? 'ok' : 'auth_required',
    service: 'mcp-gemini-bridge',
    authenticated,
    message: authenticated ? 'Ready' : 'Run: gemini auth --login'
  });
});

// Query Gemini via CLI (OAuth)
app.post('/api/query', async (req, res) => {
  try {
    const { prompt, user_id, model = DEFAULT_MODEL } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    if (!checkGeminiAuth()) {
      return res.status(401).json({
        error: 'Gemini CLI not authenticated',
        solution: 'Run: gemini auth --login'
      });
    }

    // Execute gemini-cli command
    const gemini = spawn(GEMINI_CLI, [
      '--model', model,
      '--no-stream',
      prompt
    ]);

    let stdout = '';
    let stderr = '';

    gemini.stdout.on('data', (data) => { stdout += data.toString(); });
    gemini.stderr.on('data', (data) => { stderr += data.toString(); });

    gemini.on('close', (code) => {
      if (code !== 0) {
        res.status(500).json({
          success: false,
          error: `Gemini CLI error: ${stderr}`
        });
      } else {
        res.json({
          success: true,
          response: stdout.trim(),
          model,
          user_id
        });
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Streaming query endpoint
app.post('/api/query/stream', (req, res) => {
  const { prompt, model = DEFAULT_MODEL } = req.body;

  if (!checkGeminiAuth()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const gemini = spawn(GEMINI_CLI, [
    '--model', model,
    '--stream',
    prompt
  ]);

  gemini.stdout.on('data', (data) => {
    res.write(`data: ${JSON.stringify({ chunk: data.toString() })}\n\n`);
  });

  gemini.on('close', () => {
    res.write('data: [DONE]\n\n');
    res.end();
  });
});

app.listen(PORT, () => {
  const authenticated = checkGeminiAuth();
  console.log(`✅ MCP Gemini Bridge running on http://localhost:${PORT}`);
  console.log(`   Auth status: ${authenticated ? 'Authenticated ✓' : 'Not authenticated ✗'}`);
  if (!authenticated) {
    console.log(`   ⚠️  Run: gemini auth --login`);
  }
});