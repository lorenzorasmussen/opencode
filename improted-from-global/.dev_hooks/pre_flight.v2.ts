#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const RUN_ID = process.env.LLM_RUN_ID || new Date().toISOString().replace(/[:.]/g, '-');
const RUN_DIR = join(process.cwd(), '.llm_runs', RUN_ID);
const STATE_FILE = join(RUN_DIR, 'state.json');

let state = {
  step: 0,
  completed: [] as string[],
  files: [] as string[],
  start_time: new Date().toISOString(),
  todos: [] as string[],
};

if (existsSync(STATE_FILE)) {
  state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  console.log(`🔁 Resuming run ${RUN_ID} from step ${state.step}`);
} else {
  mkdirSync(RUN_DIR, { recursive: true });
  writeFileSync(join(RUN_DIR, 'manifest.json'), JSON.stringify({ ...state }, null, 2));
}

// Model Lock Validation
console.log('🔒 Running Model Lock Validation...');
try {
  const { execSync } = require('child_process');
  execSync('bun run .dev_hooks/model_lock.v2.ts', { stdio: 'inherit' });
  console.log('✅ Model lock validation passed');
} catch (error) {
  console.error('❌ Model lock validation failed');
  process.exit(1);
}

// Sync TODOs
if (existsSync('TODO.md')) {
  const todos = readFileSync('TODO.md', 'utf8');
  state.todos = todos.match(/^- \[ \] (.+)/g)?.map((t) => t.replace('- [ ] ', '')) || [];
}

writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
process.env.LLM_RUN_ID = RUN_ID;
