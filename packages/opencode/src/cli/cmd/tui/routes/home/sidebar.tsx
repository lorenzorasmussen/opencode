import { useSync } from "@tui/context/sync"
import { createMemo, For, Show, Switch, Match } from "solid-js"
import { useTheme } from "../../context/theme"

export function HomeSidebar() {
  const sync = useSync()
  const { theme } = useTheme()

  const totalCost = createMemo(() => {
    let total = 0
    for (const messages of Object.values(sync.data.message)) {
      total += messages.reduce((sum, x) => sum + (x.role === "assistant" ? x.cost : 0), 0)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total)
  })

  const totalSessions = createMemo(() => sync.data.session.length)

  return (
    <box flexShrink={0} gap={1} width={40}>
      <box>
        <text>
          <b>OpenCode</b>
        </text>
        <text fg={theme.textMuted}>Development Mode</text>
      </box>

      <box>
        <text>
          <b>Sessions</b>
        </text>
        <text fg={theme.textMuted}>{totalSessions()} total sessions</text>
        <text fg={theme.textMuted}>{totalCost()} total spent</text>
      </box>

      <Show when={Object.keys(sync.data.mcp).length > 0}>
        <box>
          <text>
            <b>MCP</b>
          </text>
          <For each={Object.entries(sync.data.mcp)}>
            {([key, item]) => (
              <box flexDirection="row" gap={1}>
                <text
                  flexShrink={0}
                  style={{
                    fg: {
                      connected: theme.success,
                      failed: theme.error,
                      disabled: theme.textMuted,
                    }[item.status],
                  }}
                >
                  •
                </text>
                <text wrapMode="word">
                  {key}{" "}
                  <span style={{ fg: theme.textMuted }}>
                    <Switch>
                      <Match when={item.status === "connected"}>Connected</Match>
                      <Match when={item.status === "failed" && item}>
                        {(val) => <i>{val().error}</i>}
                      </Match>
                      <Match when={item.status === "disabled"}>Disabled in configuration</Match>
                    </Switch>
                  </span>
                </text>
              </box>
            )}
          </For>
        </box>
      </Show>

      <Show when={sync.data.lsp.length > 0}>
        <box>
          <text>
            <b>LSP</b>
          </text>
          <For each={sync.data.lsp}>
            {(item) => (
              <box flexDirection="row" gap={1}>
                <text
                  flexShrink={0}
                  style={{
                    fg: {
                      connected: theme.success,
                      error: theme.error,
                    }[item.status],
                  }}
                >
                  •
                </text>
                <text fg={theme.textMuted}>
                  {item.id} {item.root}
                </text>
              </box>
            )}
          </For>
        </box>
      </Show>

      <box>
        <text>
          <b>Providers</b>
        </text>
        <For each={sync.data.provider}>
          {(provider) => (
            <text fg={theme.textMuted}>
              {provider.id} ({Object.keys(provider.models).length} models)
            </text>
          )}
        </For>
      </box>

      <box>
        <text>
          <b>Agents</b>
        </text>
        <For each={sync.data.agent}>
          {(agent) => (
            <text fg={theme.textMuted}>
              {agent.name} {agent.mode === "subagent" && "(subagent)"}
            </text>
          )}
        </For>
      </box>
    </box>
  )
}
