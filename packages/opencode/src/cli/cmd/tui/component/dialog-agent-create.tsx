import { DialogAlert } from "@tui/ui/dialog-alert"
import { DialogSelect, type DialogSelectOption } from "@tui/ui/dialog-select"
import { createSignal, createResource, createMemo } from "solid-js"
import { useDialog, type DialogContext } from "@tui/ui/dialog"
import { Agent } from "../../../../agent/agent"
import { Keybind } from "@/util/keybind"
import { Config } from "../../../../config/config"
import { Instance } from "../../../../project/instance"
import { Global } from "../../../../global"

export function CreateAgentDialog() {
  const dialog = useDialog()
  const [step, setStep] = createSignal<
    "intro" | "describe" | "type" | "scope" | "tools" | "generating" | "result" | "templates"
  >("intro")
  const [description, setDescription] = createSignal("")
  const [agentType, setAgentType] = createSignal<"primary" | "all" | "subagent">("subagent")
  const [agentScope, setAgentScope] = createSignal<"global" | "project">("global")
  const [selectedTools, setSelectedTools] = createSignal<Record<string, boolean>>({})

  const [generatedAgent] = createResource(description, async (desc) => {
    if (!desc.trim()) return null
    try {
      return await Agent.generate({ description: desc })
    } catch (error) {
      console.error("Failed to generate agent:", error)
      return null
    }
  })

  // Get available tools
  const availableTools = createMemo(() => {
    const tools: Array<{name: string, description: string}> = [
      { name: "edit", description: "File editing and modification" },
      { name: "bash", description: "Shell command execution" },
      { name: "grep", description: "Text search and pattern matching" },
      { name: "read", description: "File reading and content access" },
      { name: "glob", description: "File pattern matching and discovery" },
      { name: "webfetch", description: "Web content fetching and analysis" },
      { name: "lsp", description: "Language server protocol integration" },
      { name: "mcp", description: "Model Context Protocol servers" },
    ]
    return tools
  })

  if (step() === "generating") {
    return (
      <DialogAlert
        title="Generating Agent"
        message="Generating agent configuration based on your description...\n\nThis may take a few moments."
      />
    )
  }

  if (step() === "result") {
    const agent = generatedAgent()
    if (!agent) {
      return (
        <DialogAlert
          title="Generation Failed"
          message="Failed to generate agent configuration. Please try again with a different description."
        />
      )
    }

    return (
      <DialogSelect
        title="Agent Generated"
        options={[
          {
            value: "view",
            title: "View Configuration",
            description: `See the generated agent "${agent.identifier}"`,
            onSelect: (ctx: DialogContext) => {
              const toolsYaml = Object.entries(selectedTools())
                .filter(([_, enabled]) => enabled)
                .map(([tool]) => "  " + tool + ": true")
                .join('\n')
              const promptYaml = agent.systemPrompt
                .split('\n')
                .map((line: string) => "  " + line)
                .join('\n')

              const config = "---\n" +
                "name: " + agent.identifier + "\n" +
                "description: " + agent.whenToUse + "\n" +
                "mode: " + agentType() + "\n" +
                "builtIn: false\n" +
                "permission:\n" +
                "  edit: allow\n" +
                "  bash:\n" +
                "    \"*\": allow\n" +
                "  webfetch: allow\n" +
                "tools:\n" +
                toolsYaml + "\n" +
                "prompt: |\n" +
                promptYaml + "\n"

              const title = "Agent: " + agent.identifier
              const message = "YAML Configuration:\n\n" + config + "\n\nSave this to your opencode.json or project .opencode/opencode.json"
              ctx.replace(() => (
                <DialogAlert
                  title={title}
                  message={message}
                />
              ))
            },
          },
          {
            value: "save",
            title: "Save to Config",
            description: "Add this agent to your configuration",
            onSelect: (ctx: DialogContext) => {
              // Save to config based on scope
              const configPath = agentScope() === "global"
                ? Global.Path.config + "/opencode.json"
                : Instance.worktree + "/.opencode/opencode.json"

              ctx.replace(() => (
                <DialogAlert
                  title="Save Configuration"
                  message={`Save the agent configuration to:\n\n${configPath}\n\nThen restart OpenCode to use the new agent.`}
                />
              ))
            },
          },
        ]}
        keybind={[
          {
            keybind: Keybind.parse("left")[0],
            title: "back",
            onTrigger: () => setStep("tools"),
          },
          {
            keybind: Keybind.parse("backspace")[0],
            title: "back",
            onTrigger: () => setStep("tools"),
          },
        ]}
      />
    )
  }

  if (step() === "describe") {
    return (
      <DialogSelect
        title="Describe Your Agent"
        options={[
          {
            value: "natural",
            title: "Natural Language",
            description: "Describe what you want the agent to do in plain English",
            onSelect: (ctx: DialogContext) => {
              // This would need a text input component - for now show placeholder
              ctx.replace(() => (
                <DialogAlert
                  title="Natural Language Description"
                  message="Enter your agent description in the terminal:\n\nopencode agent create\n\nThen follow the prompts to create your agent."
                />
              ))
            },
          },
          {
            value: "template",
            title: "Use Template",
            description: "Select from pre-built agent templates",
            onSelect: (_ctx) => setStep("templates"),
          },
          {
            value: "paste",
            title: "Paste Custom Prompt",
            description: "Paste your own agent prompt/configuration",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Paste Custom Prompt"
                  message={'Use the CLI to paste custom prompts:\n\nopencode agent create --prompt "your custom prompt here"'}
                />
              ))
            },
          },
        ]}
        keybind={[
          {
            keybind: Keybind.parse("left")[0],
            title: "back",
            onTrigger: () => setStep("intro"),
          },
          {
            keybind: Keybind.parse("backspace")[0],
            title: "back",
            onTrigger: () => setStep("intro"),
          },
        ]}
      />
    )
  }

  if (step() === "templates") {
    const templates = [
      {
        name: "code-review",
        description: "Reviews code for bugs, security issues, and best practices",
        prompt: "You are a senior code reviewer. Analyze code for bugs, security vulnerabilities, performance issues, and adherence to best practices. Provide constructive feedback with specific suggestions for improvement."
      },
      {
        name: "testing",
        description: "Generates and runs unit tests, integration tests",
        prompt: "You are a testing expert. Generate comprehensive unit tests, integration tests, and end-to-end tests. Ensure high code coverage and test edge cases thoroughly."
      },
      {
        name: "documentation",
        description: "Writes API documentation, README files, and code comments",
        prompt: "You are a technical writer specializing in API documentation. Create clear, comprehensive documentation including README files, API references, and inline code comments."
      },
      {
        name: "refactoring",
        description: "Improves code structure, performance, and maintainability",
        prompt: "You are a code refactoring specialist. Improve code structure, eliminate technical debt, enhance performance, and increase maintainability while preserving functionality."
      },
      {
        name: "security",
        description: "Identifies and fixes security vulnerabilities",
        prompt: "You are a cybersecurity expert. Identify security vulnerabilities, injection attacks, authentication issues, and other security risks. Provide remediation strategies."
      }
    ]

    return (
      <DialogSelect
        title="Agent Templates"
        options={[
          ...templates.map(template => ({
            value: template.name,
            title: template.name,
            description: template.description,
            onSelect: (_ctx: DialogContext) => {
              setDescription(template.prompt)
              setStep("type")
            },
          })),
          {
            value: "custom",
            title: "Custom Template",
            description: "Paste your own template prompt",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Custom Template"
                  message={'Use the CLI to create agents from custom templates:\n\nopencode agent create --template "your template prompt"'}
                />
              ))
            },
          },
        ]}
        keybind={[
          {
            keybind: Keybind.parse("left")[0],
            title: "back",
            onTrigger: () => setStep("describe"),
          },
          {
            keybind: Keybind.parse("backspace")[0],
            title: "back",
            onTrigger: () => setStep("describe"),
          },
        ]}
      />
    )
  }

  if (step() === "type") {
    return (
      <DialogSelect
        title="Agent Type"
        options={[
          {
            value: "primary",
            title: "Primary Agent",
            description: "Main agent that appears in TUI, switched with Tab key",
            onSelect: (_ctx) => {
              setAgentType("primary")
              setStep("scope")
            },
          },
          {
            value: "all",
            title: "All-Purpose Agent",
            description: "Available in TUI, can be primary or secondary",
            onSelect: (_ctx) => {
              setAgentType("all")
              setStep("scope")
            },
          },
          {
            value: "subagent",
            title: "Subagent",
            description: "Background agent, invoked with @agent-name",
            onSelect: (_ctx) => {
              setAgentType("subagent")
              setStep("scope")
            },
          },
        ]}
        keybind={[
          {
            keybind: Keybind.parse("left")[0],
            title: "back",
            onTrigger: () => setStep("describe"),
          },
          {
            keybind: Keybind.parse("backspace")[0],
            title: "back",
            onTrigger: () => setStep("describe"),
          },
        ]}
      />
    )
  }

  if (step() === "scope") {
    const project = Instance.project
    const options: DialogSelectOption[] = []

    if (project.vcs === "git") {
      options.push({
        value: "project",
        title: "Project Agent",
        description: `Save to ${Instance.worktree}/.opencode/opencode.json`,
        onSelect: (_ctx) => {
          setAgentScope("project")
          setStep("tools")
        },
      })
    }

    options.push({
      value: "global",
      title: "Global Agent",
      description: "Save to global OpenCode configuration",
      onSelect: (_ctx) => {
        setAgentScope("global")
        setStep("tools")
      },
    })

    return (
      <DialogSelect
        title="Agent Scope"
        options={options}
        keybind={[
          {
            keybind: Keybind.parse("left")[0],
            title: "back",
            onTrigger: () => setStep("type"),
          },
          {
            keybind: Keybind.parse("backspace")[0],
            title: "back",
            onTrigger: () => setStep("type"),
          },
        ]}
      />
    )
  }

  if (step() === "tools") {
    const currentTools = selectedTools()
    const options: DialogSelectOption[] = [
      ...availableTools().map(tool => ({
        value: tool.name,
        title: `${tool.name} ${currentTools[tool.name] ? "✓" : "○"}`,
        description: tool.description,
        onSelect: (_ctx: DialogContext) => {
          setSelectedTools((prev: Record<string, boolean>) => ({
            ...prev,
            [tool.name]: !prev[tool.name]
          }))
        },
      })),
      {
        value: "continue",
        title: "Continue with Selected Tools",
        description: `Generate agent with ${Object.values(currentTools).filter(Boolean).length} tools selected`,
        onSelect: (_ctx) => {
          setStep("generating")
        },
      },
    ]

    return (
      <DialogSelect
        title="Select Agent Tools"
        options={options}
        keybind={[
          {
            keybind: Keybind.parse("left")[0],
            title: "back",
            onTrigger: () => setStep("scope"),
          },
          {
            keybind: Keybind.parse("backspace")[0],
            title: "back",
            onTrigger: () => setStep("scope"),
          },
        ]}
      />
    )
  }

  // Intro step
  return (
    <DialogSelect
      title="Create Agent"
      options={[
        {
          value: "describe",
          title: "Describe Agent",
          description: "Natural language description → agent configuration",
          onSelect: (_ctx) => setStep("describe"),
        },
        {
          value: "examples",
          title: "See Examples",
          description: "View example agent descriptions and use cases",
          onSelect: (ctx: DialogContext) => {
            const message = 'Example agent descriptions:\n\n• "A code review agent that checks for security vulnerabilities and performance issues"\n• "A testing agent that generates comprehensive unit and integration tests"\n• "A documentation agent that writes API docs and README files"\n• "A refactoring agent that improves code structure and eliminates technical debt"\n\nUse these as inspiration for your own agents!'
            ctx.replace(() => (
              <DialogAlert
                title="Agent Examples"
                message={message}
              />
            ))
          },
        },
        {
          value: "cli",
          title: "Use CLI Tool",
          description: "Advanced agent creation with full CLI features",
          onSelect: (ctx: DialogContext) => {
            ctx.replace(() => (
              <DialogAlert
                title="CLI Agent Creation"
                message="For advanced agent creation with full features:\n\nopencode agent create\n\nThis provides:\n• Interactive prompts\n• Template selection\n• Custom prompt editing\n• Tool permission configuration\n• YAML/JSON export options"
              />
            ))
          },
        },
      ]}
    />
  )
}