import { beforeAll, afterAll, mock } from "bun:test"
import { Storage } from "../src/storage/sqlite"
import { Database } from "bun:sqlite"
import { Log } from "../src/util/log"
import path from "path"
import fs from "fs/promises"

// @ts-ignore
Log.init = () => {}

let currentTmpDir: string

mock.module("bun", () => ({
  $: (strings: TemplateStringsArray, ...values: any[]) => {
    const command = strings.join(" ")
    if (command.startsWith("git")) {
      if (command.includes("hash-object")) {
        return { quiet: () => ({ nothrow: () => ({ cwd: () => ({ text: () => Promise.resolve("mock-hash") }) }) }) }
      }
      if (command.includes("add")) {
        return {
          quiet: () => ({ nothrow: () => ({ cwd: () => ({ env: () => ({ text: () => Promise.resolve("") }) }) }) }),
        }
      }
      if (command.includes("write-tree")) {
        return {
          quiet: () => ({
            nothrow: () => ({ cwd: () => ({ env: () => ({ text: () => Promise.resolve("mock-tree") }) }) }),
          }),
        }
      }
      if (command.includes("checkout")) {
        return {
          quiet: () => ({ nothrow: () => ({ cwd: () => ({ env: () => ({ text: () => Promise.resolve("") }) }) }) }),
        }
      }
      if (command.includes("apply")) {
        return {
          quiet: () => ({
            nothrow: () => ({ cwd: () => ({ env: () => ({ text: () => ({ stdin: () => Promise.resolve("") }) }) }) }),
          }),
        }
      }
      if (command.includes("diff")) {
        return {
          quiet: () => ({
            nothrow: () => ({ cwd: () => ({ env: () => ({ text: () => Promise.resolve("mock-diff") }) }) }),
          }),
        }
      }
    }
    // Fallback for non-git commands or unmocked git commands
    return { quiet: () => ({ nothrow: () => ({ cwd: () => ({ text: () => Promise.resolve("") }) }) }) }
  },
}))

beforeAll(async () => {
  currentTmpDir = await fs.mkdtemp(path.join(path.dirname(__filename), "tmp-"))
  mock.module("../src/global", () => ({
    Global: {
      Path: {
        data: currentTmpDir,
        bin: path.join(currentTmpDir, "bin"),
        log: path.join(currentTmpDir, "log"),
        cache: path.join(currentTmpDir, "cache"),
        config: currentTmpDir,
        state: currentTmpDir,
      },
    },
  }))

  const db = new Database(":memory:", { readwrite: true, create: true })
  Storage.setDb(db)

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      worktree TEXT,
      created_at INTEGER,
      initialized_at INTEGER
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      parent_id TEXT,
      title TEXT,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY(project_id) REFERENCES projects(id),
      FOREIGN KEY(parent_id) REFERENCES sessions(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      data TEXT,
      FOREIGN KEY(session_id) REFERENCES sessions(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      message_id TEXT,
      session_id TEXT,
      data TEXT,
      FOREIGN KEY(message_id) REFERENCES messages(id),
      FOREIGN KEY(session_id) REFERENCES sessions(id)
    );
  `)

  db.run(`
     CREATE TABLE IF NOT EXISTS todos (
       id TEXT PRIMARY KEY,
       data TEXT
     );
   `)
})
