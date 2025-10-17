require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'mcp-filesystem',
      script: './node_modules/.bin/mcp-server-filesystem',
      args: '/Users/lorenzorasmussen/.config/opencode',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'mcp-memory',
      script: './node_modules/.bin/mcp-server-memory',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};