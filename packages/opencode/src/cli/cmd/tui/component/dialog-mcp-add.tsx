import { DialogSelect, type DialogSelectOption } from "@tui/ui/dialog-select"
import { DialogAlert } from "@tui/ui/dialog-alert"
import { createSignal, createResource } from "solid-js"
import { useDialog, type DialogContext } from "@tui/ui/dialog"

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

export function AddMcpServerDialog() {
  const dialog = useDialog()
  const [step, setStep] = createSignal<"type" | "stdio" | "remote" | "opencode" | "help">("type")
  const [discovered] = createResource(discoverMcpServers)

  if (step() === "type") {
    return (
      <DialogSelect
        title="Add MCP Server"
        options={[
          {
            value: "stdio",
            title: "Stdio (Local Command)",
            description: "Run a local command via stdin/stdout",
            onSelect: () => setStep("stdio"),
          },
          {
            value: "remote",
            title: "HTTP/SSE (Remote Server)",
            description: "Connect to a remote MCP server",
            onSelect: () => setStep("remote"),
          },
          {
            value: "opencode",
            title: "Add with OpenCode",
            description: "Paste JSON config or URL for LLM-assisted setup",
            onSelect: () => setStep("opencode"),
          },
          {
            value: "help",
            title: "Help & Examples",
            description: "Learn more about MCP server configuration",
            onSelect: () => setStep("help"),
          },
        ]}
      />
    )
  }

  if (step() === "stdio") {
    const discoveredServers = discovered()
    const availableServers = discoveredServers?.filter(s => s.available) || []
    const unavailableServers = discoveredServers?.filter(s => !s.available) || []

    const options: DialogSelectOption[] = []

    // Add available discovered servers first
    availableServers.forEach((server) => {
      options.push({
        value: server.name,
        title: `${server.name} (Available)`,
        description: server.description,
        onSelect: (ctx: DialogContext) => addStdioServer(ctx, server.name, server.command[0], server.command.slice(1)),
      })
    })

    // Add unavailable discovered servers
    unavailableServers.forEach((server) => {
      options.push({
        value: `install-${server.name}`,
        title: `${server.name} (Not Installed)`,
        description: `${server.description} - Install required`,
        onSelect: (ctx: DialogContext) => {
          ctx.replace(() => (
            <DialogAlert
              title="Server Not Available"
              message={`The ${server.name} MCP server is not installed.\n\nTo install it, run:\n\nnpm install -g @modelcontextprotocol/server-${server.name}\n\nThen try adding it again.`}
            />
          ))
        },
      })
    })

    // Add custom command option
    options.push({
      value: "custom",
      title: "Custom Command",
      description: "Enter your own command",
      onSelect: (ctx: DialogContext) => {
        ctx.replace(() => (
          <DialogAlert
            title="Custom Stdio Server"
            message={'For custom MCP servers, use the CLI command:\n\nopencode mcp add <name> "your command here"\n\nExample:\nopencode mcp add my-server "python -m my_mcp_server"'}
          />
        ))
      },
    })

    return (
      <DialogSelect
        title="Add Stdio MCP Server"
        options={options}
      />
    )
  }

  if (step() === "remote") {
    return (
      <DialogSelect
        title="Add Remote MCP Server"
        options={[
          {
            value: "http",
            title: "HTTP Streaming",
            description: "Connect to HTTP streaming endpoint",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="HTTP MCP Server"
                  message="For HTTP MCP servers, use the CLI command:\n\nopencode mcp add <name> <url> --transport http\n\nExample:\nopencode mcp add my-server https://api.example.com/mcp --transport http"
                />
              ))
            },
          },
          {
            value: "sse",
            title: "Server-Sent Events",
            description: "Connect to SSE endpoint",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="SSE MCP Server"
                  message="For SSE MCP servers, use the CLI command:\n\nopencode mcp add <name> <url> --transport sse\n\nExample:\nopencode mcp add my-server https://api.example.com/sse --transport sse"
                />
              ))
            },
          },
        ]}
      />
    )
  }

  if (step() === "opencode") {
    return (
      <DialogSelect
        title="Add MCP Server with OpenCode"
        options={[
          {
            value: "json",
            title: "Paste JSON Config",
            description: "Paste a JSON configuration object",
            onSelect: (ctx: DialogContext) => {
              const message = 'To add an MCP server from JSON config, use:\n\nopencode mcp add <name> --config \'<json-string>\'\n\nThe LLM will help parse and validate the configuration.'
              ctx.replace(() => (
                <DialogAlert
                  title="JSON Configuration"
                  message={message}
                />
              ))
            },
          },
          {
            value: "url",
            title: "From URL",
            description: "Provide a URL to fetch configuration",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="URL Configuration"
                  message="To add an MCP server from a URL, use:\n\nopencode mcp add <name> --url <config-url>\n\nThe LLM will fetch and parse the configuration."
                />
              ))
            },
          },
          {
            value: "describe",
            title: "Describe Server",
            description: "Describe what you want the server to do",
            onSelect: (ctx: DialogContext) => {
              const message = 'Tell the LLM what MCP server you want to add:\n\nopencode mcp add --describe "I want a server that can search through my code files"\n\nThe LLM will suggest and configure the appropriate server.'
              ctx.replace(() => (
                <DialogAlert
                  title="Describe MCP Server"
                  message={message}
                />
              ))
            },
          },
        ]}
      />
    )
  }

  if (step() === "help") {
    return (
      <DialogAlert
        title="MCP Server Help"
        message="MCP (Model Context Protocol) servers extend OpenCode's capabilities by providing additional tools and resources.

Transport Types:
• Stdio: Run local commands (filesystem, git, puppeteer, etc.)
• HTTP: Connect to remote HTTP streaming endpoints
• SSE: Connect to Server-Sent Events endpoints

 Popular MCP Servers:
 • Filesystem: File operations and management
 • Git: Repository analysis and operations
 • Puppeteer: Web automation and scraping
 • SQLite: Database queries and management
 • GitHub: GitHub API integration

Use 'opencode mcp add --help' for all configuration options."
      />
    )
  }

  return (
    <DialogAlert
      title="Add MCP Server"
      message="MCP server addition completed. Use 'opencode mcp list' to see configured servers."
    />
  )
}

function addStdioServer(ctx: DialogContext, name: string, command: string, args: string[]) {
  // Create the full command string
  const fullCommand = command + " " + args.join(" ")
  const message = "Run this command to add the MCP server:\n\nopencode mcp add " + name + " \"" + fullCommand + "\"\n\nThis will configure the " + name + " server for you."
  ctx.replace(() => (
    <DialogAlert
      title="MCP Server Command"
      message={message}
    />
  ))
}