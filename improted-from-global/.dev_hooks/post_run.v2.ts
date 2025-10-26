#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const RUN_ID = process.env.LLM_RUN_ID!;
const RUN_DIR = join(process.cwd(), '.llm_runs', RUN_ID);
const STATE = JSON.parse(readFileSync(join(RUN_DIR, 'state.json'), 'utf8'));

// Generate summary
const summary = `## Run: ${RUN_ID}\n- Completed: ${STATE.completed.join(', ')}\n`;
writeFileSync(join(RUN_DIR, 'summary.md'), summary);

// Auto-commit (optional)
spawnSync('git', ['add', ...STATE.files]);
spawnSync('git', ['commit', '-m', `feat(llm): ${STATE.completed.join(', ')}`]);
