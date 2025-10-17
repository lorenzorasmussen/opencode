/**
 * Qwen3 CLI Bridge - Local Ollama Integration
 * No authentication needed - fully local execution
 */

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3102;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.QWEN_MODEL || 'qwen3-coder:7b';

app.use(express.json());

// Health check with Ollama status
app.get('/health', async (req, res) => {
  try {
    const ollamaCheck = await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 2000 });
    res.json({
      status: 'ok',
      service: 'mcp-qwen-bridge',
      ollama_available: true,
      models: ollamaCheck.data.models.map(m => m.name)
    });
  } catch (error) {
    res.json({
      status: 'degraded',
      service: 'mcp-qwen-bridge',
      ollama_available: false,
      error: 'Ollama not reachable'
    });
  }
});

// Query Qwen via Ollama API
app.post('/api/query', async (req, res) => {
  try {
    const { prompt, user_id, model = DEFAULT_MODEL } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model,
      prompt,
      stream: false
    });

    res.json({
      success: true,
      response: response.data.response,
      model,
      user_id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Ollama error: ${error.message}`
    });
  }
});

// Streaming query endpoint
app.post('/api/query/stream', async (req, res) => {
  const { prompt, model = DEFAULT_MODEL } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios.post(
      `${OLLAMA_HOST}/api/generate`,
      { model, prompt, stream: true },
      { responseType: 'stream' }
    );

    response.data.on('data', (chunk) => {
      try {
        const parsed = JSON.parse(chunk);
        if (parsed.response) {
          res.write(`data: ${JSON.stringify({ chunk: parsed.response })}\n\n`);
        }
        if (parsed.done) {
          res.write('data: [DONE]\n\n');
          res.end();
        }
      } catch (e) {
        // Ignore parse errors in streaming
      }
    });

  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`✅ MCP Qwen3 Bridge running on http://localhost:${PORT}`);
  console.log(`   Ollama host: ${OLLAMA_HOST}`);
  console.log(`   Default model: ${DEFAULT_MODEL}`);
});