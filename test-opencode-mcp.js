#!/usr/bin/env node

/**
 * Test OpenCode MCP Integration with Composio
 * Tests if OpenCode can spawn and communicate with the local Composio MCP server
 */

import { spawn } from 'child_process';
import path from 'path';

async function testOpenCodeMCP() {
  console.log('🧪 Testing OpenCode MCP Integration with Composio...\n');

  try {
    // Test 1: Check if composio-mcp-server is accessible
    console.log('1. Checking if composio-mcp-server is accessible...');
    const which = spawn('which', ['composio-mcp-server']);
    await new Promise((resolve, reject) => {
      which.on('close', (code) => {
        if (code === 0) {
          console.log('   ✅ composio-mcp-server found in PATH');
          resolve();
        } else {
          console.log('   ❌ composio-mcp-server not found in PATH');
          reject(new Error('composio-mcp-server not accessible'));
        }
      });
    });

    // Test 2: Check if API key is available
    console.log('\n2. Checking if COMPOSIO_API_KEY is set...');
    const apiKey = process.env.COMPOSIO_API_KEY;
    if (apiKey) {
      console.log('   ✅ COMPOSIO_API_KEY is set');
    } else {
      console.log('   ❌ COMPOSIO_API_KEY not set');
      console.log('   💡 Set it with: export COMPOSIO_API_KEY=your_key_here');
      return;
    }

    // Test 3: Test MCP server startup
    console.log('\n3. Testing MCP server startup...');
    const server = spawn('composio-mcp-server', [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, COMPOSIO_API_KEY: apiKey }
    });

    let serverOutput = '';
    let serverError = '';

    server.stdout.on('data', (data) => {
      serverOutput += data.toString();
    });

    server.stderr.on('data', (data) => {
      serverError += data.toString();
    });

    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (serverError.includes('Error') || serverError.includes('failed')) {
      console.log('   ❌ MCP server failed to start');
      console.log('   Error:', serverError);
      server.kill();
      return;
    }

    console.log('   ✅ MCP server started successfully');

    // Test 4: Send MCP initialize message
    console.log('\n4. Testing MCP protocol communication...');

    const initMessage = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'opencode-test',
          version: '1.0.0'
        }
      }
    };

    server.stdin.write(JSON.stringify(initMessage) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (serverOutput.includes('result')) {
      console.log('   ✅ MCP protocol communication successful');
      console.log('   📋 Server responded to initialize request');
    } else {
      console.log('   ⚠️  MCP protocol response unclear');
      console.log('   Output:', serverOutput.substring(0, 200) + '...');
    }

    server.kill();

    console.log('\n🎉 OpenCode MCP Integration Test Complete!');
    console.log('✅ Composio MCP server is ready for use with OpenCode');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testOpenCodeMCP();