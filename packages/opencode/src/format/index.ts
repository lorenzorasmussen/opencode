import { App } from '../app/app'
import { BunProc } from '../bun'
import { Config } from '../config/config'
import { Log } from '../util/log'
import path from 'path'

export namespace Format {
  const log = Log.create({ service: 'format' })

  const state = App.state('format', async () => {
    const hooks: Record<string, Hook[]> = {}
    for (const item of FORMATTERS) {
      if (await item.enabled()) {
        for (const ext of item.extensions) {
          const list = hooks[ext] ?? []
          list.push({
            command: item.command,
            environment: item.environment,
          })
          hooks[ext] = list
        }
      }
    }

    const cfg = await Config.get()
    for (const [file, items] of Object.entries(
      cfg.experimental?.hook?.file_edited ?? {},
    )) {
      for (const item of items) {
        const list = hooks[file] ?? []
        list.push({
          command: item.command,
          environment: item.environment,
        })
        hooks[file] = list
      }
    }

    return {
      hooks,
    }
  })

  export async function run(file: string) {
    log.info('formatting', { file })
    const { hooks } = await state()
    const ext = path.extname(file)
    const match = hooks[ext]
    if (!match) return

    for (const item of match) {
      log.info('running', { command: item.command })
      const proc = Bun.spawn({
        cmd: item.command.map((x) => x.replace('$FILE', file)),
        cwd: App.info().path.cwd,
        env: item.environment,
      })
      const exit = await proc.exited
      if (exit !== 0)
        log.error('failed', {
          command: item.command,
          ...item.environment,
        })
    }
  }

  interface Hook {
    command: string[]
    environment?: Record<string, string>
  }

  interface Native {
    name: string
    command: string[]
    environment?: Record<string, string>
    extensions: string[]
    enabled(): Promise<boolean>
  }

  const FORMATTERS: Native[] = [
    {
      name: 'prettier',
      extensions: [
        '.js',
        '.jsx',
        '.mjs',
        '.cjs',
        '.ts',
        '.tsx',
        '.mts',
        '.cts',
        '.html',
        '.htm',
        '.css',
        '.scss',
        '.sass',
        '.less',
        '.vue',
        '.svelte',
        '.json',
        '.jsonc',
        '.yaml',
        '.yml',
        '.toml',
        '.xml',
        '.md',
        '.mdx',
        '.php',
        '.rb',
        '.java',
        '.go',
        '.rs',
        '.swift',
        '.kt',
        '.kts',
        '.sol',
        '.graphql',
        '.gql',
      ],
      command: [BunProc.which(), 'run', 'prettier', '--write', '$FILE'],
      environment: {
        BUN_BE_BUN: '1',
      },
      async enabled() {
        try {
          const proc = Bun.spawn({
            cmd: [BunProc.which(), 'run', 'prettier', '--version'],
            cwd: App.info().path.cwd,
            env: {
              BUN_BE_BUN: '1',
            },
            stdout: 'ignore',
            stderr: 'ignore',
          })
          const exit = await proc.exited
          return exit === 0
        } catch {
          return false
        }
      },
    },
  ]
}
