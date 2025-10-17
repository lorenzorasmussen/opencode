# MCP Server Tools Reference

This document lists all available tools for each MCP server based on their specifications.

## 🗂️ Filesystem Server Tools

**Package**: `@modelcontextprotocol/server-filesystem`

### Available Tools:
1. **read_file**
   - Read contents of a file
   - Parameters: `path` (string)

2. **read_multiple_files**
   - Read multiple files at once
   - Parameters: `paths` (array of strings)

3. **write_file**
   - Write content to a file
   - Parameters: `path` (string), `content` (string)

4. **create_directory**
   - Create a new directory
   - Parameters: `path` (string)

5. **list_directory**
   - List contents of a directory
   - Parameters: `path` (string)

6. **move_file**
   - Move or rename a file/directory
   - Parameters: `source` (string), `destination` (string)

7. **search_files**
   - Search for files using grep-like patterns
   - Parameters: `path` (string), `regex` (string), `include_pattern` (string)

8. **get_file_info**
   - Get file/directory metadata
   - Parameters: `path` (string)

## 🐙 Git Server Tools

**Package**: `@modelcontextprotocol/server-git`

### Available Tools:
1. **git_status**
   - Get repository status
   - Parameters: None

2. **git_log**
   - Get commit history
   - Parameters: `limit` (number), `since` (string), `until` (string)

3. **git_diff**
   - Show changes between commits
   - Parameters: `from` (string), `to` (string), `paths` (array)

4. **git_show**
   - Show detailed commit information
   - Parameters: `commit` (string)

5. **git_branch**
   - List or create branches
   - Parameters: `action` (string: "list", "create", "delete"), `name` (string)

6. **git_checkout**
   - Switch branches or restore files
   - Parameters: `target` (string), `create` (boolean)

7. **git_add**
   - Stage files for commit
   - Parameters: `paths` (array of strings)

8. **git_commit**
   - Create a commit
   - Parameters: `message` (string), `author` (object)

9. **git_push**
   - Push commits to remote
   - Parameters: `remote` (string), `branch` (string)

10. **git_pull**
    - Pull changes from remote
    - Parameters: `remote` (string), `branch` (string)

11. **git_clone**
    - Clone a repository
    - Parameters: `url` (string), `path` (string)

12. **git_init**
    - Initialize a new repository
    - Parameters: `path` (string)

## 💾 SQLite Server Tools

**Package**: `@modelcontextprotocol/server-sqlite`

### Available Tools:
1. **run_query**
   - Execute SQL queries
   - Parameters: `query` (string)

2. **get_table_info**
   - Get table schema information
   - Parameters: `table_name` (string)

3. **list_tables**
   - List all tables in database
   - Parameters: None

4. **create_table**
   - Create a new table
   - Parameters: `name` (string), `schema` (object)

5. **insert_rows**
   - Insert data into table
   - Parameters: `table` (string), `rows` (array)

6. **update_rows**
   - Update existing rows
   - Parameters: `table` (string), `where` (object), `values` (object)

7. **delete_rows**
   - Delete rows from table
   - Parameters: `table` (string), `where` (object)

## 🔍 Brave Search Server Tools

**Package**: `@modelcontextprotocol/server-brave-search`

### Available Tools:
1. **brave_web_search**
   - Perform web search
   - Parameters: `query` (string), `count` (number), `offset` (number)

2. **brave_local_search**
   - Search for local businesses
   - Parameters: `query` (string), `location` (string)

3. **brave_news_search**
   - Search for news articles
   - Parameters: `query` (string), `region` (string)

## 🐙 GitHub Server Tools

**Package**: `@modelcontextprotocol/server-github`

### Available Tools:
1. **get_user**
   - Get user information
   - Parameters: `username` (string)

2. **get_repository**
   - Get repository information
   - Parameters: `owner` (string), `repo` (string)

3. **list_repositories**
   - List user repositories
   - Parameters: `username` (string), `type` (string), `sort` (string)

4. **search_repositories**
   - Search for repositories
   - Parameters: `query` (string), `sort` (string), `order` (string)

5. **get_issue**
   - Get issue details
   - Parameters: `owner` (string), `repo` (string), `issue_number` (number)

6. **list_issues**
   - List repository issues
   - Parameters: `owner` (string), `repo` (string), `state` (string)

7. **create_issue**
   - Create a new issue
   - Parameters: `owner` (string), `repo` (string), `title` (string), `body` (string)

8. **get_pull_request**
   - Get pull request details
   - Parameters: `owner` (string), `repo` (string), `pull_number` (number)

9. **list_pull_requests**
   - List repository pull requests
   - Parameters: `owner` (string), `repo` (string), `state` (string)

10. **search_code**
    - Search for code in repositories
    - Parameters: `query` (string), `repo` (string), `language` (string)

## 🧠 Perplexity Server Tools

**Package**: `@perplexityai/mcp-server-perplexity`

### Available Tools:
1. **ask_perplexity**
   - Ask questions and get AI-powered answers
   - Parameters: `query` (string), `model` (string), `max_tokens` (number)

2. **search_perplexity**
   - Perform web search with AI analysis
   - Parameters: `query` (string), `include_sources` (boolean)

## 📝 Notion Server Tools

**Package**: `@notionhq/mcp-server-notion`

### Available Tools:
1. **list_databases**
   - List all databases in workspace
   - Parameters: None

2. **get_database**
   - Get database details
   - Parameters: `database_id` (string)

3. **query_database**
   - Query database contents
   - Parameters: `database_id` (string), `filter` (object), `sorts` (array)

4. **create_page**
   - Create a new page
   - Parameters: `parent` (object), `properties` (object), `children` (array)

5. **get_page**
   - Get page details
   - Parameters: `page_id` (string)

6. **update_page**
   - Update page properties
   - Parameters: `page_id` (string), `properties` (object)

7. **list_blocks**
   - List page blocks
   - Parameters: `block_id` (string)

8. **append_blocks**
   - Add blocks to a page
   - Parameters: `block_id` (string), `children` (array)

## 🧠 Memory Server Tools

**Package**: `@modelcontextprotocol/server-memory`

### Available Tools:
1. **create_entities**
   - Create knowledge entities
   - Parameters: `entities` (array)

2. **read_entities**
   - Read entity information
   - Parameters: `entity_names` (array)

3. **update_entities**
   - Update entity information
   - Parameters: `entities` (array)

4. **delete_entities**
   - Delete entities
   - Parameters: `entity_names` (array)

5. **search_entities**
   - Search for entities
   - Parameters: `query` (string), `limit` (number)

6. **create_relations**
   - Create relationships between entities
   - Parameters: `relations` (array)

7. **read_relations**
   - Read entity relationships
   - Parameters: `entity_names` (array)

8. **delete_relations**
   - Delete relationships
   - Parameters: `entity_names` (array)

## 🎯 Total Tools Available

| Server | Tools Count | Key Capabilities |
|--------|-------------|------------------|
| Filesystem | 8 | File operations, search, metadata |
| Git | 12 | Full Git workflow management |
| SQLite | 7 | Database operations, queries |
| Brave Search | 3 | Web search, local search, news |
| GitHub | 10 | Repository management, issues, PRs |
| Perplexity | 2 | AI-powered Q&A and search |
| Notion | 8 | Database and page management |
| Memory | 8 | Knowledge graph operations |

**Total: 58 tools across 8 servers**

## 🚀 Enhanced Git Server Configuration

Based on the available tools, here's how to use the expanded Git server capabilities:

### Basic Operations:
```bash
opencode run "check git status"
opencode run "show recent commits"
opencode run "list all branches"
```

### Advanced Operations:
```bash
opencode run "create a new branch called feature-x"
opencode run "switch to branch main"
opencode run "stage all changed files"
opencode run "commit with message 'Updated feature'"
opencode run "push changes to origin"
```

### Repository Analysis:
```bash
opencode run "show diff between HEAD and HEAD~1"
opencode run "show detailed information for commit abc123"
opencode run "find commits by author John since last week"
```