---
description: Security and dependency analysis
agent: review
---

# Dependency Audit

Perform comprehensive security and dependency analysis.

## Audit Types

1. **Security Vulnerabilities**: Known CVEs and security issues
2. **License Compliance**: Open source license compatibility
3. **Outdated Packages**: Available updates and breaking changes
4. **Bundle Size**: Dependency impact on bundle size

## Commands

!`bun audit`
!`bun outdated`
!`bun run license-check`
!`bun run bundle-analyzer`

## Security Scanning

- Check for known vulnerabilities in dependencies
- Review transitive dependencies
- Assess severity levels (Critical, High, Moderate, Low)
- Generate remediation recommendations

## License Analysis

- Verify license compatibility
- Check for copyleft vs permissive licenses
- Ensure compliance with organizational policies
- Generate license report

## Update Analysis

- Identify outdated packages
- Assess breaking changes in updates
- Prioritize security updates
- Generate update plan

## Bundle Impact

- Analyze dependency contribution to bundle size
- Identify large or unnecessary packages
- Suggest optimization strategies
- Track bundle size trends
