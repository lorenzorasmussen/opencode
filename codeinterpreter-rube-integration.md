# CodeInterpreter Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by code complexity and execution time
- **Authentication**: CodeInterpreter API access required
- **Scopes**: Code execution in isolated environments
- **Thread Safety**: Operations are thread-safe

## Available CodeInterpreter Tool Calls

### 1. CODEINTERPRETER_CREATE_SANDBOX
Creates a new sandboxed code execution environment.

**Parameters:**
```json
{
  "language": "python|javascript|bash",
  "timeout": 30,
  "memory_limit": "256MB"
}
```

**Required Fields:**
- `language`: Programming language for the sandbox

### 2. CODEINTERPRETER_EXECUTE_CODE
Executes code in a sandboxed environment.

**Parameters:**
```json
{
  "sandbox_id": "sandbox_id_string",
  "code": "print('Hello World')",
  "stdin": "input data",
  "timeout": 10
}
```

**Required Fields:**
- `sandbox_id`: The sandbox ID
- `code`: Code to execute

### 3. CODEINTERPRETER_GET_FILE_CMD
Retrieves a file from the sandbox environment.

**Parameters:**
```json
{
  "sandbox_id": "sandbox_id_string",
  "file_path": "/output.txt"
}
```

**Required Fields:**
- `sandbox_id`: The sandbox ID
- `file_path`: Path to the file in sandbox

### 4. CODEINTERPRETER_RUN_TERMINAL_CMD
Executes a terminal command in the sandbox.

**Parameters:**
```json
{
  "sandbox_id": "sandbox_id_string",
  "command": "ls -la",
  "working_directory": "/home/user",
  "timeout": 30
}
```

**Required Fields:**
- `sandbox_id`: The sandbox ID
- `command`: Terminal command to execute

### 5. CODEINTERPRETER_UPLOAD_FILE_CMD
Uploads a file to the sandbox environment.

**Parameters:**
```json
{
  "sandbox_id": "sandbox_id_string",
  "file_path": "/input.txt",
  "content": "file content here"
}
```

**Required Fields:**
- `sandbox_id`: The sandbox ID
- `file_path`: Destination path in sandbox
- `content`: File content

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('CODEINTERPRETER_EXECUTE_CODE', {
  sandbox_id: 'my-sandbox',
  code: 'print("Hello from sandbox!")'
});
```

## Simplifying CodeInterpreter Tool Calls

### Helper Functions
```javascript
async function createSandbox(language = 'python', options = {}) {
  return await callRubeTool('CODEINTERPRETER_CREATE_SANDBOX', {
    language,
    timeout: 30,
    memory_limit: '256MB',
    ...options
  });
}

async function executeCode(sandboxId, code, options = {}) {
  return await callRubeTool('CODEINTERPRETER_EXECUTE_CODE', {
    sandbox_id: sandboxId,
    code,
    timeout: 10,
    ...options
  });
}

async function runCommand(sandboxId, command, options = {}) {
  return await callRubeTool('CODEINTERPRETER_RUN_TERMINAL_CMD', {
    sandbox_id: sandboxId,
    command,
    working_directory: '/home/user',
    timeout: 30,
    ...options
  });
}

async function uploadFile(sandboxId, filePath, content) {
  return await callRubeTool('CODEINTERPRETER_UPLOAD_FILE_CMD', {
    sandbox_id: sandboxId,
    file_path: filePath,
    content
  });
}

async function downloadFile(sandboxId, filePath) {
  return await callRubeTool('CODEINTERPRETER_GET_FILE_CMD', {
    sandbox_id: sandboxId,
    file_path: filePath
  });
}
```

### Code Execution Example
```javascript
async function runPythonScript(code, inputData = '') {
  // Create a Python sandbox
  const sandbox = await createSandbox('python');

  // Execute the code
  const result = await executeCode(sandbox.id, code, {
    stdin: inputData
  });

  return {
    sandboxId: sandbox.id,
    output: result.stdout,
    error: result.stderr,
    exitCode: result.exit_code
  };
}

async function testCodeSnippet(code) {
  const result = await runPythonScript(`
import sys
${code}
print("Code executed successfully")
  `);

  return result;
}
```

### File Processing Example
```javascript
async function processDataFile(data, processingScript) {
  // Create sandbox
  const sandbox = await createSandbox('python');

  // Upload data file
  await uploadFile(sandbox.id, '/data.txt', data);

  // Upload processing script
  await uploadFile(sandbox.id, '/process.py', processingScript);

  // Execute processing
  const result = await executeCode(sandbox.id, `
with open('/data.txt', 'r') as f:
    data = f.read()

# Process data here
processed_data = data.upper()  # Example processing

with open('/output.txt', 'w') as f:
    f.write(processed_data)
  `);

  // Download result
  const output = await downloadFile(sandbox.id, '/output.txt');

  return output.content;
}
```

### Development Environment Example
```javascript
async function setupDevEnvironment(language) {
  const sandbox = await createSandbox(language);

  // Install dependencies based on language
  if (language === 'python') {
    await runCommand(sandbox.id, 'pip install requests pandas numpy');
  } else if (language === 'javascript') {
    await runCommand(sandbox.id, 'npm install axios lodash');
  }

  // Create a simple test file
  const testCode = language === 'python'
    ? 'print("Hello from Python environment!")'
    : 'console.log("Hello from JavaScript environment!");';

  await uploadFile(sandbox.id, '/test.js', testCode);

  // Run the test
  const result = await executeCode(sandbox.id, testCode);

  return {
    sandboxId: sandbox.id,
    language,
    testResult: result
  };
}
```