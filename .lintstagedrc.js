/**
 * lint-staged Configuration
 *
 * Runs only on staged files for maximum performance[4][6]
 *
 * Philosophy:
 * - Fix what can be auto-fixed
 * - Fast feedback loop
 * - Block only on critical errors
 */

export default {
  // JavaScript/TypeScript files
  "*.{js,jsx,ts,tsx}": [
    // 1. ESLint with auto-fix (max 10 warnings allowed)
    "npx eslint --fix --max-warnings 10",

    // 2. Prettier formatting
    "npx prettier --write",
  ],

  // TypeScript type checking (no auto-fix)
  "*.{ts,tsx}": [() => "bun run typecheck"],

  // JSON files
  "*.json": ["npx prettier --write"],

  // YAML files
  "*.{yml,yaml}": ["npx prettier --write"],

  // Markdown files
  "*.md": ["npx prettier --write --prose-wrap always"],
}
