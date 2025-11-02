import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { Global } from "../../global"
import { Agent } from "../../agent/agent"
import { loadCommands } from "./command"
import path from "path"
import matter from "gray-matter"
import { Instance } from "../../project/instance"
import { Log } from "../../util/log"
import fs from "fs"

const log = Log.create({ service: "interactive-cli" })

const InteractiveManageCommand = cmd({
  command: "manage",
  describe: "interactive mode for managing agents and commands",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("OpenCode Interactive Management")

        while (true) {
          const action = await prompts.select({
            message: "What would you like to manage?",
            options: [
              {
                label: "🤖 Agents",
                value: "agents",
                hint: "Create, edit, delete, and manage AI agents",
              },
              {
                label: "⚡ Commands",
                value: "commands",
                hint: "Create, edit, delete, and manage custom commands",
              },
              {
                label: "📊 Status",
                value: "status",
                hint: "View system status and statistics",
              },
              {
                label: "🚪 Exit",
                value: "exit",
                hint: "Exit interactive mode",
              },
            ],
          })

          if (prompts.isCancel(action)) throw new UI.CancelledError()

          switch (action) {
            case "agents":
              await manageAgents()
              break
            case "commands":
              await manageCommands()
              break
            case "status":
              await showStatus()
              break
            case "exit":
              prompts.outro("Goodbye!")
              return
          }
        }
      },
    })
  },
})

async function manageAgents() {
  while (true) {
    const agents = await Agent.list()

    const action = await prompts.select({
      message: "Agent Management",
      options: [
        {
          label: "📝 Create Agent",
          value: "create",
          hint: "Create a new AI agent",
        },
        {
          label: "📋 List Agents",
          value: "list",
          hint: "View all available agents",
        },
        {
          label: "✏️ Edit Agent",
          value: "edit",
          hint: "Modify an existing agent",
        },
        {
          label: "🗑️ Delete Agent",
          value: "delete",
          hint: "Remove an agent",
        },
        {
          label: "👁️ Show Agent Details",
          value: "show",
          hint: "View detailed agent information",
        },
        {
          label: "🔙 Back",
          value: "back",
          hint: "Return to main menu",
        },
      ],
    })

    if (prompts.isCancel(action)) throw new UI.CancelledError()

    if (action === "back") break

    switch (action) {
      case "create":
        await createAgentInteractive()
        break
      case "list":
        await listAgentsInteractive(agents)
        break
      case "edit":
        await editAgentInteractive(agents)
        break
      case "delete":
        await deleteAgentInteractive(agents)
        break
      case "show":
        await showAgentInteractive(agents)
        break
    }
  }
}

async function manageCommands() {
  while (true) {
    const commands = await loadCommands()

    const action = await prompts.select({
      message: "Command Management",
      options: [
        {
          label: "📝 Create Command",
          value: "create",
          hint: "Create a new custom command",
        },
        {
          label: "📋 List Commands",
          value: "list",
          hint: "View all available commands",
        },
        {
          label: "✏️ Edit Command",
          value: "edit",
          hint: "Modify an existing command",
        },
        {
          label: "🗑️ Delete Command",
          value: "delete",
          hint: "Remove a command",
        },
        {
          label: "👁️ Show Command Details",
          value: "show",
          hint: "View detailed command information",
        },
        {
          label: "🔙 Back",
          value: "back",
          hint: "Return to main menu",
        },
      ],
    })

    if (prompts.isCancel(action)) throw new UI.CancelledError()

    if (action === "back") break

    switch (action) {
      case "create":
        await createCommandInteractive()
        break
      case "list":
        await listCommandsInteractive(commands)
        break
      case "edit":
        await editCommandInteractive(commands)
        break
      case "delete":
        await deleteCommandInteractive(commands)
        break
      case "show":
        await showCommandInteractive(commands)
        break
    }
  }
}

async function createAgentInteractive() {
  prompts.note("Creating a new agent...")

  const name = await prompts.text({
    message: "Agent name",
    placeholder: "my-agent",
    validate: (x) => {
      if (!x || x.length === 0) return "Required"
      if (!/^[a-z][a-z0-9-]*$/.test(x)) return "Must be lowercase, start with letter, use hyphens"
      return undefined
    },
  })
  if (prompts.isCancel(name)) throw new UI.CancelledError()

  const description = await prompts.text({
    message: "Description",
    placeholder: "What does this agent do?",
    validate: (x) => (x && x.length > 0 ? undefined : "Required"),
  })
  if (prompts.isCancel(description)) throw new UI.CancelledError()

  const mode = await prompts.select({
    message: "Agent mode",
    options: [
      { label: "All", value: "all" },
      { label: "Primary", value: "primary" },
      { label: "Subagent", value: "subagent" },
    ],
  })
  if (prompts.isCancel(mode)) throw new UI.CancelledError()

  const systemPrompt = await prompts.text({
    message: "System prompt",
    placeholder: "Enter the system prompt for this agent...",
    validate: (x) => (x && x.length > 0 ? undefined : "Required"),
  })
  if (prompts.isCancel(systemPrompt)) throw new UI.CancelledError()

  // Save agent
  const scope = await prompts.select({
    message: "Save location",
    options: [
      { label: "Project", value: "project" },
      { label: "Global", value: "global" },
    ],
  })
  if (prompts.isCancel(scope)) throw new UI.CancelledError()

  const agentDir = path.join(
    scope === "global" ? Global.Path.config : path.join(Instance.worktree, ".opencode"),
    "agent",
  )

  if (!fs.existsSync(agentDir)) {
    fs.mkdirSync(agentDir, { recursive: true })
  }

  const content = matter.stringify(systemPrompt, {
    name,
    description,
    mode,
    builtIn: false,
  })

  const filePath = path.join(agentDir, `${name}.md`)
  await Bun.write(filePath, content)

  prompts.log.success(`Agent created: ${filePath}`)
}

async function listAgentsInteractive(agents: Agent.Info[]) {
  if (agents.length === 0) {
    prompts.note("No agents found.")
    return
  }

  const agentOptions = agents.map((agent) => ({
    label: `${agent.name} (${agent.mode}) ${agent.builtIn ? "🔧" : "📝"}`,
    value: agent.name,
    hint: agent.description,
  }))

  const selected = await prompts.select({
    message: "Select an agent to view details",
    options: [...agentOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  const agent = agents.find((a) => a.name === selected)
  if (agent) {
    await showAgentDetails(agent)
  }
}

async function editAgentInteractive(agents: Agent.Info[]) {
  const customAgents = agents.filter((a) => !a.builtIn)

  if (customAgents.length === 0) {
    prompts.note("No custom agents found to edit.")
    return
  }

  const agentOptions = customAgents.map((agent) => ({
    label: agent.name,
    value: agent.name,
    hint: agent.description,
  }))

  const selected = await prompts.select({
    message: "Select an agent to edit",
    options: [...agentOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  prompts.note(`Opening editor for agent: ${selected}`)
  // Here you could integrate with $EDITOR or open the file
  const agent = await Agent.get(selected as string)
  if (agent && !agent.builtIn) {
    // Find and open the agent file for editing
    const projectAgentDir = path.join(Instance.worktree, ".opencode", "agent")
    const globalAgentDir = path.join(Global.Path.config, "agent")

    let agentFile = path.join(projectAgentDir, `${agent.name}.md`)
    if (!fs.existsSync(agentFile)) {
      agentFile = path.join(globalAgentDir, `${agent.name}.md`)
    }

    if (fs.existsSync(agentFile)) {
      prompts.log.info(`Agent file location: ${agentFile}`)
      prompts.note("You can edit this file directly with your preferred editor.")
    }
  }
}

async function deleteAgentInteractive(agents: Agent.Info[]) {
  const customAgents = agents.filter((a) => !a.builtIn)

  if (customAgents.length === 0) {
    prompts.note("No custom agents found to delete.")
    return
  }

  const agentOptions = customAgents.map((agent) => ({
    label: `${agent.name} ${agent.builtIn ? "🔧" : "📝"}`,
    value: agent.name,
    hint: agent.description,
  }))

  const selected = await prompts.select({
    message: "Select an agent to delete",
    options: [...agentOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  const confirm = await prompts.confirm({
    message: `Are you sure you want to delete agent "${selected}"?`,
    initialValue: false,
  })
  if (prompts.isCancel(confirm)) throw new UI.CancelledError()

  if (confirm as boolean) {
    // Delete the agent file
    const projectAgentDir = path.join(Instance.worktree, ".opencode", "agent")
    const globalAgentDir = path.join(Global.Path.config, "agent")

    let agentFile = path.join(projectAgentDir, `${selected}.md`)
    if (!fs.existsSync(agentFile)) {
      agentFile = path.join(globalAgentDir, `${selected}.md`)
    }

    if (fs.existsSync(agentFile)) {
      fs.unlinkSync(agentFile)
      prompts.log.success(`Agent deleted: ${selected}`)
    }
  }
}

async function showAgentInteractive(agents: Agent.Info[]) {
  const agentOptions = agents.map((agent) => ({
    label: `${agent.name} (${agent.mode}) ${agent.builtIn ? "🔧" : "📝"}`,
    value: agent.name,
    hint: agent.description,
  }))

  const selected = await prompts.select({
    message: "Select an agent to view",
    options: [...agentOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  const agent = agents.find((a) => a.name === selected)
  if (agent) {
    await showAgentDetails(agent)
  }
}

async function showAgentDetails(agent: Agent.Info) {
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

  await prompts.confirm({ message: "Press Enter to continue..." })
}

// Command management functions (similar pattern)
async function createCommandInteractive() {
  prompts.note("Creating a new command...")

  const name = await prompts.text({
    message: "Command name",
    placeholder: "my-command",
    validate: (x) => {
      if (!x || x.length === 0) return "Required"
      if (!/^[a-z][a-z0-9-]*$/.test(x)) return "Must be lowercase, start with letter, use hyphens"
      return undefined
    },
  })
  if (prompts.isCancel(name)) throw new UI.CancelledError()

  const description = await prompts.text({
    message: "Description",
    placeholder: "What does this command do?",
    validate: (x) => (x && x.length > 0 ? undefined : "Required"),
  })
  if (prompts.isCancel(description)) throw new UI.CancelledError()

  const handler = await prompts.text({
    message: "Handler code",
    placeholder:
      "// JavaScript code for the command\nreturn 'Hello, ' + (params.input || 'World');",
    validate: (x) => (x && x.length > 0 ? undefined : "Required"),
  })
  if (prompts.isCancel(handler)) throw new UI.CancelledError()

  // Save command
  const scope = await prompts.select({
    message: "Save location",
    options: [
      { label: "Project", value: "project" },
      { label: "Global", value: "global" },
    ],
  })
  if (prompts.isCancel(scope)) throw new UI.CancelledError()

  const commandDir = path.join(
    scope === "global" ? Global.Path.config : path.join(Instance.worktree, ".opencode"),
    "command",
  )

  if (!fs.existsSync(commandDir)) {
    fs.mkdirSync(commandDir, { recursive: true })
  }

  const content = matter.stringify("", {
    name,
    description,
    handler,
    builtIn: false,
  })

  const filePath = path.join(commandDir, `${name}.md`)
  await Bun.write(filePath, content)

  prompts.log.success(`Command created: ${filePath}`)
}

async function listCommandsInteractive(commands: any[]) {
  if (commands.length === 0) {
    prompts.note("No custom commands found.")
    return
  }

  const commandOptions = commands.map((cmd) => ({
    label: `${cmd.name} ${cmd.builtIn ? "🔧" : "📝"}`,
    value: cmd.name,
    hint: cmd.description,
  }))

  const selected = await prompts.select({
    message: "Select a command to view details",
    options: [...commandOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  const command = commands.find((c) => c.name === selected)
  if (command) {
    await showCommandDetails(command)
  }
}

async function editCommandInteractive(commands: any[]) {
  const customCommands = commands.filter((c) => !c.builtIn)

  if (customCommands.length === 0) {
    prompts.note("No custom commands found to edit.")
    return
  }

  const commandOptions = customCommands.map((cmd) => ({
    label: cmd.name,
    value: cmd.name,
    hint: cmd.description,
  }))

  const selected = await prompts.select({
    message: "Select a command to edit",
    options: [...commandOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  prompts.note(`Opening editor for command: ${selected}`)
  const command = commands.find((c) => c.name === selected)
  if (command && !command.builtIn) {
    // Find and open the command file for editing
    const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
    const globalCommandDir = path.join(Global.Path.config, "command")

    let commandFile = path.join(projectCommandDir, `${command.name}.md`)
    if (!fs.existsSync(commandFile)) {
      commandFile = path.join(globalCommandDir, `${command.name}.md`)
    }

    if (fs.existsSync(commandFile)) {
      prompts.log.info(`Command file location: ${commandFile}`)
      prompts.note("You can edit this file directly with your preferred editor.")
    }
  }
}

async function deleteCommandInteractive(commands: any[]) {
  const customCommands = commands.filter((c) => !c.builtIn)

  if (customCommands.length === 0) {
    prompts.note("No custom commands found to delete.")
    return
  }

  const commandOptions = customCommands.map((cmd) => ({
    label: cmd.name,
    value: cmd.name,
    hint: cmd.description,
  }))

  const selected = await prompts.select({
    message: "Select a command to delete",
    options: [...commandOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  const confirm = await prompts.confirm({
    message: `Are you sure you want to delete command "${selected}"?`,
    initialValue: false,
  })
  if (prompts.isCancel(confirm)) throw new UI.CancelledError()

  if (confirm as boolean) {
    // Delete the command file
    const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
    const globalCommandDir = path.join(Global.Path.config, "command")

    let commandFile = path.join(projectCommandDir, `${selected}.md`)
    if (!fs.existsSync(commandFile)) {
      commandFile = path.join(globalCommandDir, `${selected}.md`)
    }

    if (fs.existsSync(commandFile)) {
      fs.unlinkSync(commandFile)
      prompts.log.success(`Command deleted: ${selected}`)
    }
  }
}

async function showCommandInteractive(commands: any[]) {
  const commandOptions = commands.map((cmd) => ({
    label: `${cmd.name} ${cmd.builtIn ? "🔧" : "📝"}`,
    value: cmd.name,
    hint: cmd.description,
  }))

  const selected = await prompts.select({
    message: "Select a command to view",
    options: [...commandOptions, { label: "🔙 Back", value: "back" }],
  })

  if (prompts.isCancel(selected)) throw new UI.CancelledError()

  if (selected === "back") return

  const command = commands.find((c) => c.name === selected)
  if (command) {
    await showCommandDetails(command)
  }
}

async function showCommandDetails(command: any) {
  UI.empty()
  prompts.intro(`Command: ${command.name}`)

  console.log(`Description: ${command.description}`)
  console.log(`Type: ${command.builtIn ? "Built-in" : "Custom"}`)

  if (command.category) {
    console.log(`Category: ${command.category}`)
  }

  if (command.usage) {
    console.log(`\nUsage:`)
    console.log(`  ${command.usage}`)
  }

  if (command.parameters && command.parameters.length > 0) {
    console.log(`\nParameters:`)
    command.parameters.forEach((param: any) => {
      const required = param.required ? "required" : "optional"
      const defaultVal = param.default !== undefined ? ` [default: ${param.default}]` : ""
      console.log(`  ${param.name} (${param.type}, ${required})${defaultVal}`)
      console.log(`    ${param.description}`)
    })
  }

  if (command.examples && command.examples.length > 0) {
    console.log(`\nExamples:`)
    command.examples.forEach((example: string) => {
      console.log(`  ${example}`)
    })
  }

  if (command.handler) {
    console.log(`\nHandler Code:`)
    console.log(
      command.handler
        .split("\n")
        .map((line: string) => `  ${line}`)
        .join("\n"),
    )
  }

  await prompts.confirm({ message: "Press Enter to continue..." })
}

async function showStatus() {
  UI.empty()
  prompts.intro("System Status")

  try {
    // Load agents
    const agents = await Agent.list()
    const customAgents = agents.filter((a) => !a.builtIn)
    const builtInAgents = agents.filter((a) => a.builtIn)

    // Load commands
    const commands = await loadCommands()
    const customCommands = commands.filter((c) => !c.builtIn)

    console.log(`\n📊 Statistics:`)
    console.log(
      `  Agents: ${agents.length} total (${customAgents.length} custom, ${builtInAgents.length} built-in)`,
    )
    console.log(`  Commands: ${commands.length} total (${customCommands.length} custom)`)

    // Check directories
    const projectAgentDir = path.join(Instance.worktree, ".opencode", "agent")
    const globalAgentDir = path.join(Global.Path.config, "agent")
    const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
    const globalCommandDir = path.join(Global.Path.config, "command")

    console.log(`\n📁 Directories:`)
    console.log(
      `  Project agents: ${projectAgentDir} ${fs.existsSync(projectAgentDir) ? "✅" : "❌"}`,
    )
    console.log(`  Global agents: ${globalAgentDir} ${fs.existsSync(globalAgentDir) ? "✅" : "❌"}`)
    console.log(
      `  Project commands: ${projectCommandDir} ${fs.existsSync(projectCommandDir) ? "✅" : "❌"}`,
    )
    console.log(
      `  Global commands: ${globalCommandDir} ${fs.existsSync(globalCommandDir) ? "✅" : "❌"}`,
    )

    // Recent activity (placeholder for future enhancement)
    console.log(`\n📈 Recent Activity:`)
    console.log(`  No recent activity tracking implemented yet`)
  } catch (error) {
    prompts.log.error(`Failed to load status: ${error}`)
  }

  await prompts.confirm({ message: "Press Enter to continue..." })
}

export const InteractiveCommand = cmd({
  command: "interactive",
  describe: "interactive mode for managing agents and commands",
  builder: (yargs) => yargs.command(InteractiveManageCommand).demandCommand(),
  async handler() {},
})
