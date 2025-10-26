#!/usr/bin/env bun

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

console.log("Checking MCP service health...\n");

// Define the expected MCP service ports
const mcpPorts = [
  { port: 3100, name: "mem0-server" },
  { port: 3101, name: "gemini-bridge" },
  { port: 3102, name: "qwen-bridge" },
  // Additional ports the user mentioned
  { port: 3000, name: "potential-web-server" },
  { port: 3001, name: "potential-service" },
  { port: 3002, name: "potential-service" },
  { port: 3003, name: "potential-service" },
  { port: 3004, name: "potential-service" },
  { port: 3005, name: "potential-service" },
  { port: 3006, name: "potential-service" },
  { port: 3007, name: "potential-service" }
];

async function checkPort(port: number, name: string) {
  try {
    // Use curl to test if the port is accessible
    const { stdout, stderr } = await execAsync(`curl -s --connect-timeout 5 http://localhost:${port}/ || echo "Connection failed"`);
    if (stderr && !stderr.includes("Connection failed") && !stderr.includes("52")) { // 52 means empty reply
      console.log(`❌ ${name} (port ${port}): ${stderr.trim()}`);
    } else if (stdout.includes("Connection failed") || stderr.includes("Connection timed out") || stderr.includes("Connection refused")) {
      console.log(`❌ ${name} (port ${port}): Not accessible`);
    } else {
      console.log(`✅ ${name} (port ${port}): Accessible`);
    }
  } catch (error: any) {
    if (error.message.includes("Connection refused") || error.message.includes("Connection timed out")) {
      console.log(`❌ ${name} (port ${port}): Not accessible`);
    } else {
      console.log(`✅ ${name} (port ${port}): Accessible`);
    }
  }
}

async function checkProcesses() {
  console.log("Checking for running processes on MCP ports...\n");
  
  for (const { port, name } of mcpPorts) {
    try {
      const { stdout } = await execAsync(`lsof -i :${port} -sTCP:LISTEN | grep LISTEN | head -1`);
      if (stdout.trim()) {
        const processInfo = stdout.trim().split(/\s+/);
        console.log(`✅ ${name} (port ${port}): Process running (PID: ${processInfo[1]})`);
      } else {
        console.log(`❌ ${name} (port ${port}): No process listening`);
      }
    } catch (error) {
      console.log(`❌ ${name} (port ${port}): No process listening`);
    }
  }
  
  console.log("\nTesting port accessibility...\n");
  
  for (const { port, name } of mcpPorts) {
    await checkPort(port, name);
  }
}

checkProcesses()
  .then(() => {
    console.log("\n📋 Health check complete");
  })
  .catch((error) => {
    console.error("❌ Error during health check:", error);
  });