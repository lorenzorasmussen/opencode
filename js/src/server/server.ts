import { Log } from "../util/log";
import { Bus } from "../bus";
import { describeRoute, generateSpecs, openAPISpecs } from "hono-openapi";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { Session } from "../session/session";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";
import { Config } from "../app/config";
import { LLM } from "../llm/llm";
import { Message } from "../session/message";

const SessionInfo = Session.Info.openapi({
  ref: "Session.Info",
});

const ProviderInfo = Config.Provider.openapi({
  ref: "Provider.Info",
});

type ProviderInfo = z.output<typeof ProviderInfo>;

export namespace Server {
  const log = Log.create({ service: "server" });
  const PORT = 16713;

  export type App = ReturnType<typeof app>;

  function app() {
    const app = new Hono();

    const result = app
      .get(
        "/openapi",
        openAPISpecs(app, {
          documentation: {
            info: {
              title: "opencode",
              version: "1.0.0",
              description: "opencode api",
            },
            openapi: "3.0.0",
          },
        }),
      )
      .get("/event", async (c) => {
        log.info("event connected");
        return streamSSE(c, async (stream) => {
          stream.writeSSE({
            data: JSON.stringify({}),
          });
          const unsub = Bus.subscribeAll(async (event) => {
            await stream.writeSSE({
              data: JSON.stringify(event),
            });
          });
          await new Promise<void>((resolve) => {
            stream.onAbort(() => {
              unsub();
              resolve();
              log.info("event disconnected");
            });
          });
        });
      })
      .post(
        "/session_create",
        describeRoute({
          description: "Create a new session",
          responses: {
            200: {
              description: "Successfully created session",
              content: {
                "application/json": {
                  schema: resolver(SessionInfo),
                },
              },
            },
          },
        }),
        async (c) => {
          const session = await Session.create();
          return c.json(session);
        },
      )
      .post(
        "/session_share",
        describeRoute({
          description: "Share the session",
          responses: {
            200: {
              description: "Successfully shared session",
              content: {
                "application/json": {
                  schema: resolver(SessionInfo),
                },
              },
            },
          },
        }),
        zValidator(
          "json",
          z.object({
            sessionID: z.string(),
          }),
        ),
        async (c) => {
          const body = c.req.valid("json");
          await Session.share(body.sessionID);
          const session = await Session.get(body.sessionID);
          return c.json(session);
        },
      )
      .post(
        "/session_messages",
        describeRoute({
          description: "Get messages for a session",
          responses: {
            200: {
              description: "Successfully created session",
              content: {
                "application/json": {
                  schema: resolver(Message.Info.array()),
                },
              },
            },
          },
        }),
        zValidator(
          "json",
          z.object({
            sessionID: z.string(),
          }),
        ),
        async (c) => {
          const messages = await Session.messages(
            c.req.valid("json").sessionID,
          );
          return c.json(messages);
        },
      )
      .post(
        "/session_list",
        describeRoute({
          description: "List all sessions",
          responses: {
            200: {
              description: "List of sessions",
              content: {
                "application/json": {
                  schema: resolver(Session.Info.array()),
                },
              },
            },
          },
        }),
        async (c) => {
          const sessions = await Array.fromAsync(Session.list());
          return c.json(sessions);
        },
      )
      .post(
        "/session_abort",
        describeRoute({
          description: "Abort a session",
          responses: {
            200: {
              description: "Aborted session",
              content: {
                "application/json": {
                  schema: resolver(z.boolean()),
                },
              },
            },
          },
        }),
        zValidator(
          "json",
          z.object({
            sessionID: z.string(),
          }),
        ),
        async (c) => {
          const body = c.req.valid("json");
          return c.json(Session.abort(body.sessionID));
        },
      )
      .post(
        "/session_chat",
        describeRoute({
          description: "Chat with a model",
          responses: {
            200: {
              description: "Chat with a model",
              content: {
                "application/json": {
                  schema: resolver(Message.Info),
                },
              },
            },
          },
        }),
        zValidator(
          "json",
          z.object({
            sessionID: z.string(),
            providerID: z.string(),
            modelID: z.string(),
            parts: Message.Part.array(),
          }),
        ),
        async (c) => {
          const body = c.req.valid("json");
          const msg = await Session.chat(body);
          return c.json(msg);
        },
      )
      .post(
        "/provider_list",
        describeRoute({
          description: "List all providers",
          responses: {
            200: {
              description: "List of providers",
              content: {
                "application/json": {
                  schema: resolver(z.record(z.string(), ProviderInfo)),
                },
              },
            },
          },
        }),
        async (c) => {
          const providers = await LLM.providers();
          const result: Record<string, ProviderInfo> = {};
          for (const [providerID, provider] of Object.entries(providers)) {
            result[providerID] = provider.info;
          }
          return c.json(result);
        },
      );

    return result;
  }

  export async function openapi() {
    const a = app();
    const result = await generateSpecs(a, {
      documentation: {
        info: {
          title: "opencode",
          version: "1.0.0",
          description: "opencode api",
        },
        openapi: "3.0.0",
      },
    });
    return result;
  }

  export function listen() {
    const server = Bun.serve({
      port: PORT,
      hostname: "0.0.0.0",
      idleTimeout: 0,
      fetch: app().fetch,
    });
    return server;
  }
}
