# Supabase Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by operation type (database queries vs. project management)
- **Authentication**: Supabase project API keys required
- **Scopes**: Project-specific access based on API key permissions
- **Thread Safety**: Operations are thread-safe

## Available Supabase Tool Calls

### 1. SUPABASE_ALPHA_CREATES_A_NEW_API_KEY_FOR_THE_PROJECT
Creates a new API key for a Supabase project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "name": "API Key Name",
  "type": "publishable|secret"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `name`: Name for the API key
- `type`: Type of API key

### 2. SUPABASE_ALPHA_DELETES_AN_API_KEY_FOR_THE_PROJECT
Deletes an API key from a Supabase project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "api_key_id": "key_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `api_key_id`: The API key ID to delete

### 3. SUPABASE_ALPHA_GET_A_THIRD_PARTY_INTEGRATION
Retrieves information about a third-party integration.

**Parameters:**
```json
{
  "integration_id": "integration_id"
}
```

**Required Fields:**
- `integration_id`: The integration ID

### 4. SUPABASE_ALPHA_LISTS_ALL_THIRD_PARTY_AUTH_INTEGRATIONS
Lists all third-party authentication integrations.

**Parameters:**
```json
{}
```

### 5. SUPABASE_ALPHA_REMOVES_A_THIRD_PARTY_AUTH_INTEGRATION
Removes a third-party authentication integration.

**Parameters:**
```json
{
  "integration_id": "integration_id"
}
```

**Required Fields:**
- `integration_id`: The integration ID to remove

### 6. SUPABASE_ALPHA_UPDATES_AN_API_KEY_FOR_THE_PROJECT
Updates an existing API key for a Supabase project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "api_key_id": "key_id",
  "name": "New Key Name"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `api_key_id`: The API key ID

### 7. SUPABASE_BETA_ACTIVATES_A_CUSTOM_HOSTNAME_FOR_A_PROJECT
Activates a custom hostname for a Supabase project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "custom_hostname": "example.com"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `custom_hostname`: The custom hostname to activate

### 8. SUPABASE_BETA_ACTIVATES_A_VANITY_SUBDOMAIN_FOR_A_PROJECT
Activates a vanity subdomain for a Supabase project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "vanity_subdomain": "mysubdomain"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `vanity_subdomain`: The vanity subdomain

### 9. SUPABASE_BETA_AUTHORIZE_USER_THROUGH_OAUTH
Authorizes a user through OAuth.

**Parameters:**
```json
{
  "provider": "google|github|discord",
  "redirect_to": "redirect_url"
}
```

**Required Fields:**
- `provider`: OAuth provider
- `redirect_to`: Redirect URL

### 10. SUPABASE_BETA_CHECKS_VANITY_SUBDOMAIN_AVAILABILITY
Checks if a vanity subdomain is available.

**Parameters:**
```json
{
  "subdomain": "desired_subdomain"
}
```

**Required Fields:**
- `subdomain`: The subdomain to check

### 11. SUPABASE_BETA_ENABLES_DATABASE_WEBHOOKS_ON_THE_PROJECT
Enables database webhooks for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 12. SUPABASE_BETA_GET_PROJECT_S_SSL_ENFORCEMENT_CONFIGURATION
Gets SSL enforcement configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 13. SUPABASE_BETA_GETS_CURRENT_VANITY_SUBDOMAIN_CONFIG
Gets current vanity subdomain configuration.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 14. SUPABASE_BETA_GETS_PROJECT_S_CUSTOM_HOSTNAME_CONFIG
Gets custom hostname configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 15. SUPABASE_BETA_GETS_PROJECT_S_NETWORK_BANS
Gets network bans for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 16. SUPABASE_BETA_GETS_PROJECT_S_NETWORK_RESTRICTIONS
Gets network restrictions for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 17. SUPABASE_BETA_GETS_PROJECT_S_PGSODIUM_CONFIG
Gets pgsodium configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 18. SUPABASE_BETA_REMOVE_A_READ_REPLICA
Removes a read replica from a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "replica_id": "replica_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `replica_id`: The replica ID to remove

### 19. SUPABASE_BETA_REMOVE_NETWORK_BANS
Removes network bans from a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "ban_ids": ["ban_id_1", "ban_id_2"]
}
```

**Required Fields:**
- `project_ref`: The project reference
- `ban_ids`: Array of ban IDs to remove

### 20. SUPABASE_BETA_RUN_SQL_QUERY
Executes a SQL query on the database.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "query": "SELECT * FROM users"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `query`: The SQL query to execute

### 21. SUPABASE_BETA_SET_UP_A_READ_REPLICA
Sets up a read replica for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "region": "us-east-1"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `region`: The region for the replica

### 22. SUPABASE_BETA_UPDATES_PROJECT_S_NETWORK_RESTRICTIONS
Updates network restrictions for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "allowed_ips": ["192.168.1.0/24"]
}
```

**Required Fields:**
- `project_ref`: The project reference

### 23. SUPABASE_BETA_UPGRADES_THE_PROJECT_S_POSTGRES_VERSION
Upgrades the PostgreSQL version for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "target_version": "15"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `target_version`: Target PostgreSQL version

### 24. SUPABASE_CONFIG_PGSODIUM_UPDATE_WITH_ROOT_KEY_WARNING
Updates pgsodium configuration with root key warning.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "config": {}
}
```

**Required Fields:**
- `project_ref`: The project reference

### 25. SUPABASE_CREATE_A_DATABASE_BRANCH
Creates a database branch.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "name": "branch_name",
  "parent_branch": "main"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `name`: Branch name

### 26. SUPABASE_CREATE_A_FUNCTION
Creates an edge function.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "name": "function_name",
  "body": "function code"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `name`: Function name
- `body`: Function code

### 27. SUPABASE_CREATE_AN_ORGANIZATION
Creates a new organization.

**Parameters:**
```json
{
  "name": "Organization Name",
  "billing_email": "billing@example.com"
}
```

**Required Fields:**
- `name`: Organization name
- `billing_email`: Billing email address

### 28. SUPABASE_CREATE_A_PROJECT
Creates a new Supabase project.

**Parameters:**
```json
{
  "name": "Project Name",
  "organization_id": "org_id",
  "region": "us-east-1",
  "plan": "free|pro|team"
}
```

**Required Fields:**
- `name`: Project name
- `organization_id`: Organization ID
- `region`: Deployment region

### 29. SUPABASE_CREATES_A_NEW_SSO_PROVIDER
Creates a new SSO provider.

**Parameters:**
```json
{
  "organization_id": "org_id",
  "type": "saml|oidc",
  "metadata": {}
}
```

**Required Fields:**
- `organization_id`: Organization ID
- `type`: SSO provider type

### 30. SUPABASE_CREATES_A_NEW_THIRD_PARTY_AUTH_INTEGRATION
Creates a new third-party auth integration.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "provider": "google|github",
  "config": {}
}
```

**Required Fields:**
- `project_ref`: The project reference
- `provider`: Auth provider

### 31. SUPABASE_CUSTOM_HOSTNAME_DNS_VERIFICATION
Verifies DNS for custom hostname.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "custom_hostname": "example.com"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `custom_hostname`: The custom hostname

### 32. SUPABASE_DELETE_A_DATABASE_BRANCH
Deletes a database branch.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "branch_id": "branch_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `branch_id`: The branch ID to delete

### 33. SUPABASE_DELETE_A_FUNCTION
Deletes an edge function.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "function_id": "function_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `function_id`: The function ID to delete

### 34. SUPABASE_DELETE_CUSTOM_HOSTNAME_CONFIG
Deletes custom hostname configuration.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 35. SUPABASE_DELETE_PROJECT_VANITY_SUBDOMAIN
Deletes project vanity subdomain.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 36. SUPABASE_DELETES_THE_GIVEN_PROJECT
Deletes a Supabase project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 37. SUPABASE_DEPLOY_FUNCTION
Deploys an edge function.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "function_id": "function_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `function_id`: The function ID to deploy

### 38. SUPABASE_DISABLE_PROJECT_READONLY
Disables readonly mode for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 39. SUPABASE_DISABLES_PREVIEW_BRANCHING
Disables preview branching for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 40. SUPABASE_EXCHANGE_O_AUTH_TOKEN
Exchanges an OAuth token.

**Parameters:**
```json
{
  "provider_token": "oauth_token",
  "provider": "google|github"
}
```

**Required Fields:**
- `provider_token`: The OAuth token
- `provider`: OAuth provider

### 41. SUPABASE_GENERATE_TYPE_SCRIPT_TYPES
Generates TypeScript types for the database.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 42. SUPABASE_GET_DATABASE_BRANCH_CONFIG
Gets database branch configuration.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "branch_id": "branch_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `branch_id`: The branch ID

### 43. SUPABASE_GET_PROJECT_API_KEYS
Gets API keys for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 44. SUPABASE_GET_PROJECT_S_PGBOUNCER_CONFIG
Gets pgbouncer configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 45. SUPABASE_GET_PROJECT_UPGRADE_ELIGIBILITY
Gets project upgrade eligibility.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 46. SUPABASE_GET_PROJECT_UPGRADE_STATUS
Gets project upgrade status.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 47. SUPABASE_GETS_A_SPECIFIC_SQL_SNIPPET
Gets a specific SQL snippet.

**Parameters:**
```json
{
  "snippet_id": "snippet_id"
}
```

**Required Fields:**
- `snippet_id`: The SQL snippet ID

### 48. SUPABASE_GETS_A_SSO_PROVIDER_BY_ITS_UUID
Gets an SSO provider by UUID.

**Parameters:**
```json
{
  "provider_id": "provider_uuid"
}
```

**Required Fields:**
- `provider_id`: The SSO provider UUID

### 49. SUPABASE_GETS_INFORMATION_ABOUT_THE_ORGANIZATION
Gets information about an organization.

**Parameters:**
```json
{
  "organization_id": "org_id"
}
```

**Required Fields:**
- `organization_id`: The organization ID

### 50. SUPABASE_GETS_PROJECT_S_AUTH_CONFIG
Gets authentication configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 51. SUPABASE_GETS_PROJECT_S_POSTGRES_CONFIG
Gets PostgreSQL configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 52. SUPABASE_GETS_PROJECT_S_POSTGREST_CONFIG
Gets PostgREST configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 53. SUPABASE_GETS_PROJECT_S_SERVICE_HEALTH_STATUS
Gets service health status for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 54. SUPABASE_GETS_PROJECT_S_SUPAVISOR_CONFIG
Gets supervisor configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 55. SUPABASE_GET_TABLE_SCHEMAS
Gets table schemas from the database.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 56. SUPABASE_LIST_ALL_DATABASE_BRANCHES
Lists all database branches for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 57. SUPABASE_LIST_ALL_FUNCTIONS
Lists all edge functions for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 58. SUPABASE_LIST_ALL_ORGANIZATIONS
Lists all organizations the user belongs to.

**Parameters:**
```json
{}
```

### 59. SUPABASE_LIST_ALL_PROJECTS
Lists all projects.

**Parameters:**
```json
{}
```

### 60. SUPABASE_LIST_ALL_SECRETS
Lists all secrets for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 61. SUPABASE_LIST_MEMBERS_OF_AN_ORGANIZATION
Lists members of an organization.

**Parameters:**
```json
{
  "organization_id": "org_id"
}
```

**Required Fields:**
- `organization_id`: The organization ID

### 62. SUPABASE_LISTS_ALL_BACKUPS
Lists all backups for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 63. SUPABASE_LISTS_ALL_BUCKETS
Lists all storage buckets for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 64. SUPABASE_LISTS_ALL_SSO_PROVIDERS
Lists all SSO providers for an organization.

**Parameters:**
```json
{
  "organization_id": "org_id"
}
```

**Required Fields:**
- `organization_id`: The organization ID

### 65. SUPABASE_LISTS_SQL_SNIPPETS_FOR_THE_LOGGED_IN_USER
Lists SQL snippets for the logged-in user.

**Parameters:**
```json
{}
```

### 66. SUPABASE_LIST_TABLES
Lists all tables in the database.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 67. SUPABASE_REMOVES_A_SSO_PROVIDER_BY_ITS_UUID
Removes an SSO provider by UUID.

**Parameters:**
```json
{
  "provider_id": "provider_uuid"
}
```

**Required Fields:**
- `provider_id`: The SSO provider UUID

### 68. SUPABASE_RESETS_A_DATABASE_BRANCH
Resets a database branch.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "branch_id": "branch_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `branch_id`: The branch ID to reset

### 69. SUPABASE_RESTORES_A_PITR_BACKUP_FOR_A_DATABASE
Restores a point-in-time recovery backup.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "backup_id": "backup_id",
  "target_time": "2024-01-01T00:00:00Z"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `backup_id`: The backup ID
- `target_time`: Target restoration time

### 70. SUPABASE_RETRIEVE_A_FUNCTION
Retrieves details of an edge function.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "function_id": "function_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `function_id`: The function ID

### 71. SUPABASE_RETRIEVE_A_FUNCTION_BODY
Retrieves the body/code of an edge function.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "function_id": "function_id"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `function_id`: The function ID

### 72. SUPABASE_RETURNS_PROJECT_S_READONLY_MODE_STATUS
Returns the readonly mode status for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 73. SUPABASE_SELECT_FROM_TABLE
Selects data from a database table.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "table": "table_name",
  "columns": ["column1", "column2"],
  "where": "condition",
  "limit": 100
}
```

**Required Fields:**
- `project_ref`: The project reference
- `table`: The table name

### 74. SUPABASE_UPDATE_A_FUNCTION
Updates an edge function.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "function_id": "function_id",
  "body": "updated function code"
}
```

**Required Fields:**
- `project_ref`: The project reference
- `function_id`: The function ID

### 75. SUPABASE_UPDATE_DATABASE_BRANCH_CONFIG
Updates database branch configuration.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "branch_id": "branch_id",
  "config": {}
}
```

**Required Fields:**
- `project_ref`: The project reference
- `branch_id`: The branch ID

### 76. SUPABASE_UPDATE_PROJECT_CUSTOM_HOSTNAME_ACTION
Updates project custom hostname.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "custom_hostname": "new.example.com"
}
```

**Required Fields:**
- `project_ref`: The project reference

### 77. SUPABASE_UPDATES_A_SSO_PROVIDER_BY_ITS_UUID
Updates an SSO provider by UUID.

**Parameters:**
```json
{
  "provider_id": "provider_uuid",
  "metadata": {}
}
```

**Required Fields:**
- `provider_id`: The SSO provider UUID

### 78. SUPABASE_UPDATES_PROJECT_S_POSTGRES_CONFIG
Updates PostgreSQL configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "config": {}
}
```

**Required Fields:**
- `project_ref`: The project reference

### 79. SUPABASE_UPDATES_PROJECT_S_POSTGREST_CONFIG
Updates PostgREST configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "config": {}
}
```

**Required Fields:**
- `project_ref`: The project reference

### 80. SUPABASE_UPDATES_PROJECT_S_SUPAVISOR_CONFIG
Updates supervisor configuration for a project.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "config": {}
}
```

**Required Fields:**
- `project_ref`: The project reference

### 81. SUPABASE_UPDATE_SSL_ENFORCEMENT_CONFIG
Updates SSL enforcement configuration.

**Parameters:**
```json
{
  "project_ref": "project_reference",
  "enforce_ssl": true
}
```

**Required Fields:**
- `project_ref`: The project reference

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('SUPABASE_BETA_RUN_SQL_QUERY', {
  project_ref: 'my-project-ref',
  query: 'SELECT * FROM users LIMIT 10'
});
```

## Simplifying Supabase Tool Calls

### Helper Functions
```javascript
async function runQuery(projectRef, query) {
  return await callRubeTool('SUPABASE_BETA_RUN_SQL_QUERY', {
    project_ref: projectRef,
    query
  });
}

async function createProject(name, orgId, region = 'us-east-1') {
  return await callRubeTool('SUPABASE_CREATE_A_PROJECT', {
    name,
    organization_id: orgId,
    region,
    plan: 'free'
  });
}

async function listTables(projectRef) {
  return await callRubeTool('SUPABASE_LIST_TABLES', {
    project_ref: projectRef
  });
}

async function deployFunction(projectRef, functionId) {
  return await callRubeTool('SUPABASE_DEPLOY_FUNCTION', {
    project_ref: projectRef,
    function_id: functionId
  });
}
```

### Database Management Example
```javascript
async function setupDatabase(projectRef) {
  // Create a users table
  await runQuery(projectRef, `
    CREATE TABLE users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Insert sample data
  await runQuery(projectRef, `
    INSERT INTO users (email) VALUES ('user@example.com');
  `);

  // Query the data
  const result = await runQuery(projectRef, 'SELECT * FROM users;');
  return result;
}
```

### Project Management Example
```javascript
async function manageSupabaseProject() {
  // List all projects
  const projects = await callRubeTool('SUPABASE_LIST_ALL_PROJECTS', {});

  // Get project details
  if (projects.length > 0) {
    const projectDetails = await callRubeTool('SUPABASE_GETS_PROJECT_S_SERVICE_HEALTH_STATUS', {
      project_ref: projects[0].ref
    });
    return projectDetails;
  }
}
```