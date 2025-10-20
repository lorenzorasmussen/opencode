import { describeRoute, validator, resolver } from "hono-openapi"
import { Hono } from "hono"
import { Config } from "../../config/config"

const ERRORS = {
  400: {
    description: "Bad request",
    content: {
      "application/json": {
        schema: resolver(
          z
            .object({
              data: z.record(z.string(), z.any()),
            })
            .meta({
              ref: "Error",
            }),
        ),
      },
    },
  },
  404: {
    description: "Not found",
    content: {
      "application/json": {
        schema: resolver(
          z
            .object({
              data: z.record(z.string(), z.any()),
            })
            .meta({
              ref: "Error",
            }),
        ),
      },
    },
  },
  500: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: resolver(
          z
            .object({
              data: z.record(z.string(), z.any()),
            })
            .meta({
              ref: "Error",
            }),
        ),
      },
    },
  },
}

export const ConfigRoute = new Hono()
  .get(
    "/config",
    describeRoute({
      description: "Get config info",
      operationId: "config.get",
      responses: {
        200: {
          description: "Get config info",
          content: {
            "application/json": {
              schema: resolver(Config.Info),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.json(await Config.get())
    },
  )
  .patch(
    "/config",
    describeRoute({
      description: "Update config",
      operationId: "config.update",
      responses: {
        200: {
          description: "Successfully updated config",
          content: {
            "application/json": {
              schema: resolver(Config.Info),
            },
          },
        },
        ...ERRORS,
      },
    }),
    validator("json", Config.Info),
    async (c) => {
      const config = c.req.valid("json")
      await Config.update(config)
      return c.json(config)
    },
  )
