# Agent Guidelines

## Build/Test Commands

- **Install**: `bun install`
- **Build**: `bun run build` (packages/opencode)
- **Test all**: `bun test`
- **Single test**: `bun test packages/opencode/test/specific.test.ts`
- **Typecheck**: `bun run typecheck`
- **Format**: `./script/format.ts`
- **Lint**: `eslint` (config in script/js/eslint.config.js)

## Code Style

- **Runtime**: Bun with TypeScript ESM modules
- **Formatting**: Prettier (no semicolons, 120 char width), EditorConfig (2 spaces, 80 max line)
- **Imports**: Relative imports for local modules, named imports preferred
- **Types**: Zod schemas for validation, TypeScript interfaces for structure
- **Naming**: camelCase variables/functions, PascalCase classes/namespaces
- **Error handling**: Result patterns, avoid throwing exceptions in tools
- **Rules**: Avoid unnecessary destructuring, else statements, try/catch, any type, let statements
- **Variables**: Prefer single word names where possible
- **APIs**: Use Bun APIs like Bun.file() extensively

## Architecture

- **Tools**: Implement Tool.Info interface with execute() method
- **Context**: Pass sessionID in tool context, use App.provide() for DI
- **Validation**: All inputs validated with Zod schemas
- **Logging**: Use Log.create({ service: "name" }) pattern
- **Storage**: Use Storage namespace for persistence
