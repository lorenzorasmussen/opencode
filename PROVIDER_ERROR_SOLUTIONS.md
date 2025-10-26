# OpenCode Provider Errors & Bad Request Solutions

## Problem Summary

You were experiencing provider errors and bad request errors in your OpenCode setup. After comprehensive analysis, I identified and resolved the following issues:

## Root Causes Identified

### 1. **Incorrect Perplexity Model ID** ❌
- **Issue**: Your configuration used `"id": "perplexity/sonar-pro"` 
- **Correct**: Should be `"id": "sonar-pro"`
- **Impact**: This caused 400 Bad Request errors from Perplexity API

### 2. **Missing Environment Variables** ❌
- **Issue**: API keys were not properly loaded into environment
- **Impact**: Authentication failures and provider connection issues

### 3. **No Error Monitoring** ❌
- **Issue**: No system to detect or recover from configuration issues
- **Impact**: Problems persisted without automatic detection

## Solutions Implemented

### ✅ Fixed Configuration Files

**Updated OpenCode Configuration** (`~/.config/.opencode/opencode.json`):
```json
{
  "provider": {
    "perplexity": {
      "models": {
        "sonar-pro": {
          "id": "sonar-pro",  // Fixed: removed "perplexity/" prefix
          "name": "Sonar Pro"
        }
      }
    }
  }
}
```

**Created Environment File** (`~/.config/.opencode/.env`):
```bash
PERPLEXITY_API_KEY=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
OPENROUTER_API_KEY=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
# ... other API keys
```

### ✅ Created Error Monitoring System

**File**: `error_monitor.sh`

**Features**:
- Real-time API connectivity testing
- Configuration validation
- Automatic error logging
- Recovery action tracking
- JSON syntax validation

**Usage**:
```bash
./error_monitor.sh monitor    # Run full monitoring
./error_monitor.sh errors     # Show recent errors
./error_monitor.sh recovery   # Show recovery actions
./error_monitor.sh fix        # Fix common issues
```

### ✅ Created Automated Recovery System

**File**: `auto_recovery.sh`

**Features**:
- Comprehensive health checks
- Automatic restore points
- Factory reset capability
- Environment file repair
- MCP configuration fixes

**Usage**:
```bash
./auto_recovery.sh health-check  # Run health check
./auto_recovery.sh fix          # Auto-fix issues
./auto_recovery.sh restore      # Restore from backup
./auto_recovery.sh backup       # Create restore point
```

## Verification Results

### ✅ API Connectivity Tests

**Perplexity API**: ✅ Working
- Model ID: `sonar-pro` (corrected)
- Authentication: Valid
- Response: Successful

**OpenRouter API**: ✅ Working
- Model ID: `qwen/qwen3-coder:free`
- Authentication: Valid
- Response: Successful

### ✅ Configuration Validation

- JSON Syntax: ✅ Valid
- Required Fields: ✅ Present
- Environment Variables: ✅ Loaded
- MCP Servers: ✅ Configured

## Ongoing Maintenance

### Daily Health Check
Add to your cron or run manually:
```bash
./auto_recovery.sh health-check
```

### Error Monitoring
Run when you suspect issues:
```bash
./error_monitor.sh monitor
```

### Automatic Recovery
If problems occur:
```bash
./auto_recovery.sh fix
```

## Troubleshooting Guide

### If Perplexity Errors Persist:
1. Check API key validity
2. Verify model name is `sonar-pro` (not `perplexity/sonar-pro`)
3. Run: `./error_monitor.sh monitor`

### If OpenRouter Errors Persist:
1. Check API key and quota
2. Verify model availability
3. Run: `./error_monitor.sh monitor`

### If Configuration Corruption:
1. Create restore point: `./auto_recovery.sh backup`
2. Reset to factory: `./auto_recovery.sh factory-reset`
3. Restore from backup: `./auto_recovery.sh restore`

### If MCP Issues:
1. Disable MCP temporarily: `./auto_recovery.sh fix-mcp`
2. Check server configurations
3. Re-enable after fixing

## File Locations

```
~/.config/.opencode/
├── opencode.json              # Main configuration
├── .env                       # Environment variables
├── error_monitor.sh            # Error monitoring script
├── auto_recovery.sh            # Recovery system script
├── logs/                      # Error and recovery logs
│   ├── errors.log
│   └── recovery.log
├── backups/                    # Configuration backups
└── restore_points/             # System restore points
```

## Quick Commands Reference

```bash
# Check system health
./auto_recovery.sh health-check

# Monitor for errors
./error_monitor.sh monitor

# Fix common issues
./auto_recovery.sh fix

# Create backup before changes
./auto_recovery.sh backup

# View recent errors
./error_monitor.sh errors

# Restore from backup
./auto_recovery.sh restore
```

## Prevention Tips

1. **Before making changes**: Always create a restore point
2. **After updates**: Run health check to verify
3. **Regular monitoring**: Check error logs weekly
4. **API key rotation**: Update keys before they expire
5. **Configuration changes**: Validate JSON syntax

## Support

If issues persist after applying these solutions:

1. Check the error logs: `./error_monitor.sh errors`
2. Run comprehensive diagnostics: `./auto_recovery.sh health-check`
3. Try factory reset as last resort: `./auto_recovery.sh factory-reset`

---

**Status**: ✅ All issues resolved and monitoring systems in place

**Last Updated**: $(date)
**System Health**: Optimal