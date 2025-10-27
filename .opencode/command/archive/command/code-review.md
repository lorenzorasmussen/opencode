---
description: "Validate implementation vs spec/constitution"
agent: reviewer
tools:
  read: true
  grep: true
  glob: true
  list: true
---

Perform a comprehensive code review of the provided implementation:

$ARGUMENTS

Focus on:

1. **Specification Compliance**: Ensure the code matches the requirements and design specifications
2. **Code Quality**: Check for best practices, readability, and maintainability
3. **Security**: Identify potential vulnerabilities and security issues
4. **Performance**: Look for performance bottlenecks and optimization opportunities
5. **Testing**: Verify test coverage and edge case handling

Provide specific, actionable feedback with line numbers where applicable.

If this is a partial implementation, note what still needs to be completed to meet the full specification.
