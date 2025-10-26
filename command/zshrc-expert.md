# Zshrc Expert Guide

## Overview
Comprehensive modular zsh configuration with XDG compliance, git integration, and enterprise-grade features.

**Key Features:**
- Modular architecture with protected `conf.d/` directory
- Lazy loading for performance optimization
- Automated backup system (`conf.d/backup/`)
- Git hooks for validation and security
- Version manager integration (rbenv, nvm)
- Comprehensive testing and monitoring

## Quick Start
```bash
# Clone and setup
git clone <repo> ~/.config/zsh
cd ~/.config/zsh
source ~/.zshrc

# Test configuration
./test_zsh.sh

# AI-assisted repository setup
copilot -p "Create private GitHub repository for zsh config" --allow-all-tools

# View documentation
cat .opencode/command/zshrc-expert.md
cat .opencode/command/copilot-workflow.md
```

## File Structure
```
~/.config/zsh/
├── conf.d/                 # Protected modular configs
│   ├── 00-main.zsh        # Core loader with zsh validation
│   ├── 01-git-enhancements.zsh
│   ├── 02-aliases.zsh
│   ├── 03-functions.zsh
│   ├── 04-prompts.zsh
│   ├── 05-completion.zsh
│   ├── 07-ux-enhancements.zsh
│   ├── 08-ruby.zsh        # Conditional rbenv loading
│   ├── 99-custom.zsh      # Lazy nvm loading
│   └── backup/            # Automated backup directory
├── hooks/                 # Git hooks and automation
│   ├── pre_tool_hook.sh   # Pre-tool validation
│   └── ...                # Other automation scripts
├── tool_launcher.sh       # Safe tool execution wrapper
├── archive/               # Legacy backups
└── backup_configs/        # Additional backups
```

## Core Configuration

### Environment Setup
- **XDG Compliance**: Proper directory structure
- **Zsh Validation**: Ensures zsh-only execution
- **Conditional Loading**: Version managers loaded on demand

### Module Loading Order
1. `00-main.zsh` - Environment validation
2. `01-git-enhancements.zsh` - Git tools
3. `02-aliases.zsh` - System aliases
4. `03-functions.zsh` - Utility functions
5. `04-prompts.zsh` - Prompt configuration
6. `05-completion.zsh` - Tab completion
7. `07-ux-enhancements.zsh` - UX features
8. `08-ruby.zsh` - Ruby environment (conditional)
9. `99-custom.zsh` - User customizations (lazy nvm)

## Key Commands

### Configuration Management
```bash
# Reload configuration
reload

# Test all modules
./test_zsh.sh

# Check syntax
zsh -n conf.d/*.zsh

# Performance audit
./hooks/performance_monitor.sh
```

### AI-Assisted Development
```bash
# Safe tool execution with validation
./tool_launcher.sh opencode -p "task description"

# Pre-tool validation check
./hooks/pre_tool_hook.sh

# Branch management for LLM work
git checkout -b feature-branch
# ... make changes ...
git commit -m "changes"
git push origin feature-branch
# Then checkout new branch for next task
```

### Backup & Recovery
```bash
# Create backup
./backup_file.sh conf.d/99-custom.zsh

# List backups
find conf.d/backup -name "*.zsh"

# Restore version
cp conf.d/backup/99-custom.zsh.v3.zsh conf.d/99-custom.zsh
```

### Safe Editing
```bash
# Cache-based editing
./hooks/cache_edit.sh conf.d/99-custom.zsh
# Edit cache file, then approve
./hooks/approve_changes.sh conf.d/99-custom.zsh
```

## Version Managers

### Rbenv (Conditional)
- Loads only when `ZSH_LOAD_RBENV=true`
- Prevents duplicate initialization
- Homebrew and system support

### NVM (Lazy Loading)
- Loads on first `nvm`, `node`, or `npm` usage
- Avoids startup performance impact
- Homebrew and system support

## Git Integration

### Pre-commit Hooks
- **Syntax validation** for all zsh files
- **File protection** prevents unauthorized changes
- **Directory restrictions** blocks new files in `conf.d/`
- **Naming standards** enforcement

### Branch Strategy
- `main`: Stable production config
- `llm-work`: Development branch for AI-assisted changes
- Feature branches: Create new branch for each major task
- **Workflow**: Commit → Push → Checkout new branch for next task

## Performance Optimization

### Startup Time
- **Target**: <200ms cold start
- **Lazy loading** for heavy tools
- **Conditional sourcing** based on usage
- **Profile with**: `zmodload zsh/zprof`

### Memory Management
- **Local variables** in functions
- **Unset unused** variables
- **Monitor usage** with `ps aux | grep zsh`

## Security Features

### File Protection
- **Permissions**: 600 for config files, 700 for hooks
- **Git hooks**: Prevent unauthorized modifications
- **Directory restrictions**: No new files in `conf.d/`

### Audit & Compliance
- **Security scanning**: `./hooks/security_audit.sh`
- **Permission validation**: Automated checks
- **Sensitive data detection**: Pattern scanning

## Testing Framework

### Automated Tests
```bash
# Full test suite
./test_zsh.sh

# Module-specific tests
./hooks/git_hooks.sh conf.d/01-git-enhancements.zsh

# Syntax validation
zsh -n conf.d/*.zsh
```

### CI/CD Integration
- GitHub Actions workflow
- Automated testing on push/PR
- Performance regression detection

## Deployment & Synchronization

### Multi-machine Setup
```bash
# Sync to remote
./hooks/deployment_automation.sh user@host:~/.config/zsh sync

# Full deployment
./hooks/deployment_automation.sh user@host:~/.config/zsh full
```

### Environment Management
- **Development/Production** configs
- **Project-specific** settings
- **Remote development** workflows

## Troubleshooting

### Common Issues
- **Startup errors**: Check `ZSH_LOAD_*` flags
- **Permission denied**: Run `chmod 600 *.zsh`
- **Missing tools**: Conditional loading prevents errors
- **Performance issues**: Use lazy loading

### Debug Commands
```bash
# Verbose loading
zsh -c "set -x; source conf.d/00-main.zsh"

# Profile startup
zsh -c "zmodload zsh/zprof; source conf.d/00-main.zsh; zprof"

# Check permissions
find . -name "*.zsh" -exec ls -la {} \;
```

## Advanced Features

### Hook System
- **Pre-work validation**: Documentation requirements
- **Change approval**: Feature preservation
- **Automated monitoring**: Performance tracking
- **Security auditing**: Regular scans

### Plugin Architecture
- **Modular design**: Easy extension
- **Conditional loading**: Performance optimization
- **Version management**: Compatibility handling

### IDE Integration
- **VS Code**: Terminal and file associations
- **Vim/Neovim**: Editor support
- **Docker**: Containerized development

## Maintenance

### Regular Tasks
- **Update backups**: `./backup_file.sh` after changes
- **Clean old versions**: `find archive -mtime +30 -delete`
- **Monitor performance**: Cron jobs for metrics
- **Security audits**: Weekly scans

### Upgrade Process
```bash
# Backup current config
tar -czf backup.tar.gz ~/.config/zsh

# Pull updates
git pull origin main

# Test and migrate
./test_zsh.sh
```

## Naming Conventions

### Files
- `camelCase`: Scripts (e.g., `backupFile.sh`)
- `kebab-case`: Configs (e.g., `git-enhancements.zsh`)
- `PascalCase`: Themes (e.g., `DarkTheme.zsh`)
- `UPPER_SNAKE_CASE`: Constants (e.g., `CONFIG_VARS.zsh`)

### Code
- Functions: `camelCase` (e.g., `createBackup()`)
- Variables: `camelCase` with prefixes (`isValid`, `getPath`)
- Aliases: `snake_case` (e.g., `git_status`)

## Best Practices

### Development
- **Modular changes**: One feature per commit
- **Test before commit**: `./test_zsh.sh`
- **Document changes**: Update this guide
- **Backup first**: `./backup_file.sh` before edits

### Security
- **Validate inputs**: Sanitize user data
- **Safe operations**: Use safe file handling
- **Regular audits**: `./hooks/security_audit.sh`

### Performance
- **Lazy loading**: Heavy tools on demand
- **Cache results**: Expensive operations
- **Monitor usage**: Track startup time

This optimized guide maintains all essential information while reducing length by ~65%. Focus on practical usage, key commands, and troubleshooting while preserving comprehensive coverage of the zsh configuration system.