#!/usr/bin/env bun
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_FILE = join(process.cwd(), 'opencode.json');

// Expected locked configuration - only lock model fields that should not change
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

function validateModels(): boolean {
  if (!existsSync(CONFIG_FILE)) {
    console.error('❌ opencode.json not found!');
    return false;
  }

  try {
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));

    // Check main model
    if (config.model !== LOCKED_CONFIG.model) {
      console.error(
        `❌ Main model changed! Expected: '${LOCKED_CONFIG.model}', Found: '${config.model}'`
      );
      return false;
    }

    // Check small model
    if (config.small_model !== LOCKED_CONFIG.small_model) {
      console.error(
        `❌ Small model changed! Expected: '${LOCKED_CONFIG.small_model}', Found: '${config.small_model}'`
      );
      return false;
    }

    const currentProviders = config.provider || {};

    // Check if all locked providers exist
    for (const [providerName, providerData] of Object.entries(LOCKED_CONFIG.provider)) {
      if (!currentProviders[providerName]) {
        console.error(`❌ Provider '${providerName}' is missing from configuration!`);
        return false;
      }

      const currentProvider = currentProviders[providerName];
      const lockedProvider = providerData as any;

      // All providers now have direct models structure
      const currentModels = currentProvider.models || {};
      const lockedModels = lockedProvider.models;

      if (!lockedModels) {
        console.error(`❌ Provider '${providerName}' configuration structure is invalid!`);
        return false;
      }

      // Check if all locked models exist
      for (const [modelName, modelData] of Object.entries(lockedModels)) {
        if (!currentModels[modelName]) {
          console.error(`❌ Model '${modelName}' is missing from provider '${providerName}'!`);
          return false;
        }

        // Check if model configuration matches
        if (!deepEqual(currentModels[modelName], modelData)) {
          console.error(
            `❌ Model '${modelName}' configuration has changed in provider '${providerName}'!`
          );
          console.error('Expected:', JSON.stringify(modelData, null, 2));
          console.error('Found:', JSON.stringify(currentModels[modelName], null, 2));
          return false;
        }
      }
    }

    console.log('✅ Model lock validation passed - no unauthorized changes detected');
    return true;
  } catch (error) {
    console.error(
      '❌ Error validating models:',
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

// Main execution
console.log('🔒 Model Lock Pre-Flight Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!validateModels()) {
  console.log('');
  console.log('🚫 MODEL LOCK VIOLATION DETECTED!');
  console.log('Changes to models in opencode.json are not allowed.');
  console.log('Please revert any model configuration changes.');
  console.log('');
  process.exit(1);
}

console.log('✅ All model configurations are locked and valid.');
console.log('');
