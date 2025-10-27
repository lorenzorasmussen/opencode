# OpenRouter Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by model and provider (typically 50-200 RPM)
- **Authentication**: OpenRouter API key required
- **Scopes**: Multi-model AI access across providers
- **Thread Safety**: Operations are thread-safe

## Available OpenRouter Tool Calls

### 1. OPENROUTER_CREATE_CHAT_COMPLETION
Creates a chat completion using various AI models.

**Parameters:**
```json
{
  "model": "anthropic/claude-3-haiku",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Required Fields:**
- `model`: AI model identifier
- `messages`: Array of chat messages

### 2. OPENROUTER_CREATE_COMPLETION
Creates a text completion using various AI models.

**Parameters:**
```json
{
  "model": "openai/gpt-3.5-turbo-instruct",
  "prompt": "Write a short story about",
  "max_tokens": 500,
  "temperature": 0.8
}
```

**Required Fields:**
- `model`: AI model identifier
- `prompt`: Text prompt

### 3. OPENROUTER_GET_CREDITS
Gets account credits and usage information.

**Parameters:**
```json
{}
```

### 4. OPENROUTER_GET_GENERATION
Gets information about a specific generation.

**Parameters:**
```json
{
  "generation_id": "generation_id_string"
}
```

**Required Fields:**
- `generation_id`: The generation ID

### 5. OPENROUTER_LIST_AVAILABLE_MODELS
Lists all available AI models through OpenRouter.

**Parameters:**
```json
{
  "order": "featured",
  "limit": 20
}
```

### 6. OPENROUTER_LIST_MODEL_ENDPOINTS
Lists endpoints for a specific model.

**Parameters:**
```json
{
  "model": "anthropic/claude-3-haiku"
}
```

**Required Fields:**
- `model`: Model identifier

### 7. OPENROUTER_LIST_PROVIDERS
Lists all available AI providers.

**Parameters:**
```json
{}
```

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('OPENROUTER_CREATE_CHAT_COMPLETION', {
  model: 'anthropic/claude-3-haiku',
  messages: [
    {
      role: 'user',
      content: 'Explain quantum computing simply'
    }
  ],
  temperature: 0.7
});
```

## Simplifying OpenRouter Tool Calls

### Helper Functions
```javascript
async function chatCompletion(model, messages, options = {}) {
  return await callRubeTool('OPENROUTER_CREATE_CHAT_COMPLETION', {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    ...options
  });
}

async function textCompletion(model, prompt, options = {}) {
  return await callRubeTool('OPENROUTER_CREATE_COMPLETION', {
    model,
    prompt,
    max_tokens: 500,
    temperature: 0.8,
    ...options
  });
}

async function getAccountInfo() {
  return await callRubeTool('OPENROUTER_GET_CREDITS', {});
}

async function listModels(order = 'featured', limit = 20) {
  return await callRubeTool('OPENROUTER_LIST_AVAILABLE_MODELS', {
    order,
    limit
  });
}

async function listProviders() {
  return await callRubeTool('OPENROUTER_LIST_PROVIDERS', {});
}
```

### Multi-Model Chat Example
```javascript
async function compareModels(userQuery, models = []) {
  if (models.length === 0) {
    models = ['anthropic/claude-3-haiku', 'openai/gpt-3.5-turbo', 'meta-llama/llama-3-8b-instruct'];
  }

  const results = {};
  const messages = [{ role: 'user', content: userQuery }];

  for (const model of models) {
    try {
      const response = await chatCompletion(model, messages, {
        temperature: 0.7,
        max_tokens: 500
      });
      results[model] = response.choices[0].message.content;
    } catch (error) {
      results[model] = `Error: ${error.message}`;
    }
  }

  return results;
}

async function smartAssistant(query, context = []) {
  // Choose model based on query complexity
  let model = 'anthropic/claude-3-haiku'; // Default fast model

  if (query.length > 200 || context.length > 3) {
    model = 'anthropic/claude-3-sonnet'; // More capable for complex queries
  }

  const messages = [
    ...context,
    { role: 'user', content: query }
  ];

  return await chatCompletion(model, messages);
}
```

### Content Generation Example
```javascript
async function generateContent(type, topic, style = 'professional') {
  let prompt = '';
  let model = 'anthropic/claude-3-haiku';

  switch (type) {
    case 'blog-post':
      prompt = `Write a comprehensive blog post about ${topic} in a ${style} style. Include introduction, main points, and conclusion.`;
      model = 'anthropic/claude-3-sonnet'; // Better for longer content
      break;
    case 'social-media':
      prompt = `Create an engaging social media post about ${topic} in a ${style} tone. Keep it under 280 characters.`;
      break;
    case 'email':
      prompt = `Write a professional email about ${topic}.`;
      break;
    case 'code':
      prompt = `Write clean, well-documented code for: ${topic}`;
      model = 'anthropic/claude-3-sonnet'; // Better for code
      break;
  }

  if (type === 'code') {
    return await textCompletion(model, prompt, {
      temperature: 0.2,
      max_tokens: 1000
    });
  }

  return await chatCompletion(model, [
    { role: 'user', content: prompt }
  ], {
    temperature: style === 'creative' ? 0.9 : 0.7,
    max_tokens: type === 'blog-post' ? 2000 : 500
  });
}
```

### Model Selection and Cost Optimization Example
```javascript
async function optimizeModelSelection(task, budget = 'low') {
  const models = await listModels();

  // Filter models by cost and capability
  let suitableModels = models.data.filter(model => {
    if (budget === 'low') {
      return model.pricing?.prompt < 0.001; // Very cheap models
    } else if (budget === 'medium') {
      return model.pricing?.prompt < 0.01; // Moderate cost
    }
    return true; // All models for high budget
  });

  // Sort by capability for the task
  suitableModels.sort((a, b) => {
    // Prioritize models good for the specific task
    const taskKeywords = {
      'coding': ['claude', 'gpt-4', 'llama'],
      'creative': ['claude', 'gpt-4', 'dalle'],
      'analysis': ['claude', 'gpt-4', 'llama'],
      'chat': ['claude', 'gpt-3.5', 'llama']
    };

    const taskWords = taskKeywords[task.toLowerCase()] || [];
    const aScore = taskWords.some(word => a.id.includes(word)) ? 1 : 0;
    const bScore = taskWords.some(word => b.id.includes(word)) ? 1 : 0;

    return bScore - aScore;
  });

  return suitableModels.slice(0, 3); // Return top 3 models
}

async function executeWithFallback(query, task = 'chat') {
  const models = await optimizeModelSelection(task);

  for (const model of models) {
    try {
      const result = await chatCompletion(model.id, [
        { role: 'user', content: query }
      ]);

      return {
        model: model.id,
        response: result.choices[0].message.content,
        cost: result.usage.total_tokens * model.pricing.prompt
      };
    } catch (error) {
      console.log(`Model ${model.id} failed: ${error.message}`);
      continue;
    }
  }

  throw new Error('All models failed to respond');
}
```