const { spawn } = require('child_process');

const acpProcess = spawn('bun', ['run', 'opencode', 'acp'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'inherit'],
});

let response = '';

acpProcess.stdout.on('data', (data) => {
  response += data.toString();
  console.log('Received:', data.toString());
});

acpProcess.on('close', (code) => {
  console.log('Process exited with code:', code);
});

// Send initialize
const initMessage = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { protocolVersion: 1 },
};

acpProcess.stdin.write(JSON.stringify(initMessage) + '\n');

// Wait a bit then send session/new
setTimeout(() => {
  const sessionMessage = {
    jsonrpc: "2.0",
    id: 2,
    method: "session/new",
    params: {
      cwd: process.cwd(),
      mcpServers: [],
    },
  };

  acpProcess.stdin.write(JSON.stringify(sessionMessage) + '\n');
  
  // End stdin after a delay
  setTimeout(() => {
    acpProcess.stdin.end();
  }, 1000);
}, 100);
