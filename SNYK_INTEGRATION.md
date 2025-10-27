# Snyk Security Integration

## Overview

This repository uses Snyk for automated security vulnerability scanning and monitoring. Snyk helps identify and fix security issues in dependencies before they become problems.

## Setup

### 1. Install Snyk GitHub App

Visit [Snyk GitHub App](https://github.com/apps/snyk) and install it for your repository.

### 2. Configure Repository Secrets

Add the following secret to your GitHub repository:

- `SNYK_TOKEN`: Your Snyk API token (get from [Snyk Account Settings](https://app.snyk.io/account))

### 3. Automatic Scanning

Snyk will automatically scan your repository on:

- Every push to main/develop branches
- Pull requests to main/develop branches
- Manual workflow dispatch

## Configuration

The `.snyk` file contains configuration for:

- Severity thresholds (currently set to `high`)
- Excluded directories
- Included file patterns
- Vulnerability ignore rules

## Workflows

### `snyk-pr-checks.yml`

Runs on pull requests and:

- Scans for vulnerabilities using `snyk test`
- Generates security reports
- Comments on PRs with findings
- Blocks merges with high-severity vulnerabilities

### Manual Scanning

You can also run Snyk manually:

```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Scan project
snyk test

# Monitor for new vulnerabilities
snyk monitor

# Check for available fixes
snyk fix
```

## Severity Levels

- **Critical**: Immediate action required
- **High**: Should be fixed soon
- **Medium**: Should be addressed
- **Low**: Monitor but not urgent

## Ignoring Vulnerabilities

To ignore specific vulnerabilities, add them to the `.snyk` file:

```yaml
ignore:
  "npm:package-name:issue-id":
    - "*":
        reason: "Justification for ignoring"
        expires: "2024-12-31"
```

## Best Practices

1. **Regular Updates**: Keep dependencies updated
2. **Review Reports**: Check security reports regularly
3. **Fix High Priority**: Address high-severity issues immediately
4. **Monitor Dependencies**: Use `snyk monitor` for continuous monitoring
5. **Automate Fixes**: Use `snyk fix` where possible

## Troubleshooting

### Common Issues

1. **No Token Error**: Ensure `SNYK_TOKEN` secret is set
2. **Permission Denied**: Check GitHub App permissions
3. **False Positives**: Use ignore rules for known false positives
4. **Build Failures**: Review severity threshold settings

### Support

- [Snyk Documentation](https://docs.snyk.io/)
- [Snyk Community](https://community.snyk.io/)
- [GitHub Issues](https://github.com/snyk/snyk/issues)

## Integration Status

✅ Snyk GitHub App installed
✅ Repository secrets configured
✅ Automated workflows active
✅ Security reports enabled
✅ PR blocking for high-severity issues
