# Hotfix Mode

Emergency fix mode for critical production issues with limited scope.

## Mode Characteristics

- **Limited Scope**: Only critical bug fixes allowed
- **Fast Track**: Streamlined process for urgent fixes
- **Minimal Changes**: Small, targeted modifications only
- **High Priority**: Bypasses normal review processes

## Allowed Operations

- Small code changes (single files, <50 lines)
- Critical security patches
- Data corruption fixes
- Service outage resolutions
- Minimal test additions

## Restricted Operations

- Large refactoring or rewrites
- New feature additions
- Breaking API changes
- Extensive test modifications
- Documentation updates (except critical)

## Process Requirements

1. **Issue Verification**: Confirm critical impact
2. **Minimal Fix**: Implement smallest possible change
3. **Immediate Testing**: Validate fix works
4. **Quick Review**: Fast-track approval
5. **Deploy & Monitor**: Immediate deployment with monitoring

## Quality Gates (Relaxed)

- Fix must resolve the critical issue
- No new critical vulnerabilities introduced
- Basic functionality testing passed
- Rollback plan prepared

## Use Cases

- Security vulnerabilities
- Data loss prevention
- Service downtime
- Critical functionality breakage

## Agent Behavior

Limits available tools to prevent scope creep. Enforces small change sets and fast validation cycles.
