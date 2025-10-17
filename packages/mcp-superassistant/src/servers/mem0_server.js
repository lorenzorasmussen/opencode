/**
 * Mem0 MCP Server - Shared Memory Layer
 * Provides HTTP/WebSocket API for all projects to access Mem0
 * Uses free sentence-transformers embeddings (no API keys)
 */

const express = require('express');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3100;
const MEM0_DIR = process.env.MEM0_DIR || path.join(process.env.HOME, 'projects', 'mem0');

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mcp-mem0-server',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Execute Mem0 operations via Python backend
function executeMem0Operation(operation, args) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(MEM0_DIR, 'mem0_cli.py');

    const python = spawn('python3', [
      pythonScript,
      operation,
      JSON.stringify(args)
    ], {
      env: { ...process.env, PYTHONPATH: MEM0_DIR }
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => { stdout += data.toString(); });
    python.stderr.on('data', (data) => { stderr += data.toString(); });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Mem0 error (${code}): ${stderr}`));
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse Mem0 output: ${stdout}`));
        }
      }
    });

    python.on('error', (err) => {
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });
  });
}

// API: Add memory
app.post('/api/memory/add', async (req, res) => {
  try {
    const { content, user_id, metadata = {} } = req.body;

    if (!content || !user_id) {
      return res.status(400).json({
        error: 'Missing required fields: content, user_id'
      });
    }

    const result = await executeMem0Operation('add', {
      messages: [{ role: 'user', content }],
      user_id,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'mcp-server'
      }
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Add memory error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Search memory
app.post('/api/memory/search', async (req, res) => {
  try {
    const { query, user_id, limit = 5 } = req.body;

    if (!query || !user_id) {
      return res.status(400).json({
        error: 'Missing required fields: query, user_id'
      });
    }

    const result = await executeMem0Operation('search', {
      query,
      user_id,
      limit: parseInt(limit)
    });

    res.json({ success: true, memories: result });
  } catch (error) {
    console.error('Search memory error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get all memories
app.get('/api/memory/all/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await executeMem0Operation('get_all', { user_id });

    res.json({ success: true, memories: result });
  } catch (error) {
    console.error('Get all memories error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('[Mem0 WS] Client connected');

  ws.on('message', async (message) => {
    try {
      const request = JSON.parse(message);
      const { operation, args } = request;

      const result = await executeMem0Operation(operation, args);

      ws.send(JSON.stringify({ success: true, result }));
    } catch (error) {
      ws.send(JSON.stringify({ success: false, error: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('[Mem0 WS] Client disconnected');
  });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`✅ MCP Mem0 Server running on http://localhost:${PORT}`);
  console.log(`   Mem0 directory: ${MEM0_DIR}`);
  console.log(`   WebSocket ready on ws://localhost:${PORT}`);
});

// Attach WebSocket server to HTTP server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Mem0 server...');
  server.close(() => {
    process.exit(0);
  });
});