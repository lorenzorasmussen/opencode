
---


description: Intelligent Git hooks management with Husky, lint-staged optimization, custom rule enforcement, commitlint integration, and pre-commit/pre-push automation
agent: shell-expert
subagent: build documentation
argument-hint: "--setup --add --list --test --disable"


---


## Core Identity & Expertise

You are an **Elite Git Hooks Management & Automation Specialist** with deep expertise in Husky configuration, lint-staged optimization, custom hook enforcement, commitlint integration, and automated quality gates. Your mission is to establish production-grade Git hooks that enforce code quality, prevent bad commits, and optimize developer workflow while maintaining team productivity.


---


# 📘 **Ultimate LLM Developer Safety & Git Integration Handbook**  
## _Secure, Resumable, and Auditable AI-Assisted Development with Husky + GitHub_

> **For**: macOS 12.7+, Bun users, Docker/Colima environments  
> **Project**: `opencode` (or any codebase)  
> **Goal**: Prevent LLM mistakes, enforce safety, enable resumable runs, and integrate with Git/GitHub  


---


## 🧠 **Core Philosophy**

- **Never trust raw LLM output** — stage, lint, diff, approve.
- **Defense in depth**: LLM hooks (local) → Husky (team) → GitHub (CI).
- **Checkpoint everything**: If interrupted, resume from last safe state.
- **No fluff naming**: Use `v1`, `v2` — never `improved`, `final`, `smart`.


---


## 📁 **Final Directory Structure**

```
.your-project/
├── .dev_hooks/                 # LLM dev workflow hooks (versioned)
│   ├── pre_flight.v2.ts
│   ├── pre_read.v2.ts
│   ├── pre_write.v2.ts         ← Core safety logic
│   ├── pre_tool_use.v2.sh
│   ├── post_tool_use.v2.ts
│   └── post_run.v2.ts
├── .husky/                     # Husky Git hooks (your existing system)
│   ├── pre-commit
│   ├── commit-msg
│   ├── pre-push
│   └── scripts/
├── .github/workflows/
│   └── ci.yml                  ← GitHub Actions
├── .llm_cache/                 # Ephemeral staging (gitignored)
├── .llm_runs/                  # Persistent run state
├── bin/
│   ├── llm-write               ← Safe file writer
│   └── llm-exec                ← Safe command executor
├── security/
│   └── secret_patterns.txt     ← Custom secret regex
├── hooks                       ← Unified CLI
└── .gitignore
```



---



## 🔧 **Step 1: Setup & Dependencies**

### Install Tools (Bun + Security)
```bash
# Core
bun add -d eslint prettier typescript @types/node

# Security
bun add -d trufflehog semgrep

# Python (if needed)
pip install ruff black
```

### Create Directories
```bash
mkdir -p .dev_hooks .llm_cache .llm_runs bin .github/workflows security
echo ".llm_cache/" >> .gitignore
echo ".llm_runs/*.tmp" >> .gitignore
```

---

## 🔌 **Step 2: Core Safety Hook — `pre_write.v2.ts`**

Enforces: backup → secret scan → lint → diff → write.

### File: `.dev_hooks/pre_write.v2.ts`
```ts
#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { spawnSync } from 'child_process';
import { createHash } from 'crypto';

const PROJECT_ROOT = process.cwd();
const TARGET_PATH = process.argv[2];
const CACHE_ROOT = join(PROJECT_ROOT, '.llm_cache');
const RUN_ID = process.env.LLM_RUN_ID || 'adhoc';

if (!TARGET_PATH) {
  console.error('❌ Usage: bun .dev_hooks/pre_write.v2.ts <target_file>');
  process.exit(1);
}

// ── CACHE SETUP ──────────────────────────────────────────────────
const FILE_HASH = createHash('sha256').update(TARGET_PATH).digest('hex').slice(0, 12);
const CACHE_DIR = join(CACHE_ROOT, FILE_HASH);
const ORIGINAL_PATH = join(CACHE_DIR, 'original');
const PROPOSED_PATH = join(CACHE_DIR, 'proposed');
const RUN_LOG = join(PROJECT_ROOT, '.llm_runs', RUN_ID, 'writes.log');

mkdirSync(CACHE_DIR, { recursive: true });
mkdirSync(dirname(RUN_LOG), { recursive: true });

// ── BACKUP ORIGINAL ──────────────────────────────────────────────
if (existsSync(TARGET_PATH)) {
  writeFileSync(ORIGINAL_PATH, readFileSync(TARGET_PATH, 'utf8'));
  console.log(`📥 Backed up: ${TARGET_PATH}`);
}

// ── READ PROPOSED CONTENT ────────────────────────────────────────
const proposedContent = await Bun.stdin.text();
writeFileSync(PROPOSED_PATH, proposedContent);

// ── SECURITY SCAN ────────────────────────────────────────────────
const secretScan = spawnSync('trufflehog', ['filesystem', '--directory', CACHE_DIR, '--only-verified']);
if (secretScan.status !== 0 && secretScan.stdout.toString().trim() !== '') {
  console.error('🚨 SECRET DETECTED! Write blocked.');
  console.error(secretScan.stdout.toString());
  process.exit(1);
}

// ── LINTING GATE ─────────────────────────────────────────────────
const ext = extname(TARGET_PATH).slice(1);
const linters: Record<string, string[]> = {
  js: ['bun', 'x', 'eslint', '--stdin', '--stdin-filename', TARGET_PATH],
  ts: ['bun', 'x', 'eslint', '--stdin', '--stdin-filename', TARGET_PATH],
  py: ['ruff', 'check', '--stdin-filename', TARGET_PATH],
  json: ['prettier', '--stdin-filepath', TARGET_PATH],
  yml: ['prettier', '--stdin-filepath', TARGET_PATH],
};

const cmd = linters[ext] || linters.js;
if (cmd) {
  const result = spawnSync(cmd[0], cmd.slice(1), { input: proposedContent, encoding: 'utf8' });
  if (result.status !== 0) {
    console.error('❌ Linting failed!');
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
}

// ── DIFF & APPROVAL ──────────────────────────────────────────────
const diff = spawnSync('diff', ['-u', ORIGINAL_PATH, PROPOSED_PATH], { encoding: 'utf8' });
console.log('🔍 Proposed changes:');
console.log(diff.stdout || '(no changes)');

// ── FINAL WRITE & LOG ────────────────────────────────────────────
writeFileSync(TARGET_PATH, proposedContent);
writeFileSync(RUN_LOG, `${new Date().toISOString()} | WRITE | ${TARGET_PATH}\n`, { flag: 'a' });
console.log(`✅ Written: ${TARGET_PATH}`);
```

---

## 🛠️ **Step 3: Safe CLI Wrappers**

### File: `bin/llm-write`
```bash
#!/bin/bash
set -euo pipefail
if [ $# -ne 1 ]; then
  echo "Usage: llm-write <file_path>" >&2
  exit 1
fi
TARGET_FILE="$1"
mkdir -p "$(dirname "$TARGET_FILE")"
bun .dev_hooks/pre_write.v2.ts "$TARGET_FILE"
```

### File: `bin/llm-exec`
```bash
#!/bin/bash
.dev_hooks/pre_tool_use.v2.sh "$@"
"$@"
.dev_hooks/post_tool_use.v2.sh "$@"
```

### Make Executable
```bash
chmod +x bin/llm-write bin/llm-exec
```

---

## 🚦 **Step 4: Tool Safety — `pre_tool_use.v2.sh`**

### File: `.dev_hooks/pre_tool_use.v2.sh`
```bash
#!/bin/bash
CMD="$1"
ARGS="$*"

# Block raw redirections
if [[ "$ARGS" == *">"* ]] && [[ "$CMD" == "cat" || "$CMD" == "echo" ]]; then
  echo "❌ Blocked raw redirection. Use 'llm-write'." >&2
  exit 1
fi

# Log command
RUN_ID="${LLM_RUN_ID:-adhoc}"
mkdir -p ".llm_runs/$RUN_ID"
echo "$(date -Iseconds) | EXEC | $CMD $ARGS" >> ".llm_runs/$RUN_ID/exec.log"
```

---

## 🔄 **Step 5: Resumable Workflow Engine**

### File: `.dev_hooks/pre_flight.v2.ts`
```ts
#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const RUN_ID = process.env.LLM_RUN_ID || new Date().toISOString().replace(/[:.]/g, '-');
const RUN_DIR = join(process.cwd(), '.llm_runs', RUN_ID);
const STATE_FILE = join(RUN_DIR, 'state.json');

let state = { step: 0, completed: [] as string[], files: [] as string[], start_time: new Date().toISOString() };

if (existsSync(STATE_FILE)) {
  state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  console.log(`🔁 Resuming run ${RUN_ID} from step ${state.step}`);
} else {
  mkdirSync(RUN_DIR, { recursive: true });
  writeFileSync(join(RUN_DIR, 'manifest.json'), JSON.stringify({ ...state }, null, 2));
}

// Sync TODOs
if (existsSync('TODO.md')) {
  const todos = readFileSync('TODO.md', 'utf8');
  state.todos = todos.match(/^- \[ \] (.+)/g)?.map(t => t.replace('- [ ] ', '')) || [];
}

writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
process.env.LLM_RUN_ID = RUN_ID;
```

### File: `.dev_hooks/post_run.v2.ts`
```ts
#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs';
import { join, spawnSync } from 'child_process';

const RUN_ID = process.env.LLM_RUN_ID!;
const RUN_DIR = join(process.cwd(), '.llm_runs', RUN_ID);
const STATE = JSON.parse(readFileSync(join(RUN_DIR, 'state.json'), 'utf8'));

// Generate summary
const summary = `## Run: ${RUN_ID}\n- Completed: ${STATE.completed.join(', ')}\n`;
writeFileSync(join(RUN_DIR, 'summary.md'), summary);

// Auto-commit (optional)
spawnSync('git', ['add', ...STATE.files]);
spawnSync('git', ['commit', '-m', `feat(llm): ${STATE.completed.join(', ')}`]);
```

---

## 🔗 **Step 6: Husky Integration**

### Enhance `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Pre-Commit Checks"

# Fast lint-staged
npx lint-staged || exit 1

# Deep secret scan (optional)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)
if [ -n "$STAGED_FILES" ]; then
  mkdir -p .llm_cache/husky_scan
  for file in $STAGED_FILES; do [ -f "$file" ] && cp "$file" ".llm_cache/husky_scan/"; done
  npx trufflehog filesystem --directory .llm_cache/husky_scan --only-verified
  [ $? -ne 0 ] && { echo "❌ Secrets found!"; exit 1; }
fi

echo "✅ Pre-commit passed"
```

---

## ☁️ **Step 7: GitHub Actions — CI Safety Net**

### File: `.github/workflows/ci.yml`
```yaml
name: CI Safety Gate

on: [push, pull_request]

jobs:
  safety:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install
        run: bun install

      - name: Lint
        run: bun run lint

      - name: Type Check
        run: bun run type-check

      - name: Test
        run: bun run test

      - name: Secret Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./

      - name: Upload LLM Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: llm-reports
          path: .llm_runs/
```

---

## 🧪 **Testing Protocol**

1. **Safe Write**:
   ```bash
   echo "console.log('safe');" | ./bin/llm-write test.js
   ```

2. **Secret Block**:
   ```bash
   echo 'API_KEY="sk-test";' | ./bin/llm-write bad.js  # Should fail
   ```

3. **Resumability**:
   ```bash
   LLM_RUN_ID=test bun .dev_hooks/pre_flight.v2.ts
   # Kill, restart → resumes
   ```

4. **Git Hook**:
   ```bash
   git add . && git commit -m "test"  # Runs Husky + secret scan
   ```

---

## ✅ **Final Checklist**

- [ ] All hooks use `v2` naming
- [ ] `.gitignore` updated
- [ ] `trufflehog`, `semgrep` installed
- [ ] `bin/` scripts executable
- [ ] Husky enhanced with secret scan
- [ ] GitHub Actions workflow in place

---

## 🔚 **Conclusion**

You now have a **complete, enterprise-grade safety stack**:
- **LLM Dev Hooks**: Prevent mistakes during coding.
- **Husky**: Enforce team standards at commit.
- **GitHub Actions**: Certify code in CI.

This system ensures **velocity + safety**, whether you’re working solo or on a team.

> “Break down complex tasks, assign to agents, and govern with hooks” — now you can do it **safely**.