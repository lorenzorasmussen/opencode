# Zen-Only Configuration Approach for OpenCode

## Overview

The Zen-only configuration approach represents a streamlined, focused methodology for configuring OpenCode multi-agent development environments. This approach mandates the exclusive use of the "zen" model across all agents, ensuring consistency, predictability, and optimized performance for software development workflows.

## Core Principles

### Model Consistency
- **Single Model Enforcement**: All agents in the configuration must use the "zen" model exclusively
- **Validation Enforcement**: Configuration validation scripts automatically check for zen model compliance
- **No Model Mixing**: Eliminates potential inconsistencies from using different AI models across agents

### Configuration Structure
```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "agent-name": {
      "model": "zen",
      // ... other configuration
    }
  }
}
```

## Agent Configuration Insights

### Primary Agents
- **orchestrator**: Uses zen model with low temperature (0.1) for consistent task coordination
- **build**: Leverages zen model for reliable code implementation with comprehensive tool access
- **extension-builder**: Specialized for browser extension development using zen's focused capabilities

### Subagents
- **specifier**: Employs zen model for precise specification authoring
- **plan**: Utilizes zen model for structured technical planning
- **reviewer**: Applies zen model for consistent validation against specifications

### Specialized Agents
- **i18n-manager**: Uses zen model for accurate internationalization across 22 languages
- **debug**: Relies on zen model for systematic multi-context debugging
- **monorepo-orchestrator**: Optimizes monorepo management with zen's analytical strengths

## Key Configurations

### Temperature Settings
- **Low Temperature (0.1)**: Used for orchestrator, plan, and reviewer for maximum consistency
- **Moderate Temperature (0.2)**: Applied to specifier for creative specification development
- **Default Temperature**: Most agents use default zen model temperature for balanced performance

### Permission Levels
- **Allow**: Core development agents (build, extension-builder) have full edit and bash permissions
- **Ask**: Orchestrator and debugging agents require user confirmation for sensitive operations
- **Deny**: Reviewer and architect agents are restricted to read-only operations for safety

### Tool Access
- **Full Tool Suite**: Primary agents have access to all tools (read, write, edit, bash, grep, glob, list)
- **Limited Tools**: Subagents have targeted tool access based on their specific functions
- **Security Considerations**: Web fetching is denied for most agents to prevent external data leakage

## Lessons Learned

### Benefits of Zen-Only Approach

1. **Predictable Behavior**: Single model ensures consistent agent responses and decision-making
2. **Simplified Maintenance**: Easier to update and maintain configurations without model-specific tuning
3. **Performance Optimization**: Zen model is specifically trained for coding and development tasks
4. **Reduced Complexity**: Eliminates model selection overhead and potential conflicts

### Implementation Challenges

1. **Model Limitations**: Zen model may have specific constraints that require workarounds for certain tasks
2. **Temperature Tuning**: Careful calibration of temperature settings is crucial for different agent roles
3. **Tool Permission Balance**: Finding the right balance between functionality and security requires iteration

### Best Practices Developed

1. **Role-Based Temperature**: Different temperatures for different agent types (planning vs. creative tasks)
2. **Progressive Permissions**: Start restrictive and expand permissions based on proven reliability
3. **Comprehensive Validation**: Automated validation ensures configuration integrity
4. **Documentation Integration**: Keep agent prompts synchronized with evolving requirements

## Community Recommendations

### For New Implementations
- Start with the provided template configuration as a baseline
- Gradually adjust temperature settings based on project-specific needs
- Implement comprehensive testing before production deployment

### For Existing Projects
- Audit current configurations for model consistency
- Consider migrating to zen-only approach for improved predictability
- Update validation scripts to enforce zen model usage

### Scaling Considerations
- Zen-only approach scales well across large monorepo environments
- Consider agent specialization for complex projects
- Monitor performance metrics to identify optimization opportunities

## Configuration Validation

The zen-only approach includes automated validation through `validate-config.sh`:

```bash
# Key validation checks
- JSON schema compliance
- Singular naming conventions (agent/, command/)
- Zen model enforcement
- Permission system validation
- Agent and command file integrity
```

## Future Evolution

The zen-only configuration approach continues to evolve with:
- Enhanced model capabilities
- Improved agent specialization
- Better permission frameworks
- Advanced validation mechanisms

## Contributing to the Community

Share your experiences with zen-only configurations:
- Document successful implementations
- Report challenges and solutions
- Contribute improved validation scripts
- Share optimized agent configurations

---

*This document represents the collective knowledge and best practices from the OpenCode community regarding zen-only configuration approaches. Contributions and updates are welcome to ensure it remains current and comprehensive.*