# OpenCode Models Guide

This document provides comprehensive information about the models available through OpenCode Zen and other providers.

## OpenCode Zen Models

OpenCode Zen is a curated list of tested and verified models specifically optimized for coding agents. These models have been benchmarked by the OpenCode team for optimal performance.

### Free Models (Limited Time)

| Model                | Description             | Context Window | Pricing                 |
| -------------------- | ----------------------- | -------------- | ----------------------- |
| **Grok Code Fast 1** | xAI's fast coding model | Unknown        | **Free** (limited time) |
| **Code Supernova**   | Stealth model in beta   | Unknown        | **Free** (limited time) |

> **Note**: Free models may collect data during their beta period for improvement purposes.

### Premium Models

#### Claude Series (Anthropic)

| Model                 | Context                          | Input Price                          | Output Price                       | Cached Read                        | Cached Write |
| --------------------- | -------------------------------- | ------------------------------------ | ---------------------------------- | ---------------------------------- | ------------ |
| **Claude Sonnet 4.5** | ≤200K: $3.00/M<br>>200K: $6.00/M | $15.00/M (≤200K)<br>$22.50/M (>200K) | $0.30/M (≤200K)<br>$0.60/M (>200K) | $3.75/M (≤200K)<br>$7.50/M (>200K) |
| **Claude Sonnet 4**   | ≤200K: $3.00/M<br>>200K: $6.00/M | $15.00/M (≤200K)<br>$22.50/M (>200K) | $0.30/M (≤200K)<br>$0.60/M (>200K) | $3.75/M (≤200K)<br>$7.50/M (>200K) |
| **Claude Haiku 4.5**  | Standard                         | $1.00/M                              | $5.00/M                            | $0.10/M                            | $1.25/M      |
| **Claude Haiku 3.5**  | Standard                         | $0.80/M                              | $4.00/M                            | $0.08/M                            | $1.00/M      |
| **Claude Opus 4.1**   | Standard                         | $15.00/M                             | $75.00/M                           | $1.50/M                            | $18.75/M     |

#### GPT Series (OpenAI)

| Model           | Context  | Input Price | Output Price | Cached Read |
| --------------- | -------- | ----------- | ------------ | ----------- |
| **GPT 5**       | Standard | $1.25/M     | $10.00/M     | $0.125/M    |
| **GPT 5 Codex** | Standard | $1.25/M     | $10.00/M     | $0.125/M    |

#### Other Models

| Model                | Provider | Context  | Input Price | Output Price |
| -------------------- | -------- | -------- | ----------- | ------------ | ------- |
| **Qwen3 Coder 480B** | Alibaba  | Standard | $0.45/M     | $1.50/M      |
| **Kimi K2**          | Moonshot | Standard | $0.60/M     | $2.50/M      | $0.36/M |

## Model Selection Guidelines

### For Different Tasks

#### Code Implementation & Feature Development

- **Recommended**: Claude Sonnet 4.5, GPT 5 Codex
- **Budget Option**: Claude Haiku 4.5, Qwen3 Coder 480B
- **Free Option**: Grok Code Fast 1, Code Supernova

#### Code Review & Analysis

- **Recommended**: Claude Sonnet 4, Claude Haiku 4.5
- **Budget Option**: Claude Haiku 3.5

#### Debugging & Problem Solving

- **Recommended**: Claude Sonnet 4.5, GPT 5
- **Budget Option**: Claude Haiku 4.5

#### Documentation & Planning

- **Recommended**: Claude Sonnet 4, Claude Haiku 4.5
- **Budget Option**: Claude Haiku 3.5

### Performance Tiers

#### High Performance (Premium)

- **Claude Sonnet 4.5**: Best overall for complex coding tasks
- **GPT 5 Codex**: Excellent for code generation and understanding
- **Claude Opus 4.1**: Maximum capability for challenging problems

#### Balanced Performance

- **Claude Sonnet 4**: Good balance of capability and cost
- **GPT 5**: Strong general-purpose coding
- **Claude Haiku 4.5**: Fast and capable for most tasks

#### Cost-Effective

- **Claude Haiku 3.5**: Most affordable Claude option
- **Qwen3 Coder 480B**: Good value for coding tasks
- **Kimi K2**: Competitive pricing with good performance

#### Free (Beta)

- **Grok Code Fast 1**: Fast coding model from xAI
- **Code Supernova**: Experimental model in stealth mode

## Usage in OpenCode Configuration

### Model ID Format

Use the format `opencode/<model-id>` in your configuration:

```json
{
  "model": "opencode/claude-sonnet-4-5"
}
```

### Available Model IDs

- `opencode/gpt-5`
- `opencode/gpt-5-codex`
- `opencode/claude-sonnet-4-5`
- `opencode/claude-sonnet-4`
- `opencode/claude-haiku-4-5`
- `opencode/claude-3-5-haiku`
- `opencode/claude-opus-4-1`
- `opencode/qwen3-coder`
- `opencode/grok-code`
- `opencode/kimi-k2`

## API Endpoints

Different models use different API endpoints:

### Anthropic Models (Claude series)

- **Endpoint**: `https://opencode.ai/zen/v1/messages`
- **Package**: `@ai-sdk/anthropic`

### OpenAI Models (GPT series)

- **Endpoint**: `https://opencode.ai/zen/v1/responses`
- **Package**: `@ai-sdk/openai`

### OpenAI Compatible Models

- **Endpoint**: `https://opencode.ai/zen/v1/chat/completions`
- **Package**: `@ai-sdk/openai-compatible`
- **Models**: Qwen3 Coder, Grok Code, Kimi K2

## Privacy & Data Retention

- **Hosting**: All models hosted in the US
- **Zero-retention policy**: Most providers don't use data for training
- **Exceptions**:
  - Grok Code Fast 1: Data may be used for improvement during free period
  - Code Supernova: Data may be used for improvement during beta
  - OpenAI APIs: Requests retained for 30 days
  - Anthropic APIs: Requests retained for 30 days

## Cost Optimization Tips

1. **Use cached tokens**: Take advantage of cached read/write pricing when available
2. **Choose appropriate models**: Use Haiku for simple tasks, Sonnet for complex work
3. **Monitor usage**: Set spending limits for team environments
4. **Consider context windows**: Larger contexts cost more for >200K tokens

## Team Features

- **Workspace management**: Free during beta period
- **Role-based access**: Admin and Member roles
- **Model access control**: Enable/disable specific models
- **Bring your own keys**: Use existing OpenAI/Anthropic keys
- **Spending limits**: Set monthly limits per member

## Getting Started

1. **Sign up**: Visit [OpenCode Zen](https://opencode.ai/auth)
2. **Add balance**: Minimum $20 + $1.23 processing fee
3. **Get API key**: Copy from your dashboard
4. **Configure**: Run `opencode auth login` and select opencode provider
5. **Select models**: Use `/models` in TUI to see available options

## Model Recommendations by Use Case

### For Individual Developers

- **Primary**: Claude Sonnet 4.5 (best balance)
- **Secondary**: Claude Haiku 4.5 (faster, cheaper)
- **Budget**: Claude Haiku 3.5

### For Teams

- **Code Review**: Claude Sonnet 4, Claude Haiku 4.5
- **Feature Development**: Claude Sonnet 4.5, GPT 5 Codex
- **Documentation**: Claude Haiku 4.5, Claude Sonnet 4

### For Enterprise

- **High Security**: Claude Sonnet 4.5 (with data controls)
- **Cost Control**: Claude Haiku 3.5 with spending limits
- **Bring Your Own Key**: Use existing enterprise keys

---

## Related Documentation

- **[AGENTS.md](./AGENTS.md)** - Agent configuration and model assignment
- **[README.md](./README.md)** - Project overview and setup guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project documentation

_Last updated: October 2025_  
_For the most current pricing and model availability, visit [OpenCode Zen](https://opencode.ai/zen)_
