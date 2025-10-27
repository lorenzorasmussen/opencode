# Gemini Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: Varies by model and request type (RPM and TPM limits apply)
- **Authentication**: Google AI API key required
- **Scopes**: AI model access and content generation
- **Thread Safety**: Operations are thread-safe

## Available Gemini Tool Calls

### 1. GEMINI_COUNT_TOKENS
Counts tokens in text for cost estimation.

**Parameters:**
```json
{
  "model": "gemini-pro",
  "contents": [
    {
      "parts": [
        {
          "text": "Hello world"
        }
      ]
    }
  ]
}
```

**Required Fields:**
- `model`: Gemini model name
- `contents`: Content to count tokens for

### 2. GEMINI_EMBED_CONTENT
Generates embeddings for text content.

**Parameters:**
```json
{
  "model": "embedding-001",
  "content": {
    "parts": [
      {
        "text": "Text to embed"
      }
    ]
  },
  "task_type": "retrieval_document"
}
```

**Required Fields:**
- `model`: Embedding model name
- `content`: Content to embed

### 3. GEMINI_GENERATE_CONTENT
Generates text content using Gemini models.

**Parameters:**
```json
{
  "model": "gemini-pro",
  "contents": [
    {
      "parts": [
        {
          "text": "Write a short story about AI"
        }
      ]
    }
  ],
  "generation_config": {
    "temperature": 0.7,
    "max_output_tokens": 1000
  }
}
```

**Required Fields:**
- `model`: Gemini model name
- `contents`: Input content

### 4. GEMINI_GENERATE_IMAGE
Generates images using Gemini models.

**Parameters:**
```json
{
  "model": "imagen-3.0-generate-001",
  "prompt": "A beautiful sunset over mountains",
  "generation_config": {
    "number_of_images": 1,
    "output_mime_type": "image/jpeg"
  }
}
```

**Required Fields:**
- `model`: Image generation model
- `prompt`: Text prompt for image generation

### 5. GEMINI_GENERATE_VIDEOS
Generates videos using Gemini models.

**Parameters:**
```json
{
  "model": "veo-2.0-generate-001",
  "prompt": "A cat playing with a ball",
  "generation_config": {
    "duration_seconds": 5,
    "fps": 30
  }
}
```

**Required Fields:**
- `model`: Video generation model
- `prompt`: Text prompt for video generation

### 6. GEMINI_GET_VIDEOS_OPERATION
Gets the status of a video generation operation.

**Parameters:**
```json
{
  "name": "operations/generate-video-operation-id"
}
```

**Required Fields:**
- `name`: Operation name/ID

### 7. GEMINI_LIST_MODELS
Lists available Gemini models.

**Parameters:**
```json
{
  "page_size": 10
}
```

### 8. GEMINI_WAIT_FOR_VIDEO
Waits for video generation to complete.

**Parameters:**
```json
{
  "operation_name": "operations/generate-video-operation-id",
  "timeout_seconds": 300
}
```

**Required Fields:**
- `operation_name`: Operation name to wait for

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('GEMINI_GENERATE_CONTENT', {
  model: 'gemini-pro',
  contents: [
    {
      parts: [
        {
          text: 'Explain quantum computing in simple terms'
        }
      ]
    }
  ]
});
```

## Simplifying Gemini Tool Calls

### Helper Functions
```javascript
async function generateText(prompt, model = 'gemini-pro', options = {}) {
  return await callRubeTool('GEMINI_GENERATE_CONTENT', {
    model,
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generation_config: {
      temperature: 0.7,
      max_output_tokens: 1000,
      ...options
    }
  });
}

async function generateImage(prompt, options = {}) {
  return await callRubeTool('GEMINI_GENERATE_IMAGE', {
    model: 'imagen-3.0-generate-001',
    prompt,
    generation_config: {
      number_of_images: 1,
      output_mime_type: 'image/jpeg',
      ...options
    }
  });
}

async function generateVideo(prompt, duration = 5) {
  return await callRubeTool('GEMINI_GENERATE_VIDEOS', {
    model: 'veo-2.0-generate-001',
    prompt,
    generation_config: {
      duration_seconds: duration,
      fps: 30
    }
  });
}

async function createEmbeddings(text, taskType = 'retrieval_document') {
  return await callRubeTool('GEMINI_EMBED_CONTENT', {
    model: 'embedding-001',
    content: {
      parts: [
        {
          text
        }
      ]
    },
    task_type: taskType
  });
}

async function countTokens(text, model = 'gemini-pro') {
  return await callRubeTool('GEMINI_COUNT_TOKENS', {
    model,
    contents: [
      {
        parts: [
          {
            text
          }
        ]
      }
    ]
  });
}
```

### Content Generation Example
```javascript
async function createBlogPost(topic, tone = 'professional') {
  const prompt = `Write a comprehensive blog post about ${topic}.
  Use a ${tone} tone. Include an introduction, main points, and conclusion.
  Make it engaging and informative.`;

  const result = await generateText(prompt, 'gemini-pro', {
    temperature: 0.8,
    max_output_tokens: 2000
  });

  return result.candidates[0].content.parts[0].text;
}

async function summarizeText(text, maxLength = 200) {
  const prompt = `Summarize the following text in ${maxLength} words or less:
  ${text}`;

  const result = await generateText(prompt, 'gemini-pro', {
    temperature: 0.3,
    max_output_tokens: maxLength
  });

  return result.candidates[0].content.parts[0].text;
}
```

### Creative Content Example
```javascript
async function generateCreativeContent(type, topic) {
  let prompt = '';
  let model = 'gemini-pro';

  switch (type) {
    case 'story':
      prompt = `Write a short creative story about: ${topic}`;
      break;
    case 'poem':
      prompt = `Write an original poem about: ${topic}`;
      break;
    case 'image':
      return await generateImage(`Create an artistic image of: ${topic}`);
    case 'video':
      return await generateVideo(`Create a short video concept about: ${topic}`);
    default:
      prompt = `Create creative content about: ${topic}`;
  }

  if (type === 'image' || type === 'video') {
    return await generateImage(prompt);
  }

  return await generateText(prompt, model, {
    temperature: 0.9,
    max_output_tokens: 1000
  });
}
```

### AI Assistant Example
```javascript
async function aiAssistant(query, context = []) {
  // Build conversation context
  const contents = context.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  // Add current query
  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  const result = await callRubeTool('GEMINI_GENERATE_CONTENT', {
    model: 'gemini-pro',
    contents,
    generation_config: {
      temperature: 0.7,
      max_output_tokens: 500
    }
  });

  return result.candidates[0].content.parts[0].text;
}

async function codeAssistant(code, instruction) {
  const prompt = `Given this code:
${code}

${instruction}

Provide the updated code with explanation.`;

  const result = await generateText(prompt, 'gemini-pro', {
    temperature: 0.2,
    max_output_tokens: 1000
  });

  return result.candidates[0].content.parts[0].text;
}
```