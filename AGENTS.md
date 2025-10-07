# Agent Guidelines for OpenCode

## Build/Test Commands

- **Build**: `bun run build` (packages/opencode)
- **Test**: `bun test` (packages/opencode) or `bun turbo test` (root for all packages)
- **Test single file**: `bun test <file>.test.ts`
- **Typecheck**: `bun typecheck` (root) or `bun run typecheck` (packages/opencode)
- **Format**: `./script/format.ts` (prettier with no semicolons, 120 char width)
- **Dev**: `bun dev` (packages/opencode)

## Code Style

- **Language**: TypeScript with Bun runtime
- **Imports**: Relative imports preferred, no global aliases
- **Formatting**: Prettier (no semicolons, 120 char lines), EditorConfig (2 spaces, LF)
- **Naming**: PascalCase for classes/types, camelCase for variables/functions, snake_case for files
- **Types**: Strict typing, avoid `any`, use Zod for validation
- **Error Handling**: Custom NamedError class with Zod schemas, avoid try/catch where possible
- **Variables**: Prefer `const` over `let`, single word names when possible
- **Functions**: Keep in one function unless composable/reusable, avoid unnecessary destructuring
- **Control Flow**: Avoid `else` statements, prefer early returns
- **APIs**: Use Bun APIs like `Bun.file()`, `Bun.Glob` extensively

## IMPORTANT

- Try to keep things in one function unless composable or reusable
- DO NOT do unnecessary destructuring of variables
- DO NOT use `else` statements unless necessary
- DO NOT use `try`/`catch` if it can be avoided
- AVOID `try`/`catch` where possible
- AVOID `else` statements
- AVOID using `any` type
- AVOID `let` statements
- PREFER single word variable names where possible
- Use as many bun apis as possible like Bun.file()

## Debugging

- To test opencode in the `packages/opencode` directory you can run `bun dev`
