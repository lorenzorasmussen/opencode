# PerplexityAI Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 5 requests per minute (varies by plan)
- **Authentication**: PerplexityAI API key required
- **Scopes**: AI-powered search and analysis
- **Thread Safety**: Operations are thread-safe

## Available PerplexityAI Tool Calls

### 1. PERPLEXITYAI_PERPLEXITY_AI_SEARCH
Performs AI-powered search with comprehensive analysis.

**Parameters:**
```json
{
  "query": "What are the latest developments in quantum computing?",
  "model": "llama-3.1-sonar-large-128k-online",
  "return_images": false,
  "return_related_questions": true,
  "search_recency_filter": "month"
}
```

**Required Fields:**
- `query`: Search query

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('PERPLEXITYAI_PERPLEXITY_AI_SEARCH', {
  query: 'Explain the impact of AI on healthcare',
  model: 'llama-3.1-sonar-large-128k-online',
  return_related_questions: true
});
```

## Simplifying PerplexityAI Tool Calls

### Helper Functions
```javascript
async function search(query, options = {}) {
  return await callRubeTool('PERPLEXITYAI_PERPLEXITY_AI_SEARCH', {
    query,
    model: 'llama-3.1-sonar-large-128k-online',
    return_images: false,
    return_related_questions: true,
    search_recency_filter: 'month',
    ...options
  });
}

async function deepResearch(topic, includeImages = false) {
  return await search(topic, {
    model: 'llama-3.1-sonar-large-128k-online',
    return_images: includeImages,
    return_related_questions: true,
    search_recency_filter: 'year' // Broader time range for deep research
  });
}

async function quickAnswer(question) {
  return await search(question, {
    model: 'llama-3.1-sonar-small-128k-online', // Faster model for quick answers
    return_related_questions: false,
    search_recency_filter: 'week'
  });
}
```

### Research and Analysis Example
```javascript
async function researchTopic(topic, depth = 'comprehensive') {
  const searchOptions = {
    return_related_questions: true,
    return_images: false
  };

  if (depth === 'comprehensive') {
    searchOptions.search_recency_filter = 'year';
    searchOptions.model = 'llama-3.1-sonar-large-128k-online';
  } else if (depth === 'current') {
    searchOptions.search_recency_filter = 'week';
    searchOptions.model = 'llama-3.1-sonar-small-128k-online';
  } else {
    searchOptions.search_recency_filter = 'month';
  }

  const result = await search(`Comprehensive analysis: ${topic}`, searchOptions);

  return {
    topic,
    depth,
    answer: result.answer,
    sources: result.sources || [],
    relatedQuestions: result.related_questions || [],
    searchTime: new Date().toISOString()
  };
}

async function compareOptions(options, criteria) {
  const query = `Compare the following options based on ${criteria.join(', ')}: ${options.join(' vs ')}`;
  return await deepResearch(query);
}
```

### Current Events and News Example
```javascript
async function getLatestNews(topic) {
  return await search(`Latest news and developments in ${topic}`, {
    search_recency_filter: 'day',
    return_related_questions: true
  });
}

async function analyzeTrend(trend) {
  const result = await search(`Analyze the trend: ${trend} - current status, growth, and future predictions`, {
    search_recency_filter: 'month',
    return_related_questions: true
  });

  return {
    trend,
    analysis: result.answer,
    sources: result.sources,
    lastUpdated: new Date().toISOString()
  };
}
```

### Educational Research Example
```javascript
async function explainConcept(concept, level = 'intermediate') {
  const query = `Explain ${concept} at a ${level} level with examples and real-world applications`;
  return await search(query, {
    return_related_questions: true,
    search_recency_filter: 'year' // Include latest research
  });
}

async function findLearningResources(topic, resourceType = 'all') {
  let query = `Best learning resources for ${topic}`;
  if (resourceType !== 'all') {
    query += ` - focus on ${resourceType}`;
  }

  return await search(query, {
    return_related_questions: false,
    search_recency_filter: 'month'
  });
}
```