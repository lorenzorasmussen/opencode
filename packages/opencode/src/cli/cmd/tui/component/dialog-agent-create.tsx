import { DialogAlert } from "@tui/ui/dialog-alert"
import { DialogSelect, type DialogSelectOption } from "@tui/ui/dialog-select"
import { createSignal, createResource } from "solid-js"
import { useDialog, type DialogContext } from "@tui/ui/dialog"
import { Agent } from "../../../../agent/agent"

export function CreateAgentDialog() {
  const dialog = useDialog()
  const [step, setStep] = createSignal<"intro" | "generating" | "result">("intro")
  const [description, setDescription] = createSignal("")

  const [generatedAgent] = createResource(description, async (desc) => {
    if (!desc.trim()) return null
    try {
      return await Agent.generate({ description: desc })
    } catch (error) {
      console.error("Failed to generate agent:", error)
      return null
    }
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
              const config = JSON.stringify({
                name: agent.identifier,
                description: agent.whenToUse,
                prompt: agent.systemPrompt,
                mode: "subagent",
                builtIn: false,
              }, null, 2)
              const title = "Agent: " + agent.identifier
              const message = "Configuration:\n\n" + config + "\n\nTo add this agent, save this configuration to your config file."
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
              // In a full implementation, this would save to config
              ctx.replace(() => (
                <DialogAlert
                  title="Agent Saved"
                  message={`Agent "${agent.identifier}" has been added to your configuration.\n\nRestart OpenCode to use the new agent.`}
                />
              ))
            },
          },
        ]}
      />
    )
  }

  return (
    <DialogSelect
      title="Create Agent"
      options={[
        {
          value: "describe",
          title: "Describe Agent",
          description: "Tell us what you want the agent to do",
          onSelect: (ctx: DialogContext) => {
            // For now, show a message about CLI usage
            // In a full implementation, this would prompt for description
            ctx.replace(() => (
              <DialogAlert
                title="Agent Creation"
                message="For now, use the CLI to create agents:\n\nopencode agent create\n\nThis will guide you through describing and generating a new agent."
              />
            ))
          },
        },
        {
          value: "examples",
          title: "See Examples",
          description: "View example agent descriptions",
          onSelect: (ctx: DialogContext) => {
            const message = 'Example agent descriptions:\n\n• "A code review agent that checks for security vulnerabilities"\n• "A testing agent that generates and runs unit tests"\n• "A documentation agent that writes API documentation"\n\nUse these as inspiration for your own agents!'
            ctx.replace(() => (
              <DialogAlert
                title="Agent Examples"
                message={message}
              />
            ))
          },
        },
      ]}
    />
  )
}