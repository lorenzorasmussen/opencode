# Mem0 Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by operation type
- **Authentication**: Mem0 API key required
- **Scopes**: Memory read/write access
- **Thread Safety**: Operations are thread-safe

## Available Mem0 Tool Calls

### 1. MEM0_ADD_MEMBER_TO_PROJECT
Adds a member to a project.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "user_id": "user_id_string",
  "role": "member|admin"
}
```

**Required Fields:**
- `project_id`: The project ID
- `user_id`: The user ID to add
- `role`: The role for the member

### 2. MEM0_ADD_NEW_MEMORY_RECORDS
Creates new memory records.

**Parameters:**
```json
{
  "memories": [
    {
      "content": "Memory content",
      "metadata": {"key": "value"}
    }
  ],
  "user_id": "user_id_string"
}
```

**Required Fields:**
- `memories`: Array of memory objects
- `user_id`: The user ID

### 3. MEM0_ADD_ORGANIZATION_MEMBER
Adds a member to an organization.

**Parameters:**
```json
{
  "organization_id": "org_id_string",
  "user_id": "user_id_string",
  "role": "member|admin"
}
```

**Required Fields:**
- `organization_id`: The organization ID
- `user_id`: The user ID to add
- `role`: The role for the member

### 4. MEM0_CREATE_A_NEW_AGENT
Creates a new AI agent.

**Parameters:**
```json
{
  "name": "Agent Name",
  "instructions": "Agent instructions",
  "model": "gpt-4",
  "tools": ["tool1", "tool2"]
}
```

**Required Fields:**
- `name`: Agent name
- `instructions`: Agent instructions

### 5. MEM0_CREATE_A_NEW_AGENT_RUN
Runs an existing agent.

**Parameters:**
```json
{
  "agent_id": "agent_id_string",
  "input": "Input for the agent",
  "session_id": "session_id_string"
}
```

**Required Fields:**
- `agent_id`: The agent ID
- `input`: Input for the agent

### 6. MEM0_CREATE_A_NEW_APPLICATION
Creates a new application.

**Parameters:**
```json
{
  "name": "Application Name",
  "description": "Application description",
  "type": "web|mobile|api"
}
```

**Required Fields:**
- `name`: Application name
- `description`: Application description

### 7. MEM0_CREATE_A_NEW_ORGANIZATION_ENTRY
Creates a new organization.

**Parameters:**
```json
{
  "name": "Organization Name",
  "description": "Organization description"
}
```

**Required Fields:**
- `name`: Organization name

### 8. MEM0_CREATE_A_NEW_USER
Creates a new user.

**Parameters:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "metadata": {"key": "value"}
}
```

**Required Fields:**
- `email`: User email
- `name`: User name

### 9. MEM0_CREATE_AN_EXPORT_JOB_WITH_SCHEMA
Creates an export job with schema.

**Parameters:**
```json
{
  "filters": {"user_id": "user123"},
  "schema": {"field1": "type1"},
  "format": "json|csv"
}
```

**Required Fields:**
- `filters`: Export filters
- `schema`: Data schema

### 10. MEM0_CREATE_MEMORY_ENTRY
Creates a memory entry.

**Parameters:**
```json
{
  "content": "Memory content",
  "user_id": "user_id_string",
  "metadata": {"key": "value"}
}
```

**Required Fields:**
- `content`: Memory content
- `user_id`: The user ID

### 11. MEM0_CREATE_PROJECT
Creates a new project.

**Parameters:**
```json
{
  "name": "Project Name",
  "organization_id": "org_id_string",
  "description": "Project description"
}
```

**Required Fields:**
- `name`: Project name
- `organization_id`: Organization ID

### 12. MEM0_DELETE_AN_ORGANIZATION
Deletes an organization.

**Parameters:**
```json
{
  "organization_id": "org_id_string"
}
```

**Required Fields:**
- `organization_id`: The organization ID to delete

### 13. MEM0_DELETE_A_SPECIFIC_MEMORY_BY_ID
Deletes a specific memory by ID.

**Parameters:**
```json
{
  "memory_id": "memory_id_string"
}
```

**Required Fields:**
- `memory_id`: The memory ID to delete

### 14. MEM0_DELETE_ENTITY_BY_TYPE_AND_ID
Deletes an entity by type and ID.

**Parameters:**
```json
{
  "entity_type": "user|project|organization",
  "entity_id": "entity_id_string"
}
```

**Required Fields:**
- `entity_type`: Type of entity
- `entity_id`: The entity ID

### 15. MEM0_DELETE_MEMORIES_ENDPOINT
Deletes memories using filters.

**Parameters:**
```json
{
  "filters": {"user_id": "user123"},
  "delete_all": false
}
```

**Required Fields:**
- `filters`: Deletion filters

### 16. MEM0_DELETE_MEMORY_BATCH_WITH_UUIDS
Deletes multiple memories by UUIDs.

**Parameters:**
```json
{
  "memory_ids": ["id1", "id2", "id3"]
}
```

**Required Fields:**
- `memory_ids`: Array of memory IDs

### 17. MEM0_DELETE_PROJECT
Deletes a project.

**Parameters:**
```json
{
  "project_id": "project_id_string"
}
```

**Required Fields:**
- `project_id`: The project ID to delete

### 18. MEM0_DELETE_PROJECT_MEMBER
Removes a member from a project.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "user_id": "user_id_string"
}
```

**Required Fields:**
- `project_id`: The project ID
- `user_id`: The user ID to remove

### 19. MEM0_EXPORT_DATA_BASED_ON_FILTERS
Exports data based on filters.

**Parameters:**
```json
{
  "filters": {"user_id": "user123"},
  "include_metadata": true
}
```

**Required Fields:**
- `filters`: Export filters

### 20. MEM0_FETCH_DETAILED_LIST_OF_ORGANIZATIONS
Fetches detailed list of organizations.

**Parameters:**
```json
{
  "limit": 10,
  "offset": 0
}
```

### 21. MEM0_FETCH_DETAILS_OF_A_SPECIFIC_ORGANIZATION
Fetches details of a specific organization.

**Parameters:**
```json
{
  "organization_id": "org_id_string"
}
```

**Required Fields:**
- `organization_id`: The organization ID

### 22. MEM0_FETCH_LIST_OF_ENTITY_FILTERS
Fetches list of entity filters.

**Parameters:**
```json
{
  "entity_type": "user|project"
}
```

**Required Fields:**
- `entity_type`: Type of entity

### 23. MEM0_FETCH_SPECIFIC_ENTITY_DETAILS_WITH_OPTIONAL_FILTERS
Fetches entity details with optional filters.

**Parameters:**
```json
{
  "entity_type": "user",
  "entity_id": "entity_id_string",
  "filters": {"status": "active"}
}
```

**Required Fields:**
- `entity_type`: Type of entity
- `entity_id`: The entity ID

### 24. MEM0_GET_ORGANIZATION_MEMBERS
Gets organization members.

**Parameters:**
```json
{
  "organization_id": "org_id_string"
}
```

**Required Fields:**
- `organization_id`: The organization ID

### 25. MEM0_GET_PROJECT_DETAILS
Gets project details.

**Parameters:**
```json
{
  "project_id": "project_id_string"
}
```

**Required Fields:**
- `project_id`: The project ID

### 26. MEM0_GET_PROJECT_MEMBERS
Gets project members.

**Parameters:**
```json
{
  "project_id": "project_id_string"
}
```

**Required Fields:**
- `project_id`: The project ID

### 27. MEM0_GET_PROJECTS
Gets list of projects.

**Parameters:**
```json
{
  "organization_id": "org_id_string",
  "limit": 10
}
```

### 28. MEM0_GET_USER_MEMORY_STATS
Gets user memory statistics.

**Parameters:**
```json
{
  "user_id": "user_id_string"
}
```

**Required Fields:**
- `user_id`: The user ID

### 29. MEM0_LIST_ENTITIES_WITH_OPTIONAL_ORG_AND_PROJECT_FILTERS
Lists entities with optional filters.

**Parameters:**
```json
{
  "entity_type": "user",
  "organization_id": "org_id_string",
  "project_id": "project_id_string",
  "limit": 10
}
```

**Required Fields:**
- `entity_type`: Type of entity

### 30. MEM0_PERFORM_SEMANTIC_SEARCH_ON_MEMORIES
Performs semantic search on memories.

**Parameters:**
```json
{
  "query": "search query",
  "user_id": "user_id_string",
  "limit": 10
}
```

**Required Fields:**
- `query`: Search query
- `user_id`: The user ID

### 31. MEM0_REMOVE_A_MEMBER_FROM_THE_ORGANIZATION
Removes a member from an organization.

**Parameters:**
```json
{
  "organization_id": "org_id_string",
  "user_id": "user_id_string"
}
```

**Required Fields:**
- `organization_id`: The organization ID
- `user_id`: The user ID to remove

### 32. MEM0_RETRIEVE_ALL_EVENTS_FOR_THE_CURRENTLY_LOGGED_IN_USER
Retrieves all events for the current user.

**Parameters:**
```json
{
  "limit": 10,
  "offset": 0
}
```

### 33. MEM0_RETRIEVE_ENTITY_SPECIFIC_MEMORIES
Retrieves memories specific to an entity.

**Parameters:**
```json
{
  "entity_type": "user",
  "entity_id": "entity_id_string",
  "limit": 10
}
```

**Required Fields:**
- `entity_type`: Type of entity
- `entity_id`: The entity ID

### 34. MEM0_RETRIEVE_LIST_OF_MEMORY_EVENTS
Retrieves list of memory events.

**Parameters:**
```json
{
  "user_id": "user_id_string",
  "limit": 10
}
```

### 35. MEM0_RETRIEVE_MEMORY_BY_UNIQUE_IDENTIFIER
Retrieves memory by unique identifier.

**Parameters:**
```json
{
  "memory_id": "memory_id_string"
}
```

**Required Fields:**
- `memory_id`: The memory ID

### 36. MEM0_RETRIEVE_MEMORY_HISTORY_BY_ID
Retrieves memory history by ID.

**Parameters:**
```json
{
  "memory_id": "memory_id_string"
}
```

**Required Fields:**
- `memory_id`: The memory ID

### 37. MEM0_RETRIEVE_MEMORY_LIST
Retrieves list of memories.

**Parameters:**
```json
{
  "user_id": "user_id_string",
  "limit": 10,
  "offset": 0
}
```

### 38. MEM0_SEARCH_MEMORIES_WITH_QUERY_FILTERS
Searches memories with query and filters.

**Parameters:**
```json
{
  "query": "search query",
  "filters": {"category": "work"},
  "user_id": "user_id_string"
}
```

**Required Fields:**
- `query`: Search query

### 39. MEM0_UPDATE_MEMORY_BATCH_WITH_UUID
Updates multiple memories by UUID.

**Parameters:**
```json
{
  "updates": [
    {
      "memory_id": "id1",
      "content": "Updated content"
    }
  ]
}
```

**Required Fields:**
- `updates`: Array of memory updates

### 40. MEM0_UPDATE_MEMORY_DETAILS_BY_ID
Updates memory details by ID.

**Parameters:**
```json
{
  "memory_id": "memory_id_string",
  "content": "Updated content",
  "metadata": {"key": "new_value"}
}
```

**Required Fields:**
- `memory_id`: The memory ID

### 41. MEM0_UPDATE_ORGANIZATION_MEMBER_ROLE
Updates organization member role.

**Parameters:**
```json
{
  "organization_id": "org_id_string",
  "user_id": "user_id_string",
  "role": "admin|member"
}
```

**Required Fields:**
- `organization_id`: The organization ID
- `user_id`: The user ID
- `role`: New role

### 42. MEM0_UPDATE_PROJECT
Updates project details.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "name": "New Project Name",
  "description": "Updated description"
}
```

**Required Fields:**
- `project_id`: The project ID

### 43. MEM0_UPDATE_PROJECT_MEMBER_ROLE
Updates project member role.

**Parameters:**
```json
{
  "project_id": "project_id_string",
  "user_id": "user_id_string",
  "role": "admin|member"
}
```

**Required Fields:**
- `project_id`: The project ID
- `user_id`: The user ID
- `role`: New role

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('MEM0_CREATE_MEMORY_ENTRY', {
  content: 'User prefers morning meetings',
  user_id: 'user123',
  metadata: { category: 'preferences' }
});
```

## Simplifying Mem0 Tool Calls

### Helper Functions
```javascript
async function storeMemory(content, userId, metadata = {}) {
  return await callRubeTool('MEM0_CREATE_MEMORY_ENTRY', {
    content,
    user_id: userId,
    metadata
  });
}

async function searchMemories(query, userId, limit = 10) {
  return await callRubeTool('MEM0_PERFORM_SEMANTIC_SEARCH_ON_MEMORIES', {
    query,
    user_id: userId,
    limit
  });
}

async function getUserMemories(userId, limit = 20) {
  return await callRubeTool('MEM0_RETRIEVE_MEMORY_LIST', {
    user_id: userId,
    limit
  });
}

async function updateMemory(memoryId, content, metadata = {}) {
  return await callRubeTool('MEM0_UPDATE_MEMORY_DETAILS_BY_ID', {
    memory_id: memoryId,
    content,
    metadata
  });
}

async function createProject(name, orgId, description = '') {
  return await callRubeTool('MEM0_CREATE_PROJECT', {
    name,
    organization_id: orgId,
    description
  });
}
```

### Personal Knowledge Management Example
```javascript
async function rememberUserPreference(userId, preference, context) {
  const memory = `User ${preference} in ${context}`;
  return await storeMemory(memory, userId, {
    type: 'preference',
    context,
    timestamp: new Date().toISOString()
  });
}

async function getUserPreferences(userId) {
  const memories = await searchMemories('preferences OR likes OR prefers', userId);
  return memories.filter(memory =>
    memory.metadata.type === 'preference'
  );
}
```

### Project Memory System Example
```javascript
async function setupProjectMemory(projectId, userId) {
  // Create initial project memory
  await storeMemory(`Started working on project ${projectId}`, userId, {
    project_id: projectId,
    type: 'project_start'
  });

  // Set up recurring memory capture
  return {
    projectId,
    memoryCount: 1,
    lastUpdated: new Date().toISOString()
  };
}

async function captureProjectInsight(projectId, userId, insight) {
  return await storeMemory(insight, userId, {
    project_id: projectId,
    type: 'insight',
    timestamp: new Date().toISOString()
  });
}

async function getProjectMemories(projectId, userId) {
  const allMemories = await getUserMemories(userId, 100);
  return allMemories.filter(memory =>
    memory.metadata.project_id === projectId
  );
}
```