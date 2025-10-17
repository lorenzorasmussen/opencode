/**
 * MCP Health Monitor
 * Periodically checks all MCP server health endpoints
 * Logs status and alerts on failures
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CHECK_INTERVAL = process.env.CHECK_INTERVAL || 30000; // 30 seconds
const LOG_FILE = path.join(__dirname, '../../logs/health.log');

// Server endpoints to monitor
const SERVERS = [
  { name: 'Mem0 Server', url: 'http://localhost:3100/health' },
  { name: 'Gemini Bridge', url: 'http://localhost:3101/health' },
  { name: 'Qwen Bridge', url: 'http://localhost:3102/health' }
];

function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  console.log(message);
  fs.appendFileSync(LOG_FILE, logEntry);
}

async function checkServer(server) {
  try {
    const response = await axios.get(server.url, { timeout: 5000 });
    return {
      name: server.name,
      status: 'ok',
      response_time: response.data.response_time || 'unknown',
      details: response.data
    };
  } catch (error) {
    return {
      name: server.name,
      status: 'error',
      error: error.message
    };
  }
}

async function healthCheck() {
  log('🔍 Starting MCP server health check...');

  const results = await Promise.all(SERVERS.map(checkServer));

  let allHealthy = true;
  results.forEach(result => {
    if (result.status === 'ok') {
      log(`✅ ${result.name}: OK`);
    } else {
      log(`❌ ${result.name}: FAILED - ${result.error}`);
      allHealthy = false;
    }
  });

  if (allHealthy) {
    log('🎉 All MCP servers healthy');
  } else {
    log('⚠️  Some MCP servers unhealthy - check logs');
  }

  log('─'.repeat(50));
}

// Initial check
healthCheck();

// Periodic checks
setInterval(healthCheck, CHECK_INTERVAL);

log(`🚀 MCP Health Monitor started - checking every ${CHECK_INTERVAL/1000}s`);
log(`📝 Logs: ${LOG_FILE}`);