# js

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Global Installation

To install OpenCode globally for development:

```bash
# Install both production and dev versions globally
npm install -g .

# Or with bun
bun install -g .
```

This will make two commands available globally:
- `opencode` - Production version (compiled binary)
- `opencode-dev` - Development version (runs with bun)

## Development

To run the development version locally:

```bash
bun run dev
```

This project was created using `bun init` in bun v1.2.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
