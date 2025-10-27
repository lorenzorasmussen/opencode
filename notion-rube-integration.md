# Complete Notion Tools in Notion MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 3 requests/second per integration
- **Text Content Limit**: 2000 characters per `text.content` field
- **Max Blocks per Call**: 100 blocks for bulk operations
- **Authentication**: Requires Notion integration token and workspace sharing
- **Parent Access**: Parent pages/databases must be shared with integration

## Available Notion Tool Calls

### 1. NOTION_ADD_MULTIPLE_PAGE_CONTENT
Bulk-add content blocks to Notion. CRITICAL: Notion API enforces 2000 char limit per text.content field. Features: - Accepts simplified format: {'content': 'text', 'block_property': 'type'} - OR full Notion block format with 'type' and properties - AUTO-SPLITS text >2000 chars into multiple blocks - AUTO-PARSES markdown: **bold**, *italic*, ~~strike~~, `inline code`, [links](url) - Maximum 100 blocks per API call REQUIRED 'content' for: paragraph, heading_1-3, callout, to_do, toggle, quote, list items. For code blocks use full format: {'type': 'code', 'code': {'rich_text': [...], 'language': 'python'}} Common errors: - "content.length should be ≤ 2000": Auto-split failed, manually split content - "Content is required": Missing content for text blocks - Each item MUST be wrapped in 'content_block' field

**Parameters:**
```json
{
  "block_id": "page_id",
  "content_blocks": [
    {
      "content": "Your text content here",
      "block_property": "paragraph"
    },
    {
      "content": "**Bold text** and *italic text*",
      "block_property": "heading_1"
    },
    {
      "content": "Code example",
      "block_property": "code",
      "language": "javascript"
    }
  ]
}
```

**Required Fields:**
- `block_id`: Parent page/block ID
- `content_blocks`: Array of content objects
- Each content block must have `content` and `block_property`

### 2. NOTION_APPEND_BLOCK_CHILDREN
Appends raw Notion API blocks to parent. CRITICAL: Text content limited to 2000 chars per text.content field. Use for: Advanced blocks (tables, databases), pre-built block objects, complex nested structures. REQUIRES exact Notion block schema - each block MUST have 'object':'block' and 'type'. Text blocks MUST use rich_text arrays: {'rich_text': [{'type': 'text', 'text': {'content': 'text'}}]} Common errors: - "content.length should be ≤ 2000": Text exceeds API limit, split into multiple blocks - "validation_error": Using 'text' instead of 'rich_text' for headings/paragraphs - "object_not_found": Invalid block_id or no integration access - Missing 'object': 'block' or 'type' fields For simple content, use 'add_multiple_page_content' instead - it handles formatting automatically.

**Parameters:**
```json
{
  "block_id": "page_id",
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "Text content (max 2000 chars)"
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Text content (max 2000 chars)",
            "href": null
          }
        ],
        "color": "default"
      }
    }
  ]
}
```

**Required Fields:**
- `block_id`: Parent block/page ID
- `children`: Array of block objects
- Each block must have `object: "block"` and `type`
- Text blocks require `rich_text` arrays

### 3. NOTION_ARCHIVE_NOTION_PAGE
Archives (moves to trash) or unarchives (restores from trash) a specified Notion page.

**Parameters:**
```json
{
  "page_id": "page_id_string",
  "archived": true
}
```

**Required Fields:**
- `page_id`: The page ID to archive/unarchive
- `archived`: Boolean (true to archive, false to unarchive)

### 4. NOTION_CREATE_COMMENT
Adds a comment to a Notion page (via `parent_page_id`) OR to an existing discussion thread (via `discussion_id`); cannot create new discussion threads on specific blocks (inline comments).

**Parameters:**
```json
{
  "parent_page_id": "page_id_string",
  "discussion_id": "discussion_id_string",
  "rich_text": [
    {
      "type": "text",
      "text": {
        "content": "Comment content"
      }
    }
  ]
}
```

**Required Fields:**
- Either `parent_page_id` OR `discussion_id`
- `rich_text`: Array of rich text objects

### 5. NOTION_CREATE_DATABASE
Creates a new Notion database as a subpage under a specified parent page with a defined properties schema. IMPORTANT NOTES: - The parent page MUST be shared with your integration, otherwise you'll get a 404 error - If you encounter conflict errors (409), retry the request as Notion may experience temporary save conflicts - For relation properties, you MUST provide the database_id of the related database - Parent ID must be a valid UUID format (with or without hyphens), not a template variable Use this action exclusively for creating new databases.

**Parameters:**
```json
{
  "parent_id": "parent_page_id",
  "title": "Database Title",
  "properties": {
    "Name": {
      "name": "Name",
      "type": "title"
    },
    "Status": {
      "name": "Status",
      "type": "select",
      "select": {
        "options": [
          {"name": "Not Started", "color": "red"},
          {"name": "In Progress", "color": "yellow"},
          {"name": "Done", "color": "green"}
        ]
      }
    }
  }
}
```

**Required Fields:**
- `parent_id`: Parent page ID (must be shared with integration)
- `title`: Database title
- `properties`: Property schema object

### 6. NOTION_CREATE_FILE_UPLOAD
Tool to create a Notion FileUpload object and retrieve an upload URL. Use when you need to automate attaching local or external files directly into Notion without external hosting.

**Parameters:**
```json
{
  "name": "filename.ext",
  "type": "external",
  "external": {
    "url": "https://example.com/file.ext"
  }
}
```

**Required Fields:**
- `name`: Filename
- `type`: "external" or "file"
- `external.url` or `file.url`: File URL

### 7. NOTION_CREATE_NOTION_PAGE
Creates a new empty page in a Notion workspace under a specified parent page or database. PREREQUISITES: - Parent page/database must exist and be accessible in your Notion workspace - Use search_pages or list_databases first to obtain valid parent IDs LIMITATIONS: - Cannot create root-level pages (must have a parent) - May encounter conflicts if creating pages too quickly - Title-based parent search is less reliable than using UUIDs

**Parameters:**
```json
{
  "parent_id": "parent_page_or_database_id",
  "title": "Page Title",
  "content": "Optional initial content"
}
```

**Required Fields:**
- `parent_id`: Parent page/database ID
- `title`: Page title

### 8. NOTION_DELETE_BLOCK
Archives a Notion block, page, or database using its ID, which sets its 'archived' property to true (like moving to "Trash" in the UI) and allows it to be restored later.

**Parameters:**
```json
{
  "block_id": "block_id_string"
}
```

**Required Fields:**
- `block_id`: The block/page/database ID to archive

### 9. NOTION_DUPLICATE_PAGE
Duplicates a Notion page, including all its content, properties, and nested blocks, under a specified parent page or workspace.

**Parameters:**
```json
{
  "page_id": "source_page_id",
  "parent_id": "destination_parent_id"
}
```

**Required Fields:**
- `page_id`: Source page ID to duplicate
- `parent_id`: Destination parent ID

### 10. NOTION_FETCH_BLOCK_CONTENTS
Retrieves a paginated list of direct, first-level child block objects along with contents for a given parent Notion block or page ID; use block IDs from the response for subsequent calls to access deeply nested content.

**Parameters:**
```json
{
  "block_id": "parent_block_id",
  "page_size": 100,
  "start_cursor": "cursor_string"
}
```

**Required Fields:**
- `block_id`: Parent block/page ID

### 11. NOTION_FETCH_BLOCK_METADATA
Fetches metadata for a Notion block (including pages, which are special blocks) using its UUID. Returns block type, properties, and basic info but not child content. Prerequisites: 1) Block/page must be shared with your integration, 2) Use valid block_id from API responses (not URLs). For child blocks, use fetch_block_contents instead. Common 404 errors mean the block isn't accessible to your integration.

**Parameters:**
```json
{
  "block_id": "block_id_string"
}
```

**Required Fields:**
- `block_id`: The block ID to fetch metadata for

### 12. NOTION_FETCH_COMMENTS
Fetches unresolved comments for a specified Notion block or page ID.

**Parameters:**
```json
{
  "block_id": "block_or_page_id"
}
```

**Required Fields:**
- `block_id`: Block or page ID

### 13. NOTION_FETCH_DATA
Fetches Notion items (pages and/or databases) from the Notion workspace, use this to get minimal data about the items in the workspace with a query or list all items in the workspace with minimal data

**Parameters:**
```json
{
  "query": "search term",
  "filter": {
    "property": "object",
    "value": "page"
  },
  "page_size": 100
}
```

### 14. NOTION_FETCH_DATABASE
Fetches a Notion database's structural metadata (properties, title, etc.) via its `database_id`, not the data entries; `database_id` must reference an existing database.

**Parameters:**
```json
{
  "database_id": "database_id_string"
}
```

**Required Fields:**
- `database_id`: The database ID

### 15. NOTION_FETCH_ROW
Retrieves a Notion database row's properties and metadata; use fetch_block_contents for page content blocks.

**Parameters:**
```json
{
  "page_id": "row_page_id"
}
```

**Required Fields:**
- `page_id`: The page ID of the database row

### 16. NOTION_GET_ABOUT_ME
Retrieves the User object for the bot associated with the current Notion integration token, typically to obtain the bot's user ID for other API operations.

**Parameters:**
```json
{}
```

**No required parameters**

### 17. NOTION_GET_ABOUT_USER
Retrieves detailed information about a specific Notion user, such as their name, avatar, and email, based on their unique user ID.

**Parameters:**
```json
{
  "user_id": "user_id_string"
}
```

**Required Fields:**
- `user_id`: The user ID to fetch info for

### 18. NOTION_GET_PAGE_PROPERTY_ACTION
Call this to get a specific property from a Notion page when you have a valid `page_id` and `property_id`; handles pagination for properties returning multiple items.

**Parameters:**
```json
{
  "page_id": "page_id_string",
  "property_id": "property_id_string",
  "page_size": 100
}
```

**Required Fields:**
- `page_id`: The page ID
- `property_id`: The property ID

### 19. NOTION_INSERT_ROW_DATABASE
Creates a new page (row) in a specified Notion database. Prerequisites: - The database must be explicitly shared with your Notion integration - Property names and types must match the database schema exactly - Select/multi-select options must already exist in the database Common Errors: - 404 "Could not find database": Database is not shared with your integration - 400 "Status is not a property": Using 'status' type incorrectly (use 'select' instead) - Validation error on properties: Properties must be provided as a list, not a dictionary

**Parameters:**
```json
{
  "database_id": "database_id_string",
  "properties": {
    "Name": {
      "title": [{"text": {"content": "Row Title"}}]
    },
    "Status": {
      "select": {"name": "In Progress"}
    }
  }
}
```

**Required Fields:**
- `database_id`: Target database ID
- `properties`: Row properties matching database schema

### 20. NOTION_LIST_USERS
Retrieves a paginated list of users (excluding guests) from the Notion workspace; the number of users returned per page may be less than the requested `page_size`.

**Parameters:**
```json
{
  "page_size": 100,
  "start_cursor": "cursor_string"
}
```

### 21. NOTION_QUERY_DATABASE
Queries a Notion database to retrieve pages (rows). In Notion, databases are collections where each row is a page and columns are properties. Returns paginated results with metadata. Important requirements: - The database must be shared with your integration - Property names in sorts must match existing database properties exactly (case-sensitive) - The start_cursor must be a valid UUID from a previous response's next_cursor field - Database IDs must be valid 32-character UUIDs (with or without hyphens) Use this action to: - Retrieve all or filtered database entries - Sort results by one or more properties - Paginate through large result sets - Get database content for processing or display

**Parameters:**
```json
{
  "database_id": "database_id_string",
  "filter": {
    "property": "Status",
    "select": {
      "equals": "In Progress"
    }
  },
  "sorts": [
    {
      "property": "Name",
      "direction": "ascending"
    }
  ],
  "page_size": 100,
  "start_cursor": "cursor_string"
}
```

**Required Fields:**
- `database_id`: Database ID to query

### 22. NOTION_QUERY_DATABASE_WITH_FILTER
Tool to query a Notion database with server-side filtering, sorting, and pagination. Use when you need to retrieve a subset of rows by property, date, status, or other conditions.

**Parameters:**
```json
{
  "database_id": "database_id_string",
  "filter": {
    "and": [
      {
        "property": "Status",
        "select": {
          "equals": "In Progress"
        }
      },
      {
        "property": "Priority",
        "select": {
          "equals": "High"
        }
      }
    ]
  },
  "page_size": 100
}
```

**Required Fields:**
- `database_id`: Database ID to query

### 23. NOTION_RETRIEVE_COMMENT
Tool to retrieve a specific comment by its ID. Use when you have a comment ID and need to fetch its details.

**Parameters:**
```json
{
  "comment_id": "comment_id_string"
}
```

**Required Fields:**
- `comment_id`: The comment ID

### 24. NOTION_RETRIEVE_DATABASE_PROPERTY
Tool to retrieve a specific property object of a Notion database. Use when you need to get details about a single database column/property.

**Parameters:**
```json
{
  "database_id": "database_id_string",
  "property_id": "property_id_string"
}
```

**Required Fields:**
- `database_id`: Database ID
- `property_id`: Property ID

### 25. NOTION_SEARCH_NOTION_PAGE
Searches Notion pages and databases by title; an empty query lists all accessible items, useful for discovering IDs or as a fallback when a specific query yields no results.

**Parameters:**
```json
{
  "query": "search term",
  "filter": {
    "property": "object",
    "value": "page"
  },
  "page_size": 100,
  "start_cursor": "cursor_string"
}
```

### 26. NOTION_UPDATE_BLOCK
Updates existing Notion block's text content. ⚠️ CRITICAL: Content limited to 2000 chars. Cannot change block type or archive blocks. Content exceeding 2000 chars will fail with validation error. For longer content, split across multiple blocks using add_multiple_page_content.

**Parameters:**
```json
{
  "block_id": "block_id_string",
  "content": "New text content (max 2000 chars)"
}
```

**Required Fields:**
- `block_id`: Block ID to update
- `content`: New text content

### 27. NOTION_UPDATE_PAGE
Update page properties, icon, cover, or archive status. Requires at least one update parameter. Common errors: - "Invalid property identifier": Property name doesn't exist - use exact names from your database - "should be defined": Property value missing wrapper - always wrap: {'Field': {'type': value}} - "Input should be a valid dictionary": Properties must be dict, not list Property formats by type: - title/rich_text: {'text': {'content': 'value'}} - select/status: {'name': 'option'} - url: plain string needs {'url': 'string'} wrapper - number: plain number needs {'number': value} wrapper

**Parameters:**
```json
{
  "page_id": "page_id_string",
  "properties": {
    "Status": {
      "select": {"name": "Completed"}
    },
    "Priority": {
      "select": {"name": "High"}
    }
  },
  "icon": {
    "type": "emoji",
    "emoji": "✅"
  },
  "archived": false
}
```

**Required Fields:**
- `page_id`: Page ID to update
- At least one update parameter (properties, icon, cover, archived)

### 28. NOTION_UPDATE_ROW_DATABASE
Updates a Notion database row (page) by its UUID. Common issues: (1) Use UUID from page URL, not the full URL, (2) Ensure page is shared with integration, (3) Match property names exactly as in database, (4) Use 'status' type for Status properties, not 'select', (5) Retry on 409 Conflict errors (concurrent updates). Supports updating properties, icon, cover, or archiving the row.

**Parameters:**
```json
{
  "page_id": "row_page_id",
  "properties": {
    "Status": {
      "status": {"name": "Completed"}
    },
    "Progress": {
      "number": 100
    }
  }
}
```

**Required Fields:**
- `page_id`: Row page ID to update

### 29. NOTION_UPDATE_SCHEMA_DATABASE
Updates an existing Notion database's schema including title, description, and/or properties (columns). IMPORTANT NOTES: - At least one update (title, description, or properties) must be provided - The database must be shared with your integration - Property names are case-sensitive and must match exactly - When changing a property to 'relation' type, you MUST provide the database_id of the target database - Removing properties will permanently delete that column and its data - Use NOTION_FETCH_DATA first to get the exact property names and database structure Common errors: - 'database_id' missing: Ensure you're passing the database_id parameter (not page_id) - 'data_source_id' undefined: When changing to relation type, database_id is required in PropertySchemaUpdate - Property name mismatch: Names must match exactly including case and special characters

**Parameters:**
```json
{
  "database_id": "database_id_string",
  "title": "New Database Title",
  "description": "Updated description",
  "properties": {
    "New Property": {
      "name": "New Property",
      "type": "text"
    }
  }
}
```

**Required Fields:**
- `database_id`: Database ID to update
- At least one update parameter (title, description, or properties)

## Usage Pattern in Notion MCP

All Notion tools follow this calling pattern:

```javascript
const result = await callNotionTool('TOOL_NAME', {
  // tool-specific parameters
});
```

## Using Rube MCP Server Toolkits

The Rube MCP server (Composio) provides access to 14+ toolkits with 333+ tools total. Here's how to use different toolkits:

### 1. Authentication Setup

Set your Rube auth token:
```bash
export RUBE_AUTH="your_composio_api_key_here"
```

### 2. Available Toolkits

- **NOTION** (29 tools): Database and page management
- **GMAIL** (27 tools): Email operations
- **GOOGLEDRIVE** (51 tools): File storage and sharing
- **GOOGLECALENDAR** (29 tools): Calendar and event management
- **SUPABASE** (81 tools): Database operations
- **GITHUB** (various): Repository management
- **SLACK** (various): Team communication
- **And 7 more toolkits...**

### 3. Toolkit Usage Examples

#### Notion Toolkit
```javascript
// Create a page
const result = await callRubeTool('NOTION_CREATE_NOTION_PAGE', {
  parent_id: "your-parent-id",
  title: "My New Page"
});

// Query database
const data = await callRubeTool('NOTION_QUERY_DATABASE', {
  database_id: "your-database-id",
  filter: { property: "Status", select: { equals: "Done" } }
});
```

#### Gmail Toolkit
```javascript
// Send email
await callRubeTool('GMAIL_SEND_EMAIL', {
  to: ["recipient@example.com"],
  subject: "Hello",
  body: "Message content"
});

// List emails
const emails = await callRubeTool('GMAIL_FETCH_EMAILS', {
  max_results: 10
});
```

#### Google Drive Toolkit
```javascript
// Upload file
await callRubeTool('GOOGLEDRIVE_UPLOAD_FILE', {
  file_path: "/path/to/file.pdf",
  parent_id: "folder-id"
});

// List files
const files = await callRubeTool('GOOGLEDRIVE_LIST_FILES', {});
```

## Simplifying Tool Calls

### 1. Helper Functions

Create reusable helper functions for common operations:

```javascript
// Generic Rube tool caller
async function callRubeTool(toolName, params) {
  // Implementation from test scripts
}

// Notion-specific helpers
async function createNotionPage(parentId, title, content = "") {
  return await callRubeTool('NOTION_CREATE_NOTION_PAGE', {
    parent_id: parentId,
    title: title,
    content: content
  });
}

async function addNotionContent(pageId, blocks) {
  return await callRubeTool('NOTION_ADD_MULTIPLE_PAGE_CONTENT', {
    block_id: pageId,
    content_blocks: blocks
  });
}

// Gmail helpers
async function sendEmail(to, subject, body) {
  return await callRubeTool('GMAIL_SEND_EMAIL', {
    to: Array.isArray(to) ? to : [to],
    subject: subject,
    body: body
  });
}
```

### 2. Batch Operations

Combine multiple tool calls for efficiency:

```javascript
async function createNotionWorkspaceReport(workspaceData) {
  // Create main report page
  const reportPage = await createNotionPage(
    "parent-id",
    "Workspace Report",
    "Automated workspace analysis"
  );

  // Add sections
  await addNotionContent(reportPage.id, [
    { content: "Pages Summary", block_property: "heading_1" },
    { content: `Total pages: ${workspaceData.pages.length}`, block_property: "paragraph" },
    { content: "Databases Summary", block_property: "heading_1" },
    { content: `Total databases: ${workspaceData.databases.length}`, block_property: "paragraph" }
  ]);

  return reportPage;
}
```

### 3. Error Handling & Retries

Implement robust error handling:

```javascript
async function safeToolCall(toolName, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await callRubeTool(toolName, params);
      return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));

      // Handle specific errors
      if (error.message.includes('409')) {
        console.log('Conflict detected, retrying...');
      }
    }
  }
}
```

### 4. Configuration Management

Store toolkit configurations:

```javascript
const TOOLKIT_CONFIGS = {
  notion: {
    workspaceId: "your-workspace-id",
    defaultParentId: "default-parent-page-id"
  },
  gmail: {
    defaultSender: "your-email@example.com"
  },
  drive: {
    rootFolderId: "your-root-folder-id"
  }
};

function getToolkitConfig(toolkit) {
  return TOOLKIT_CONFIGS[toolkit] || {};
}
```

### 5. Integration Patterns

#### OpenCode Integration
```javascript
// In OpenCode commands
async function runNotionAnalysis() {
  const workspace = await callRubeTool('NOTION_FETCH_DATA', {
    get_all: true
  });

  // Process and display results
  console.log(`Found ${workspace.results.length} items`);

  // Create summary page
  const summary = await createNotionWorkspaceReport(workspace);
  console.log(`Report created: ${summary.url}`);
}
```

#### Automated Workflows
```javascript
// Daily report generator
async function generateDailyReports() {
  const today = new Date().toISOString().split('T')[0];

  // Gmail: Send daily summary
  await sendEmail(
    "team@example.com",
    `Daily Report - ${today}`,
    "Attached is today's workspace summary..."
  );

  // Notion: Update status page
  await callRubeTool('NOTION_UPDATE_PAGE', {
    page_id: "status-page-id",
    properties: {
      "Last Updated": { date: { start: new Date().toISOString() } }
    }
  });
}
```

### 6. Best Practices

1. **Rate Limiting**: Respect the 3 requests/second limit
2. **Error Handling**: Always implement retries for 409/429 errors
3. **Authentication**: Keep tokens secure and rotate regularly
4. **Testing**: Use the provided test scripts before production
5. **Documentation**: Document your custom helpers and workflows
6. **Monitoring**: Log tool usage and success rates

### 7. Advanced Patterns

#### Custom Tool Builders
```javascript
function createNotionDatabaseTool(databaseId) {
  return {
    query: (filter) => callRubeTool('NOTION_QUERY_DATABASE', {
      database_id: databaseId,
      filter: filter
    }),
    insert: (properties) => callRubeTool('NOTION_INSERT_ROW_DATABASE', {
      database_id: databaseId,
      properties: properties
    }),
    update: (pageId, properties) => callRubeTool('NOTION_UPDATE_ROW_DATABASE', {
      page_id: pageId,
      properties: properties
    })
  };
}

// Usage
const tasksDb = createNotionDatabaseTool("your-tasks-database-id");
await tasksDb.insert({ Name: { title: [{ text: { content: "New Task" } }] } });
```

#### Workflow Orchestration
```javascript
class RubeWorkflow {
  constructor() {
    this.steps = [];
  }

  addStep(toolName, params, dependsOn = null) {
    this.steps.push({ toolName, params, dependsOn });
  }

  async execute() {
    const results = {};
    for (const step of this.steps) {
      if (step.dependsOn && !results[step.dependsOn]) {
        throw new Error(`Dependency ${step.dependsOn} not satisfied`);
      }

      const result = await safeToolCall(step.toolName, step.params);
      results[step.toolName] = result;
    }
    return results;
  }
}

// Usage
const workflow = new RubeWorkflow();
workflow.addStep('NOTION_CREATE_NOTION_PAGE', { parent_id: "parent", title: "Report" });
workflow.addStep('NOTION_ADD_MULTIPLE_PAGE_CONTENT', { block_id: "page-id", content_blocks: [...] }, 'NOTION_CREATE_NOTION_PAGE');
await workflow.execute();
```

## Critical Requirements & Common Errors

### Text Content Limits
- **2000 characters max** per `text.content` field
- **Auto-splitting** available in `NOTION_ADD_MULTIPLE_PAGE_CONTENT`
- **Manual splitting** required for `NOTION_APPEND_BLOCK_CHILDREN`

### Authentication & Access
- **Integration token** required in environment
- **Workspace sharing** required for parent pages/databases
- **Valid UUIDs** required for all IDs (with or without hyphens)

### Block Structure Requirements
- **Text blocks**: Must use `rich_text` arrays, not direct `text` objects
- **All blocks**: Must include `object: "block"` and `type` fields
- **Rich text**: Each text object needs `type: "text"`, `text.content`, `annotations`, `plain_text`, `href`

### Rate Limiting
- **3 requests/second** maximum per integration
- **Exponential backoff** recommended for retries
- **Batch operations** preferred for multiple updates

### Common Error Codes
- **400**: Invalid request structure, missing required fields, text too long
- **401**: Authentication failed, invalid token
- **403**: Insufficient permissions, integration not shared
- **404**: Resource not found, invalid IDs
- **409**: Conflict (concurrent updates), retry required
- **429**: Rate limit exceeded, implement backoff