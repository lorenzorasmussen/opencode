#!/usr/bin/env bun

import { spawn } from "child_process";
import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

console.log("Starting MCP Server Farm...");

// Define the MCP services and their ports
const mcpServices = [
  {
    name: "mem0-server",
    port: 3100,
    command: ["node", `${homedir()}/projects/mcp-superassistant/src/servers/mem0_server.js`],
    env: { PORT: "3100", MEM0_DIR: `${homedir()}/projects/mem0`, LOG_LEVEL: "info" }
  },
  {
    name: "gemini-bridge",
    port: 3101,
    command: ["node", `${homedir()}/projects/mcp-superassistant/src/bridges/gemini_bridge.js`],
    env: { 
      PORT: "3101", 
      GEMINI_CLI_PATH: "gemini", 
      GEMINI_MODEL: "gemini-2.5-flash", 
      AUTH_TYPE: "oauth"
    }
  },
  {
    name: "qwen-bridge",
    port: 3102,
    command: ["node", `${homedir()}/projects/mcp-superassistant/src/bridges/qwen_bridge.js`],
    env: { 
      PORT: "3102", 
      OLLAMA_HOST: "http://localhost:11434", 
      QWEN_MODEL: "qwen3-coder:7b"
    }
  }
];

// Function to check if a port is in use
async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const net = require('net');
    const tester = net.createServer()
      .once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        tester.close();
        resolve(false);
      });
    
    tester.listen(port, '127.0.0.1');
  });
}

// Start each service
async function startServices() {
  for (const service of mcpServices) {
    try {
      // Check if port is already in use
      const inUse = await isPortInUse(service.port);
      if (inUse) {
        console.log(`⚠️  Port ${service.port} already in use for ${service.name}`);
        continue;
      }

      // Check if the script exists
      const scriptPath = service.command[1];
      if (!existsSync(scriptPath)) {
        console.log(`❌ Script not found for ${service.name}: ${scriptPath}`);
        console.log(`   You may need to create this script or install the mcp-superassistant package first`);
        continue;
      }

      // Start the service
      console.log(`🚀 Starting ${service.name} on port ${service.port}...`);
      
      const childProcess = spawn(service.command[0], service.command.slice(1), {
        env: { ...process.env, ...service.env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Pipe the output to this process
      childProcess.stdout?.on('data', (data) => {
        console.log(`[${service.name}] ${data.toString()}`);
      });

      childProcess.stderr?.on('data', (data) => {
        console.error(`[${service.name} ERROR] ${data.toString()}`);
      });

      childProcess.on('close', (code) => {
        console.log(`🔒 ${service.name} closed with code ${code}`);
      });

      // Add a small delay to allow the service to start
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Failed to start ${service.name}:`, error);
    }
  }
}

// Run the startup process
startServices()
  .then(() => {
    console.log("✅ MCP Server Farm startup initiated");
    console.log("💡 Note: Services are running in the foreground. Press Ctrl+C to stop.");
  })
  .catch((error) => {
    console.error("❌ Error starting MCP Server Farm:", error);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n shutting down MCP services...');
  process.exit(0);
});