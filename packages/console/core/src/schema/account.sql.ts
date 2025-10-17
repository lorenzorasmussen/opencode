import { mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
import { id, timestamps } from "../drizzle/types"

export const AccountTable = mysqlTable(
  "account",
  {
    id: id(),
    ...timestamps,
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
  },
  (table) => [uniqueIndex("email").on(table.email)],
)
