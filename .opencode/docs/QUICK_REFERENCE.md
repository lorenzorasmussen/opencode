# OpenCode Quick Reference Guide

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
- `/type-check` - TypeScript validation