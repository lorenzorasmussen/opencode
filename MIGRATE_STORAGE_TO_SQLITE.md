# Migration Plan: Storage Layer to SQLite

This document outlines the plan for migrating the `opencode` storage layer from the current file-system-based implementation to a more performant and robust SQLite-based solution.

## Plan

1.  **Implement New SQLite Storage Module:** Create a new module (`packages/opencode/src/storage/sqlite.ts`) that encapsulates all database interactions, using the `bun:sqlite` library.
2.  **Create Migration Script:** Develop a standalone script to migrate all existing data from the JSON files to the new SQLite database.
3.  **Update Session Module:** Refactor the `Session` module to use the new SQLite storage module, taking advantage of batch operations to fix the "N+1" problem.
4.  **Update Documentation:** Update all relevant architectural and developer documentation to reflect the new storage mechanism.
5.  **Deprecate and Remove Old Code:** Once the migration is complete and verified, remove the old file-system-based storage code and the now-redundant `Lock` module.

## To-Do List

- [ ] Create `packages/opencode/src/storage/sqlite.ts`.
- [ ] Define the database schema in `sqlite.ts`.
- [ ] Implement `read`, `write`, `update`, `list`, and `remove` methods in `sqlite.ts`.
- [ ] Implement batch methods like `readMany` in `sqlite.ts`.
- [ ] Create `packages/opencode/scripts/migrate-storage-to-sqlite.ts`.
- [ ] Implement the data migration logic in the script.
- [ ] Update `packages/opencode/src/session/index.ts` to use the new `sqlite.ts` module.
- [ ] Replace single-item calls with batch calls in the `Session` module.
- [ ] Remove the `Lock` module usage from the `Session` module.
- [ ] Search for and update all relevant documentation.
- [ ] Remove `packages/opencode/src/storage/storage.ts`.
- [ ] Remove the `Lock` module if it's no longer needed.
