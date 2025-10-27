#!/usr/bin/env node

/**
 * Get Actual Tools from Composio MCP Server
 * Connects to the local MCP server and lists all available tools
 */

import { spawn } from 'child_process';

async function getMcpTools() {
  console.log('🔧 Getting actual tools from Composio MCP Server...\n');

  try {
    // Start the MCP server
    const server = spawn('npx', ['composio-mcp-server'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, COMPOSIO_API_KEY: process.env.COMPOSIO_API_KEY || 'dummy-key' }
    });

    let serverOutput = '';
    let serverError = '';

    server.stdout.on('data', (data) => {
      serverOutput += data.toString();
    });

    server.stderr.on('data', (data) => {
      serverError += data.toString();
    });

    // Wait for server to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (serverError.includes('Error') || serverError.includes('COMPOSIO_API_KEY is not set')) {
      console.error('❌ Server failed to start:', serverError);
      server.kill();
      return;
    }

    console.log('✅ MCP server started successfully');

    // Send initialize message
    const initMessage = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'opencode-tools-query',
          version: '1.0.0'
        }
      }
    };

    console.log('📤 Sending initialize request...');
    server.stdin.write(JSON.stringify(initMessage) + '\n');

    // Wait for initialize response
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send tools/list request
    const toolsMessage = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    };

    console.log('📤 Requesting tools list...');
    server.stdin.write(JSON.stringify(toolsMessage) + '\n');

    // Wait for tools response
    await new Promise(resolve => setTimeout(resolve, 5000));

    server.kill();

    // Parse the output
    console.log('\n📋 Parsing server response...\n');

    const lines = serverOutput.trim().split('\n');
    let tools = [];

    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        if (response.id === 2 && response.result && response.result.tools) {
          tools = response.result.tools;
          break;
        }
      } catch (e) {
        // Skip non-JSON lines
      }
    }

    if (tools.length === 0) {
      console.log('❌ No tools found in response');
      console.log('Raw output:', serverOutput);
      return;
    }

    console.log(`🎯 Found ${tools.length} tools available:\n`);

    // Group tools by category
    const categories = {};
    tools.forEach(tool => {
      const category = tool.name.split('_')[0].toUpperCase();
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(tool);
    });

    // Display tools by category
    Object.keys(categories).sort().forEach(category => {
      console.log(`📁 ${category} (${categories[category].length} tools):`);
      categories[category].slice(0, 5).forEach(tool => {
        console.log(`   • ${tool.name}: ${tool.description || 'No description'}`);
      });
      if (categories[category].length > 5) {
        console.log(`   ... and ${categories[category].length - 5} more`);
      }
      console.log('');
    });

    console.log(`\n📊 Total: ${tools.length} tools across ${Object.keys(categories).length} categories`);

    // Show sample tool details
    if (tools.length > 0) {
      console.log('\n🔍 Sample tool details:');
      const sampleTool = tools[0];
      console.log(`Name: ${sampleTool.name}`);
      console.log(`Description: ${sampleTool.description}`);
      if (sampleTool.inputSchema) {
        console.log(`Input Schema: ${JSON.stringify(sampleTool.inputSchema, null, 2)}`);
      }
    }

  } catch (error) {
    console.error('❌ Error getting MCP tools:', error.message);
  }
}

getMcpTools();