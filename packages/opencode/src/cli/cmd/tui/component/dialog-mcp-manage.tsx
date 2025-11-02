import { DialogSelect } from "@tui/ui/dialog-select"
import { DialogAlert } from "@tui/ui/dialog-alert"
import { createSignal } from "solid-js"
import { type DialogContext } from "@tui/ui/dialog"
import { AddMcpServerDialog } from "./dialog-mcp-add"

export function ManageMcpServersDialog() {
  const [step, setStep] = createSignal<"main" | "list" | "remove" | "config">("main")

  if (step() === "main") {
    return (
      <DialogSelect
        title="Manage MCP Servers"
        options={[
          {
            value: "add",
            title: "Add Server",
            description: "Add a new MCP server",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => <AddMcpServerDialog />)
            },
          },
          {
            value: "list",
            title: "List Servers",
            description: "View configured MCP servers",
            onSelect: () => setStep("list"),
          },
          {
            value: "remove",
            title: "Remove Server",
            description: "Remove an MCP server",
            onSelect: () => setStep("remove"),
          },
          {
            value: "config",
            title: "Configure Access",
            description: "Allow or exclude servers",
            onSelect: () => setStep("config"),
          },
          {
            value: "help",
            title: "Help & Examples",
            description: "Learn about MCP servers",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
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

Use 'opencode mcp --help' for all CLI options."
                />
              ))
            },
          },
        ]}
      />
    )
  }

  if (step() === "list") {
    return (
      <DialogSelect
        title="List MCP Servers"
        options={[
          {
            value: "global",
            title: "Global Servers",
            description: "List globally configured MCP servers",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Global MCP Servers"
                  message="To list global MCP servers, run:\n\nopencode mcp list --scope global\n\nThis shows servers available across all projects."
                />
              ))
            },
          },
          {
            value: "project",
            title: "Project Servers",
            description: "List project-specific MCP servers",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Project MCP Servers"
                  message="To list project MCP servers, run:\n\nopencode mcp list --scope project\n\nThis shows servers configured for the current project."
                />
              ))
            },
          },
          {
            value: "status",
            title: "Configuration Status",
            description: "View server access configuration",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="MCP Configuration Status"
                  message="To view MCP configuration status, run:\n\nopencode mcp config status\n\nThis shows which servers are allowed, excluded, or blocked."
                />
              ))
            },
          },
        ]}
      />
    )
  }

  if (step() === "remove") {
    return (
      <DialogSelect
        title="Remove MCP Server"
        options={[
          {
            value: "global",
            title: "Remove Global Server",
            description: "Remove a globally configured server",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Remove Global MCP Server"
                  message="To remove a global MCP server, run:\n\nopencode mcp remove <server-name> --scope global\n\nExample:\nopencode mcp remove filesystem --scope global"
                />
              ))
            },
          },
          {
            value: "project",
            title: "Remove Project Server",
            description: "Remove a project-specific server",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Remove Project MCP Server"
                  message="To remove a project MCP server, run:\n\nopencode mcp remove <server-name> --scope project\n\nExample:\nopencode mcp remove my-custom-server --scope project"
                />
              ))
            },
          },
        ]}
      />
    )
  }

  if (step() === "config") {
    return (
      <DialogSelect
        title="Configure MCP Access"
        options={[
          {
            value: "allow",
            title: "Allow Server",
            description: "Allow a specific MCP server",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Allow MCP Server"
                  message="To allow a specific MCP server, run:\n\nopencode mcp config allow <server-name>\n\nThis server will be explicitly allowed even if others are blocked."
                />
              ))
            },
          },
          {
            value: "exclude",
            title: "Exclude Server",
            description: "Exclude a specific MCP server",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Exclude MCP Server"
                  message="To exclude a specific MCP server, run:\n\nopencode mcp config exclude <server-name>\n\nThis server will be blocked from use."
                />
              ))
            },
          },
        ]}
      />
    )
  }

  return (
    <DialogAlert
      title="Manage MCP Servers"
      message="MCP server management completed."
    />
  )
}