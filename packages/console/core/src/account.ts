import { z } from "zod"
import { eq } from "drizzle-orm"
import { fn } from "./util/fn"
import { Database } from "./drizzle"
import { Identifier } from "./identifier"
import { AccountTable } from "./schema/account.sql"

export namespace Account {
  export const create = fn(
    z.object({
      email: z.string().email(),
      passwordHash: z.string().optional(),
      id: z.string().optional(),
    }),
    async (input) =>
      Database.transaction(async (tx) => {
        const id = input.id ?? Identifier.create("account")
        await tx.insert(AccountTable).values({
          id,
          email: input.email,
          passwordHash: input.passwordHash,
        })
        return id
      }),
  )

  export const fromID = fn(z.string(), async (id) =>
    Database.transaction(async (tx) => {
      return tx
        .select()
        .from(AccountTable)
        .where(eq(AccountTable.id, id))
        .execute()
        .then((rows) => rows[0])
    }),
  )

  export const fromEmail = fn(z.string().email(), async (email) =>
    Database.transaction(async (tx) => {
      return tx
        .select()
        .from(AccountTable)
        .where(eq(AccountTable.email, email))
        .execute()
        .then((rows) => rows[0])
    }),
  )
}
