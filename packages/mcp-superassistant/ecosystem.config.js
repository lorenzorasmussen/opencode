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
      cwd: path.join(os.homedir(), '.config', 'opencode', 'mcp-superassistant'),
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
        GEMINI_CLI_PATH: 'gemini',
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
      cron_restart: '*/5 * * * *',
      watch: false,
      env: {
        CHECK_INTERVAL: 30000
      },
      error_file: './logs/health-error.log',
      out_file: './logs/health-out.log'
    }
  ]
};