import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { Global } from "../../global"
import { Config } from "../../config/config"
import path from "path"
import fs from "fs/promises"
import { $ } from "bun"

const GlobalConfigCommand = cmd({
  command: "config",
  describe: "manage global configuration",
  builder: (yargs) =>
    yargs
      .option("edit", {
        describe: "open global config in editor",
        type: "boolean",
      })
      .option("show", {
        describe: "show current global config",
        type: "boolean",
      })
      .option("reset", {
        describe: "reset global config to defaults",
        type: "boolean",
      })
      .option("path", {
        describe: "show configuration path",
        type: "boolean",
      }),
  async handler(argv) {
    if (argv.edit) {
      const configPath = path.join(Global.Path.config, "opencode.jsonc")
      const editor = process.env.EDITOR || "nano"
      await $`${editor} ${configPath}`
      return
    }

    if (argv.show) {
      const config = await Config.global()
      UI.println(JSON.stringify(config, null, 2))
      return
    }

    if (argv.reset) {
      const confirm = await prompts.confirm({
        message: "Are you sure you want to reset global configuration?",
      })
      if (prompts.isCancel(confirm) || !confirm) {
        UI.println("Operation cancelled")
        return
      }

      const configPath = path.join(Global.Path.config, "opencode.jsonc")
      try {
        await fs.unlink(configPath)
        UI.println("Global configuration reset successfully")
      } catch (error) {
        if ((error as any).code !== "ENOENT") {
          throw error
        }
        UI.println("No global configuration file found")
      }
      return
    }

    if (argv.path) {
      const configPath = path.join(Global.Path.config, "opencode.jsonc")
      UI.println(`Global configuration path: ${configPath}`)
      return
    }

    // Interactive config management
    prompts.intro("Global Configuration Management")

    const action = await prompts.select({
      message: "What would you like to do?",
      options: [
        {
          label: "View current configuration",
          value: "view" as const,
        },
        {
          label: "Edit configuration file",
          value: "edit" as const,
        },
        {
          label: "Reset to defaults",
          value: "reset" as const,
        },
        {
          label: "Show configuration path",
          value: "path" as const,
        },
      ],
    })

    if (prompts.isCancel(action)) {
      throw new UI.CancelledError()
    }

    switch (action) {
      case "view": {
        const config = await Config.global()
        UI.println(JSON.stringify(config, null, 2))
        break
      }
      case "edit": {
        const configPath = path.join(Global.Path.config, "opencode.jsonc")
        const editor = process.env.EDITOR || "nano"
        await $`${editor} ${configPath}`
        UI.println(`Opened ${configPath} in ${editor}`)
        break
      }
      case "reset": {
        const confirm = await prompts.confirm({
          message: "Are you sure you want to reset global configuration?",
        })
        if (prompts.isCancel(confirm) || !confirm) {
          UI.println("Operation cancelled")
          break
        }

        const configPath = path.join(Global.Path.config, "opencode.jsonc")
        try {
          await fs.unlink(configPath)
          UI.println("Global configuration reset successfully")
        } catch (error) {
          if ((error as any).code !== "ENOENT") {
            throw error
          }
          UI.println("No global configuration file found")
        }
        break
      }
      case "path": {
        const configPath = path.join(Global.Path.config, "opencode.jsonc")
        UI.println(`Global configuration path: ${configPath}`)
        break
      }
    }

    prompts.outro("Done")
  },
})

const GlobalPathCommand = cmd({
  command: "paths",
  describe: "show global paths",
  async handler() {
    UI.println(JSON.stringify(Global.Path, null, 2))
  },
})

export const GlobalCommand = cmd({
  command: "global",
  describe: "manage global opencode settings",
  builder: (yargs) => yargs.command(GlobalConfigCommand).command(GlobalPathCommand).demandCommand(),
  async handler() {},
})
