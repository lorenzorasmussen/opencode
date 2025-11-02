import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { Global } from "../../global"
import { Agent } from "../../agent/agent"
import path from "path"
import matter from "gray-matter"
import { Instance } from "../../project/instance"
import { Log } from "../../util/log"
import fs from "fs"

const log = Log.create({ service: "agent-cli" })

const AgentCreateCommand = cmd({
  command: "create",
  describe: "create a new agent",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("Create agent")
        const project = Instance.project

        let scope: "global" | "project" = "global"
        if (project.vcs === "git") {
          const scopeResult = await prompts.select({
            message: "Location",
            options: [
              {
                label: "Current project",
                value: "project" as const,
                hint: Instance.worktree,
              },
              {
                label: "Global",
                value: "global" as const,
                hint: Global.Path.config,
              },
            ],
          })
          if (prompts.isCancel(scopeResult)) throw new UI.CancelledError()
          scope = scopeResult
        }

        const query = await prompts.text({
          message: "Description",
          placeholder: "What should this agent do?",
          validate: (x) => (x && x.length > 0 ? undefined : "Required"),
        })
        if (prompts.isCancel(query)) throw new UI.CancelledError()

        const spinner = prompts.spinner()

        spinner.start("Generating agent configuration...")
        const generated = await Agent.generate({ description: query }).catch((error) => {
          spinner.stop(`LLM failed to generate agent: ${error.message}`, 1)
          throw new UI.CancelledError()
        })
        spinner.stop(`Agent ${generated.identifier} generated`)

        const availableTools = [
          "bash",
          "read",
          "write",
          "edit",
          "list",
          "glob",
          "grep",
          "webfetch",
          "task",
          "todowrite",
          "todoread",
        ]

        const selectedTools = await prompts.multiselect({
          message: "Select tools to enable",
          options: availableTools.map((tool) => ({
            label: tool,
            value: tool,
          })),
          initialValues: availableTools,
        })
        if (prompts.isCancel(selectedTools)) throw new UI.CancelledError()

        const modeResult = await prompts.select({
          message: "Agent mode",
          options: [
            {
              label: "All",
              value: "all" as const,
              hint: "Can function in both primary and subagent roles",
            },
            {
              label: "Primary",
              value: "primary" as const,
              hint: "Acts as a primary/main agent",
            },
            {
              label: "Subagent",
              value: "subagent" as const,
              hint: "Can be used as a subagent by other agents",
            },
          ],
          initialValue: "all",
        })
        if (prompts.isCancel(modeResult)) throw new UI.CancelledError()

        const tools: Record<string, boolean> = {}
        for (const tool of availableTools) {
          if (!selectedTools.includes(tool)) {
            tools[tool] = false
          }
        }

        const frontmatter: any = {
          description: generated.whenToUse,
          mode: modeResult,
        }
        if (Object.keys(tools).length > 0) {
          frontmatter.tools = tools
        }

        const content = matter.stringify(generated.systemPrompt, frontmatter)
        const agentDir = path.join(
          scope === "global" ? Global.Path.config : path.join(Instance.worktree, ".opencode"),
          `agent`,
        )

        // Ensure directory exists
        if (!fs.existsSync(agentDir)) {
          fs.mkdirSync(agentDir, { recursive: true })
        }

        const filePath = path.join(agentDir, `${generated.identifier}.md`)
        await Bun.write(filePath, content)

        prompts.log.success(`Agent created: ${filePath}`)
        prompts.outro("Done")
      },
    })
  },
})

const AgentListCommand = cmd({
  command: "list",
  describe: "list all available agents",
  builder: (yargs) => {
    return yargs
      .option("scope", {
        describe: "filter by scope",
        type: "string",
        choices: ["global", "project", "all"],
        default: "all",
      })
      .option("format", {
        describe: "output format",
        type: "string",
        choices: ["table", "json"],
        default: "table",
      })
  },
  async handler(opts: any) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const agents = await Agent.list()

        if (opts.format === "json") {
          console.log(JSON.stringify(agents, null, 2))
          return
        }

        if (agents.length === 0) {
          console.log("No agents found.")
          return
        }

        UI.empty()
        prompts.intro("Available Agents")

        // Group by scope
        const globalAgents: Agent.Info[] = []
        const projectAgents: Agent.Info[] = []
        const builtInAgents: Agent.Info[] = []

        for (const agent of agents) {
          if (agent.builtIn) {
            builtInAgents.push(agent)
          } else {
            // Check if it's in project directory
            const projectAgentDir = path.join(Instance.worktree, ".opencode", "agent")
            const agentFile = path.join(projectAgentDir, `${agent.name}.md`)
            if (fs.existsSync(agentFile)) {
              projectAgents.push(agent)
            } else {
              globalAgents.push(agent)
            }
          }
        }

        const printAgentGroup = (title: string, agents: Agent.Info[]) => {
          if (agents.length === 0) return

          console.log(`\n${title}:`)
          agents.forEach((agent) => {
            const status = agent.builtIn ? "🔧 built-in" : "📝 custom"
            const mode = agent.mode === "all" ? "all" : agent.mode
            const tools = Object.entries(agent.tools || {})
              .filter(([_, enabled]) => enabled)
              .map(([name]) => name)
              .slice(0, 3)
              .join(", ")
            const toolCount = Object.values(agent.tools || {}).filter(Boolean).length
            const toolText = toolCount > 3 ? `${tools} +${toolCount - 3}` : tools

            console.log(`  ${agent.name} (${mode}) ${status}`)
            if (agent.description) {
              console.log(`    ${agent.description}`)
            }
            if (toolCount > 0) {
              console.log(`    Tools: ${toolText}`)
            }
            console.log("")
          })
        }

        printAgentGroup("Built-in Agents", builtInAgents)
        printAgentGroup("Project Agents", projectAgents)
        printAgentGroup("Global Agents", globalAgents)
      },
    })
  },
})

const AgentEditCommand = cmd({
  command: "edit <name>",
  describe: "edit an existing agent interactively",
  async handler(opts: any) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const agent = await Agent.get(opts.name as string)
        if (!agent) {
          UI.error(`Agent "${opts.name}" not found`)
          process.exit(1)
        }

        if (agent.builtIn) {
          UI.error(`Cannot edit built-in agent "${opts.name}"`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro(`Edit Agent: ${agent.name}`)

        // Find agent file
        const projectAgentDir = path.join(Instance.worktree, ".opencode", "agent")
        const globalAgentDir = path.join(Global.Path.config, "agent")

        let agentFile = path.join(projectAgentDir, `${agent.name}.md`)

        if (!fs.existsSync(agentFile)) {
          agentFile = path.join(globalAgentDir, `${agent.name}.md`)
        }

        if (!fs.existsSync(agentFile)) {
          UI.error(`Agent file not found for "${opts.name}"`)
          process.exit(1)
        }

        const content = await Bun.file(agentFile).text()
        const parsed = matter(content)

        // Edit description
        const description = await prompts.text({
          message: "Description",
          placeholder: "What should this agent do?",
          initialValue: agent.description || "",
        })
        if (prompts.isCancel(description)) throw new UI.CancelledError()

        // Edit mode
        const modeResult = await prompts.select({
          message: "Agent mode",
          options: [
            {
              label: "All",
              value: "all" as const,
              hint: "Can function in both primary and subagent roles",
            },
            {
              label: "Primary",
              value: "primary" as const,
              hint: "Acts as a primary/main agent",
            },
            {
              label: "Subagent",
              value: "subagent" as const,
              hint: "Can be used as a subagent by other agents",
            },
          ],
          initialValue: agent.mode,
        })
        if (prompts.isCancel(modeResult)) throw new UI.CancelledError()

        // Edit tools
        const availableTools = [
          "bash",
          "read",
          "write",
          "edit",
          "list",
          "glob",
          "grep",
          "webfetch",
          "task",
          "todowrite",
          "todoread",
        ]

        const currentTools = availableTools.filter((tool) => agent.tools?.[tool] !== false)

        const selectedTools = await prompts.multiselect({
          message: "Select tools to enable",
          options: availableTools.map((tool) => ({
            label: tool,
            value: tool,
          })),
          initialValues: currentTools,
        })
        if (prompts.isCancel(selectedTools)) throw new UI.CancelledError()

        // Edit system prompt
        const editPrompt = await prompts.confirm({
          message: "Edit system prompt?",
          initialValue: false,
        })
        if (prompts.isCancel(editPrompt)) throw new UI.CancelledError()

        let systemPrompt = parsed.content
        if (editPrompt) {
          const newPrompt = await prompts.text({
            message: "System prompt",
            placeholder: "Enter system prompt for this agent...",
            initialValue: parsed.content,
            validate: (x) => (x && x.length > 0 ? undefined : "Required"),
          })
          if (prompts.isCancel(newPrompt)) throw new UI.CancelledError()
          systemPrompt = newPrompt
        }

        // Build new frontmatter
        const tools: Record<string, boolean> = {}
        for (const tool of availableTools) {
          if (!selectedTools.includes(tool)) {
            tools[tool] = false
          }
        }

        const frontmatter: any = {
          description: description || undefined,
          mode: modeResult,
        }
        if (Object.keys(tools).length > 0) {
          frontmatter.tools = tools
        }

        const newContent = matter.stringify(systemPrompt, frontmatter)
        await Bun.write(agentFile, newContent)

        prompts.log.success(`Agent updated: ${agentFile}`)
        prompts.outro("Done")
      },
    })
  },
})

const AgentDeleteCommand = cmd({
  command: "delete <name>",
  describe: "delete an existing agent",
  async handler(opts: any) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const agent = await Agent.get(opts.name as string)
        if (!agent) {
          UI.error(`Agent "${opts.name}" not found`)
          process.exit(1)
        }

        if (agent.builtIn) {
          UI.error(`Cannot delete built-in agent "${opts.name}"`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro(`Delete Agent: ${agent.name}`)

        const confirm = await prompts.confirm({
          message: `Are you sure you want to delete agent "${agent.name}"?`,
          initialValue: false,
        })
        if (prompts.isCancel(confirm)) throw new UI.CancelledError()

        if (!confirm) {
          prompts.outro("Cancelled")
          return
        }

        // Find agent file
        const projectAgentDir = path.join(Instance.worktree, ".opencode", "agent")
        const globalAgentDir = path.join(Global.Path.config, "agent")

        let agentFile = path.join(projectAgentDir, `${agent.name}.md`)

        if (!fs.existsSync(agentFile)) {
          agentFile = path.join(globalAgentDir, `${agent.name}.md`)
        }

        if (!fs.existsSync(agentFile)) {
          UI.error(`Agent file not found for "${opts.name}"`)
          process.exit(1)
        }

        fs.unlinkSync(agentFile)
        prompts.log.success(`Agent deleted: ${agent.name}`)
        prompts.outro("Done")
      },
    })
  },
})

const AgentShowCommand = cmd({
  command: "show <name>",
  describe: "show detailed information about an agent",
  builder: (yargs) => {
    return yargs.option("format", {
      describe: "output format",
      type: "string",
      choices: ["table", "json", "yaml"],
      default: "table",
    })
  },
  async handler(opts: any) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const agent = await Agent.get(opts.name as string)
        if (!agent) {
          UI.error(`Agent "${opts.name}" not found`)
          process.exit(1)
        }

        if (opts.format === "json") {
          console.log(JSON.stringify(agent, null, 2))
          return
        }

        if (opts.format === "yaml") {
          // Simple YAML output
          console.log(`name: ${agent.name}`)
          console.log(`mode: ${agent.mode}`)
          console.log(`builtIn: ${agent.builtIn}`)
          if (agent.description) {
            console.log(`description: ${agent.description}`)
          }
          if (agent.model) {
            console.log(`model:`)
            console.log(`  providerID: ${agent.model.providerID}`)
            console.log(`  modelID: ${agent.model.modelID}`)
          }
          if (agent.tools) {
            console.log(`tools:`)
            Object.entries(agent.tools).forEach(([tool, enabled]) => {
              console.log(`  ${tool}: ${enabled}`)
            })
          }
          if (agent.permission) {
            console.log(`permission:`)
            console.log(`  edit: ${agent.permission.edit}`)
            console.log(`  webfetch: ${agent.permission.webfetch}`)
            if (typeof agent.permission.bash === "object") {
              console.log(`  bash:`)
              Object.entries(agent.permission.bash).forEach(([cmd, perm]) => {
                console.log(`    ${cmd}: ${perm}`)
              })
            } else {
              console.log(`  bash: ${agent.permission.bash}`)
            }
          }
          return
        }

        // Table format
        UI.empty()
        prompts.intro(`Agent: ${agent.name}`)

        console.log(`Mode: ${agent.mode}`)
        console.log(`Type: ${agent.builtIn ? "Built-in" : "Custom"}`)

        if (agent.description) {
          console.log(`\nDescription:`)
          console.log(`  ${agent.description}`)
        }

        if (agent.model) {
          console.log(`\nModel:`)
          console.log(`  Provider: ${agent.model.providerID}`)
          console.log(`  Model: ${agent.model.modelID}`)
        }

        if (agent.tools) {
          const enabledTools = Object.entries(agent.tools)
            .filter(([_, enabled]) => enabled)
            .map(([name]) => name)

          if (enabledTools.length > 0) {
            console.log(`\nEnabled Tools:`)
            enabledTools.forEach((tool) => console.log(`  • ${tool}`))
          }
        }

        if (agent.prompt) {
          console.log(`\nSystem Prompt:`)
          console.log(
            agent.prompt
              .split("\n")
              .map((line) => `  ${line}`)
              .join("\n"),
          )
        }
      },
    })
  },
})

export const AgentCommand = cmd({
  command: "agent",
  describe: "manage agents",
  builder: (yargs) =>
    yargs
      .command(AgentCreateCommand)
      .command(AgentListCommand)
      .command(AgentEditCommand)
      .command(AgentDeleteCommand)
      .command(AgentShowCommand)
      .demandCommand(),
  async handler() {},
})
