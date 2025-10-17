#!/bin/bash

# MCP Server Management Script
# Usage: ./manage-mcp.sh [start|stop|restart|status|logs|delete]

ACTION=${1:-status}

case $ACTION in
    start)
        echo "Starting MCP servers..."
        pm2 start ecosystem.config.js
        ;;
    stop)
        echo "Stopping MCP servers..."
        pm2 stop ecosystem.config.js
        ;;
    restart)
        echo "Restarting MCP servers..."
        pm2 restart ecosystem.config.js
        ;;
    status)
        echo "MCP Server Status:"
        pm2 list
        ;;
    logs)
        echo "Showing MCP server logs (press Ctrl+C to exit):"
        pm2 logs
        ;;
    delete)
        echo "Deleting MCP servers..."
        pm2 delete ecosystem.config.js
        ;;
    save)
        echo "Saving PM2 process list..."
        pm2 save
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|status|logs|delete|save]"
        echo "  start   - Start all MCP servers"
        echo "  stop    - Stop all MCP servers"
        echo "  restart - Restart all MCP servers"
        echo "  status  - Show server status"
        echo "  logs    - Show server logs"
        echo "  delete  - Remove servers from PM2"
        echo "  save    - Save current process list"
        exit 1
        ;;
esac