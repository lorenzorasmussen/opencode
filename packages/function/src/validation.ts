import { z } from "zod"

export const shareCreateSchema = z.object({
  sessionID: z.string().min(1).max(200),
})

export const shareDeleteSchema = z.object({
  sessionID: z.string().min(1).max(200),
  secret: z.string().min(1).max(100),
})

export const shareSyncSchema = z.object({
  sessionID: z.string().min(1).max(200),
  secret: z.string().min(1).max(100),
  key: z.string().min(1).max(500),
  content: z.any(),
})

export const exchangePatSchema = z.object({
  owner: z.string().min(1).max(100),
  repo: z.string().min(1).max(100),
})

export const idSchema = z.string().min(1).max(50)

export const SHORT_NAME_LENGTH = 8
