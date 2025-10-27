# Rube MCP Tools Reference - 333 Tools Available

## Overview
This document provides a comprehensive reference for all 333 tools available through the Rube MCP server. Tools are organized by service category for easy discovery and usage.

## Quick Access Categories

### 🔧 Development & Code
- [CODEINTERPRETER](#codeinterpreter) - Code execution and file operations
- [COMPOSIO](#composio) - Platform tools and integrations
- [OPENROUTER](#openrouter) - Multi-model AI access
- [GEMINI](#gemini) - Google's AI models

### 📧 Communication
- [GMAIL](#gmail) - Email management
- [TELEGRAM](#telegram) - Messaging and bots
- [LINKEDIN](#linkedin) - Social media

### 📅 Productivity
- [GOOGLECALENDAR](#googlecalendar) - Calendar and scheduling
- [GOOGLEDOCS](#googledocs) - Document creation and editing
- [GOOGLESHEETS](#googlesheets) - Spreadsheet operations
- [GOOGLEDRIVE](#googledrive) - File storage and sharing
- [NOTION](#notion) - Notes and databases

### 🗄️ Data & Storage
- [SUPABASE](#supabase) - Database operations
- [MEM0](#mem0) - Memory and knowledge management

### 🌐 Web & Automation
- [BROWSERBASE](#browserbase) - Web automation
- [PERPLEXITYAI](#perplexityai) - AI-powered search

---

## Tool Categories & Capabilities

### BROWSERBASE (10 tools)
Web automation and browser session management
- `BROWSERBASE_TOOL_CONTEXTS_CREATE` - Create browser contexts
- `BROWSERBASE_TOOL_CONTEXTS_GET` - Get context information
- `BROWSERBASE_TOOL_CONTEXTS_UPDATE` - Update browser contexts
- `BROWSERBASE_TOOL_CREATE_BROWSER_SESSION` - Start browser sessions
- `BROWSERBASE_TOOL_SESSIONS_GET` - Get session details
- `BROWSERBASE_TOOL_SESSIONS_GET_DEBUG` - Debug session information
- `BROWSERBASE_TOOL_SESSIONS_GET_DOWNLOADS` - Get downloaded files
- `BROWSERBASE_TOOL_SESSIONS_GET_LOGS` - Retrieve session logs
- `BROWSERBASE_TOOL_SESSIONS_LIST` - List active sessions
- `BROWSERBASE_TOOL_SESSIONS_UPDATE` - Update session settings

### CODEINTERPRETER (5 tools)
Code execution in sandboxed environments
- `CODEINTERPRETER_CREATE_SANDBOX` - Create isolated code environment
- `CODEINTERPRETER_EXECUTE_CODE` - Run code and get results
- `CODEINTERPRETER_GET_FILE_CMD` - Retrieve files from sandbox
- `CODEINTERPRETER_RUN_TERMINAL_CMD` - Execute terminal commands
- `CODEINTERPRETER_UPLOAD_FILE_CMD` - Upload files to sandbox

### COMPOSIO (21 tools)
Core platform tools and integrations
- `COMPOSIO_CHECK_ACTIVE_CONNECTION` - Verify connection status
- `COMPOSIO_CHECK_ACTIVE_CONNECTIONS` - List all active connections
- `COMPOSIO_CREATE_PLAN` - Create execution plans
- `COMPOSIO_DOWNLOAD_S3_FILE` - Download files from S3
- `COMPOSIO_ENABLE_TRIGGER` - Enable automation triggers
- `COMPOSIO_EXECUTE_RECIPE` - Run predefined workflows
- `COMPOSIO_EXECUTE_TOOL` - Execute specific tools
- `COMPOSIO_GET_DEPENDENCY_GRAPH` - View tool dependencies
- `COMPOSIO_GET_RECIPE_DETAILS` - Get workflow information
- `COMPOSIO_GET_REQUIRED_PARAMETERS` - Check required inputs
- `COMPOSIO_GET_RESPONSE_SCHEMA` - Get output schemas
- `COMPOSIO_INITIATE_CONNECTION` - Start new connections
- `COMPOSIO_LIST_TOOLKITS` - Browse available toolkits
- `COMPOSIO_LIST_TRIGGERS` - View automation triggers
- `COMPOSIO_MANAGE_CONNECTIONS` - Manage integrations
- `COMPOSIO_MULTI_EXECUTE_TOOL` - Run multiple tools
- `COMPOSIO_REMOTE_BASH_TOOL` - Execute remote commands
- `COMPOSIO_REMOTE_WORKBENCH` - Access remote development
- `COMPOSIO_SEARCH_TOOLS` - Search available tools
- `COMPOSIO_WAIT_FOR_CONNECTION` - Wait for connections
- `COMPOSIO_CREATE_UPDATE_RECIPE` - Create/modify workflows

### GEMINI (8 tools)
Google AI model access
- `GEMINI_COUNT_TOKENS` - Count tokens in text
- `GEMINI_EMBED_CONTENT` - Generate embeddings
- `GEMINI_GENERATE_CONTENT` - Generate text content
- `GEMINI_GENERATE_IMAGE` - Create images
- `GEMINI_GENERATE_VIDEOS` - Generate videos
- `GEMINI_GET_VIDEOS_OPERATION` - Check video generation status
- `GEMINI_LIST_MODELS` - List available models
- `GEMINI_WAIT_FOR_VIDEO` - Wait for video completion

### GMAIL (27 tools)
Email management and operations
- `GMAIL_ADD_LABEL_TO_EMAIL` - Add labels to emails
- `GMAIL_BATCH_DELETE_MESSAGES` - Delete multiple messages
- `GMAIL_BATCH_MODIFY_MESSAGES` - Modify multiple messages
- `GMAIL_CREATE_EMAIL_DRAFT` - Create email drafts
- `GMAIL_CREATE_LABEL` - Create new labels
- `GMAIL_DELETE_DRAFT` - Delete email drafts
- `GMAIL_DELETE_MESSAGE` - Delete specific messages
- `GMAIL_FETCH_EMAILS` - Retrieve emails
- `GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID` - Get message by ID
- `GMAIL_FETCH_MESSAGE_BY_THREAD_ID` - Get message by thread
- `GMAIL_FORWARD_MESSAGE` - Forward emails
- `GMAIL_GET_ATTACHMENT` - Download attachments
- `GMAIL_GET_CONTACTS` - Access contacts
- `GMAIL_GET_PEOPLE` - Get people information
- `GMAIL_GET_PROFILE` - Get user profile
- `GMAIL_LIST_DRAFTS` - List email drafts
- `GMAIL_LIST_HISTORY` - Get email history
- `GMAIL_LIST_LABELS` - List email labels
- `GMAIL_LIST_THREADS` - List email threads
- `GMAIL_MODIFY_THREAD_LABELS` - Modify thread labels
- `GMAIL_MOVE_TO_TRASH` - Move to trash
- `GMAIL_PATCH_LABEL` - Update labels
- `GMAIL_REMOVE_LABEL` - Remove labels
- `GMAIL_REPLY_TO_THREAD` - Reply to threads
- `GMAIL_SEARCH_PEOPLE` - Search contacts
- `GMAIL_SEND_DRAFT` - Send draft emails
- `GMAIL_SEND_EMAIL` - Send new emails

### GOOGLECALENDAR (29 tools)
Calendar and event management
- `GOOGLECALENDAR_ACL_PATCH` - Update access control
- `GOOGLECALENDAR_CALENDAR_LIST_INSERT` - Add calendar to list
- `GOOGLECALENDAR_CALENDAR_LIST_UPDATE` - Update calendar list
- `GOOGLECALENDAR_CALENDARS_DELETE` - Delete calendars
- `GOOGLECALENDAR_CALENDARS_UPDATE` - Update calendar settings
- `GOOGLECALENDAR_CLEAR_CALENDAR` - Clear all events
- `GOOGLECALENDAR_CREATE_EVENT` - Create new events
- `GOOGLECALENDAR_DELETE_EVENT` - Delete events
- `GOOGLECALENDAR_DUPLICATE_CALENDAR` - Duplicate calendars
- `GOOGLECALENDAR_EVENTS_INSTANCES` - Get event instances
- `GOOGLECALENDAR_EVENTS_LIST` - List events
- `GOOGLECALENDAR_EVENTS_MOVE` - Move events
- `GOOGLECALENDAR_EVENTS_WATCH` - Watch for changes
- `GOOGLECALENDAR_FIND_EVENT` - Search for events
- `GOOGLECALENDAR_FIND_FREE_SLOTS` - Find available time
- `GOOGLECALENDAR_FREE_BUSY_QUERY` - Check availability
- `GOOGLECALENDAR_GET_CALENDAR` - Get calendar details
- `GOOGLECALENDAR_GET_CURRENT_DATE_TIME` - Get current time
- `GOOGLECALENDAR_LIST_ACL_RULES` - List access rules
- `GOOGLECALENDAR_LIST_CALENDARS` - List all calendars
- `GOOGLECALENDAR_PATCH_CALENDAR` - Update calendar
- `GOOGLECALENDAR_PATCH_EVENT` - Update events
- `GOOGLECALENDAR_QUICK_ADD` - Quick event creation
- `GOOGLECALENDAR_REMOVE_ATTENDEE` - Remove attendees
- `GOOGLECALENDAR_SETTINGS_LIST` - List settings
- `GOOGLECALENDAR_SETTINGS_WATCH` - Watch settings
- `GOOGLECALENDAR_SYNC_EVENTS` - Sync events
- `GOOGLECALENDAR_UPDATE_ACL_RULE` - Update access rules
- `GOOGLECALENDAR_UPDATE_EVENT` - Update event details

### GOOGLEDRIVE (51 tools)
File storage and collaboration
- `GOOGLEDRIVE_ADD_FILE_SHARING_PREFERENCE` - Set sharing preferences
- `GOOGLEDRIVE_COPY_FILE` - Copy files
- `GOOGLEDRIVE_CREATE_COMMENT` - Add comments
- `GOOGLEDRIVE_CREATE_DRIVE` - Create shared drives
- `GOOGLEDRIVE_CREATE_FILE` - Create new files
- `GOOGLEDRIVE_CREATE_FILE_FROM_TEXT` - Create files from text
- `GOOGLEDRIVE_CREATE_FOLDER` - Create folders
- `GOOGLEDRIVE_CREATE_REPLY` - Reply to comments
- `GOOGLEDRIVE_CREATE_SHORTCUT_TO_FILE` - Create file shortcuts
- `GOOGLEDRIVE_DELETE_COMMENT` - Delete comments
- `GOOGLEDRIVE_DELETE_DRIVE` - Delete shared drives
- `GOOGLEDRIVE_DELETE_PERMISSION` - Remove permissions
- `GOOGLEDRIVE_DELETE_REPLY` - Delete comment replies
- `GOOGLEDRIVE_DOWNLOAD_FILE` - Download files
- `GOOGLEDRIVE_EDIT_FILE` - Edit file content
- `GOOGLEDRIVE_EMPTY_TRASH` - Empty trash
- `GOOGLEDRIVE_FILES_MODIFY_LABELS` - Modify file labels
- `GOOGLEDRIVE_FIND_FILE` - Search for files
- `GOOGLEDRIVE_FIND_FOLDER` - Search for folders
- `GOOGLEDRIVE_GENERATE_IDS` - Generate file IDs
- `GOOGLEDRIVE_GET_ABOUT` - Get drive information
- `GOOGLEDRIVE_GET_CHANGES_START_PAGE_TOKEN` - Get change tokens
- `GOOGLEDRIVE_GET_COMMENT` - Get comment details
- `GOOGLEDRIVE_GET_DRIVE` - Get drive information
- `GOOGLEDRIVE_GET_FILE_METADATA` - Get file metadata
- `GOOGLEDRIVE_GET_PERMISSION` - Get permission details
- `GOOGLEDRIVE_GET_REPLY` - Get comment replies
- `GOOGLEDRIVE_GET_REVISION` - Get file revisions
- `GOOGLEDRIVE_GOOGLE_DRIVE_DELETE_FOLDER_OR_FILE_ACTION` - Delete items
- `GOOGLEDRIVE_HIDE_DRIVE` - Hide shared drives
- `GOOGLEDRIVE_LIST_CHANGES` - List file changes
- `GOOGLEDRIVE_LIST_COMMENTS` - List file comments
- `GOOGLEDRIVE_LIST_FILE_LABELS` - List file labels
- `GOOGLEDRIVE_LIST_FILES` - List files
- `GOOGLEDRIVE_LIST_PERMISSIONS` - List permissions
- `GOOGLEDRIVE_LIST_REPLIES_TO_COMMENT` - List comment replies
- `GOOGLEDRIVE_LIST_REVISIONS` - List file revisions
- `GOOGLEDRIVE_LIST_SHARED_DRIVES` - List shared drives
- `GOOGLEDRIVE_MOVE_FILE` - Move files
- `GOOGLEDRIVE_RESUMABLE_UPLOAD` - Upload large files
- `GOOGLEDRIVE_STOP_WATCH_CHANNEL` - Stop watching changes
- `GOOGLEDRIVE_UNHIDE_DRIVE` - Unhide drives
- `GOOGLEDRIVE_UNTRASH_FILE` - Restore from trash
- `GOOGLEDRIVE_UPDATE_COMMENT` - Update comments
- `GOOGLEDRIVE_UPDATE_DRIVE` - Update drive settings
- `GOOGLEDRIVE_UPDATE_FILE_PUT` - Update file content
- `GOOGLEDRIVE_UPDATE_FILE_REVISION_METADATA` - Update revision metadata
- `GOOGLEDRIVE_UPDATE_PERMISSION` - Update permissions
- `GOOGLEDRIVE_UPDATE_REPLY` - Update comment replies
- `GOOGLEDRIVE_UPLOAD_FILE` - Upload files
- `GOOGLEDRIVE_WATCH_CHANGES` - Watch for file changes

### LINKEDIN (4 tools)
Social media management
- `LINKEDIN_CREATE_LINKED_IN_POST` - Create posts
- `LINKEDIN_DELETE_LINKED_IN_POST` - Delete posts
- `LINKEDIN_GET_COMPANY_INFO` - Get company information
- `LINKEDIN_GET_MY_INFO` - Get user profile information

### MEM0 (43 tools)
Memory and knowledge management
- `MEM0_ADD_MEMBER_TO_PROJECT` - Add project members
- `MEM0_ADD_NEW_MEMORY_RECORDS` - Create memory records
- `MEM0_ADD_ORGANIZATION_MEMBER` - Add organization members
- `MEM0_CREATE_A_NEW_AGENT` - Create AI agents
- `MEM0_CREATE_A_NEW_AGENT_RUN` - Run agents
- `MEM0_CREATE_A_NEW_APPLICATION` - Create applications
- `MEM0_CREATE_A_NEW_ORGANIZATION_ENTRY` - Create organizations
- `MEM0_CREATE_A_NEW_USER` - Create users
- `MEM0_CREATE_AN_EXPORT_JOB_WITH_SCHEMA` - Export data
- `MEM0_CREATE_MEMORY_ENTRY` - Create memory entries
- `MEM0_CREATE_PROJECT` - Create projects
- `MEM0_DELETE_AN_ORGANIZATION` - Delete organizations
- `MEM0_DELETE_A_SPECIFIC_MEMORY_BY_ID` - Delete memories
- `MEM0_DELETE_ENTITY_BY_TYPE_AND_ID` - Delete entities
- `MEM0_DELETE_MEMORIES_ENDPOINT` - Delete memories
- `MEM0_DELETE_MEMORY_BATCH_WITH_UUIDS` - Batch delete memories
- `MEM0_DELETE_PROJECT` - Delete projects
- `MEM0_DELETE_PROJECT_MEMBER` - Remove project members
- `MEM0_EXPORT_DATA_BASED_ON_FILTERS` - Export filtered data
- `MEM0_FETCH_DETAILED_LIST_OF_ORGANIZATIONS` - List organizations
- `MEM0_FETCH_DETAILS_OF_A_SPECIFIC_ORGANIZATION` - Get organization details
- `MEM0_FETCH_LIST_OF_ENTITY_FILTERS` - Get entity filters
- `MEM0_FETCH_SPECIFIC_ENTITY_DETAILS_WITH_OPTIONAL_FILTERS` - Get entity details
- `MEM0_GET_ORGANIZATION_MEMBERS` - List organization members
- `MEM0_GET_PROJECT_DETAILS` - Get project information
- `MEM0_GET_PROJECT_MEMBERS` - List project members
- `MEM0_GET_PROJECTS` - List projects
- `MEM0_GET_USER_MEMORY_STATS` - Get memory statistics
- `MEM0_LIST_ENTITIES_WITH_OPTIONAL_ORG_AND_PROJECT_FILTERS` - List entities
- `MEM0_PERFORM_SEMANTIC_SEARCH_ON_MEMORIES` - Search memories
- `MEM0_REMOVE_A_MEMBER_FROM_THE_ORGANIZATION` - Remove organization members
- `MEM0_RETRIEVE_ALL_EVENTS_FOR_THE_CURRENTLY_LOGGED_IN_USER` - Get user events
- `MEM0_RETRIEVE_ENTITY_SPECIFIC_MEMORIES` - Get entity memories
- `MEM0_RETRIEVE_LIST_OF_MEMORY_EVENTS` - List memory events
- `MEM0_RETRIEVE_MEMORY_BY_UNIQUE_IDENTIFIER` - Get memory by ID
- `MEM0_RETRIEVE_MEMORY_HISTORY_BY_ID` - Get memory history
- `MEM0_RETRIEVE_MEMORY_LIST` - List memories
- `MEM0_SEARCH_MEMORIES_WITH_QUERY_FILTERS` - Search memories
- `MEM0_UPDATE_MEMORY_BATCH_WITH_UUID` - Batch update memories
- `MEM0_UPDATE_MEMORY_DETAILS_BY_ID` - Update memory details
- `MEM0_UPDATE_ORGANIZATION_MEMBER_ROLE` - Update member roles
- `MEM0_UPDATE_PROJECT` - Update projects
- `MEM0_UPDATE_PROJECT_MEMBER_ROLE` - Update project member roles

### NOTION (29 tools)
Note-taking and database management
- `NOTION_ADD_MULTIPLE_PAGE_CONTENT` - Add content to pages
- `NOTION_APPEND_BLOCK_CHILDREN` - Add child blocks
- `NOTION_ARCHIVE_NOTION_PAGE` - Archive pages
- `NOTION_CREATE_COMMENT` - Create comments
- `NOTION_CREATE_DATABASE` - Create databases
- `NOTION_CREATE_FILE_UPLOAD` - Upload files
- `NOTION_CREATE_NOTION_PAGE` - Create pages
- `NOTION_DELETE_BLOCK` - Delete blocks
- `NOTION_DUPLICATE_PAGE` - Duplicate pages
- `NOTION_FETCH_BLOCK_CONTENTS` - Get block content
- `NOTION_FETCH_BLOCK_METADATA` - Get block metadata
- `NOTION_FETCH_COMMENTS` - Get comments
- `NOTION_FETCH_DATA` - Fetch data
- `NOTION_FETCH_DATABASE` - Get database information
- `NOTION_FETCH_ROW` - Get database rows
- `NOTION_GET_ABOUT_ME` - Get user information
- `NOTION_GET_ABOUT_USER` - Get user details
- `NOTION_GET_PAGE_PROPERTY_ACTION` - Get page properties
- `NOTION_INSERT_ROW_DATABASE` - Insert database rows
- `NOTION_LIST_USERS` - List users
- `NOTION_QUERY_DATABASE` - Query databases
- `NOTION_QUERY_DATABASE_WITH_FILTER` - Query with filters
- `NOTION_RETRIEVE_COMMENT` - Get specific comments
- `NOTION_RETRIEVE_DATABASE_PROPERTY` - Get database properties
- `NOTION_SEARCH_NOTION_PAGE` - Search pages
- `NOTION_UPDATE_BLOCK` - Update blocks
- `NOTION_UPDATE_PAGE` - Update pages
- `NOTION_UPDATE_ROW_DATABASE` - Update database rows
- `NOTION_UPDATE_SCHEMA_DATABASE` - Update database schema

### OPENROUTER (7 tools)
Multi-model AI access
- `OPENROUTER_CREATE_CHAT_COMPLETION` - Generate chat responses
- `OPENROUTER_CREATE_COMPLETION` - Generate text completions
- `OPENROUTER_GET_CREDITS` - Check account credits
- `OPENROUTER_GET_GENERATION` - Get generation details
- `OPENROUTER_LIST_AVAILABLE_MODELS` - List available models
- `OPENROUTER_LIST_MODEL_ENDPOINTS` - List model endpoints
- `OPENROUTER_LIST_PROVIDERS` - List AI providers

### PERPLEXITYAI (1 tool)
AI-powered search
- `PERPLEXITYAI_PERPLEXITY_AI_SEARCH` - Perform AI-enhanced searches

### SUPABASE (81 tools)
Database and backend operations
- `SUPABASE_ALPHA_CREATES_A_NEW_API_KEY_FOR_THE_PROJECT` - Create API keys
- `SUPABASE_ALPHA_DELETES_AN_API_KEY_FOR_THE_PROJECT` - Delete API keys
- `SUPABASE_ALPHA_GET_A_THIRD_PARTY_INTEGRATION` - Get integrations
- `SUPABASE_ALPHA_LISTS_ALL_THIRD_PARTY_AUTH_INTEGRATIONS` - List integrations
- `SUPABASE_ALPHA_REMOVES_A_THIRD_PARTY_AUTH_INTEGRATION` - Remove integrations
- `SUPABASE_ALPHA_UPDATES_AN_API_KEY_FOR_THE_PROJECT` - Update API keys
- `SUPABASE_BETA_ACTIVATES_A_CUSTOM_HOSTNAME_FOR_A_PROJECT` - Activate custom domains
- `SUPABASE_BETA_ACTIVATES_A_VANITY_SUBDOMAIN_FOR_A_PROJECT` - Activate vanity domains
- `SUPABASE_BETA_AUTHORIZE_USER_THROUGH_OAUTH` - OAuth authorization
- `SUPABASE_BETA_CHECKS_VANITY_SUBDOMAIN_AVAILABILITY` - Check domain availability
- `SUPABASE_BETA_ENABLES_DATABASE_WEBHOOKS_ON_THE_PROJECT` - Enable webhooks
- `SUPABASE_BETA_GET_PROJECT_S_SSL_ENFORCEMENT_CONFIGURATION` - Get SSL config
- `SUPABASE_BETA_GETS_CURRENT_VANITY_SUBDOMAIN_CONFIG` - Get domain config
- `SUPABASE_BETA_GETS_PROJECT_S_CUSTOM_HOSTNAME_CONFIG` - Get hostname config
- `SUPABASE_BETA_GETS_PROJECT_S_NETWORK_BANS` - Get network bans
- `SUPABASE_BETA_GETS_PROJECT_S_NETWORK_RESTRICTIONS` - Get network restrictions
- `SUPABASE_BETA_GETS_PROJECT_S_PGSODIUM_CONFIG` - Get encryption config
- `SUPABASE_BETA_REMOVE_A_READ_REPLICA` - Remove read replicas
- `SUPABASE_BETA_REMOVE_NETWORK_BANS` - Remove network bans
- `SUPABASE_BETA_RUN_SQL_QUERY` - Execute SQL queries
- `SUPABASE_BETA_SET_UP_A_READ_REPLICA` - Set up read replicas
- `SUPABASE_BETA_UPDATES_PROJECT_S_NETWORK_RESTRICTIONS` - Update network restrictions
- `SUPABASE_BETA_UPGRADES_THE_PROJECT_S_POSTGRES_VERSION` - Upgrade PostgreSQL
- `SUPABASE_CONFIG_PGSODIUM_UPDATE_WITH_ROOT_KEY_WARNING` - Update encryption
- `SUPABASE_CREATE_A_DATABASE_BRANCH` - Create database branches
- `SUPABASE_CREATE_A_FUNCTION` - Create edge functions
- `SUPABASE_CREATE_AN_ORGANIZATION` - Create organizations
- `SUPABASE_CREATE_A_PROJECT` - Create projects
- `SUPABASE_CREATES_A_NEW_SSO_PROVIDER` - Create SSO providers
- `SUPABASE_CREATES_A_NEW_THIRD_PARTY_AUTH_INTEGRATION` - Create auth integrations
- `SUPABASE_CUSTOM_HOSTNAME_DNS_VERIFICATION` - Verify DNS
- `SUPABASE_DELETE_A_DATABASE_BRANCH` - Delete database branches
- `SUPABASE_DELETE_A_FUNCTION` - Delete functions
- `SUPABASE_DELETE_CUSTOM_HOSTNAME_CONFIG` - Delete hostname config
- `SUPABASE_DELETE_PROJECT_VANITY_SUBDOMAIN` - Delete vanity domains
- `SUPABASE_DELETES_THE_GIVEN_PROJECT` - Delete projects
- `SUPABASE_DEPLOY_FUNCTION` - Deploy functions
- `SUPABASE_DISABLE_PROJECT_READONLY` - Disable readonly mode
- `SUPABASE_DISABLES_PREVIEW_BRANCHING` - Disable preview branching
- `SUPABASE_EXCHANGE_O_AUTH_TOKEN` - Exchange OAuth tokens
- `SUPABASE_GENERATE_TYPE_SCRIPT_TYPES` - Generate TypeScript types
- `SUPABASE_GET_DATABASE_BRANCH_CONFIG` - Get branch config
- `SUPABASE_GET_PROJECT_API_KEYS` - Get API keys
- `SUPABASE_GET_PROJECT_S_PGBOUNCER_CONFIG` - Get connection pooling config
- `SUPABASE_GET_PROJECT_UPGRADE_ELIGIBILITY` - Check upgrade eligibility
- `SUPABASE_GET_PROJECT_UPGRADE_STATUS` - Get upgrade status
- `SUPABASE_GETS_A_SPECIFIC_SQL_SNIPPET` - Get SQL snippets
- `SUPABASE_GETS_A_SSO_PROVIDER_BY_ITS_UUID` - Get SSO provider
- `SUPABASE_GETS_INFORMATION_ABOUT_THE_ORGANIZATION` - Get organization info
- `SUPABASE_GETS_PROJECT_S_AUTH_CONFIG` - Get auth config
- `SUPABASE_GETS_PROJECT_S_POSTGRES_CONFIG` - Get PostgreSQL config
- `SUPABASE_GETS_PROJECT_S_POSTGREST_CONFIG` - Get PostgREST config
- `SUPABASE_GETS_PROJECT_S_SERVICE_HEALTH_STATUS` - Get service health
- `SUPABASE_GETS_PROJECT_S_SUPAVISOR_CONFIG` - Get supervisor config
- `SUPABASE_GET_TABLE_SCHEMAS` - Get table schemas
- `SUPABASE_LIST_ALL_DATABASE_BRANCHES` - List database branches
- `SUPABASE_LIST_ALL_FUNCTIONS` - List functions
- `SUPABASE_LIST_ALL_ORGANIZATIONS` - List organizations
- `SUPABASE_LIST_ALL_PROJECTS` - List projects
- `SUPABASE_LIST_ALL_SECRETS` - List secrets
- `SUPABASE_LIST_MEMBERS_OF_AN_ORGANIZATION` - List organization members
- `SUPABASE_LISTS_ALL_BACKUPS` - List backups
- `SUPABASE_LISTS_ALL_BUCKETS` - List storage buckets
- `SUPABASE_LISTS_ALL_SSO_PROVIDERS` - List SSO providers
- `SUPABASE_LISTS_SQL_SNIPPETS_FOR_THE_LOGGED_IN_USER` - List SQL snippets
- `SUPABASE_LIST_TABLES` - List tables
- `SUPABASE_REMOVES_A_SSO_PROVIDER_BY_ITS_UUID` - Remove SSO provider
- `SUPABASE_RESETS_A_DATABASE_BRANCH` - Reset database branch
- `SUPABASE_RESTORES_A_PITR_BACKUP_FOR_A_DATABASE` - Restore from backup
- `SUPABASE_RETRIEVE_A_FUNCTION` - Get function details
- `SUPABASE_RETRIEVE_A_FUNCTION_BODY` - Get function code
- `SUPABASE_RETURNS_PROJECT_S_READONLY_MODE_STATUS` - Check readonly status
- `SUPABASE_SELECT_FROM_TABLE` - Query tables
- `SUPABASE_UPDATE_A_FUNCTION` - Update functions
- `SUPABASE_UPDATE_DATABASE_BRANCH_CONFIG` - Update branch config
- `SUPABASE_UPDATE_PROJECT_CUSTOM_HOSTNAME_ACTION` - Update hostname
- `SUPABASE_UPDATES_A_SSO_PROVIDER_BY_ITS_UUID` - Update SSO provider
- `SUPABASE_UPDATES_PROJECT_S_POSTGRES_CONFIG` - Update PostgreSQL config
- `SUPABASE_UPDATES_PROJECT_S_POSTGREST_CONFIG` - Update PostgREST config
- `SUPABASE_UPDATES_PROJECT_S_SUPAVISOR_CONFIG` - Update supervisor config
- `SUPABASE_UPDATE_SSL_ENFORCEMENT_CONFIG` - Update SSL config

### TELEGRAM (17 tools)
Messaging and bot operations
- `TELEGRAM_ANSWER_CALLBACK_QUERY` - Answer callback queries
- `TELEGRAM_DELETE_MESSAGE` - Delete messages
- `TELEGRAM_EDIT_MESSAGE` - Edit messages
- `TELEGRAM_EXPORT_CHAT_INVITE_LINK` - Export invite links
- `TELEGRAM_FORWARD_MESSAGE` - Forward messages
- `TELEGRAM_GET_CHAT` - Get chat information
- `TELEGRAM_GET_CHAT_ADMINISTRATORS` - Get chat admins
- `TELEGRAM_GET_CHAT_HISTORY` - Get chat history
- `TELEGRAM_GET_CHAT_MEMBERS_COUNT` - Get member count
- `TELEGRAM_GET_ME` - Get bot information
- `TELEGRAM_GET_UPDATES` - Get bot updates
- `TELEGRAM_SEND_DOCUMENT` - Send documents
- `TELEGRAM_SEND_LOCATION` - Send locations
- `TELEGRAM_SEND_MESSAGE` - Send messages
- `TELEGRAM_SEND_PHOTO` - Send photos
- `TELEGRAM_SEND_POLL` - Send polls
- `TELEGRAM_SET_MY_COMMANDS` - Set bot commands

## Integration Documentation

For detailed usage instructions, parameter specifications, and practical examples, see the comprehensive integration guides:

### 📚 **Complete Integration Guides**
- **[Supabase Integration](./supabase-rube-integration.md)** - 81 database and backend tools
- **[Google Drive Integration](./googledrive-rube-integration.md)** - 51 file storage tools
- **[Google Calendar Integration](./googlecalendar-rube-integration.md)** - 29 scheduling tools
- **[Mem0 Integration](./mem0-rube-integration.md)** - 43 memory management tools
- **[Composio Integration](./composio-rube-integration.md)** - 21 platform orchestration tools
- **[Telegram Integration](./telegram-rube-integration.md)** - 17 messaging tools
- **[Browserbase Integration](./browserbase-rube-integration.md)** - 10 web automation tools
- **[CodeInterpreter Integration](./codeinterpreter-rube-integration.md)** - 5 code execution tools
- **[Gemini Integration](./gemini-rube-integration.md)** - 8 Google AI model tools
- **[OpenRouter Integration](./openrouter-rube-integration.md)** - 7 multi-model AI tools
- **[LinkedIn Integration](./linkedin-rube-integration.md)** - 4 professional networking tools
- **[PerplexityAI Integration](./perplexityai-rube-integration.md)** - 1 AI-powered search tool

Each integration guide includes:
- Complete parameter specifications
- Authentication requirements
- Helper functions for common operations
- Real-world usage examples
- Error handling patterns

## Usage Examples

### Basic Tool Call Format
```json
{
  "method": "tools/call",
  "params": {
    "name": "TOOL_NAME",
    "arguments": {
      "param1": "value1",
      "param2": "value2"
    }
  }
}
```

### Common Patterns
- **File Operations**: Use `*_CREATE_*`, `*_UPDATE_*`, `*_DELETE_*` tools
- **Search/List**: Use `*_LIST_*`, `*_SEARCH_*`, `*_FIND_*` tools
- **Communication**: Use `*_SEND_*`, `*_CREATE_*` for messaging
- **Data Management**: Use `*_QUERY_*`, `*_INSERT_*`, `*_UPDATE_*` for databases

### Authentication
All tools use the configured `RUBE_AUTH` token for authentication. No additional setup required.

## Integration Notes
- Tools are available through the MCP server at the configured endpoint
- All tools support JSON-RPC 2.0 protocol
- Error handling follows standard MCP specifications
- Rate limits and quotas apply based on your Composio plan

---
*Last updated: $(date)*
*Total tools: 333*
*Categories: 14*