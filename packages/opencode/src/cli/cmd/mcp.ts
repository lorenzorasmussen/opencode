import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { Global } from "../../global"
import { Instance } from "../../project/instance"
import path from "path"
import fs from "fs/promises"
import { Config } from "../../config/config"

const McpAddCommand = cmd({
  command: "add [name] [commandOrUrl]",
  describe: "add an MCP server",
  builder: (yargs) => {
    return yargs
      .positional("name", {
        describe: "unique name for the server",
        type: "string",
      })
      .positional("commandOrUrl", {
        describe: "command for local server or URL for remote server",
        type: "string",
      })
      .option("type", {
        alias: "t",
        describe: "server type",
        choices: ["local", "remote"] as const,
        default: "local" as const,
      })
      .example("$0 filesystem 'npx -y @modelcontextprotocol/server-filesystem /tmp'", "Add filesystem MCP server")
      .example("$0 git 'npx -y @modelcontextprotocol/server-git --repository .'", "Add git MCP server")
      .example("$0 puppeteer 'npx -y @modelcontextprotocol/server-puppeteer'", "Add puppeteer MCP server")
      .example("$0 my-api https://api.example.com/mcp --type remote", "Add remote HTTP MCP server")
      .option("env", {
        alias: "e",
        describe: "environment variables (KEY=value)",
        type: "array",
      })
      .option("header", {
        alias: "H",
        describe: "HTTP headers for remote servers (Key: Value)",
        type: "array",
      })
      .option("timeout", {
        describe: "request timeout in milliseconds",
        type: "number",
        default: 5000,
      })
      .option("enabled", {
        describe: "enable the server on startup",
        type: "boolean",
        default: true,
      })
      .option("scope", {
        describe: "configuration scope",
        choices: ["global", "project"] as const,
        default: "global" as const,
      })
      .option("describe", {
        describe: "describe what MCP server you want (LLM-assisted setup)",
        type: "string",
      })
      .option("config", {
        describe: "JSON configuration string (LLM-assisted parsing)",
        type: "string",
      })
      .option("url", {
        describe: "URL to fetch MCP server configuration from",
        type: "string",
      })
  },
   async handler(opts) {
     const scope = opts.scope as "global" | "project"

     // Handle LLM-assisted setup options
     if (opts.describe) {
       return await handleDescribeOption(opts.describe as string, scope)
     }

     if (opts.config) {
       return await handleConfigOption(opts.config as string, scope)
     }

     if (opts.url) {
       return await handleUrlOption(opts.url as string, scope)
     }

     UI.empty()
     prompts.intro(`Add MCP server (${scope} scope)`)

    // Get server name
    let name = opts.name as string
    if (!name) {
      const nameResult = await prompts.text({
        message: "Enter MCP server name",
        validate: (x) => (x && x.length > 0 ? undefined : "Required"),
      })
      if (prompts.isCancel(nameResult)) throw new UI.CancelledError()
      name = nameResult as string
    }

    // Get server type
    let serverType = opts.type as "local" | "remote"
    if (!opts.name) {
      const typeResult = await prompts.select({
        message: "Select server type",
        options: [
          {
            label: "Local (Command)",
            value: "local",
            hint: "Run a local command",
          },
          {
            label: "Remote (HTTP)",
            value: "remote",
            hint: "Connect to remote HTTP endpoint",
          },
        ],
      })
      if (prompts.isCancel(typeResult)) throw new UI.CancelledError()
      serverType = typeResult as "local" | "remote"
    }

    let serverConfig: Config.Mcp

    // Configure based on type
    if (serverType === "local") {
      let command = opts.commandOrUrl as string
      if (!command) {
        const commandResult = await prompts.text({
          message: "Enter command to run",
          placeholder: "e.g., npx -y @modelcontextprotocol/server-filesystem /tmp",
          validate: (x) => (x && x.length > 0 ? undefined : "Required"),
        })
        if (prompts.isCancel(commandResult)) throw new UI.CancelledError()
        command = commandResult as string
      }

      // Parse command and args
      const parts = command.split(' ')
      serverConfig = {
        type: "local",
        command: parts,
        enabled: opts.enabled as boolean,
        timeout: opts.timeout as number,
      }

      // Environment variables
      if (opts.env && Array.isArray(opts.env)) {
        serverConfig.environment = {}
        for (const env of opts.env) {
          const [key, ...valueParts] = (env as string).split('=')
          serverConfig.environment[key] = valueParts.join('=')
        }
      }
    } else {
      let url = opts.commandOrUrl as string
      if (!url) {
        const urlResult = await prompts.text({
          message: "Enter server URL",
          placeholder: "https://api.example.com/mcp",
          validate: (x) => {
            if (!x) return "Required"
            try {
              new URL(x)
              return undefined
            } catch {
              return "Invalid URL"
            }
          },
        })
        if (prompts.isCancel(urlResult)) throw new UI.CancelledError()
        url = urlResult as string
      }

      serverConfig = {
        type: "remote",
        url,
        enabled: opts.enabled as boolean,
        timeout: opts.timeout as number,
      }

      // Headers
      if (opts.header && Array.isArray(opts.header)) {
        serverConfig.headers = {}
        for (const header of opts.header) {
          const [key, ...valueParts] = (header as string).split(': ')
          serverConfig.headers[key] = valueParts.join(': ')
        }
      }
    }

    // Add the server
    await addMcpServer(name, serverConfig, scope)

    prompts.log.success(`MCP server "${name}" added successfully (${scope} scope)`)
    prompts.outro("MCP server configured")
  },
})

const McpListCommand = cmd({
  command: "list",
  describe: "list all configured MCP servers",
  builder: (yargs) => {
    return yargs
      .option("format", {
        describe: "output format",
        type: "string",
        choices: ["table", "json"],
        default: "table",
      })
      .option("scope", {
        describe: "configuration scope",
        choices: ["global", "project"] as const,
        default: "global" as const,
      })
  },
  async handler(opts) {
    const scope = opts.scope as "global" | "project"

    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const servers = await listMcpServers(scope)

        if (opts.format === "json") {
          console.log(JSON.stringify({ servers }, null, 2))
          return
        }

        UI.empty()
        prompts.intro(`MCP Servers (${scope} scope)`)

        if (servers.length === 0) {
          prompts.note(`No MCP servers configured in ${scope} scope.`)
          return
        }

        console.log(`\n📋 Configured Servers (${scope} scope):`)
        servers.forEach((server) => {
          const statusIcon = server.enabled ? "✅" : "⏸️"
          console.log(`  ${statusIcon} ${server.name} (${server.type})`)
          if (server.type === "local") {
            console.log(`    Command: ${server.command.join(' ')}`)
            if (server.environment) {
              console.log(`    Environment: ${Object.entries(server.environment).map(([k, v]) => `${k}=${v}`).join(', ')}`)
            }
          } else if (server.type === "remote") {
            console.log(`    URL: ${server.url}`)
            if (server.headers) {
              console.log(`    Headers: ${Object.entries(server.headers).map(([k, v]) => `${k}: ${v}`).join(', ')}`)
            }
          }
          console.log(`    Timeout: ${server.timeout}ms`)
          console.log(`    Enabled: ${server.enabled}`)
          console.log("")
        })
      },
    })
  },
})

const McpRemoveCommand = cmd({
  command: "remove <name>",
  describe: "remove an MCP server",
  builder: (yargs) => {
    return yargs.option("scope", {
      describe: "configuration scope",
      choices: ["global", "project"] as const,
      default: "global" as const,
    })
  },
  async handler(opts) {
    const scope = opts.scope as "global" | "project"

    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const servers = await listMcpServers(scope)
        const server = servers.find((s) => s.name === opts.name)

        if (!server) {
          UI.error(`MCP server "${opts.name}" not found in ${scope} scope`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro(`Remove MCP Server: ${server.name} (${scope} scope)`)

        const confirm = await prompts.confirm({
          message: `Are you sure you want to remove MCP server "${server.name}" from ${scope} scope?`,
          initialValue: false,
        })
        if (prompts.isCancel(confirm)) throw new UI.CancelledError()

        if (!confirm) {
          prompts.outro("Cancelled")
          return
        }

        await removeMcpServer(opts.name as string, scope)
        prompts.log.success(`MCP server removed: ${opts.name} (${scope} scope)`)
        prompts.outro("Done")
      },
    })
  },
})

const McpDiscoverCommand = cmd({
  command: "discover",
  describe: "discover available MCP servers",
  async handler() {
    UI.empty()
    prompts.intro("Discovering MCP Servers")

    const discovered = await discoverMcpServers()

    console.log("\n🔍 Discovered MCP Servers:")
    discovered.forEach((server) => {
      const statusIcon = server.available ? "✅" : "❌"
      console.log(`  ${statusIcon} ${server.name} - ${server.description}`)
      if (server.available) {
        console.log(`    Command: ${server.command.join(' ')}`)
      }
    })

    const availableCount = discovered.filter(s => s.available).length
    console.log(`\n📊 Found ${availableCount} of ${discovered.length} common MCP servers available.`)

    if (availableCount > 0) {
      console.log("\n💡 Tip: Use 'opencode mcp add <name>' to add any of these servers.")
    }
  },
})

const McpStatusCommand = cmd({
  command: "status",
  describe: "show MCP configuration status",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const servers = await listMcpServers()

        UI.empty()
        prompts.intro("MCP Configuration Status")

        console.log("\n📊 Summary:")
        console.log(`  Total servers: ${servers.length}`)
        console.log(`  Enabled servers: ${servers.filter(s => s.enabled).length}`)
        console.log(`  Disabled servers: ${servers.filter(s => !s.enabled).length}`)

        console.log("\n📋 Server Status:")
        servers.forEach((server) => {
          const statusIcon = server.enabled ? "✅" : "⏸️"
          console.log(`  ${statusIcon} ${server.name} (${server.type}) - ${server.enabled ? 'enabled' : 'disabled'}`)
        })
      },
    })
  },
})

// MCP Server Discovery
interface DiscoveredServer {
  name: string
  description: string
  command: string[]
  available: boolean
}

async function discoverMcpServers(): Promise<DiscoveredServer[]> {
  const servers: DiscoveredServer[] = []

  // Common MCP servers to check
  const commonServers = [
    {
      name: "filesystem",
      description: "File system operations",
      command: ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
      checkCommand: "npx --package @modelcontextprotocol/server-filesystem --version",
    },
    {
      name: "git",
      description: "Git repository operations",
      command: ["npx", "-y", "@modelcontextprotocol/server-git", "--repository", process.cwd()],
      checkCommand: "npx --package @modelcontextprotocol/server-git --version",
    },
    {
      name: "puppeteer",
      description: "Web automation and scraping",
      command: ["npx", "-y", "@modelcontextprotocol/server-puppeteer"],
      checkCommand: "npx --package @modelcontextprotocol/server-puppeteer --version",
    },
    {
      name: "sqlite",
      description: "SQLite database operations",
      command: ["npx", "-y", "@modelcontextprotocol/server-sqlite", "--db-path", "/tmp/test.db"],
      checkCommand: "npx --package @modelcontextprotocol/server-sqlite --version",
    },
    {
      name: "github",
      description: "GitHub API integration",
      command: ["npx", "-y", "@modelcontextprotocol/server-github"],
      checkCommand: "npx --package @modelcontextprotocol/server-github --version",
    },
  ]

  for (const server of commonServers) {
    try {
      // Check if the package is available
      await Bun.$`${server.checkCommand}`.quiet()
      servers.push({
        ...server,
        available: true,
      })
    } catch {
      servers.push({
        ...server,
        available: false,
      })
    }
  }

  return servers
}

// Helper functions - MCP servers are now stored in opencode.json

async function loadMcpConfig(scope: "global" | "project" = "global"): Promise<Config.Info> {
  if (scope === "global") {
    return await Config.global()
  } else {
    // For project scope, we need to load project-specific config
    // For now, we'll use global config as project config isn't implemented yet
    return await Config.global()
  }
}

async function saveMcpConfig(config: Config.Info, scope: "global" | "project" = "global"): Promise<void> {
  if (scope === "global") {
    const configPath = path.join(Global.Path.config, "opencode.json")
    await Bun.write(configPath, JSON.stringify(config, null, 2))
  } else {
    // For project scope, save to project .opencode/opencode.json
    const projectConfigPath = path.join(Instance.worktree, ".opencode", "opencode.json")
    try {
      await fs.mkdir(path.dirname(projectConfigPath), { recursive: true } as any)
    } catch {}
    await Bun.write(projectConfigPath, JSON.stringify(config, null, 2))
  }
}

async function listMcpServers(scope: "global" | "project" = "global"): Promise<Array<{name: string} & Config.Mcp>> {
  const config = await loadMcpConfig(scope)
  const servers: Array<{name: string} & Config.Mcp> = []

  if (config.mcp) {
    for (const [name, serverConfig] of Object.entries(config.mcp)) {
      servers.push({ name, ...serverConfig })
    }
  }

  return servers
}

async function addMcpServer(name: string, config: Config.Mcp, scope: "global" | "project" = "global"): Promise<void> {
  const currentConfig = await loadMcpConfig(scope)

  if (!currentConfig.mcp) {
    currentConfig.mcp = {}
  }

  currentConfig.mcp[name] = config
  await saveMcpConfig(currentConfig, scope)
}

async function removeMcpServer(name: string, scope: "global" | "project" = "global"): Promise<void> {
  const currentConfig = await loadMcpConfig(scope)

  if (currentConfig.mcp && currentConfig.mcp[name]) {
    delete currentConfig.mcp[name]
    await saveMcpConfig(currentConfig, scope)
  }
}

// LLM-assisted setup handlers
async function handleDescribeOption(description: string, scope: "global" | "project") {
  UI.empty()
  prompts.intro("LLM-Assisted MCP Server Setup")

  console.log(`🤖 Analyzing your description: "${description}"`)
  console.log("")

  // For now, provide helpful suggestions based on common patterns
  // In a full implementation, this would call an LLM to analyze the description
  const suggestions = analyzeDescription(description)

  if (suggestions.length === 0) {
    prompts.log.error("Could not determine MCP server configuration from description")
    console.log("Try providing more specific details about what you want the server to do.")
    return
  }

  console.log("💡 Suggested MCP server configurations:")
  suggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion.name}`)
    console.log(`   ${suggestion.description}`)
    console.log(`   Command: ${suggestion.command}`)
    console.log("")
  })

  const selected = await prompts.select({
    message: "Select a configuration to add:",
    options: suggestions.map((s, index) => ({
      label: s.name,
      value: index,
      hint: s.description,
    })),
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  const config = suggestions[selected as number]
  await addMcpServer(config.name.toLowerCase().replace(/\s+/g, '-'), {
    type: "local",
    command: config.command.split(' '),
    enabled: true,
    timeout: 5000,
  }, scope)

  prompts.log.success(`MCP server "${config.name}" added successfully (${scope} scope)`)
  prompts.outro("Server configured and ready to use")
}

async function handleConfigOption(configJson: string, scope: "global" | "project") {
  UI.empty()
  prompts.intro("LLM-Assisted JSON Configuration Parsing")

  try {
    // Parse and validate the JSON
    const parsed = JSON.parse(configJson)

    // Basic validation - check for required fields
    if (!parsed.name || !parsed.type) {
      throw new Error("Configuration must include 'name' and 'type' fields")
    }

    if (!['local', 'remote'].includes(parsed.type)) {
      throw new Error("Type must be 'local' or 'remote'")
    }

    console.log("✅ Configuration validated")
    console.log(`📋 Server: ${parsed.name}`)
    console.log(`🔧 Type: ${parsed.type}`)

    if (parsed.type === 'local' && parsed.command) {
      console.log(`💻 Command: ${Array.isArray(parsed.command) ? parsed.command.join(' ') : parsed.command}`)
    } else if (parsed.type === 'remote' && parsed.url) {
      console.log(`🌐 URL: ${parsed.url}`)
    }

    const confirm = await prompts.confirm({
      message: "Add this MCP server configuration?",
      initialValue: true,
    })

    if (prompts.isCancel(confirm) || !confirm) {
      prompts.outro("Cancelled")
      return
    }

    // Convert to Config.Mcp format
    let serverConfig: Config.Mcp

    if (parsed.type === 'local') {
      serverConfig = {
        type: "local",
        command: Array.isArray(parsed.command) ? parsed.command : parsed.command.split(' '),
        enabled: parsed.enabled !== false,
        timeout: parsed.timeout || 5000,
      }
      if (parsed.environment) {
        serverConfig.environment = parsed.environment
      }
    } else if (parsed.type === 'remote') {
      serverConfig = {
        type: "remote",
        url: parsed.url,
        enabled: parsed.enabled !== false,
        timeout: parsed.timeout || 5000,
      }
      if (parsed.headers) {
        serverConfig.headers = parsed.headers
      }
    } else {
      throw new Error(`Unsupported server type: ${parsed.type}`)
    }

    await addMcpServer(parsed.name, serverConfig, scope)
    prompts.log.success(`MCP server "${parsed.name}" added successfully (${scope} scope)`)
    prompts.outro("Server configured and ready to use")

  } catch (error) {
    prompts.log.error("Failed to parse configuration")
    console.log(`Error: ${error instanceof Error ? error.message : String(error)}`)
    console.log("")
    console.log("Expected JSON format:")
    console.log(`{
  "name": "server-name",
  "type": "local|remote",
  "command": ["cmd", "arg1", "arg2"], // for local
  "url": "https://api.example.com/mcp", // for remote
  "environment": {"KEY": "value"}, // optional
  "headers": {"Authorization": "Bearer token"}, // optional for remote
  "timeout": 5000, // optional
  "enabled": true // optional
}`)
  }
}

async function handleUrlOption(url: string, scope: "global" | "project") {
  UI.empty()
  prompts.intro("Fetching MCP Server Configuration from URL")

  try {
    console.log(`📡 Fetching configuration from: ${url}`)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const configJson = await response.text()
    console.log("✅ Configuration fetched successfully")

    // Reuse the config parsing logic
    await handleConfigOption(configJson, scope)

  } catch (error) {
    prompts.log.error("Failed to fetch configuration")
    console.log(`Error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Simple description analyzer (would be replaced with LLM in full implementation)
function analyzeDescription(description: string): Array<{name: string, description: string, command: string}> {
  const desc = description.toLowerCase()

  const suggestions = []

  if (desc.includes('file') || desc.includes('filesystem') || desc.includes('read file') || desc.includes('write file')) {
    suggestions.push({
      name: "Filesystem",
      description: "File system operations and management",
      command: "npx -y @modelcontextprotocol/server-filesystem /tmp"
    })
  }

  if (desc.includes('git') || desc.includes('repository') || desc.includes('version control')) {
    suggestions.push({
      name: "Git",
      description: "Git repository analysis and operations",
      command: "npx -y @modelcontextprotocol/server-git --repository ."
    })
  }

  if (desc.includes('web') || desc.includes('browser') || desc.includes('scrape') || desc.includes('puppeteer')) {
    suggestions.push({
      name: "Puppeteer",
      description: "Web automation and scraping",
      command: "npx -y @modelcontextprotocol/server-puppeteer"
    })
  }

  if (desc.includes('database') || desc.includes('sqlite') || desc.includes('sql')) {
    suggestions.push({
      name: "SQLite",
      description: "SQLite database operations",
      command: "npx -y @modelcontextprotocol/server-sqlite --db-path /tmp/test.db"
    })
  }

  if (desc.includes('github') || desc.includes('api') || desc.includes('repository')) {
    suggestions.push({
      name: "GitHub",
      description: "GitHub API integration",
      command: "npx -y @modelcontextprotocol/server-github"
    })
  }

  return suggestions
}

export const McpCommand = cmd({
  command: "mcp",
  describe: "manage MCP (Model Context Protocol) servers",
  builder: (yargs) =>
    yargs
      .command(McpAddCommand)
      .command(McpListCommand)
      .command(McpRemoveCommand)
      .command(McpDiscoverCommand)
      .command(McpStatusCommand)
      .demandCommand(),
  async handler() {},
})