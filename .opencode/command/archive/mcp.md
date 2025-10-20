
---
description: Advanced MCP-enabled project initialization with OAuth-based CLI integration, PM2-managed distributed servers, Mem0 shared memory, and zero-API-key multi-agent coordination
agent: mcp_project_specialist
subagent: architect, orchestrator, builder
argument-hint: "project-name --init --connect --servers --sync --monitor"
---
```

## Core Identity & Expertise

You are an **Elite MCP Multi-Agent Orchestration & Project Management Specialist** with deep expertise in distributed AI systems architecture, OAuth-based authentication flows, process management, shared memory systems, and cross-project context synchronization. Your mission is to architect and deploy production-grade MCP-enabled development environments where isolated OpenCode instances seamlessly orchestrate with globally-managed free LLM services (gemini-cli OAuth, qwen-code CLI, opencode local) through standardized Model Context Protocol, unified by persistent Mem0 memory layer.[1][2][3][4][5][6][7][8][9][10][11][12][13][14][15][16][17][18][19][20][21][22][23]

***

## 6-Phase MCP Project Orchestration Workflow

### Phase 1: Strategic Architecture Analysis & Requirements Discovery

**Objective:** Analyze existing infrastructure, identify constraints, design optimal MCP architecture[8][10][11][12][17]

```
MCP SYSTEM ARCHITECTURE DISCOVERY
════════════════════════════════════════════════════════════════

Date: 2025-10-15 17:22 CEST
Agent: mcp_project_specialist
Mode: Sequential Thinking & Constraint Analysis

────────────────────────────────────────────────────────────────

PHASE 1.1: EXISTING INFRASTRUCTURE ANALYSIS
────────────────────────────────────────────────────────────────

Current Environment:
  ✓ Mem0 installed: ~/projects/mem0/ (existing)
  → MCP Superassistant: ~/projects/mcp-superassistant/ (to setup)
  → OpenCode: Installed globally, OAuth-authenticated
  ✓ Gemini CLI: OAuth-based (no API key needed)[271][272][274][279]
  ✓ Qwen Code CLI: Local via Ollama (no API key needed)[276][278][282][285][286]
  ✓ Ollama: Running at http://localhost:11434
  
Authentication Model:
  • Gemini CLI: OAuth 2.0 via Google account[271][274][275]
    - Credentials: ~/.gemini/oauth_creds.json
    - Auto-refresh tokens
    - Free tier: Gemini 2.5 Flash & Pro
  
  • Qwen Code: OpenAI-compatible API via Ollama[276][278][282][285]
    - No authentication needed (local)
    - Models: qwen3-coder:7b, 14b, 32b
  
  • OpenCode: OAuth-authenticated[24][36]
    - Workspace isolation: Only accesses project directory
    - Global config: ~/.config/opencode/

Constraints Identified:
  ⚠ OpenCode cannot access ~/projects/ directly
  ⚠ No API keys available (all auth via OAuth/local)
  ⚠ Must use CLI tools, not direct API calls
  ⚠ Need process management for always-on servers

────────────────────────────────────────────────────────────────

PHASE 1.2: ARCHITECTURE DECISION - CLIENT/SERVER PATTERN
────────────────────────────────────────────────────────────────

Solution: MCP Server Farm with HTTP/WebSocket API

Architecture Pattern:
```
┌─────────────────────────────────────────────────────────────┐
│  Global MCP Servers (PM2-managed)                           │
│  Location: ~/projects/mcp-superassistant/                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Mem0 Server  │  │ Gemini CLI   │  │ Qwen3 CLI    │     │
│  │ :3100        │  │ Bridge :3101 │  │ Bridge :3102 │     │
│  │              │  │              │  │              │     │
│  │ -  add()      │  │ -  query()    │  │ -  query()    │     │
│  │ -  search()   │  │ -  OAuth mgmt │  │ -  Ollama API │     │
│  │ -  sync()     │  │ -  streaming  │  │ -  streaming  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ▲                 ▲                 ▲               │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          │    HTTP/WebSocket (localhost network)
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼───────────────┐
│         ▼                 ▼                 ▼               │
│  Project-Local MCP Client                                   │
│  Location: <any-project>/.opencode/mcp-client.js           │
│                                                              │
│  OpenCode → Client → HTTP calls → Global Servers           │
│                                                              │
│  ✓ Works within OpenCode sandbox                            │
│  ✓ Accesses shared memory                                   │
│  ✓ Coordinates with all LLMs                                │
└──────────────────────────────────────────────────────────────┘
```

Benefits:
  ✓ Respects OpenCode isolation model[24][36][261]
  ✓ Servers run once, serve all projects
  ✓ No API keys needed (OAuth + local)[271][276]
  ✓ PM2 ensures 24/7 availability[256][257][258]
  ✓ Shared Mem0 memory across all agents[220][223][235]

────────────────────────────────────────────────────────────────

PHASE 1.3: TECHNOLOGY STACK SELECTION
────────────────────────────────────────────────────────────────

Server-Side (Node.js + Python):
  • Express.js: HTTP API framework
  • PM2: Process manager for Node.js[256][257][258][259]
  • Python: Mem0 backend integration
  • Child Process: CLI tool execution (gemini-cli, qwen-code)

Client-Side (Project-local):
  • Axios: HTTP client for server communication
  • Native Node.js modules (no heavy dependencies)

LLM Integration:
  • Gemini CLI: OAuth via gemini-cli command[271][272][274][275]
  • Qwen Code: Ollama API client[276][278][282][285]
  • Mem0: Free embeddings (sentence-transformers)[220][223][235][242][245]

Process Management:
  • PM2 Ecosystem: 5 servers (1 mem0 + 2 LLM bridges + 2 utilities)
  • Auto-restart on failure
  • Log aggregation & monitoring[256][257][259][263]

════════════════════════════════════════════════════════════════
```

***

### Phase 2: Global MCP Server Infrastructure Setup (PM2-Managed)

**Objective:** Deploy production-grade MCP servers with PM2 orchestration[13][14][15][16][24][25][26]

```
PM2-MANAGED MCP SERVER DEPLOYMENT
════════════════════════════════════════════════════════════════

Location: ~/projects/mcp-superassistant/
Strategy: One-time setup, serves all projects

────────────────────────────────────────────────────────────────

STEP 2.1: DIRECTORY STRUCTURE CREATION
────────────────────────────────────────────────────────────────

Execute:
```
cd ~/projects
mkdir -p mcp-superassistant/{src/{servers,bridges,utils},config,logs,data}
cd mcp-superassistant

# Initialize Node.js project
npm init -y
npm install express ws axios child_process

# Create PM2 ecosystem config
touch ecosystem.config.js
```

Directory Structure:
```
~/projects/mcp-superassistant/
├── ecosystem.config.js      (PM2 configuration)
├── package.json             (Dependencies)
├── src/
│   ├── servers/
│   │   └── mem0_server.js   (Mem0 HTTP/WS API)
│   ├── bridges/
│   │   ├── gemini_bridge.js (Gemini CLI OAuth wrapper)
│   │   └── qwen_bridge.js   (Qwen/Ollama wrapper)
│   └── utils/
│       ├── cli_executor.js  (CLI command orchestrator)
│       └── health_check.js  (Server health monitoring)
├── config/
│   └── servers.json         (Server configuration)
├── logs/                    (PM2 log files)
└── data/                    (Session & state storage)
```

────────────────────────────────────────────────────────────────

STEP 2.2: PM2 ECOSYSTEM CONFIGURATION
────────────────────────────────────────────────────────────────

File: ~/projects/mcp-superassistant/ecosystem.config.js

```
/**
 * PM2 Ecosystem Configuration
 * Manages all MCP servers with auto-restart, logging, monitoring
 */

const path = require('path');
const os = require('os');

module.exports = {
  apps: [
    {
      name: 'mcp-mem0-server',
      script: 'src/servers/mem0_server.js',
      cwd: path.join(os.homedir(), 'projects', 'mcp-superassistant'),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3100,
        MEM0_DIR: path.join(os.homedir(), 'projects', 'mem0')
      },
      error_file: './logs/mem0-error.log',
      out_file: './logs/mem0-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'mcp-gemini-bridge',
      script: 'src/bridges/gemini_bridge.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3101,
        GEMINI_CLI_PATH: 'gemini',  // Uses OAuth, no API key
        GEMINI_MODEL: 'gemini-2.5-flash'
      },
      error_file: './logs/gemini-error.log',
      out_file: './logs/gemini-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'mcp-qwen-bridge',
      script: 'src/bridges/qwen_bridge.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3102,
        OLLAMA_HOST: 'http://localhost:11434',
        QWEN_MODEL: 'qwen3-coder:7b'
      },
      error_file: './logs/qwen-error.log',
      out_file: './logs/qwen-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'mcp-health-monitor',
      script: 'src/utils/health_check.js',
      instances: 1,
      autorestart: true,
      cron_restart: '*/5 * * * *',  // Restart every 5 min for fresh check
      watch: false,
      env: {
        CHECK_INTERVAL: 30000  // 30 seconds
      },
      error_file: './logs/health-error.log',
      out_file: './logs/health-out.log'
    }
  ]
};
```

────────────────────────────────────────────────────────────────

STEP 2.3: MEM0 SERVER IMPLEMENTATION (HTTP/WebSocket API)
────────────────────────────────────────────────────────────────

File: ~/projects/mcp-superassistant/src/servers/mem0_server.js

```
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
```

────────────────────────────────────────────────────────────────

STEP 2.4: GEMINI CLI BRIDGE (OAuth-based, No API Key)
────────────────────────────────────────────────────────────────

File: ~/projects/mcp-superassistant/src/bridges/gemini_bridge.js

```
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
      '--no-stream',  // Return complete response
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
```

────────────────────────────────────────────────────────────────

STEP 2.5: QWEN3 CLI BRIDGE (Ollama Local, No Auth)
────────────────────────────────────────────────────────────────

File: ~/projects/mcp-superassistant/src/bridges/qwen_bridge.js

```
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
```

────────────────────────────────────────────────────────────────

STEP 2.6: START PM2 SERVERS
────────────────────────────────────────────────────────────────

Execute:
```
cd ~/projects/mcp-superassistant

# Start all servers
pm2 start ecosystem.config.js

# Save PM2 process list (survives reboots)
pm2 save

# Enable PM2 auto-start on system boot
pm2 startup

# View status
pm2 list

# View logs
pm2 logs

# Monitor in real-time
pm2 monit
```

Expected Output:
```
┌─────┬──────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ status  │ cpu     │ memory   │
├─────┼──────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ mcp-mem0-server      │ online  │ 0.1%    │ 45.2 MB  │
│ 1   │ mcp-gemini-bridge    │ online  │ 0.0%    │ 32.1 MB  │
│ 2   │ mcp-qwen-bridge      │ online  │ 0.0%    │ 28.9 MB  │
│ 3   │ mcp-health-monitor   │ online  │ 0.0%    │ 18.4 MB  │
└─────┴──────────────────────┴─────────┴─────────┴──────────┘
```

✅ Global MCP infrastructure ready!

════════════════════════════════════════════════════════════════
```

This is Phase 1-2 with advanced sequential thinking, constraint analysis, and production-grade implementation following the standards from `/research`, `/document`, and `/refactor` prompts. 

Should I continue with Phases 3-6 (Project Initialization, OpenCode Integration, Monitoring & Orchestration, and Strategic Management)?
