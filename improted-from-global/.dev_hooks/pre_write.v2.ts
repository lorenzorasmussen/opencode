#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { spawnSync } from 'child_process';
import { createHash } from 'crypto';

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

const PROJECT_ROOT = process.cwd();
const TARGET_PATH = process.argv[2];
const CACHE_ROOT = join(PROJECT_ROOT, '.llm_cache');
const RUN_ID = process.env.LLM_RUN_ID || 'adhoc';
const FILE_HASH = createHash('sha256').update(TARGET_PATH).digest('hex').slice(0, 12);
const CACHE_DIR = join(CACHE_ROOT, FILE_HASH);
const ORIGINAL_PATH = join(CACHE_DIR, 'original');
const PROPOSED_PATH = join(CACHE_DIR, 'proposed');
const RUN_LOG = join(PROJECT_ROOT, '.llm_runs', RUN_ID, 'writes.log');

if (!TARGET_PATH) {
  console.error('❌ Usage: bun .dev_hooks/pre_write.v2.ts <target_file>');
  process.exit(1);
}

// ── MODEL LOCK VALIDATION ───────────────────────────────────────────
if (TARGET_PATH === 'opencode.json') {
  console.log('🔒 Model Lock Check: Validating proposed opencode.json changes...');

  // Expected locked configuration
  const LOCKED_CONFIG = {
    provider: {
      perplexity: {
        options: {
          apiKey: '${PERPLEXITY_API_KEY}',
        },
        models: {
          'sonar-pro': {
            id: 'perplexity/sonar-pro',
            name: 'Sonar Pro',
          },
        },
      },
      openrouter: {
        options: {
          apiKey: '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',
          baseURL: 'https://openrouter.ai/api/v1',
        },
        models: {
          'qwen3-coder': {
            id: 'qwen/qwen3-coder:free',
            name: 'Qwen3 Coder (Free)',
          },
          'text-embedding-ada-002': {
            id: 'openai/text-embedding-ada-002',
            name: 'OpenAI Text Embedding Ada 002',
          },
          'bge-reranker-base': {
            id: 'baai/bge-reranker-base',
            name: 'BGE Reranker Base',
          },
        },
      },
    },
  };

  // ── MODEL LOCK VALIDATION ───────────────────────────────────────────
  if (TARGET_PATH === 'opencode.json') {
    console.log('🔒 Model Lock Check: Validating proposed opencode.json changes...');

    // ── READ PROPOSED CONTENT ────────────────────────────────────────
    const proposedContent = readFileSync(0, 'utf8');

    try {
      const proposedConfig = JSON.parse(proposedContent);

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
  const secretScan = spawnSync('./bin/trufflehog', [
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
}
