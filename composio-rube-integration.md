# Composio Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by operation type
- **Authentication**: Composio API key required
- **Scopes**: Platform management access
- **Thread Safety**: Operations are thread-safe

## Available Composio Tool Calls

### 1. COMPOSIO_CHECK_ACTIVE_CONNECTION
Checks if a connection is active.

**Parameters:**
```json
{
  "connection_id": "connection_id_string"
}
```

**Required Fields:**
- `connection_id`: The connection ID to check

### 2. COMPOSIO_CHECK_ACTIVE_CONNECTIONS
Lists all active connections.

**Parameters:**
```json
{
  "app_names": ["gmail", "notion"]
}
```

### 3. COMPOSIO_CREATE_PLAN
Creates an execution plan.

**Parameters:**
```json
{
  "name": "Plan Name",
  "description": "Plan description",
  "steps": [
    {
      "tool": "GMAIL_SEND_EMAIL",
      "parameters": {}
    }
  ]
}
```

**Required Fields:**
- `name`: Plan name
- `steps`: Array of execution steps

### 4. COMPOSIO_DOWNLOAD_S3_FILE
Downloads a file from S3.

**Parameters:**
```json
{
  "bucket": "bucket_name",
  "key": "file_key",
  "local_path": "/path/to/save"
}
```

**Required Fields:**
- `bucket`: S3 bucket name
- `key`: S3 object key
- `local_path`: Local file path

### 5. COMPOSIO_ENABLE_TRIGGER
Enables an automation trigger.

**Parameters:**
```json
{
  "trigger_id": "trigger_id_string"
}
```

**Required Fields:**
- `trigger_id`: The trigger ID to enable

### 6. COMPOSIO_EXECUTE_RECIPE
Executes a predefined recipe/workflow.

**Parameters:**
```json
{
  "recipe_id": "recipe_id_string",
  "parameters": {}
}
```

**Required Fields:**
- `recipe_id`: The recipe ID to execute

### 7. COMPOSIO_EXECUTE_TOOL
Executes a specific tool.

**Parameters:**
```json
{
  "tool_name": "GMAIL_SEND_EMAIL",
  "parameters": {
    "to": ["user@example.com"],
    "subject": "Test",
    "body": "Hello"
  }
}
```

**Required Fields:**
- `tool_name`: Name of the tool to execute
- `parameters`: Tool parameters

### 8. COMPOSIO_GET_DEPENDENCY_GRAPH
Gets tool dependency graph.

**Parameters:**
```json
{
  "tool_name": "GMAIL_SEND_EMAIL"
}
```

**Required Fields:**
- `tool_name`: The tool name

### 9. COMPOSIO_GET_RECIPE_DETAILS
Gets details of a recipe.

**Parameters:**
```json
{
  "recipe_id": "recipe_id_string"
}
```

**Required Fields:**
- `recipe_id`: The recipe ID

### 10. COMPOSIO_GET_REQUIRED_PARAMETERS
Gets required parameters for a tool.

**Parameters:**
```json
{
  "tool_name": "GMAIL_SEND_EMAIL"
}
```

**Required Fields:**
- `tool_name`: The tool name

### 11. COMPOSIO_GET_RESPONSE_SCHEMA
Gets response schema for a tool.

**Parameters:**
```json
{
  "tool_name": "GMAIL_SEND_EMAIL"
}
```

**Required Fields:**
- `tool_name`: The tool name

### 12. COMPOSIO_INITIATE_CONNECTION
Initiates a new connection.

**Parameters:**
```json
{
  "app_name": "gmail",
  "auth_mode": "OAUTH2",
  "redirect_uri": "https://example.com/callback"
}
```

**Required Fields:**
- `app_name`: Application name
- `auth_mode`: Authentication mode

### 13. COMPOSIO_LIST_TOOLKITS
Lists available toolkits.

**Parameters:**
```json
{
  "category": "communication|productivity"
}
```

### 14. COMPOSIO_LIST_TRIGGERS
Lists available automation triggers.

**Parameters:**
```json
{
  "app_name": "gmail"
}
```

### 15. COMPOSIO_MANAGE_CONNECTIONS
Manages connections (list, update, delete).

**Parameters:**
```json
{
  "action": "list|update|delete",
  "connection_id": "connection_id_string",
  "updates": {}
}
```

**Required Fields:**
- `action`: Management action

### 16. COMPOSIO_MULTI_EXECUTE_TOOL
Executes multiple tools in sequence.

**Parameters:**
```json
{
  "executions": [
    {
      "tool_name": "GMAIL_SEND_EMAIL",
      "parameters": {}
    },
    {
      "tool_name": "GOOGLECALENDAR_CREATE_EVENT",
      "parameters": {}
    }
  ]
}
```

**Required Fields:**
- `executions`: Array of tool executions

### 17. COMPOSIO_REMOTE_BASH_TOOL
Executes remote bash commands.

**Parameters:**
```json
{
  "command": "ls -la",
  "host": "remote-server.com",
  "working_directory": "/home/user"
}
```

**Required Fields:**
- `command`: Bash command to execute
- `host`: Remote host

### 18. COMPOSIO_REMOTE_WORKBENCH
Accesses remote development workbench.

**Parameters:**
```json
{
  "action": "create|list|delete",
  "workbench_id": "workbench_id_string",
  "config": {}
}
```

**Required Fields:**
- `action`: Workbench action

### 19. COMPOSIO_SEARCH_TOOLS
Searches for available tools.

**Parameters:**
```json
{
  "query": "email",
  "category": "communication"
}
```

**Required Fields:**
- `query`: Search query

### 20. COMPOSIO_WAIT_FOR_CONNECTION
Waits for a connection to be established.

**Parameters:**
```json
{
  "connection_id": "connection_id_string",
  "timeout": 300
}
```

**Required Fields:**
- `connection_id`: The connection ID

### 21. COMPOSIO_CREATE_UPDATE_RECIPE
Creates or updates a recipe/workflow.

**Parameters:**
```json
{
  "recipe_id": "recipe_id_string",
  "name": "Recipe Name",
  "description": "Recipe description",
  "steps": [],
  "triggers": []
}
```

**Required Fields:**
- `name`: Recipe name
- `steps`: Recipe steps

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('COMPOSIO_EXECUTE_TOOL', {
  tool_name: 'GMAIL_SEND_EMAIL',
  parameters: {
    to: ['user@example.com'],
    subject: 'Hello',
    body: 'Message content'
  }
});
```

## Simplifying Composio Tool Calls

### Helper Functions
```javascript
async function executeTool(toolName, parameters) {
  return await callRubeTool('COMPOSIO_EXECUTE_TOOL', {
    tool_name: toolName,
    parameters
  });
}

async function createConnection(appName, authMode = 'OAUTH2') {
  return await callRubeTool('COMPOSIO_INITIATE_CONNECTION', {
    app_name: appName,
    auth_mode: authMode
  });
}

async function listActiveConnections() {
  return await callRubeTool('COMPOSIO_CHECK_ACTIVE_CONNECTIONS', {});
}

async function searchTools(query, category = null) {
  const params = { query };
  if (category) params.category = category;
  return await callRubeTool('COMPOSIO_SEARCH_TOOLS', params);
}

async function createWorkflow(name, steps, triggers = []) {
  return await callRubeTool('COMPOSIO_CREATE_UPDATE_RECIPE', {
    name,
    description: `Workflow: ${name}`,
    steps,
    triggers
  });
}
```

### Workflow Automation Example
```javascript
async function setupEmailNotificationWorkflow() {
  // Create a workflow that sends email notifications
  const workflow = await createWorkflow('Email Notifications', [
    {
      tool: 'GMAIL_SEND_EMAIL',
      parameters: {
        to: ['{{recipient}}'],
        subject: '{{subject}}',
        body: '{{message}}'
      }
    }
  ]);

  // Set up trigger for new events
  await callRubeTool('COMPOSIO_ENABLE_TRIGGER', {
    trigger_id: workflow.triggers[0].id
  });

  return workflow;
}
```

### Multi-Tool Execution Example
```javascript
async function processNewUser(userData) {
  // Execute multiple tools in sequence
  const results = await callRubeTool('COMPOSIO_MULTI_EXECUTE_TOOL', {
    executions: [
      {
        tool_name: 'SUPABASE_SELECT_FROM_TABLE',
        parameters: {
          project_ref: 'my-project',
          table: 'users',
          columns: ['id', 'email']
        }
      },
      {
        tool_name: 'GMAIL_SEND_EMAIL',
        parameters: {
          to: [userData.email],
          subject: 'Welcome!',
          body: 'Welcome to our platform!'
        }
      },
      {
        tool_name: 'GOOGLECALENDAR_CREATE_EVENT',
        parameters: {
          calendar_id: 'primary',
          summary: 'Onboarding Call',
          start: { date_time: '2024-01-01T10:00:00Z' },
          end: { date_time: '2024-01-01T11:00:00Z' }
        }
      }
    ]
  });

  return results;
}
```

### Connection Management Example
```javascript
async function setupIntegrations() {
  const requiredApps = ['gmail', 'notion', 'googlecalendar'];

  for (const app of requiredApps) {
    // Check if connection exists
    const connections = await listActiveConnections();
    const existing = connections.find(c => c.app_name === app);

    if (!existing) {
      // Create new connection
      const connection = await createConnection(app);
      console.log(`Created connection for ${app}: ${connection.id}`);

      // Wait for user to authorize
      await callRubeTool('COMPOSIO_WAIT_FOR_CONNECTION', {
        connection_id: connection.id,
        timeout: 600
      });
    }
  }
}
```