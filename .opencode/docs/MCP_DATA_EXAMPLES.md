# MCP Server Data Examples

This document shows the actual data structures and examples you can expect from each MCP server.

## 🧠 Perplexity Server - AI-Powered Answers

**Tool: `ask_perplexity`**
**Input:** `{"query": "What are the main challenges in AI safety?"}`

**Expected Response Structure:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "The main challenges in AI safety include:\n\n1. **Alignment Problem**: Ensuring AI systems pursue goals that align with human values\n2. **Robustness**: Making AI systems reliable under various conditions\n3. **Scalability**: Ensuring safety measures work as AI systems become more powerful\n4. **Verification**: Proving that AI systems are safe mathematically\n5. **Value Learning**: Teaching AI systems what humans actually want\n\nRecent developments include:\n- Constitutional AI approaches\n- Debate and amplification techniques\n- Adversarial training methods\n- Formal verification research\n\nSources: Recent papers from OpenAI, Anthropic, DeepMind, and academic research."
      }
    ]
  }
}
```

**Real Example Queries:**
- "Explain quantum computing in simple terms"
- "What are the latest developments in fusion energy?"
- "How does machine learning differ from traditional programming?"
- "What are the ethical implications of facial recognition technology?"

## 📝 Notion Server - Workspace Data

**Tool: `list_databases`**
**Input:** `{}`

**Expected Response Structure:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 3 databases in your workspace:\n\n1. **Project Tracker**\n   - ID: 12345678-1234-1234-1234-123456789abc\n   - Properties: Name, Status, Priority, Due Date, Assignee\n\n2. **Meeting Notes**\n   - ID: 87654321-4321-4321-4321-cba987654321\n   - Properties: Title, Date, Participants, Key Decisions, Action Items\n\n3. **Knowledge Base**\n   - ID: a1b2c3d4-e5f6-4321-4321-123456789012\n   - Properties: Topic, Category, Last Updated, Tags"
      }
    ]
  }
}
```

**Tool: `list_pages`**
**Input:** `{"database_id": "12345678-1234-1234-1234-123456789abc"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Database 'Project Tracker' contains 5 pages:\n\n1. **Website Redesign**\n   - Status: In Progress\n   - Priority: High\n   - Due Date: 2024-02-15\n   - Assignee: John Doe\n\n2. **API Integration**\n   - Status: Planning\n   - Priority: Medium\n   - Due Date: 2024-03-01\n   - Assignee: Jane Smith\n\n[... more pages ...]"
      }
    ]
  }
}
```

## 🔍 Brave Search Server - Web Search Results

**Tool: `brave_web_search`**
**Input:** `{"query": "latest AI news 2024"}`

**Expected Response Structure:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Search Results for 'latest AI news 2024':\n\n1. **OpenAI GPT-5 Rumors Heat Up**\n   - Summary: Industry speculation about OpenAI's next major model release\n   - URL: https://techcrunch.com/openai-gpt-5-rumors\n   - Published: 2024-01-15\n\n2. **Google DeepMind Achieves Breakthrough in Protein Folding**\n   - Summary: New AI system predicts protein structures with 95% accuracy\n   - URL: https://deepmind.google/protein-folding-breakthrough\n   - Published: 2024-01-12\n\n3. **Anthropic Raises $750M for AI Safety Research**\n   - Summary: Funding round focused on developing safer AI systems\n   - URL: https://anthropic.com/funding-announcement\n   - Published: 2024-01-10\n\n[... more results ...]"
      }
    ]
  }
}
```

## 🐙 GitHub Server - Repository Data

**Tool: `get_user`**
**Input:** `{"username": "octocat"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "GitHub User: octocat\n\n- **Name**: The Octocat\n- **Bio**: GitHub's mascot and official demo account\n- **Location**: San Francisco, CA\n- **Company**: GitHub\n- **Public Repos**: 8\n- **Followers**: 12,345\n- **Following**: 0\n- **Joined**: January 2008\n\nPopular Repositories:\n1. **Hello-World** (2.1k stars) - A simple hello world repository\n2. **Spoon-Knife** (11.4k stars) - A test repository for forking\n3. **Octocat.jpg** (456 stars) - Octocat image assets"
      }
    ]
  }
}
```

**Tool: `search_repositories`**
**Input:** `{"query": "language:typescript stars:>1000", "sort": "stars", "order": "desc"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Top TypeScript repositories by stars:\n\n1. **microsoft/vscode** (156k ⭐)\n   - Microsoft's open source code editor\n   - Last updated: 2 hours ago\n\n2. **microsoft/TypeScript** (94k ⭐)\n   - TypeScript is a superset of JavaScript\n   - Last updated: 1 day ago\n\n3. **denoland/deno** (91k ⭐)\n   - A secure runtime for JavaScript and TypeScript\n   - Last updated: 3 hours ago\n\n[... more results ...]"
      }
    ]
  }
}
```

## 💾 SQLite Server - Database Operations

**Tool: `run_query`**
**Input:** `{"query": "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT); INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com'), ('Jane Smith', 'jane@example.com'); SELECT * FROM users;"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Query executed successfully!\n\nResults:\n\n| id | name       | email            |\n|----|------------|------------------|\n| 1  | John Doe   | john@example.com |\n| 2  | Jane Smith | jane@example.com |\n\n2 rows returned"
      }
    ]
  }
}
```

## 📁 Filesystem Server - File Operations

**Tool: `read_file`**
**Input:** `{"path": "/Users/username/Documents/notes.txt"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Meeting Notes\n\n## January 15, 2024\n\n- Discussed Q1 goals\n- Assigned tasks to team members\n- Next meeting: January 22\n\n## Action Items\n- [ ] Update project timeline\n- [ ] Review budget\n- [x] Send meeting recap"
      }
    ]
  }
}
```

**Tool: `list_directory`**
**Input:** `{"path": "/Users/username/Documents"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Contents of /Users/username/Documents:\n\n**Directories:**\n- Projects/\n- Personal/\n- Work/\n\n**Files:**\n- resume.pdf (2.3 MB)\n- notes.txt (1.2 KB)\n- budget.xlsx (456 KB)\n- presentation.pptx (8.9 MB)\n\nTotal: 7 items (12.8 MB)"
      }
    ]
  }
}
```

## 🧠 Memory Server - Knowledge Storage

**Tool: `create_entities`**
**Input:** `{"entities": [{"name": "OpenCode", "entityType": "software", "observations": ["Multi-agent development environment", "Supports MCP servers", "Built with TypeScript"]}]}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Successfully stored entity 'OpenCode' with 3 observations in the knowledge graph."
      }
    ]
  }
}
```

**Tool: `query_entities`**
**Input:** `{"query": "What is OpenCode?"}`

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Based on stored knowledge:\n\n**OpenCode** is a software that:\n- Is a multi-agent development environment\n- Supports MCP (Model Context Protocol) servers\n- Is built with TypeScript\n\nRelated concepts: MCP servers, TypeScript, development environment"
      }
    ]
  }
}
```

## 🚀 How to Get This Data in OpenCode

Use natural language queries that trigger the appropriate MCP server:

```bash
# Perplexity AI answers
opencode run "What are the latest breakthroughs in quantum computing?"

# Notion workspace data
opencode run "Show me all my Notion databases"

# Web search
opencode run "Search for recent developments in renewable energy"

# GitHub data
opencode run "Find popular Python repositories on GitHub"

# Database operations
opencode run "Create a table for storing project tasks"

# File operations
opencode run "Read the contents of my README.md file"

# Knowledge storage
opencode run "Remember that Kubernetes is a container orchestration platform"
```

All responses follow the JSON-RPC 2.0 format with structured content that OpenCode can parse and present in a user-friendly way.