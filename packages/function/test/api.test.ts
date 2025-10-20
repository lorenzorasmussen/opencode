import { describe, it, expect } from "vitest"
import {
  shareCreateSchema,
  shareDeleteSchema,
  shareSyncSchema,
  exchangePatSchema,
  idSchema,
  SHORT_NAME_LENGTH,
} from "../src/validation"

describe("API Validation Schemas", () => {
  it("should validate shareCreateSchema", () => {
    expect(shareCreateSchema.safeParse({ sessionID: "test123" }).success).toBe(true)
    expect(shareCreateSchema.safeParse({ sessionID: "" }).success).toBe(false)
    expect(shareCreateSchema.safeParse({ sessionID: "a".repeat(201) }).success).toBe(false)
  })

  it("should validate shareDeleteSchema", () => {
    expect(shareDeleteSchema.safeParse({ sessionID: "test123", secret: "secret" }).success).toBe(true)
    expect(shareDeleteSchema.safeParse({ sessionID: "", secret: "secret" }).success).toBe(false)
    expect(shareDeleteSchema.safeParse({ sessionID: "test123", secret: "" }).success).toBe(false)
  })

  it("should validate shareSyncSchema", () => {
    expect(shareSyncSchema.safeParse({ sessionID: "test123", secret: "secret", key: "key", content: {} }).success).toBe(
      true,
    )
    expect(shareSyncSchema.safeParse({ sessionID: "", secret: "secret", key: "key", content: {} }).success).toBe(false)
  })

  it("should validate exchangePatSchema", () => {
    expect(exchangePatSchema.safeParse({ owner: "test", repo: "repo" }).success).toBe(true)
    expect(exchangePatSchema.safeParse({ owner: "", repo: "repo" }).success).toBe(false)
  })

  it("should validate idSchema", () => {
    expect(idSchema.safeParse("validid").success).toBe(true)
    expect(idSchema.safeParse("").success).toBe(false)
    expect(idSchema.safeParse("a".repeat(51)).success).toBe(false)
    expect(idSchema.safeParse("invalid@id").success).toBe(true) // allows special chars
  })
})

describe("Utilities", () => {
  it("should have correct SHORT_NAME_LENGTH", () => {
    expect(SHORT_NAME_LENGTH).toBe(8)
  })
})
