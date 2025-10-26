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

// ── MODEL LOCK VALIDATION ───────────────────────────────────────────
if (TARGET_PATH === 'opencode.json') {
  console.log('🔒 Model Lock Check: Validating proposed opencode.json changes...');

  // Expected locked configuration
  const LOCKED_CONFIG = {
    model: 'opencode/code-supernova',
    small_model: 'opencode/big-pickle',
    provider: {
      opencode: {
        models: {
          'code-supernova': {
            id: 'opencode/code-supernova',
            name: 'Code Supernova',
          },
          'grok-code-fast-1': {
            id: 'opencode/grok-code-fast-1',
            name: 'Grok Code Fast',
          },
          'big-pickle': {
            id: 'opencode/big-pickle',
            name: 'Big Pickle',
          },
        },
      },
      openrouter: {
        models: {
          'qwen3-coder': {
            id: 'qwen/qwen3-coder:free',
            name: 'Qwen3 Coder (Free)',
          },
          'mistral-small': {
            id: 'mistralai/mistral-small-3.2-24b-instruct:free',
            name: 'Mistral Small 3.2 (Free)',
          },
          'text-embedding-ada-002': {
            id: 'openai/text-embedding-ada-002',
            name: 'OpenAI Text Embedding Ada 002',
          },
          'text-embedding-3-small': {
            id: 'openai/text-embedding-3-small',
            name: 'OpenAI Text Embedding 3 Small',
          },
          'bge-reranker-base': {
            id: 'baai/bge-reranker-base',
            name: 'BGE Reranker Base',
          },
          'bge-reranker-large': {
            id: 'baai/bge-reranker-large',
            name: 'BGE Reranker Large',
          },
        },
      },
    },
  };

  function deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    return false;
  }

  // ── READ PROPOSED CONTENT ────────────────────────────────────────
  const proposedContent = await Bun.stdin.text();

  try {
    const proposedConfig = JSON.parse(proposedContent);

    // Check main model
    if (proposedConfig.model !== LOCKED_CONFIG.model) {
      console.error(
        `❌ Main model violation! Expected: '${LOCKED_CONFIG.model}', Proposed: '${proposedConfig.model}'`
      );
      console.log('');
      console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
      console.log('Changes to models in opencode.json are not allowed.');
      console.log('This write operation has been blocked.');
      console.log('');
      process.exit(1);
    }

    // Check small model
    if (proposedConfig.small_model !== LOCKED_CONFIG.small_model) {
      console.error(
        `❌ Small model violation! Expected: '${LOCKED_CONFIG.small_model}', Proposed: '${proposedConfig.small_model}'`
      );
      console.log('');
      console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
      console.log('Changes to models in opencode.json are not allowed.');
      console.log('This write operation has been blocked.');
      console.log('');
      process.exit(1);
    }

    const proposedProviders = proposedConfig.provider || {};

    // Check if all locked providers exist and models match
    for (const [providerName, providerData] of Object.entries(LOCKED_CONFIG.provider)) {
      if (!proposedProviders[providerName]) {
        console.error(`❌ Provider '${providerName}' is missing from proposed configuration!`);
        console.log('');
        console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
        console.log('Changes to models in opencode.json are not allowed.');
        console.log('This write operation has been blocked.');
        console.log('');
        process.exit(1);
      }

      const proposedProvider = proposedProviders[providerName];
      const lockedProvider = providerData as any;

      // All providers now have direct models structure
      const proposedModels = proposedProvider.models || {};
      const lockedModels = lockedProvider.models;

      if (!lockedModels) {
        console.error(`❌ Provider '${providerName}' configuration structure is invalid!`);
        console.log('');
        console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
        console.log('Changes to models in opencode.json are not allowed.');
        console.log('This write operation has been blocked.');
        console.log('');
        process.exit(1);
      }

      // Check if all locked models exist and match
      for (const [modelName, modelData] of Object.entries(lockedModels)) {
        if (!proposedModels[modelName]) {
          console.error(
            `❌ Model '${modelName}' is missing from provider '${providerName}' in proposed configuration!`
          );
          console.log('');
          console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
          console.log('Changes to models in opencode.json are not allowed.');
          console.log('This write operation has been blocked.');
          console.log('');
          process.exit(1);
        }

        // Check if model configuration matches
        if (!deepEqual(proposedModels[modelName], modelData)) {
          console.error(
            `❌ Model '${modelName}' configuration violation in provider '${providerName}'!`
          );
          console.error('Expected:', JSON.stringify(modelData, null, 2));
          console.error('Proposed:', JSON.stringify(proposedModels[modelName], null, 2));
          console.log('');
          console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
          console.log('Changes to models in opencode.json are not allowed.');
          console.log('This write operation has been blocked.');
          console.log('');
          process.exit(1);
        }
      }
    }

    console.log('✅ Model lock validation passed - proposed changes are authorized');
  } catch (error) {
    console.error('❌ Error parsing proposed opencode.json:', error.message);
    console.log('');
    console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
    console.log('Invalid JSON or parsing error in proposed changes.');
    console.log('This write operation has been blocked.');
    console.log('');
    process.exit(1);
  }
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
const secretScan = spawnSync('trufflehog', [
  'filesystem',
  '--directory',
  CACHE_DIR,
  '--only-verified',
]);
const output = secretScan.stdout ? secretScan.stdout.toString().trim() : '';
if (secretScan.status !== 0 && output !== '') {
  console.error('🚨 SECRET DETECTED! Write blocked.');
  console.error(output);
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
  const result = spawnSync(cmd[0], cmd.slice(1), {
    input: proposedContent,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.error('❌ Linting failed!');
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
}

// ── DIFF & APPROVAL ──────────────────────────────────────────────
if (existsSync(ORIGINAL_PATH)) {
  const diff = spawnSync('diff', ['-u', ORIGINAL_PATH, PROPOSED_PATH], {
    encoding: 'utf8',
  });
  console.log('🔍 Proposed changes:');
  console.log(diff.stdout || '(no changes)');
} else {
  console.log('🔍 New file:');
  console.log(proposedContent);
}

// ── FINAL WRITE & LOG ────────────────────────────────────────────
writeFileSync(TARGET_PATH, proposedContent);
writeFileSync(RUN_LOG, `${new Date().toISOString()} | WRITE | ${TARGET_PATH}\n`, { flag: 'a' });
console.log(`✅ Written: ${TARGET_PATH}`);
