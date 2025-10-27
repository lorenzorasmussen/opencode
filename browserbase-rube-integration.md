# Browserbase Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by plan (typically 100-1000 sessions/hour)
- **Authentication**: Browserbase API key required
- **Scopes**: Browser session management and web automation
- **Thread Safety**: Operations are thread-safe

## Available Browserbase Tool Calls

### 1. BROWSERBASE_TOOL_CONTEXTS_CREATE
Creates a new browser context.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "name": "Context Name",
  "browser_settings": {}
}
```

**Required Fields:**
- `project_id`: The project ID

### 2. BROWSERBASE_TOOL_CONTEXTS_GET
Gets information about a browser context.

**Parameters:**
```json
{
  "context_id": "context_id_string"
}
```

**Required Fields:**
- `context_id`: The context ID

### 3. BROWSERBASE_TOOL_CONTEXTS_UPDATE
Updates a browser context.

**Parameters:**
```json
{
  "context_id": "context_id_string",
  "name": "New Context Name",
  "browser_settings": {}
}
```

**Required Fields:**
- `context_id`: The context ID

### 4. BROWSERBASE_TOOL_CREATE_BROWSER_SESSION
Creates a new browser session.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "context_id": "context_id_string",
  "extensions": ["extension_id"],
  "proxies": []
}
```

**Required Fields:**
- `project_id`: The project ID

### 5. BROWSERBASE_TOOL_SESSIONS_GET
Gets information about a browser session.

**Parameters:**
```json
{
  "session_id": "session_id_string"
}
```

**Required Fields:**
- `session_id`: The session ID

### 6. BROWSERBASE_TOOL_SESSIONS_GET_DEBUG
Gets debug information for a session.

**Parameters:**
```json
{
  "session_id": "session_id_string"
}
```

**Required Fields:**
- `session_id`: The session ID

### 7. BROWSERBASE_TOOL_SESSIONS_GET_DOWNLOADS
Gets downloaded files from a session.

**Parameters:**
```json
{
  "session_id": "session_id_string"
}
```

**Required Fields:**
- `session_id`: The session ID

### 8. BROWSERBASE_TOOL_SESSIONS_GET_LOGS
Gets logs from a browser session.

**Parameters:**
```json
{
  "session_id": "session_id_string",
  "level": "info|error|debug"
}
```

**Required Fields:**
- `session_id`: The session ID

### 9. BROWSERBASE_TOOL_SESSIONS_LIST
Lists browser sessions.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "status": "running|completed",
  "limit": 10
}
```

### 10. BROWSERBASE_TOOL_SESSIONS_UPDATE
Updates a browser session.

**Parameters:**
```json
{
  "session_id": "session_id_string",
  "status": "running|paused|stopped"
}
```

**Required Fields:**
- `session_id`: The session ID

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('BROWSERBASE_TOOL_CREATE_BROWSER_SESSION', {
  project_id: 'my-project-id',
  context_id: 'my-context-id'
});
```

## Simplifying Browserbase Tool Calls

### Helper Functions
```javascript
async function createBrowserSession(projectId, contextId = null, options = {}) {
  const params = { project_id: projectId };
  if (contextId) params.context_id = contextId;
  return await callRubeTool('BROWSERBASE_TOOL_CREATE_BROWSER_SESSION', {
    ...params,
    ...options
  });
}

async function getSessionInfo(sessionId) {
  return await callRubeTool('BROWSERBASE_TOOL_SESSIONS_GET', {
    session_id: sessionId
  });
}

async function createContext(projectId, name, settings = {}) {
  return await callRubeTool('BROWSERBASE_TOOL_CONTEXTS_CREATE', {
    project_id: projectId,
    name,
    browser_settings: settings
  });
}

async function listSessions(projectId, status = null) {
  const params = { project_id: projectId };
  if (status) params.status = status;
  return await callRubeTool('BROWSERBASE_TOOL_SESSIONS_LIST', params);
}

async function getSessionLogs(sessionId, level = 'info') {
  return await callRubeTool('BROWSERBASE_TOOL_SESSIONS_GET_LOGS', {
    session_id: sessionId,
    level
  });
}
```

### Web Scraping Automation Example
```javascript
async function scrapeWebsite(url, selectors) {
  // Create a browser session
  const session = await createBrowserSession('my-project-id');

  // In a real implementation, you would use the session to navigate and scrape
  // This is a simplified example showing the Browserbase workflow

  console.log(`Created session: ${session.id}`);

  // Get session info
  const info = await getSessionInfo(session.id);
  console.log('Session status:', info.status);

  // Get logs if needed
  const logs = await getSessionLogs(session.id);
  console.log('Session logs:', logs);

  return {
    sessionId: session.id,
    status: info.status,
    logs
  };
}
```

### Session Management Example
```javascript
async function manageBrowserSessions(projectId) {
  // List all running sessions
  const runningSessions = await listSessions(projectId, 'running');
  console.log(`Found ${runningSessions.length} running sessions`);

  // Create a new context for testing
  const context = await createContext(projectId, 'Test Context', {
    viewport: { width: 1920, height: 1080 },
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  // Create a session with the new context
  const session = await createBrowserSession(projectId, context.id, {
    extensions: ['ublock-origin'],
    proxies: []
  });

  return {
    contextId: context.id,
    sessionId: session.id,
    runningSessions: runningSessions.length
  };
}
```

### Debug and Monitoring Example
```javascript
async function debugSession(sessionId) {
  // Get debug information
  const debugInfo = await callRubeTool('BROWSERBASE_TOOL_SESSIONS_GET_DEBUG', {
    session_id: sessionId
  });

  // Get downloaded files
  const downloads = await callRubeTool('BROWSERBASE_TOOL_SESSIONS_GET_DOWNLOADS', {
    session_id: sessionId
  });

  // Get all logs
  const logs = await getSessionLogs(sessionId, 'debug');

  return {
    debug: debugInfo,
    downloads,
    logs
  };
}

async function monitorSessions(projectId) {
  const sessions = await listSessions(projectId);

  for (const session of sessions) {
    if (session.status === 'running') {
      const logs = await getSessionLogs(session.id, 'error');
      if (logs.length > 0) {
        console.log(`Session ${session.id} has errors:`, logs);
      }
    }
  }

  return sessions;
}
```