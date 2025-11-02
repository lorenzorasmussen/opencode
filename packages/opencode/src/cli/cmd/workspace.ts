import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { Global } from "../../global"
import { Instance } from "../../project/instance"
import { Log } from "../../util/log"
import path from "path"
import fs from "fs"
import z from "zod"

const log = Log.create({ service: "workspace-cli" })

// Workspace configuration schema
const WorkspaceConfigSchema = z.object({
  directories: z
    .array(
      z.object({
        path: z.string(),
        name: z.string(),
        description: z.string().optional(),
        alias: z.string().optional(),
      }),
    )
    .optional(),
  defaultDirectory: z.string().optional(),
})

type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>

const WorkspaceAddCommand = cmd({
  command: "add <path>",
  describe: "add a directory to workspace",
  builder: (yargs) => {
    return yargs
      .positional("path", {
        describe: "directory path to add",
        type: "string",
      })
      .option("name", {
        describe: "display name for the directory",
        type: "string",
      })
      .option("description", {
        describe: "description of the directory",
        type: "string",
      })
      .option("alias", {
        describe: "short alias for quick access",
        type: "string",
      })
  },
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const dirPath = path.resolve(opts.path as string)

        // Check if directory exists
        if (!fs.existsSync(dirPath)) {
          UI.error(`Directory "${dirPath}" does not exist`)
          process.exit(1)
        }

        // Check if it's already in workspace
        const config = await loadWorkspaceConfig()
        const existing = config.directories?.find((d) => d.path === dirPath)

        if (existing) {
          UI.error(`Directory "${dirPath}" is already in workspace`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro("Add Directory to Workspace")

        // Get name if not provided
        let name = opts.name as string
        if (!name) {
          const nameResult = await prompts.text({
            message: "Display name",
            placeholder: path.basename(dirPath),
            validate: (x) => (x && x.length > 0 ? undefined : "Required"),
          })
          if (prompts.isCancel(nameResult)) throw new UI.CancelledError()
          name = nameResult as string
        }

        // Get description if not provided
        let description = opts.description as string
        if (!description) {
          const descriptionResult = await prompts.text({
            message: "Description (optional)",
            placeholder: `Directory at ${dirPath}`,
          })
          if (prompts.isCancel(descriptionResult)) throw new UI.CancelledError()
          description = descriptionResult as string
        }

        // Get alias if not provided
        let alias = opts.alias as string
        if (!alias) {
          const aliasResult = await prompts.text({
            message: "Short alias (optional)",
            placeholder: path
              .basename(dirPath)
              .toLowerCase()
              .replace(/[^a-z0-9]/g, ""),
          })
          if (prompts.isCancel(aliasResult)) throw new UI.CancelledError()
          alias = aliasResult as string
        }

        // Add to workspace
        const newDir = {
          path: dirPath,
          name: name,
          description: description || undefined,
          alias: alias || undefined,
        }

        config.directories = [...(config.directories || []), newDir]
        await saveWorkspaceConfig(config)

        prompts.log.success(`Added "${name}" to workspace`)
        if (alias) {
          prompts.log.info(`Alias: ${alias}`)
        }
        prompts.outro("Done")
      },
    })
  },
})

const WorkspaceListCommand = cmd({
  command: "list",
  describe: "list all workspace directories",
  builder: (yargs) => {
    return yargs.option("format", {
      describe: "output format",
      type: "string",
      choices: ["table", "json", "paths"],
      default: "table",
    })
  },
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const config = await loadWorkspaceConfig()
        const directories = config.directories || []

        if (opts.format === "json") {
          console.log(JSON.stringify(config, null, 2))
          return
        }

        if (opts.format === "paths") {
          directories.forEach((dir) => console.log(dir.path))
          return
        }

        // Table format
        UI.empty()
        prompts.intro("Workspace Directories")

        if (directories.length === 0) {
          prompts.note("No directories in workspace.")
          prompts.note("Use 'opencode workspace add <path>' to add directories.")
          return
        }

        console.log("\n📁 Workspace Directories:")
        directories.forEach((dir, index) => {
          const isDefault = config.defaultDirectory === dir.path
          const defaultIcon = isDefault ? " ⭐" : ""
          const aliasInfo = dir.alias ? ` (${dir.alias})` : ""

          console.log(`  ${index + 1}. ${dir.name}${aliasInfo}${defaultIcon}`)
          console.log(`     Path: ${dir.path}`)
          if (dir.description) {
            console.log(`     ${dir.description}`)
          }
          if (isDefault) {
            console.log(`     Default workspace directory`)
          }
          console.log("")
        })

        console.log(`\n💡 Tips:`)
        console.log(`  Use 'opencode workspace set-default <name>' to set default`)
        console.log(`  Use 'opencode workspace remove <name>' to remove`)
        console.log(`  Use 'opencode workspace cd <name|alias>' to change to`)
      },
    })
  },
})

const WorkspaceRemoveCommand = cmd({
  command: "remove <name>",
  describe: "remove a directory from workspace",
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const config = await loadWorkspaceConfig()
        const directories = config.directories || []

        // Find by name, alias, or path
        const toRemove = directories.find(
          (dir) =>
            dir.name === opts.name ||
            dir.alias === opts.name ||
            dir.path === path.resolve(opts.name as string),
        )

        if (!toRemove) {
          UI.error(`Directory "${opts.name}" not found in workspace`)
          process.exit(1)
        }

        UI.empty()
        prompts.intro(`Remove from Workspace: ${toRemove.name}`)

        const confirm = await prompts.confirm({
          message: `Remove "${toRemove.name}" from workspace?`,
          initialValue: false,
        })
        if (prompts.isCancel(confirm)) throw new UI.CancelledError()

        if (!confirm) {
          prompts.outro("Cancelled")
          return
        }

        // Remove from config
        config.directories = directories.filter((dir) => dir.path !== toRemove.path)

        // Clear default if it was the removed directory
        if (config.defaultDirectory === toRemove.path) {
          config.defaultDirectory = undefined
        }

        await saveWorkspaceConfig(config)
        prompts.log.success(`Removed "${toRemove.name}" from workspace`)
        prompts.outro("Done")
      },
    })
  },
})

const WorkspaceSetDefaultCommand = cmd({
  command: "set-default <name>",
  describe: "set default workspace directory",
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const config = await loadWorkspaceConfig()
        const directories = config.directories || []

        // Find by name, alias, or path
        const toSet = directories.find(
          (dir) =>
            dir.name === opts.name ||
            dir.alias === opts.name ||
            dir.path === path.resolve(opts.name as string),
        )

        if (!toSet) {
          UI.error(`Directory "${opts.name}" not found in workspace`)
          process.exit(1)
        }

        config.defaultDirectory = toSet.path
        await saveWorkspaceConfig(config)

        prompts.log.success(`Set "${toSet.name}" as default workspace directory`)
        prompts.outro("Done")
      },
    })
  },
})

const WorkspaceCdCommand = cmd({
  command: "cd <name>",
  describe: "change to a workspace directory",
  async handler(opts) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const config = await loadWorkspaceConfig()
        const directories = config.directories || []

        // Find by name, alias, or path
        const target = directories.find(
          (dir) =>
            dir.name === opts.name ||
            dir.alias === opts.name ||
            dir.path === path.resolve(opts.name as string),
        )

        if (!target) {
          UI.error(`Directory "${opts.name}" not found in workspace`)
          process.exit(1)
        }

        console.log(target.path)
      },
    })
  },
})

const WorkspaceStatusCommand = cmd({
  command: "status",
  describe: "show workspace status and current directory",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const config = await loadWorkspaceConfig()
        const directories = config.directories || []
        const currentDir = process.cwd()

        UI.empty()
        prompts.intro("Workspace Status")

        console.log(`\n📍 Current Directory: ${currentDir}`)

        // Check if current directory is in workspace
        const currentWorkspace = directories.find((dir) => dir.path === currentDir)
        if (currentWorkspace) {
          console.log(`✅ Current directory is in workspace`)
          console.log(`   Name: ${currentWorkspace.name}`)
          if (currentWorkspace.alias) {
            console.log(`   Alias: ${currentWorkspace.alias}`)
          }
          if (config.defaultDirectory === currentWorkspace.path) {
            console.log(`   ⭐ Default workspace directory`)
          }
        } else {
          console.log(`❌ Current directory is not in workspace`)
        }

        console.log(`\n📊 Summary:`)
        console.log(`  Total directories: ${directories.length}`)
        console.log(`  Default directory: ${config.defaultDirectory || "None set"}`)

        if (directories.length > 0) {
          console.log(`\n📁 Quick Access:`)
          directories.forEach((dir) => {
            const alias = dir.alias ? ` (${dir.alias})` : ""
            const current = dir.path === currentDir ? " 📍" : ""
            const def = config.defaultDirectory === dir.path ? " ⭐" : ""
            console.log(`  ${dir.name}${alias}${current}${def}`)
          })
        }
      },
    })
  },
})

// Helper functions
async function loadWorkspaceConfig(): Promise<WorkspaceConfig> {
  const configPath = getWorkspaceConfigPath()

  if (!fs.existsSync(configPath)) {
    return { directories: [] }
  }

  try {
    const content = await Bun.file(configPath).text()
    return WorkspaceConfigSchema.parse(JSON.parse(content))
  } catch (error) {
    console.warn(`Invalid workspace config, using defaults:`, error)
    return { directories: [] }
  }
}

async function saveWorkspaceConfig(config: WorkspaceConfig): Promise<void> {
  const configPath = getWorkspaceConfigPath()
  const configDir = path.dirname(configPath)

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }

  await Bun.write(configPath, JSON.stringify(config, null, 2))
}

function getWorkspaceConfigPath(): string {
  return path.join(Global.Path.config, "workspace.json")
}

// Export helper functions for testing
export { loadWorkspaceConfig, saveWorkspaceConfig, getWorkspaceConfigPath }

export const WorkspaceCommand = cmd({
  command: "workspace",
  describe: "manage workspace directories for project access",
  builder: (yargs) =>
    yargs
      .command(WorkspaceAddCommand)
      .command(WorkspaceListCommand)
      .command(WorkspaceRemoveCommand)
      .command(WorkspaceSetDefaultCommand)
      .command(WorkspaceCdCommand)
      .command(WorkspaceStatusCommand)
      .demandCommand(),
  async handler() {},
})
