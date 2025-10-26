# OpenCode Browser Extension Development - User Guides

## Overview

OpenCode provides a streamlined multi-agent development environment for browser extension development. This guide covers the 11 core commands and 12 agent workflows available in the system.

## Table of Contents

1. [Agent Overview](#agent-overview)
2. [Core Commands](#core-commands)
3. [Development Workflow](#development-workflow)
4. [Build & Testing](#build--testing)
5. [Quality Assurance](#quality-assurance)
6. [Documentation & Security](#documentation--security)

## Agent Overview

### Primary Agents

#### Orchestrator (`@orchestrator`)
**Role**: Strategic multi-agent coordination and project orchestration
- Coordinates complex development tasks across specialized agents
- Manages dependencies, progress monitoring, and quality gates
- Delegates tasks based on agent expertise and workload

#### Build (`@build`)
**Role**: Feature implementation and code development specialist
- Implements features with comprehensive testing and documentation
- Focuses on clean, maintainable code following SOLID principles
- Ensures code quality, error handling, and security

#### Extension Builder (`@extension-builder`)
**Role**: Browser extension implementation with MV3 expertise
- Specialized in Manifest V3 architecture and CSP compliance
- Handles multi-context development (background, content, popup)
- Manages cross-origin communication and security constraints

#### Monorepo Orchestrator (`@monorepo-orchestrator`)
**Role**: Monorepo orchestration with Turbo optimization
- Manages complex monorepo builds and dependencies
- Optimizes build performance with Turbo caching
- Coordinates package relationships and deployments

### Subagents

#### Specifier (`@specifier`)
**Role**: Constitution and specification authoring
- Creates project constitutions defining core principles
- Authors detailed, unambiguous feature specifications
- Ensures specifications enable clear implementation planning

#### Plan (`@plan`)
**Role**: Technical plan and task breakdown
- Develops comprehensive implementation strategies
- Breaks complex features into manageable tasks
- Identifies dependencies, risks, and resource requirements

#### Architect (`@architect`)
**Role**: System design and architectural decision-making
- Creates scalable, maintainable system architectures
- Applies SOLID principles and design patterns
- Makes technology selection and architectural decisions

#### Reviewer (`@reviewer`)
**Role**: Spec/constitution compliance validator
- Validates implementations against specifications
- Ensures constitution adherence and quality standards
- Performs systematic reviews of code, tests, and documentation

#### Tests (`@tests`)
**Role**: Browser extension testing specialist
- Tests across multiple contexts (background, content, popup)
- Handles Manifest V3 challenges and browser API mocking
- Manages cross-browser compatibility and E2E testing

#### I18n Manager (`@i18n-manager`)
**Role**: Internationalization management for 22 languages
- Manages complex i18n systems with RTL support
- Handles translation workflows and quality assurance
- Ensures cultural adaptation and locale-specific formatting

#### Debug (`@debug`)
**Role**: Multi-context execution debugger
- Debugs across service workers, content scripts, and popup contexts
- Handles cross-context communication and browser API issues
- Manages extension-specific debugging challenges

## Core Commands

### Research (`/research`)
**Agent**: specifier
**Purpose**: Research best practices and solutions
**Usage**: `/research [topic]`

Researches best practices, technologies, and solutions for development challenges.

**Example**:
```
 /research browser extension security best practices
```

### Plan (`/plan`)
**Agent**: plan
**Purpose**: Generate technical plan from spec
**Usage**: `/plan [specification]`

Creates comprehensive implementation plans with task breakdown, dependencies, and risk assessment.

**Example**:
```
 /plan extension feature implementation
```

### Todo (`/todo`)
**Agent**: plan
**Purpose**: Create task breakdown from plan
**Usage**: `/todo [plan]`

Breaks down plans into executable tasks with clear deliverables and acceptance criteria.

### Code Review (`/code-review`)
**Agent**: reviewer
**Purpose**: Validate implementation vs spec/constitution
**Usage**: `/code-review [implementation]`

Validates compliance with specifications and project principles.

### Security Scan (`/security-scan`)
**Agent**: reviewer
**Purpose**: Scan for security vulnerabilities and unsafe patterns
**Usage**: `/security-scan`

Scans codebase for security vulnerabilities and unsafe coding patterns.

### Build (`/build`)
**Agent**: extension-builder
**Purpose**: Full extension build with all packages
**Usage**: `/build`

Builds complete browser extension with all contexts and dependencies.

### Format (`/format`)
**Agent**: tests
**Purpose**: Format code using Prettier
**Usage**: `/format`

Ensures consistent code formatting across the codebase.

### Test (`/test`)
**Agent**: tests
**Purpose**: Run unit tests for specific package
**Usage**: `/test [package]`

Runs unit tests with proper mocking for extension contexts.

### Update Documentation (`/update-documentation`)
**Agent**: documentation
**Purpose**: Update documentation (includes API docs, user guides, architecture docs)
**Usage**: `/update-documentation`

Maintains up-to-date documentation across all types.

### Debug (`/debug`)
**Agent**: debug
**Purpose**: Debug issues in the extension
**Usage**: `/debug [issue]`

Debugs extension-specific issues across multiple contexts.

### Validate Build (`/validate-build`)
**Agent**: tests
**Purpose**: Validate build artifacts for extension
**Usage**: `/validate-build`

Ensures build artifacts are correct and complete.

## Build & Testing

### Build (`/build`)
**Agent**: extension-builder
**Purpose**: Full extension build with all packages
**Usage**: `/build`

Builds complete browser extension with all contexts and dependencies.

### Test (`/test`)
**Agent**: tests
**Purpose**: Run unit tests for specific package
**Usage**: `/test [package]`

Runs unit tests with proper mocking for extension contexts.

### Validate Build (`/validate-build`)
**Agent**: tests
**Purpose**: Validate build artifacts for extension
**Usage**: `/validate-build`

Ensures build artifacts are correct and complete.

## Quality Assurance

### Code Review (`/code-review`)
**Agent**: reviewer
**Purpose**: Validate implementation vs spec/constitution
**Usage**: `/code-review [implementation]`

Validates compliance with specifications and project principles.

### Security Scan (`/security-scan`)
**Agent**: reviewer
**Purpose**: Scan for security vulnerabilities and unsafe patterns
**Usage**: `/security-scan`

Scans codebase for security vulnerabilities and unsafe coding patterns.

### Format (`/format`)
**Agent**: tests
**Purpose**: Format code using Prettier
**Usage**: `/format`

Ensures consistent code formatting across the codebase.

### Test (`/test`)
**Agent**: tests
**Purpose**: Run unit tests for specific package
**Usage**: `/test [package]`

Runs unit tests with proper mocking for extension contexts.

## Documentation & Security

### Update Documentation (`/update-documentation`)
**Agent**: documentation
**Purpose**: Update documentation (includes API docs, user guides, architecture docs)
**Usage**: `/update-documentation`

Maintains up-to-date documentation across all types.

### Security Scan (`/security-scan`)
**Agent**: reviewer
**Purpose**: Scan for security vulnerabilities and unsafe patterns
**Usage**: `/security-scan`

Scans codebase for security vulnerabilities and unsafe coding patterns.

## Best Practices

### Development Workflow
1. **Research**: Use `/research` to understand best practices
2. **Plan**: Create technical plans with `/plan`
3. **Break Down**: Use `/todo` for task management
4. **Implement**: Build features with `/build`
5. **Test**: Validate with `/test`
6. **Review**: Ensure quality with `/code-review`
7. **Debug**: Fix issues with `/debug`
8. **Validate**: Final check with `/validate-build`

### Code Quality
- Run `/format` before commits
- Use `/test` for unit testing
- Apply `/security-scan` for security validation
- Implement `/code-review` for compliance

### Extension Development
- Minimal permission requests
- Secure cross-context communication
- CSP compliance
- Cross-browser compatibility

## Quick Reference

### Most Used Commands
- `/research` - Research best practices
- `/plan` - Generate technical plan
- `/todo` - Create task breakdown
- `/build` - Full extension build
- `/test` - Run unit tests
- `/code-review` - Validate implementation
- `/security-scan` - Security vulnerability scan
- `/format` - Format code
- `/update-documentation` - Update docs
- `/debug` - Debug issues
- `/validate-build` - Validate build artifacts

### Agent Quick Reference
- **@orchestrator**: Project coordination
- **@build**: Feature implementation
- **@extension-builder**: Extension development
- **@tests**: Testing specialist
- **@reviewer**: Quality assurance
- **@debug**: Multi-context debugging

## Troubleshooting

### Common Issues
- **Build Failures**: Run `/validate-build` to check issues
- **Test Failures**: Use `/debug` for extension-specific problems
- **Security Issues**: Apply `/security-scan` for vulnerabilities
- **Code Quality**: Use `/format` and `/code-review`

### Getting Help
- **Complex Tasks**: `@orchestrator` for multi-step coordination
- **Debugging**: `@debug` for extension issues
- **Quality**: `@reviewer` for compliance validation





## Best Practices

### Development Workflow
1. **Planning**: Use `/constitution` and `/specify` for project foundation
2. **Design**: Leverage `/plan` and `/tasks` for detailed planning
3. **Implementation**: Use `/implement` with comprehensive testing
4. **Quality**: Apply `/validate-spec` and various testing commands
5. **Documentation**: Maintain docs with documentation commands

### Code Quality
- Run `/lint-all` and `/type-check-all` before commits
- Use `/test-unit-all` for comprehensive unit testing
- Apply `/security-scan` for security validation
- Implement `/performance-baseline` for performance monitoring

### Internationalization
- Use `/extract-strings` after adding new text
- Run `/validate-translations` to ensure completeness
- Apply `/i18n-coverage` to track translation status
- Test with `/test-i18n` for functionality validation

### Performance Optimization
- Use `/analyze-bundle` to identify optimization opportunities
- Apply `/performance-profile` for bottleneck identification
- Implement `/code-splitting` for better loading performance
- Monitor with `/memory-analysis` for resource usage

### Deployment
- Validate with `/test-e2e-all` before deployment
- Use `/deploy-staging` for pre-production testing
- Apply `/create-release` for proper versioning
- Deploy with `/deploy-chrome` or `/deploy-firefox`

## Troubleshooting

### Common Issues

#### Build Failures
- Run `/clean-build` to clear artifacts
- Check with `/validate-build` for issues
- Use `/type-errors` for TypeScript problems

#### Test Failures
- Run `/test-cross-context` for extension-specific issues
- Use `/debug` for multi-context problems
- Apply `/regression-detection` for new failures

#### Performance Issues
- Use `/performance-profile` to identify bottlenecks
- Apply `/memory-analysis` for resource problems
- Run `/bundle-comparison` to track size changes

#### I18n Problems
- Run `/validate-translations` for syntax errors
- Use `/sync-translations` for consistency issues
- Apply `/i18n-coverage` to check completeness

### Getting Help
- Use `@orchestrator` for complex multi-step issues
- Apply `@debug` for extension-specific debugging
- Leverage `@architect` for design and architecture questions

This comprehensive guide covers all available commands and workflows in the OpenCode browser extension development environment. Each command is designed to work seamlessly with the agent system to provide efficient, high-quality development processes.# OpenCode Quick Reference Guide

## Most Used Commands

### Development Workflow
```
/constitution     Create project constitution
/specify          Create feature specification
/plan             Generate technical plan
/implement        Implement feature with tests
/validate-spec    Validate vs requirements
```

### Building & Testing
```
/build            Full extension build
/test-unit        Run unit tests
/lint             Lint code
/type-check       TypeScript validation
```

### Quality Assurance
```
/security-scan       Security vulnerability scan
/performance-profile  Performance analysis
/validate-build       Build artifact validation
/code-quality         Code quality assessment
/test-unit           Test coverage report
```

### Internationalization
```
/extract-strings     Extract translatable strings
/build-i18n          Build translation bundles
/validate-translations Check translation integrity
/i18n-coverage       Translation completeness
/sync-translations   Sync language files
```

### Performance & Optimization
```
/analyze-bundle      Bundle composition analysis
/optimize-bundle     Bundle size optimization
/memory-analysis     Memory usage profiling
/performance-baseline Establish performance baseline
/code-splitting      Implement code splitting
```

### Deployment
```
/deploy-chrome      Deploy to Chrome Web Store
/deploy-firefox     Deploy to Firefox Add-ons
/create-release     Create versioned release
/changelog-generate Generate changelog
/tag-release        Git tag release
```

## Agent Quick Reference

### Primary Agents
- **@orchestrator**: Project coordination and task delegation
- **@build**: Feature implementation with testing
- **@extension-builder**: Browser extension development
- **@monorepo-orchestrator**: Monorepo management

### Specialized Subagents
- **@specifier**: Requirements and specifications
- **@plan**: Technical planning and task breakdown
- **@architect**: System design and architecture
- **@reviewer**: Quality assurance and compliance
- **@tests**: Extension testing specialist
- **@i18n-manager**: Internationalization management
- **@debug**: Multi-context debugging

## Common Workflows

### New Feature Development
1. `/specify [feature]` - Create specification
2. `/plan [spec]` - Generate implementation plan
3. `/implement [task]` - Code the feature
4. `/test-unit` - Run unit tests
5. `/validate-spec` - Verify compliance

### Release Preparation
1. `/test-e2e` - E2E testing
2. `/security-scan` - Security validation
3. `/performance-profile` - Performance check
4. `/build` - Production build
5. `/create-release` - Version and release

### Code Quality Checks
1. `/lint` - Code style validation
2. `/type-check` - Type safety
3. `/test-unit` - Test completeness
4. `/code-quality` - Overall assessment
5. `/security-scan` - Security validation

## Extension Contexts

### Background (Service Worker)
- Handles API calls and data processing
- Manages extension lifecycle events
- Coordinates cross-context communication

### Content Scripts
- Manipulates web page DOM
- Runs in isolated world
- Handles user interactions on pages

### Popup/Action
- Provides user interface
- Manages extension settings
- Displays extension status

## File Structure

```
opencode.json          # Agent and command configuration
agent/                 # Agent prompt files
command/               # Command definitions
src/                   # Source code
package.json           # Dependencies and scripts
```

## Key Principles

- **Specification First**: Always create specs before implementation
- **Test Early**: Write tests alongside code
- **Security First**: Validate security in every step
- **Performance Matters**: Monitor and optimize continuously
- **International Ready**: Design for 22+ languages from start

## Getting Help

- Use `@orchestrator` for complex multi-step tasks
- `@architect` for design and architecture questions
- `@debug` for extension-specific issues
- `@reviewer` for quality and compliance concerns

## Emergency Commands

- `/clean-build` - Clear all build artifacts
- `/validate-build` - Check build integrity
- `/security-scan` - Immediate security check
- `/type-check` - TypeScript validation# OpenCode User Guides - Complete Documentation Suite

## Documentation Overview

This comprehensive documentation suite provides everything needed to effectively use the OpenCode browser extension development environment. The system features 95+ specialized commands and 10 intelligent agents working together to deliver high-quality extension development.

## Documentation Files

### 📖 [USER_GUIDES.md](USER_GUIDES.md)
**Comprehensive Command Reference**
- Complete catalog of all 95+ commands
- Detailed usage instructions and examples
- Organized by functional categories
- Best practices and troubleshooting tips

### 🤝 [AGENT_WORKFLOWS.md](AGENT_WORKFLOWS.md)
**Agent Collaboration Patterns**
- Detailed agent roles and responsibilities
- Workflow pipelines and collaboration patterns
- Context-specific development strategies
- Quality assurance and debugging workflows

### ⚡ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
**Fast Access Guide**
- Most commonly used commands
- Quick agent reference
- Common workflows and patterns
- Emergency troubleshooting commands

### 🏗️ [AGENTS.md](AGENTS.md)
**Agent System Overview**
- Global agent rules and guidelines
- Coding standards and security requirements
- Development workflow and quality assurance
- Tool usage and communication standards

## System Architecture

### Multi-Agent Coordination
OpenCode employs a sophisticated multi-agent system where specialized agents handle different aspects of development:

- **4 Primary Agents**: Orchestrate major development tasks
- **6 Subagents**: Provide specialized support functions
- **95+ Commands**: Granular operations for specific tasks
- **Monorepo Support**: Turbo-powered parallel processing

### Key Capabilities

#### Browser Extension Expertise
- Manifest V3 architecture mastery
- Multi-context development (background, content, popup)
- Cross-browser compatibility (Chrome, Firefox, Edge, Safari)
- Security-first development practices

#### Internationalization (i18n)
- Support for 22+ languages
- RTL language handling
- Automated translation workflows
- Cultural adaptation and localization

#### Quality Assurance
- Comprehensive testing across all contexts
- Security scanning and vulnerability assessment
- Performance profiling and optimization
- Code quality and compliance validation

#### Development Efficiency
- Automated build and deployment pipelines
- Hot reloading and incremental development
- Comprehensive documentation generation
- Monorepo orchestration with Turbo

## Getting Started

### Quick Start
1. **Project Setup**: Use `/constitution` to define project principles
2. **Feature Development**: Start with `/specify` for requirements
3. **Implementation**: Use `/implement` for code development
4. **Quality Checks**: Run `/test-unit-all` and `/lint-all`
5. **Deployment**: Use `/deploy-chrome` or `/deploy-firefox`

### Development Workflow
```
Requirements → Specification → Planning → Implementation → Testing → Validation → Deployment
     ↓            ↓           ↓          ↓            ↓          ↓           ↓
/constitution /specify    /plan   /implement /test-*   /validate-* /deploy-*
```

## Command Categories

### Core Development (6 commands)
Project foundation, specification, planning, and implementation

### Build & Compilation (6 commands)
Extension building, packaging, and optimization

### Testing (12 commands)
Unit, integration, E2E, and extension-specific testing

### Code Quality (8 commands)
Linting, type checking, complexity analysis, and formatting

### Internationalization (10 commands)
Translation management, language support, and i18n validation

### Performance (10 commands)
Bundle analysis, optimization, profiling, and monitoring

### Documentation (10 commands)
API docs, user guides, architecture docs, and validation

### Security (4 commands)
Security scanning, compliance, and dependency auditing

### Deployment (7 commands)
Web store deployment, release management, and distribution

### Development Tools (6 commands)
Development servers, debugging, monitoring, and utilities

### Validation (3 commands)
Architecture, build, and RTL validation

## Agent Roles

### Primary Agents
- **Orchestrator**: Strategic coordination and project management
- **Builder**: Clean code implementation with comprehensive testing
- **Extension Builder**: Browser extension development specialist
- **Monorepo Orchestrator**: Large-scale project coordination

### Subagents
- **Specifier**: Requirements analysis and specification authoring
- **Planner**: Technical planning and task decomposition
- **Architect**: System design and architectural decision-making
- **Reviewer**: Quality assurance and compliance validation
- **Extension Tester**: Multi-context testing and validation
- **I18n Manager**: Internationalization and localization management
- **Context Debugger**: Multi-context debugging and troubleshooting

## Best Practices

### Development Standards
- **Specification First**: Always create detailed specs before coding
- **Test-Driven Development**: Write tests alongside implementation
- **Security by Design**: Integrate security validation throughout
- **Performance Conscious**: Monitor and optimize from the start
- **International Ready**: Design for global audiences from day one

### Code Quality
- Strict TypeScript configuration
- Comprehensive error handling
- SOLID principles application
- Clean code and maintainable architecture
- Automated quality gates

### Extension Development
- Minimal permission requests
- Secure cross-context communication
- CSP compliance
- Cross-browser compatibility
- Performance optimization

## Troubleshooting

### Common Issues
- **Build Failures**: Use `/clean-build` and `/validate-build`
- **Test Issues**: Run `/test-cross-context` for extension problems
- **Performance**: Apply `/performance-profile` and `/memory-analysis`
- **I18n Problems**: Use `/validate-translations` and `/sync-translations`

### Getting Help
- **Complex Tasks**: `@orchestrator` for multi-step coordination
- **Design Questions**: `@architect` for architectural guidance
- **Debugging**: `@debug` for extension-specific issues
- **Quality Concerns**: `@reviewer` for compliance validation

## Advanced Features

### Monorepo Support
- Turbo-powered parallel builds
- Package dependency management
- Cross-package testing and validation
- Optimized development workflows

### AI-Powered Development
- Intelligent code generation
- Automated testing and validation
- Smart error detection and fixing
- Performance optimization recommendations

### Enterprise-Ready
- Comprehensive security scanning
- Regulatory compliance validation
- Audit trails and documentation
- Scalable architecture patterns

## Contributing

The OpenCode system is designed to be extensible. New commands and agents can be added by:

1. Creating command definition files in `command/`
2. Adding agent configurations in `agent/`
3. Updating the main `opencode.json` configuration
4. Following established patterns and best practices

## Support and Resources

- **Command Reference**: [USER_GUIDES.md](USER_GUIDES.md) for detailed usage
- **Agent Workflows**: [AGENT_WORKFLOWS.md](AGENT_WORKFLOWS.md) for collaboration patterns
- **Quick Access**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for fast reference
- **Agent Guidelines**: [AGENTS.md](AGENTS.md) for system overview

This documentation suite provides comprehensive coverage of the OpenCode browser extension development environment, enabling efficient, high-quality development workflows for complex extension projects.