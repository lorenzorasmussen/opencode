import { Database } from "bun:sqlite";
import path from "path";
import { Global } from "../global";
import { Log } from "../util/log";

export namespace Storage {
  const log = Log.create({ service: "storage-sqlite" });
  let db: Database;

  export function setDb(newDb: Database) {
    db = newDb;
  }

  async function getDb() {
    if (db) return db;
    const dbFile = path.join(Global.Path.data, "opencode.sqlite");
    db = new Database(dbFile);
    log.info("Database connection established.");
    return db;
  }

  export async function remove(key: string[]) {
    const [table, ...rest] = key;
    const id = rest.join("/");
    const db = await getDb();
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  }

  export async function read<T>(key: string[]) {
    const [table, ...rest] = key;
    const id = rest.join("/");
    const db = await getDb();
    if (table === 'projects') {
        return db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id) as T;
    }
    const result = db.prepare(`SELECT data FROM ${table} WHERE id = ?`).get(id) as { data: string } | undefined;
    return result ? JSON.parse(result.data) as T : undefined;
  }

  export async function readMany<T>(keys: string[][]) {
    if (keys.length === 0) return [];

    const db = await getDb();
    const table = keys[0][0]; // Assuming all keys are for the same table

    const ids = keys.map(key => key.slice(1).join("/"));
    const placeholders = ids.map(() => "?").join(", ");

    let query: string;
    if (table === 'projects') {
        query = `SELECT * FROM projects WHERE id IN (${placeholders})`;
    } else {
        query = `SELECT data FROM ${table} WHERE id IN (${placeholders})`;
    }

    const results = db.prepare(query).all(...ids) as ({ id: string, data?: string } | T)[];

    return results.map(row => {
        if (table === 'projects') {
            return row as T;
        } else {
            return JSON.parse((row as { data: string }).data) as T;
        }
    });
  }

  export async function update<T>(key: string[], fn: (draft: T) => void) {
    const [table, ...rest] = key;
    const id = rest.join("/");
    const db = await getDb();
    const transact = db.transaction(async () => {
        const current = await read<T>(key);
        if (current) {
            fn(current);
            if (table === 'projects') {
                const project = current as any;
                db.prepare(`UPDATE projects SET worktree = ?, created_at = ?, initialized_at = ? WHERE id = ?`).run(project.worktree, project.time.created, project.time.initialized, project.id);
            } else {
                db.prepare(`UPDATE ${table} SET data = ? WHERE id = ?`).run(JSON.stringify(current), id);
            }
            return current;
        }
    });
    return transact() as T;
  }

  export async function write<T>(key: string[], content: T) {
    const [table, ...rest] = key;
    const id = rest.join("/");
    const db = await getDb();
    if (table === 'projects') {
        const project = content as any;
        db.prepare(`INSERT OR REPLACE INTO projects (id, worktree, created_at, initialized_at) VALUES (?, ?, ?, ?)`).run(project.id, project.worktree, project.time.created, project.time.initialized);
    } else {
        db.prepare(`INSERT OR REPLACE INTO ${table} (id, data) VALUES (?, ?)`).run(id, JSON.stringify(content));
    }
  }

  export async function list(prefix: string[]) {
    const [table, ...rest] = prefix;
    const db = await getDb();
    let query = `SELECT id FROM ${table}`;
    let params: string[] = [];

    if (table === 'sessions' && rest.length > 0) {
      // Assuming rest[0] is projectID if present, though current schema doesn't use it for filtering sessions directly
      // For now, we'll just list all sessions if no specific projectID is used in prefix for filtering
    } else if (table === 'messages' && rest.length > 0) {
      query += ` WHERE session_id = ?`;
      params.push(rest[0]);
    } else if (table === 'parts' && rest.length > 0) {
      query += ` WHERE message_id = ?`;
      params.push(rest[0]);
    } else if (table === 'todos' && rest.length > 0) {
      query += ` WHERE session_id = ?`;
      params.push(rest[0]);
    }

    const results = db.prepare(query).all(...params) as { id: string }[];
    return results.map(r => [table, ...r.id.split("/")]);
  }
}
