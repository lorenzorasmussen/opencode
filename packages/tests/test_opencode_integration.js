const { spawn } = require('child_process');

// Test OpenCode MCP integration
console.log('🧪 Testing OpenCode MCP Integration\n');

const opencode = spawn('opencode', ['run', 'list files in current directory'], {
    cwd: '/Users/lorenzorasmussen/.config/opencode',
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        PERPLEXITY_API_KEY: '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',
        BRAVE_API_KEY: 'BSA0K6XKVBTS0gNI0KX_J3odZAOyJMs',
        GITHUB_PERSONAL_ACCESS_TOKEN: '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',
        NOTION_TOKEN: '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',
        NOTION_WORKSPACE_ID: '28efaddf-df54-43be-9688-584f768f4b3d'
    }
});

let output = '';
let errorOutput = '';

opencode.stdout.on('data', (data) => {
    output += data.toString();
    console.log('OpenCode Output:', data.toString());
});

opencode.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.log('OpenCode Error:', data.toString());
});

opencode.on('close', (code) => {
    console.log(`\nOpenCode exited with code ${code}`);
    if (output.includes('files') || output.includes('directory')) {
        console.log('✅ MCP integration working!');
    } else {
        console.log('❌ MCP integration not working');
        console.log('Output:', output);
        console.log('Errors:', errorOutput);
    }
});

// Timeout after 10 seconds
setTimeout(() => {
    opencode.kill();
    console.log('\n⏰ Test timed out');
}, 10000);