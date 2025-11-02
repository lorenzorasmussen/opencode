import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { Global } from "../../global"
import path from "path"
import matter from "gray-matter"
import { Instance } from "../../project/instance"
import { Log } from "../../util/log"
import fs from "fs"
import z from "zod"

const log = Log.create({ service: "command-cli" })

// Command definition schema
export const CommandInfo = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string().optional(),
  usage: z.string().optional(),
  examples: z.array(z.string()).optional(),
  parameters: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(["string", "number", "boolean", "array"]),
        description: z.string(),
        required: z.boolean().default(false),
        default: z.any().optional(),
      }),
    )
    .optional(),
  handler: z.string(), // JavaScript code to execute
  builtIn: z.boolean().default(false),
})

export type CommandInfo = z.infer<typeof CommandInfo>

const CommandCreateCommand = cmd({
  command: "create",
  describe: "create a new custom command",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("Create Custom Command")

        let scope: "global" | "project" = "global"
        const project = Instance.project

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

        const name = await prompts.text({
          message: "Command name",
          placeholder: "my-command",
          validate: (x) => {
            if (!x || x.length === 0) return "Required"
            if (!/^[a-z][a-z0-9-]*$/.test(x))
              return "Must be lowercase, start with letter, use hyphens"
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

        const category = await prompts.text({
          message: "Category (optional)",
          placeholder: "development, utility, etc.",
        })
        if (prompts.isCancel(category)) throw new UI.CancelledError()

        const usage = await prompts.text({
          message: "Usage pattern (optional)",
          placeholder: "my-command [options] <input>",
        })
        if (prompts.isCancel(usage)) throw new UI.CancelledError()

        const addParams = await prompts.confirm({
          message: "Add parameters?",
          initialValue: false,
        })
        if (prompts.isCancel(addParams)) throw new UI.CancelledError()

        let parameters: any[] = []
        if (addParams) {
          let addMore: boolean | symbol = true
          while (addMore === true) {
            const paramName = await prompts.text({
              message: "Parameter name",
              placeholder: "input",
              validate: (x) => (x && x.length > 0 ? undefined : "Required"),
            })
            if (prompts.isCancel(paramName)) throw new UI.CancelledError()

            const paramType = await prompts.select({
              message: "Parameter type",
              options: [
                { label: "String", value: "string" },
                { label: "Number", value: "number" },
                { label: "Boolean", value: "boolean" },
                { label: "Array", value: "array" },
              ],
            })
            if (prompts.isCancel(paramType)) throw new UI.CancelledError()

            const paramDesc = await prompts.text({
              message: "Parameter description",
              placeholder: "Describe this parameter",
              validate: (x) => (x && x.length > 0 ? undefined : "Required"),
            })
            if (prompts.isCancel(paramDesc)) throw new UI.CancelledError()

            const required = await prompts.confirm({
              message: "Required parameter?",
              initialValue: false,
            })
            if (prompts.isCancel(required)) throw new UI.CancelledError()

            let defaultValue: any
            if (!required) {
              const hasDefault = await prompts.confirm({
                message: "Add default value?",
                initialValue: false,
              })
              if (prompts.isCancel(hasDefault)) throw new UI.CancelledError()

              if (hasDefault) {
                const defaultVal = await prompts.text({
                  message: "Default value",
                  placeholder: "default value",
                })
                if (prompts.isCancel(defaultVal)) throw new UI.CancelledError()
                defaultValue = defaultVal
              }
            }

            parameters.push({
              name: paramName,
              type: paramType,
              description: paramDesc,
              required,
              default: defaultValue,
            })

            const newAddMore = await prompts.confirm({
              message: "Add another parameter?",
              initialValue: false,
            })
            addMore = newAddMore
            if (prompts.isCancel(addMore)) throw new UI.CancelledError()
            if (addMore === true) {
              // Continue loop
            } else {
              break
            }
          }
        }

        const addExamples = await prompts.confirm({
          message: "Add examples?",
          initialValue: true,
        })
        if (prompts.isCancel(addExamples)) throw new UI.CancelledError()

        let examples: string[] = []
        if (addExamples) {
          let addMore: boolean | symbol = true
          while (addMore === true) {
            const example = await prompts.text({
              message: "Example usage",
              placeholder: "my-command --option value input.txt",
            })
            if (prompts.isCancel(example)) throw new UI.CancelledError()

            if (example) {
              examples.push(example)
            }

            const newAddMore = await prompts.confirm({
              message: "Add another example?",
              initialValue: false,
            })
            addMore = newAddMore
            if (prompts.isCancel(addMore)) throw new UI.CancelledError()
            if (addMore === true) {
              // Continue loop
            } else {
              break
            }
          }
        }

        prompts.note("Now you'll write the JavaScript handler code for this command.")
        prompts.note("Available variables: args, params, log, session")
        prompts.note("Use 'return' to output results or 'throw new Error()' for errors")

        const handler = await prompts.text({
          message: "Handler code",
          placeholder:
            "// Your JavaScript code here\nreturn 'Hello, ' + (params.input || 'World');",
          validate: (x) => (x && x.length > 0 ? undefined : "Required"),
        })
        if (prompts.isCancel(handler)) throw new UI.CancelledError()

        // Build command object
        const command: any = {
          name,
          description,
          category: category || undefined,
          usage: usage || undefined,
          examples: examples.length > 0 ? examples : undefined,
          parameters: parameters.length > 0 ? parameters : undefined,
          handler,
          builtIn: false,
        }

        const content = matter.stringify("", command)
        const commandDir = path.join(
          scope === "global" ? Global.Path.config : path.join(Instance.worktree, ".opencode"),
          `command`,
        )

        // Ensure directory exists
        if (!fs.existsSync(commandDir)) {
          fs.mkdirSync(commandDir, { recursive: true })
        }

        const filePath = path.join(commandDir, `${name}.md`)
        await Bun.write(filePath, content)

        prompts.log.success(`Command created: ${filePath}`)
        prompts.outro("Done")
      },
    })
  },
})

const CommandListCommand = cmd({
  command: "list",
  describe: "list all available commands",
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
      .option("category", {
        describe: "filter by category",
        type: "string",
      })
  },
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const commands = await loadCommands()

        if (opts.format === "json") {
          console.log(JSON.stringify(commands, null, 2))
          return
        }

        if (commands.length === 0) {
          console.log("No custom commands found.")
          return
        }

        UI.empty()
        prompts.intro("Available Commands")

        // Filter by category if specified
        let filteredCommands = commands
        if (opts.category) {
          filteredCommands = commands.filter((cmd) => cmd.category === opts.category)
        }

        // Group by scope
        const globalCommands: CommandInfo[] = []
        const projectCommands: CommandInfo[] = []

        for (const command of filteredCommands) {
          if (command.builtIn) continue // Skip built-in commands

          // Check if it's in project directory
          const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
          const commandFile = path.join(projectCommandDir, `${command.name}.md`)
          if (fs.existsSync(commandFile)) {
            projectCommands.push(command)
          } else {
            globalCommands.push(command)
          }
        }

        const printCommandGroup = (title: string, commands: CommandInfo[]) => {
          if (commands.length === 0) return

          console.log(`\n${title}:`)
          commands.forEach((command) => {
            const category = command.category ? `[${command.category}]` : ""
            console.log(`  ${command.name} ${category}`)
            console.log(`    ${command.description}`)
            if (command.usage) {
              console.log(`    Usage: ${command.usage}`)
            }
            if (command.examples && command.examples.length > 0) {
              console.log(`    Examples:`)
              command.examples.forEach((example) => {
                console.log(`      ${example}`)
              })
            }
            console.log("")
          })
        }

        printCommandGroup("Project Commands", projectCommands)
        printCommandGroup("Global Commands", globalCommands)

        // Show categories
        const categories = [...new Set(commands.map((cmd) => cmd.category).filter(Boolean))]
        if (categories.length > 0) {
          console.log(`\nCategories: ${categories.join(", ")}`)
        }
      },
    })
  },
})

const CommandEditCommand = cmd({
  command: "edit <name>",
  describe: "edit an existing custom command",
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const commands = await loadCommands()
        const command = commands.find((cmd) => cmd.name === opts.name)

        if (!command) {
          UI.error(`Command "${opts.name}" not found`)
          process.exit(1)
        }

        if (command.builtIn) {
          UI.error(`Cannot edit built-in command "${opts.name}"`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro(`Edit Command: ${command.name}`)

        // Find command file
        const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
        const globalCommandDir = path.join(Global.Path.config, "command")

        let commandFile = path.join(projectCommandDir, `${command.name}.md`)
        let scope = "project"

        if (!fs.existsSync(commandFile)) {
          commandFile = path.join(globalCommandDir, `${command.name}.md`)
          scope = "global"
        }

        if (!fs.existsSync(commandFile)) {
          UI.error(`Command file not found for "${opts.name}"`)
          process.exit(1)
        }

        const content = await Bun.file(commandFile).text()
        const parsed = matter(content)

        // Edit description
        const description = await prompts.text({
          message: "Description",
          initialValue: command.description,
          validate: (x) => (x && x.length > 0 ? undefined : "Required"),
        })
        if (prompts.isCancel(description)) throw new UI.CancelledError()

        // Edit category
        const category = await prompts.text({
          message: "Category (optional)",
          initialValue: command.category || "",
        })
        if (prompts.isCancel(category)) throw new UI.CancelledError()

        // Edit usage
        const usage = await prompts.text({
          message: "Usage pattern (optional)",
          initialValue: command.usage || "",
        })
        if (prompts.isCancel(usage)) throw new UI.CancelledError()

        // Edit handler code
        const editHandler = await prompts.confirm({
          message: "Edit handler code?",
          initialValue: true,
        })
        if (prompts.isCancel(editHandler)) throw new UI.CancelledError()

        let handler = command.handler
        if (editHandler) {
          const newHandler = await prompts.text({
            message: "Handler code",
            initialValue: command.handler,
            validate: (x) => (x && x.length > 0 ? undefined : "Required"),
          })
          if (prompts.isCancel(newHandler)) throw new UI.CancelledError()
          handler = newHandler
        }

        // Build new command object
        const updatedCommand: any = {
          name: command.name,
          description,
          category: category || undefined,
          usage: usage || undefined,
          examples: command.examples,
          parameters: command.parameters,
          handler,
          builtIn: false,
        }

        const newContent = matter.stringify("", updatedCommand)
        await Bun.write(commandFile, newContent)

        prompts.log.success(`Command updated: ${commandFile}`)
        prompts.outro("Done")
      },
    })
  },
})

const CommandDeleteCommand = cmd({
  command: "delete <name>",
  describe: "delete an existing custom command",
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const commands = await loadCommands()
        const command = commands.find((cmd) => cmd.name === opts.name)

        if (!command) {
          UI.error(`Command "${opts.name}" not found`)
          process.exit(1)
        }

        if (command.builtIn) {
          UI.error(`Cannot delete built-in command "${opts.name}"`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro(`Delete Command: ${command.name}`)

        const confirm = await prompts.confirm({
          message: `Are you sure you want to delete command "${command.name}"?`,
          initialValue: false,
        })
        if (prompts.isCancel(confirm)) throw new UI.CancelledError()

        if (confirm !== true) {
          prompts.outro("Cancelled")
          return
        }

        // Find command file
        const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
        const globalCommandDir = path.join(Global.Path.config, "command")

        let commandFile = path.join(projectCommandDir, `${command.name}.md`)

        if (!fs.existsSync(commandFile)) {
          commandFile = path.join(globalCommandDir, `${command.name}.md`)
        }

        if (!fs.existsSync(commandFile)) {
          UI.error(`Command file not found for "${opts.name}"`)
          process.exit(1)
        }

        fs.unlinkSync(commandFile)
        prompts.log.success(`Command deleted: ${command.name}`)
        prompts.outro("Done")
      },
    })
  },
})

const CommandShowCommand = cmd({
  command: "show <name>",
  describe: "show detailed information about a command",
  builder: (yargs) => {
    return yargs.option("format", {
      describe: "output format",
      type: "string",
      choices: ["table", "json", "yaml"],
      default: "table",
    })
  },
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const commands = await loadCommands()
        const command = commands.find((cmd) => cmd.name === opts.name)

        if (!command) {
          UI.error(`Command "${opts.name}" not found`)
          process.exit(1)
        }

        if (opts.format === "json") {
          console.log(JSON.stringify(command, null, 2))
          return
        }

        if (opts.format === "yaml") {
          console.log(`name: ${command.name}`)
          console.log(`description: ${command.description}`)
          console.log(`builtIn: ${command.builtIn}`)
          if (command.category) {
            console.log(`category: ${command.category}`)
          }
          if (command.usage) {
            console.log(`usage: ${command.usage}`)
          }
          if (command.examples && command.examples.length > 0) {
            console.log(`examples:`)
            command.examples.forEach((example) => {
              console.log(`  - ${example}`)
            })
          }
          if (command.parameters && command.parameters.length > 0) {
            console.log(`parameters:`)
            command.parameters.forEach((param) => {
              console.log(`  ${param.name}:`)
              console.log(`    type: ${param.type}`)
              console.log(`    description: ${param.description}`)
              console.log(`    required: ${param.required}`)
              if (param.default !== undefined) {
                console.log(`    default: ${param.default}`)
              }
            })
          }
          return
        }

        // Table format
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
          command.parameters.forEach((param) => {
            const required = param.required ? "required" : "optional"
            const defaultVal = param.default !== undefined ? ` [default: ${param.default}]` : ""
            console.log(`  ${param.name} (${param.type}, ${required})${defaultVal}`)
            console.log(`    ${param.description}`)
          })
        }

        if (command.examples && command.examples.length > 0) {
          console.log(`\nExamples:`)
          command.examples.forEach((example) => {
            console.log(`  ${example}`)
          })
        }

        if (command.handler) {
          console.log(`\nHandler Code:`)
          console.log(
            command.handler
              .split("\n")
              .map((line) => `  ${line}`)
              .join("\n"),
          )
        }
      },
    })
  },
})

// Helper function to load commands from files
export async function loadCommands(): Promise<CommandInfo[]> {
  const commands: CommandInfo[] = []

  // Load from project directory
  const projectCommandDir = path.join(Instance.worktree, ".opencode", "command")
  if (fs.existsSync(projectCommandDir)) {
    const files = fs.readdirSync(projectCommandDir).filter((f) => f.endsWith(".md"))
    for (const file of files) {
      try {
        const content = await Bun.file(path.join(projectCommandDir, file)).text()
        const parsed = matter(content)
        const command = CommandInfo.parse(parsed.data as any)
        commands.push(command)
      } catch (error) {
        log.warn(`Failed to load command from ${file}:`, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  // Load from global directory
  const globalCommandDir = path.join(Global.Path.config, "command")
  if (fs.existsSync(globalCommandDir)) {
    const files = fs.readdirSync(globalCommandDir).filter((f) => f.endsWith(".md"))
    for (const file of files) {
      try {
        const content = await Bun.file(path.join(globalCommandDir, file)).text()
        const parsed = matter(content)
        const command = CommandInfo.parse(parsed.data as any)
        commands.push(command)
      } catch (error) {
        log.warn(`Failed to load command from ${file}:`, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  return commands
}

export const CommandCommand = cmd({
  command: "command",
  describe: "manage custom commands",
  builder: (yargs) =>
    yargs
      .command(CommandCreateCommand)
      .command(CommandListCommand)
      .command(CommandEditCommand)
      .command(CommandDeleteCommand)
      .command(CommandShowCommand)
      .demandCommand(),
  async handler() {},
})
