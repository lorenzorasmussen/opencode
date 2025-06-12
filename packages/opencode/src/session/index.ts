import path from "path"
import { App } from "../app/app"
import { Identifier } from "../id/id"
import { Storage } from "../storage/storage"
import { Log } from "../util/log"
import {
  convertToModelMessages,
  generateText,
  LoadAPIKeyError,
  stepCountIs,
  streamText,
  tool,
  type Tool as AITool,
  type LanguageModelUsage,
  type UIMessage,
} from "ai"
import { z, ZodSchema } from "zod"
import { Decimal } from "decimal.js"

import PROMPT_INITIALIZE from "../session/prompt/initialize.txt"

import { Share } from "../share/share"
import { Message } from "./message"
import { Bus } from "../bus"
import { Provider } from "../provider/provider"
import { MCP } from "../mcp"
import { NamedError } from "../util/error"
import type { Tool } from "../tool/tool"
import { SystemPrompt } from "./system"

export namespace Session {
  const log = Log.create({ service: "session" })

  export const Info = z
    .object({
      id: Identifier.schema("session"),
      parentID: Identifier.schema("session").optional(),
      share: z
        .object({
          secret: z.string(),
          url: z.string(),
        })
        .optional(),
      title: z.string(),
      time: z.object({
        created: z.number(),
        updated: z.number(),
      }),
    })
    .openapi({
      ref: "session.info",
    })
  export type Info = z.output<typeof Info>

  export const Event = {
    Updated: Bus.event(
      "session.updated",
      z.object({
        info: Info,
      }),
    ),
    Error: Bus.event(
      "session.error",
      z.object({
        error: Message.Info.shape.metadata.shape.error,
      }),
    ),
  }

  const state = App.state("session", () => {
    const sessions = new Map<string, Info>()
    const messages = new Map<string, Message.Info[]>()

    return {
      sessions,
      messages,
    }
  })

  export async function create(parentID?: string) {
    const result: Info = {
      id: Identifier.descending("session"),
      parentID,
      title: "Child Session - " + new Date().toISOString(),
      time: {
        created: Date.now(),
        updated: Date.now(),
      },
    }
    log.info("created", result)
    state().sessions.set(result.id, result)
    await Storage.writeJSON("session/info/" + result.id, result)
    if (!result.parentID)
      share(result.id).then((share) => {
        update(result.id, (draft) => {
          draft.share = share
        })
      })
    Bus.publish(Event.Updated, {
      info: result,
    })
    return result
  }

  export async function get(id: string) {
    const result = state().sessions.get(id)
    if (result) {
      return result
    }
    const read = await Storage.readJSON<Info>("session/info/" + id)
    state().sessions.set(id, read)
    return read as Info
  }

  export async function share(id: string) {
    const session = await get(id)
    if (session.share) return session.share
    const share = await Share.create(id)
    await update(id, (draft) => {
      draft.share = share
    })
    for (const msg of await messages(id)) {
      await Share.sync("session/message/" + id + "/" + msg.id, msg)
    }
    return share
  }

  export async function update(id: string, editor: (session: Info) => void) {
    const { sessions } = state()
    const session = await get(id)
    if (!session) return
    editor(session)
    session.time.updated = Date.now()
    sessions.set(id, session)
    await Storage.writeJSON("session/info/" + id, session)
    Bus.publish(Event.Updated, {
      info: session,
    })
    return session
  }

  export async function messages(sessionID: string) {
    const result = [] as Message.Info[]
    const list = Storage.list("session/message/" + sessionID)
    for await (const p of list) {
      const read = await Storage.readJSON<Message.Info>(p)
      result.push(read)
    }
    result.sort((a, b) => (a.id > b.id ? 1 : -1))
    return result
  }

  export async function getMessage(sessionID: string, messageID: string) {
    return Storage.readJSON<Message.Info>(
      "session/message/" + sessionID + "/" + messageID,
    )
  }

  export async function* list() {
    for await (const item of Storage.list("session/info")) {
      const sessionID = path.basename(item, ".json")
      yield get(sessionID)
    }
  }

  export function abort(sessionID: string) {
    const controller = pending.get(sessionID)
    if (!controller) return false
    controller.abort()
    pending.delete(sessionID)
    return true
  }

  async function updateMessage(msg: Message.Info) {
    await Storage.writeJSON(
      "session/message/" + msg.metadata.sessionID + "/" + msg.id,
      msg,
    )
    Bus.publish(Message.Event.Updated, {
      info: msg,
    })
  }

  export async function chat(input: {
    sessionID: string
    providerID: string
    modelID: string
    parts: Message.Part[]
    system?: string[]
    tools?: Tool.Info[]
  }) {
    const l = log.clone().tag("session", input.sessionID)
    l.info("chatting")
    const model = await Provider.getModel(input.providerID, input.modelID)
    let msgs = await messages(input.sessionID)
    const previous = msgs.at(-1)

    // auto summarize if too long
    if (previous?.metadata.assistant) {
      const tokens =
        previous.metadata.assistant.tokens.input +
        previous.metadata.assistant.tokens.output
      if (
        tokens >
        (model.info.limit.context - (model.info.limit.output ?? 0)) * 0.9
      ) {
        await summarize({
          sessionID: input.sessionID,
          providerID: input.providerID,
          modelID: input.modelID,
        })
        return chat(input)
      }
    }

    using abort = lock(input.sessionID)

    const lastSummary = msgs.findLast(
      (msg) => msg.metadata.assistant?.summary === true,
    )
    if (lastSummary) msgs = msgs.filter((msg) => msg.id >= lastSummary.id)

    const app = App.info()
    if (msgs.length === 0) {
      generateText({
        maxOutputTokens: 20,
        messages: convertToModelMessages([
          ...SystemPrompt.title(input.providerID).map(
            (x): UIMessage => ({
              id: Identifier.ascending("message"),
              role: "system",
              parts: [
                {
                  type: "text",
                  text: x,
                },
              ],
            }),
          ),
          {
            role: "user",
            parts: input.parts,
          },
        ]),
        temperature: 0,
        model: model.language,
      })
        .then((result) => {
          return Session.update(input.sessionID, (draft) => {
            draft.title = result.text
          })
        })
        .catch(() => {})
    }
    const msg: Message.Info = {
      role: "user",
      id: Identifier.ascending("message"),
      parts: input.parts,
      metadata: {
        time: {
          created: Date.now(),
        },
        sessionID: input.sessionID,
        tool: {},
      },
    }
    await updateMessage(msg)
    msgs.push(msg)

    const system = input.system ?? SystemPrompt.provider(input.providerID)
    system.push(...(await SystemPrompt.environment(input.sessionID)))
    system.push(...(await SystemPrompt.custom()))

    const next: Message.Info = {
      id: Identifier.ascending("message"),
      role: "assistant",
      parts: [],
      metadata: {
        assistant: {
          system,
          path: {
            cwd: app.path.cwd,
            root: app.path.root,
          },
          cost: 0,
          tokens: {
            input: 0,
            output: 0,
            reasoning: 0,
          },
          modelID: input.modelID,
          providerID: input.providerID,
        },
        time: {
          created: Date.now(),
        },
        sessionID: input.sessionID,
        tool: {},
      },
    }
    await updateMessage(next)
    const tools: Record<string, AITool> = {}

    for (const item of await Provider.tools(input.providerID)) {
      tools[item.id.replaceAll(".", "_")] = tool({
        id: item.id as any,
        description: item.description,
        parameters: item.parameters as ZodSchema,
        async execute(args, opts) {
          const start = Date.now()
          try {
            const result = await item.execute(args, {
              sessionID: input.sessionID,
              abort: abort.signal,
              messageID: next.id,
            })
            next.metadata!.tool![opts.toolCallId] = {
              ...result.metadata,
              time: {
                start,
                end: Date.now(),
              },
            }
            await updateMessage(next)
            return result.output
          } catch (e: any) {
            next.metadata!.tool![opts.toolCallId] = {
              error: true,
              message: e.toString(),
              title: e.toString(),
              time: {
                start,
                end: Date.now(),
              },
            }
            await updateMessage(next)
            return e.toString()
          }
        },
      })
    }

    for (const [key, item] of Object.entries(await MCP.tools())) {
      const execute = item.execute
      if (!execute) continue
      item.execute = async (args, opts) => {
        const start = Date.now()
        try {
          const result = await execute(args, opts)
          next.metadata!.tool![opts.toolCallId] = {
            ...result.metadata,
            time: {
              start,
              end: Date.now(),
            },
          }
          await updateMessage(next)
          return result.content
            .filter((x: any) => x.type === "text")
            .map((x: any) => x.text)
            .join("\n\n")
        } catch (e: any) {
          next.metadata!.tool![opts.toolCallId] = {
            error: true,
            message: e.toString(),
            title: "mcp",
            time: {
              start,
              end: Date.now(),
            },
          }
          await updateMessage(next)
          return e.toString()
        }
      }
      tools[key] = item
    }

    let text: Message.TextPart | undefined
    const result = streamText({
      onStepFinish: async (step) => {
        log.info("step finish", {
          finishReason: step.finishReason,
        })
        const assistant = next.metadata!.assistant!
        const usage = getUsage(step.usage, model.info)
        assistant.cost += usage.cost
        assistant.tokens = usage.tokens
        await updateMessage(next)
        if (text) {
          Bus.publish(Message.Event.PartUpdated, {
            part: text,
            messageID: next.id,
            sessionID: next.metadata.sessionID,
          })
        }
        text = undefined
      },
      async onChunk(input) {
        const value = input.chunk
        l.info("part", {
          type: value.type,
        })
        switch (value.type) {
          case "text":
            if (!text) {
              text = value
              next.parts.push(value)
              break
            } else text.text += value.text
            break

          case "tool-call": {
            const [match] = next.parts.flatMap((p) =>
              p.type === "tool-invocation" &&
              p.toolInvocation.toolCallId === value.toolCallId
                ? [p]
                : [],
            )
            if (!match) break
            match.toolInvocation.args = value.args
            match.toolInvocation.state = "call"
            Bus.publish(Message.Event.PartUpdated, {
              part: match,
              messageID: next.id,
              sessionID: next.metadata.sessionID,
            })
            break
          }

          case "tool-call-streaming-start":
            next.parts.push({
              type: "tool-invocation",
              toolInvocation: {
                state: "partial-call",
                toolName: value.toolName,
                toolCallId: value.toolCallId,
                args: {},
              },
            })
            Bus.publish(Message.Event.PartUpdated, {
              part: next.parts[next.parts.length - 1],
              messageID: next.id,
              sessionID: next.metadata.sessionID,
            })
            break

          case "tool-call-delta":
            break

          case "tool-result":
            const match = next.parts.find(
              (p) =>
                p.type === "tool-invocation" &&
                p.toolInvocation.toolCallId === value.toolCallId,
            )
            if (match && match.type === "tool-invocation") {
              match.toolInvocation = {
                args: value.args,
                toolCallId: value.toolCallId,
                toolName: value.toolName,
                state: "result",
                result: value.result as string,
              }
              Bus.publish(Message.Event.PartUpdated, {
                part: match,
                messageID: next.id,
                sessionID: next.metadata.sessionID,
              })
            }
            break

          default:
            l.info("unhandled", {
              type: value.type,
            })
        }
        await updateMessage(next)
      },
      async onFinish(input) {
        const assistant = next.metadata!.assistant!
        const usage = getUsage(input.totalUsage, model.info)
        assistant.cost = usage.cost
        await updateMessage(next)
      },
      onError(err) {
        log.error("error", err)
        switch (true) {
          case LoadAPIKeyError.isInstance(err.error):
            next.metadata.error = new Provider.AuthError(
              {
                providerID: input.providerID,
                message: err.error.message,
              },
              { cause: err.error },
            ).toObject()
            break
          case err.error instanceof Error:
            next.metadata.error = new NamedError.Unknown(
              { message: err.error.toString() },
              { cause: err.error },
            ).toObject()
            break
          default:
            next.metadata.error = new NamedError.Unknown(
              { message: JSON.stringify(err.error) },
              { cause: err.error },
            )
        }
        Bus.publish(Event.Error, {
          error: next.metadata.error,
        })
      },
      async prepareStep(step) {
        next.parts.push({
          type: "step-start",
        })
        await updateMessage(next)
        return step
      },
      toolCallStreaming: true,
      abortSignal: abort.signal,
      stopWhen: stepCountIs(1000),
      messages: convertToModelMessages([
        ...system.map(
          (x): UIMessage => ({
            id: Identifier.ascending("message"),
            role: "system",
            parts: [
              {
                type: "text",
                text: x,
              },
            ],
          }),
        ),
        ...msgs,
      ]),
      temperature: model.info.id === "codex-mini-latest" ? undefined : 0,
      tools: {
        ...(await MCP.tools()),
        ...tools,
      },
      model: model.language,
    })
    await result.consumeStream({
      onError: (err) => {
        log.error("stream error", {
          err,
        })
      },
    })
    next.metadata!.time.completed = Date.now()
    for (const part of next.parts) {
      if (
        part.type === "tool-invocation" &&
        part.toolInvocation.state !== "result"
      ) {
        part.toolInvocation = {
          ...part.toolInvocation,
          state: "result",
          result: "request was aborted",
        }
      }
    }
    await updateMessage(next)
    return next
  }

  export async function summarize(input: {
    sessionID: string
    providerID: string
    modelID: string
  }) {
    using abort = lock(input.sessionID)
    const msgs = await messages(input.sessionID)
    const lastSummary = msgs.findLast(
      (msg) => msg.metadata.assistant?.summary === true,
    )?.id
    const filtered = msgs.filter((msg) => !lastSummary || msg.id >= lastSummary)
    const model = await Provider.getModel(input.providerID, input.modelID)
    const app = App.info()
    const system = SystemPrompt.summarize(input.providerID)

    const next: Message.Info = {
      id: Identifier.ascending("message"),
      role: "assistant",
      parts: [],
      metadata: {
        tool: {},
        sessionID: input.sessionID,
        assistant: {
          system,
          path: {
            cwd: app.path.cwd,
            root: app.path.root,
          },
          summary: true,
          cost: 0,
          modelID: input.modelID,
          providerID: input.providerID,
          tokens: {
            input: 0,
            output: 0,
            reasoning: 0,
          },
        },
        time: {
          created: Date.now(),
        },
      },
    }
    await updateMessage(next)
    const result = await generateText({
      abortSignal: abort.signal,
      model: model.language,
      messages: convertToModelMessages([
        ...system.map(
          (x): UIMessage => ({
            id: Identifier.ascending("message"),
            role: "system",
            parts: [
              {
                type: "text",
                text: x,
              },
            ],
          }),
        ),
        ...filtered,
        {
          role: "user",
          parts: [
            {
              type: "text",
              text: "Provide a detailed but concise summary of our conversation above. Focus on information that would be helpful for continuing the conversation, including what we did, what we're doing, which files we're working on, and what we're going to do next.",
            },
          ],
        },
      ]),
    })
    next.parts.push({
      type: "text",
      text: result.text,
    })
    const assistant = next.metadata!.assistant!
    const usage = getUsage(result.usage, model.info)
    assistant.cost = usage.cost
    assistant.tokens = usage.tokens
    await updateMessage(next)
  }

  const pending = new Map<string, AbortController>()
  function lock(sessionID: string) {
    log.info("locking", { sessionID })
    if (pending.has(sessionID)) throw new BusyError(sessionID)
    const controller = new AbortController()
    pending.set(sessionID, controller)
    return {
      signal: controller.signal,
      [Symbol.dispose]() {
        log.info("unlocking", { sessionID })
        pending.delete(sessionID)
      },
    }
  }

  function getUsage(usage: LanguageModelUsage, model: Provider.Model) {
    const tokens = {
      input: usage.inputTokens ?? 0,
      output: usage.outputTokens ?? 0,
      reasoning: usage.reasoningTokens ?? 0,
    }
    return {
      cost: new Decimal(0)
        .add(new Decimal(tokens.input).mul(model.cost.input).div(1_000_000))
        .add(new Decimal(tokens.output).mul(model.cost.output).div(1_000_000))
        .toNumber(),
      tokens,
    }
  }

  export class BusyError extends Error {
    constructor(public readonly sessionID: string) {
      super(`Session ${sessionID} is busy`)
    }
  }

  export async function initialize(input: {
    sessionID: string
    modelID: string
    providerID: string
  }) {
    const app = App.info()
    await Session.chat({
      sessionID: input.sessionID,
      providerID: input.providerID,
      modelID: input.modelID,
      parts: [
        {
          type: "text",
          text: PROMPT_INITIALIZE.replace("${path}", app.path.root),
        },
      ],
    })
    await App.initialize()
  }
}
