# Agent Workflows and Collaboration Patterns

## Overview

This document provides detailed workflows and collaboration patterns for the OpenCode multi-agent system, focusing on how agents work together to deliver high-quality browser extension development.

## Primary Agent Workflows

### Orchestrator-Led Development

The **Orchestrator** (`@orchestrator`) serves as the central coordinator for complex development tasks:

#### Project Initialization Workflow
```
1. @orchestrator analyze project requirements and identify scope
2. @specifier create constitution defining project principles
3. @architect design high-level system architecture
4. @plan break down work into phases and milestones
5. @orchestrator assign initial tasks to appropriate agents
6. @orchestrator establish monitoring and progress tracking
```

#### Feature Development Workflow
```
1. @orchestrator receive feature request or requirement
2. @specifier create detailed specification with acceptance criteria
3. @plan develop technical implementation plan
4. @architect validate architectural approach and constraints
5. @build implement feature with comprehensive testing
6. @tests validate across all extension contexts
7. @reviewer ensure specification compliance
8. @orchestrator coordinate integration and deployment
```

### Builder-Centric Implementation

The **Builder** (`@build`) and **Extension Builder** (`@extension-builder`) handle implementation:

#### Clean Code Implementation
```
@build implement feature following SOLID principles:
- Single Responsibility: One reason to change
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes interchangeable with base types
- Interface Segregation: Client-specific interfaces
- Dependency Inversion: Depend on abstractions, not concretions
```

#### Extension-Specific Implementation
```
@extension-builder handle MV3 architecture:
- Service Worker: Event-driven background processing
- Content Scripts: Isolated world DOM manipulation
- Popup/Action: User interface and controls
- Message Passing: Secure cross-context communication
```

## Subagent Collaboration Patterns

### Specification to Implementation Pipeline

#### 1. Specification Creation (`@specifier`)
```
Input: Feature requirements
Process:
- Analyze stakeholder needs
- Define functional requirements
- Establish acceptance criteria
- Identify constraints and dependencies
Output: Detailed specification document
```

#### 2. Technical Planning (`@plan`)
```
Input: Specification document
Process:
- Assess technical feasibility
- Identify implementation approach
- Break down into executable tasks
- Estimate effort and resources
Output: Technical plan with task breakdown
```

#### 3. Architecture Validation (`@architect`)
```
Input: Technical plan
Process:
- Review architectural decisions
- Validate design patterns
- Assess scalability and maintainability
- Identify potential technical debt
Output: Architecture approval or recommendations
```

### Quality Assurance Pipeline

#### Code Review Process (`@reviewer`)
```
Pre-Implementation:
- Validate specification completeness
- Review architectural decisions
- Assess technical approach

During Implementation:
- Monitor code quality standards
- Validate testing coverage
- Check security practices

Post-Implementation:
- Verify requirement fulfillment
- Assess documentation completeness
- Validate performance criteria
```

#### Testing Strategy (`@tests`)
```
Unit Testing:
- Test individual functions and modules
- Mock browser APIs and extension contexts
- Validate error handling and edge cases

Integration Testing:
- Test cross-context communication
- Validate message passing security
- Test storage synchronization

End-to-End Testing:
- Simulate complete user workflows
- Test extension installation and updates
- Validate cross-browser compatibility
```

### Internationalization Workflow (`@i18n-manager`)

#### Translation Pipeline
```
1. @i18n-manager extract strings from new code
2. @i18n-manager update base language file
3. @i18n-manager coordinate professional translation
4. @i18n-manager validate translation completeness
5. @tests test i18n functionality
6. @i18n-manager build optimized translation bundles
```

#### Language Addition Process
```
1. @i18n-manager add language support infrastructure
2. @i18n-manager create initial translation file structure
3. @i18n-manager implement locale-specific formatting
4. @i18n-manager test RTL support if applicable
5. @i18n-manager update build system for new language
```

## Context-Specific Workflows

### Multi-Context Extension Development

#### Background Service Worker Context
```
@extension-builder implement:
- Event listeners for extension lifecycle
- API calls and data processing
- Cross-context message handling
- Storage management and synchronization

@debug debug:
- Service worker startup and activation
- Event listener reliability
- API permission handling
- Memory usage and performance
```

#### Content Script Context
```
@extension-builder implement:
- DOM manipulation in isolated world
- User interaction handling
- Data extraction and injection
- Cross-origin communication

@debug debug:
- Injection timing and conditions
- DOM access permissions
- Isolated world conflicts
- Performance impact on page loading
```

#### Popup/Action Context
```
@extension-builder implement:
- User interface components
- State management and updates
- Settings and configuration
- Extension control functions

@debug debug:
- UI responsiveness and rendering
- State synchronization issues
- User interaction handling
- Memory leaks in popup lifecycle
```

### Cross-Context Communication Patterns

#### Message Passing Implementation
```
@extension-builder establish secure channels:
- Define message protocols and schemas
- Implement sender validation
- Add error handling and timeouts
- Document message flow patterns

@tests validate communication:
- Test message delivery reliability
- Validate security and origin checking
- Test error scenarios and recovery
- Monitor performance impact
```

## Error Handling and Debugging Workflows

### Systematic Debugging Approach (`@debug`)

#### Issue Analysis Framework
```
1. Identify affected extension contexts
2. Reproduce issue in isolated environment
3. Set up comprehensive logging
4. Trace execution flow across contexts
5. Identify root cause and contributing factors
6. Implement fix with proper error handling
7. Validate fix across all scenarios
8. Document debugging process and lessons
```

#### Common Extension Bug Patterns
```
Service Worker Issues:
- Race conditions in startup sequence
- Event listener cleanup failures
- API quota and rate limiting problems

Content Script Issues:
- DOM readiness timing problems
- Isolated world access conflicts
- Cross-origin security restrictions

Message Passing Issues:
- Message loss in high-frequency scenarios
- Type validation failures
- Context lifecycle timing issues
```

## Performance Optimization Workflows

### Bundle Optimization Pipeline
```
@extension-builder analyze current bundle:
- Identify largest modules and dependencies
- Find unused code and dead imports
- Assess loading performance impact

@extension-builder implement optimizations:
- Apply code splitting strategies
- Implement lazy loading where appropriate
- Optimize import statements
- Compress and minify assets

@tests validate optimizations:
- Test loading performance improvements
- Validate functionality preservation
- Monitor memory usage changes
- Test across different network conditions
```

### Memory Management Strategy
```
@debug profile memory usage:
- Monitor per-context memory consumption
- Identify memory leak patterns
- Assess garbage collection efficiency

@extension-builder implement fixes:
- Clean up event listeners properly
- Implement object pooling where appropriate
- Optimize data structure choices
- Add memory monitoring and alerts
```

## Security and Compliance Workflows

### Security Review Process (`@reviewer`)
```
Code Review Security Checks:
- Input validation and sanitization
- Authentication and authorization
- Data encryption and secure storage
- CSP compliance and script injection prevention

Extension-Specific Security:
- Permission justification and minimization
- Secure message passing validation
- Cross-origin request safety
- Privacy data handling compliance
```

### Compliance Validation (`@reviewer`)
```
Browser Store Requirements:
- Manifest validation and completeness
- Permission declarations accuracy
- Content security policy compliance
- User data handling transparency

Legal and Regulatory:
- Privacy policy accuracy
- Data collection disclosure
- Accessibility compliance
- International law considerations
```

## Continuous Integration Workflows

### Automated Quality Gates
```
Pre-commit Hooks:
- @extension-builder run linting and type checking
- @tests execute unit tests
- @reviewer perform basic security scan

CI/CD Pipeline:
- @extension-builder build all packages
- @tests run comprehensive test suite
- @i18n-manager validate translation completeness
- @reviewer perform security and compliance checks
- @orchestrator coordinate deployment approval
```

### Release Preparation Workflow
```
@orchestrator initiate release process:
- @tests run full test matrix
- @i18n-manager finalize translations
- @extension-builder create production build
- @reviewer perform final security review
- @documentation update release notes
- @extension-builder tag and deploy release
```

## Agent Communication Protocols

### Direct Agent Invocation
```
@agent-name [specific task or question]
Examples:
@architect review this design decision
@debug help debug this cross-context issue
@i18n-manager add support for Spanish locale
```

### Command-Based Collaboration
```
Commands automatically route to appropriate agents:
- /constitution → @specifier
- /build-extension → @extension-builder
- /test-e2e → @tests
- /security-scan → @reviewer
```

### Escalation Patterns
```
For complex issues requiring multiple agents:
1. Start with specific agent for technical expertise
2. Escalate to @orchestrator for coordination if needed
3. Involve @architect for design-related decisions
4. Engage @reviewer for quality and compliance validation
```

## Best Practices for Agent Collaboration

### Communication Guidelines
- Be specific about requirements and constraints
- Provide context for technical decisions
- Document assumptions and rationale
- Use consistent terminology across agents

### Workflow Optimization
- Leverage agent specialization for efficiency
- Use parallel processing when tasks are independent
- Implement feedback loops for continuous improvement
- Maintain clear separation of concerns

### Quality Assurance
- Validate outputs at each workflow stage
- Implement automated checks where possible
- Maintain comprehensive documentation
- Conduct regular process reviews

### Performance Considerations
- Monitor agent resource usage
- Optimize for parallel execution
- Cache results when appropriate
- Implement efficient communication patterns

This workflow guide provides the foundation for effective multi-agent collaboration in browser extension development, ensuring consistent quality, efficient processes, and successful project delivery.