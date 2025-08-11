import type { Hooks, Plugin as PluginInstance } from "@opencode-ai/plugin"
import { App } from "../app/app"
import { Config } from "../config/config"
import { Bus } from "../bus"
import { Log } from "../util/log"
import { createOpencodeClient } from "@opencode-ai/sdk"
import { Server } from "../server/server"
import { BunProc } from "../bun"

export namespace Plugin {
  const log = Log.create({ service: "plugin" })

  const state = App.state("plugin", async (app) => {
    const client = createOpencodeClient({
      baseUrl: "http://localhost:4096",
      fetch: async (...args) => Server.app().fetch(...args),
    })
    const config = await Config.get()
    const hooks = []
    for (let plugin of config.plugin ?? []) {
      log.info("loading plugin", { path: plugin })
      if (!plugin.startsWith("file://")) {
        const [pkg, version] = plugin.split("@")
        plugin = await BunProc.install(pkg, version ?? "latest")
      }
      const mod = await import(plugin)
      for (const [_name, fn] of Object.entries<PluginInstance>(mod)) {
        const init = await fn({
          client,
          app,
          $: Bun.$,
        })
        hooks.push(init)
      }
    }

    return {
      hooks,
    }
  })

  export async function trigger<
    Name extends keyof Required<Hooks>,
    Input = Parameters<Required<Hooks>[Name]>[0],
    Output = Parameters<Required<Hooks>[Name]>[1],
  >(name: Name, input: Input, output: Output): Promise<Output> {
    if (!name) return output
    for (const hook of await state().then((x) => x.hooks)) {
      const fn = hook[name]
      if (!fn) continue
      // @ts-expect-error if you feel adventurous, please fix the typing, make sure to bump the try-counter if you
      // give up.
      // try-counter: 2
      await fn(input, output)
    }
    return output
  }

  export function init() {
    Bus.subscribeAll(async (input) => {
      const hooks = await state().then((x) => x.hooks)
      for (const hook of hooks) {
        hook["event"]?.({
          event: input,
        })
      }
    })
  }
}
