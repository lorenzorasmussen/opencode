# Review-Only Mode

Read-only code analysis and review mode for secure code inspection.

## Mode Characteristics

- **Read-Only**: No file modifications allowed
- **Analysis Focus**: Code quality, security, performance review
- **Safe Environment**: Cannot accidentally modify production code

## Allowed Operations

- Reading files and directories
- Running analysis tools (grep, lint check, etc.)
- Generating reports and documentation
- Running tests in read-only mode

## Restricted Operations

- File creation or modification
- Running build/deploy commands
- Making commits or pushes
- Executing destructive operations

## Use Cases

- Code review sessions
- Security audits
- Performance analysis
- Documentation review
- Pre-deployment validation

## Agent Behavior

Automatically switches to review agent for analysis tasks. Prevents accidental changes during review processes.
