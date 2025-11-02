# Operational Procedures Manual

## Overview

This manual provides operational procedures for running, monitoring, and maintaining the OpenCode-Zed ACP integration in production environments.

## Daily Operations

### 1. System Health Checks

#### Morning Health Check Procedure

**Frequency**: Daily, 9:00 AM

**Responsible**: Operations Team

**Procedure**:

1. **Check System Status**

   ```bash
   # Check OpenCode ACP service status
   systemctl status opencode-acp

   # Check Zed plugin status (if applicable)
   # Check system resources
   df -h
   free -h
   uptime
   ```

2. **Verify Service Availability**

   ```bash
   # Test ACP endpoint
   curl -X POST http://localhost:3000/acp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1}}'

   # Check response time
   time curl -s http://localhost:3000/acp > /dev/null
   ```

3. **Review Logs**

   ```bash
   # Check for errors in last 24 hours
   grep "ERROR" /var/log/opencode-acp.log | tail -20

   # Check warning patterns
   grep "WARN" /var/log/opencode-acp.log | tail -10

   # Review connection events
   grep -E "(connected|disconnected)" /var/log/opencode-acp.log | tail -5
   ```

4. **Monitor Performance Metrics**

   ```bash
   # Check response time percentiles
   # Verify memory usage < 500MB
   # Confirm CPU usage < 30%
   # Check active sessions
   ```

5. **Document Findings**
   - Record any anomalies
   - Note performance trends
   - Update incident log if needed

### 2. Backup Operations

#### Configuration Backup

**Frequency**: Daily, automated

**Procedure**:

```bash
#!/bin/bash
# Daily configuration backup script

BACKUP_DIR="/var/backups/opencode-acp"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup configurations
tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
  /etc/opencode/ \
  ~/.config/zed/

# Backup session data (if persistent)
# tar -czf $BACKUP_DIR/sessions_$DATE.tar.gz /var/lib/opencode/sessions/

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Verify backup integrity
tar -tzf $BACKUP_DIR/config_$DATE.tar.gz > /dev/null
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_DIR/config_$DATE.tar.gz"
else
  echo "Backup failed!" >&2
  exit 1
fi
```

#### Data Backup

**Frequency**: Weekly, Sundays 2:00 AM

**Procedure**:

```bash
#!/bin/bash
# Weekly data backup script

BACKUP_DIR="/var/backups/opencode-data"
DATE=$(date +%Y%m%d)

# Backup user data
pg_dump opencode_db > $BACKUP_DIR/database_$DATE.sql

# Backup session data
tar -czf $BACKUP_DIR/sessions_$DATE.tar.gz /var/lib/opencode/sessions/

# Backup logs (last 30 days)
find /var/log -name "opencode*.log" -mtime -30 \
  -exec tar -czf $BACKUP_DIR/logs_$DATE.tar.gz {} +

# Encrypt backups
gpg --encrypt --recipient backup-key $BACKUP_DIR/*_$DATE.*

# Upload to remote storage
aws s3 cp $BACKUP_DIR/ s3://opencode-backups/ --recursive

# Clean local backups (keep last 7 days)
find $BACKUP_DIR -name "*_$DATE.*" -mtime +7 -delete
```

### 3. Log Management

#### Log Rotation

**Configuration** (/etc/logrotate.d/opencode-acp):

```
/var/log/opencode-acp.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
    create 644 opencode opencode
    postrotate
        systemctl reload opencode-acp
    endscript
}
```

#### Log Analysis

**Daily Log Review**:

```bash
#!/bin/bash
# Daily log analysis script

LOG_FILE="/var/log/opencode-acp.log"
REPORT_FILE="/var/reports/daily-$(date +%Y%m%d).txt"

# Generate daily report
{
  echo "=== OpenCode ACP Daily Report $(date) ==="
  echo

  echo "Error Summary:"
  grep "ERROR" "$LOG_FILE" | wc -l
  echo

  echo "Top Error Types:"
  grep "ERROR" "$LOG_FILE" | sed 's/.*ERROR //' | sort | uniq -c | sort -nr | head -5
  echo

  echo "Response Time Statistics:"
  grep "duration" "$LOG_FILE" | awk '{print $NF}' | sort -n | awk '
    BEGIN {count=0; sum=0}
    {count++; sum+=$1; if(min=="")min=$1; max=$1}
    END {
      if(count>0) {
        print "Count:", count
        print "Average:", sum/count "ms"
        print "Min:", min "ms"
        print "Max:", max "ms"
        print "95th percentile:", (count > 19 ? "calculate properly" : "insufficient data")
      }
    }
  '
  echo

  echo "Active Sessions:"
  grep "session/new" "$LOG_FILE" | wc -l
  echo

  echo "Tool Executions:"
  grep "tool_call" "$LOG_FILE" | wc -l

} > "$REPORT_FILE"

# Email report
mail -s "OpenCode ACP Daily Report" admin@company.com < "$REPORT_FILE"
```

## Weekly Operations

### 1. Performance Monitoring

#### Weekly Performance Review

**Frequency**: Weekly, Wednesdays 10:00 AM

**Procedure**:

1. **Review Performance Trends**

   ```bash
   # Generate performance report for last 7 days
   ./scripts/performance-report.sh --days 7

   # Check for performance regressions
   ./scripts/compare-performance.sh baseline.json current.json
   ```

2. **Analyze Resource Usage**

   ```bash
   # CPU usage trends
   sar -u -f /var/log/sa/sa$(date +%d) | tail -10

   # Memory usage patterns
   sar -r -f /var/log/sa/sa$(date +%d) | tail -10

   # Disk I/O statistics
   iostat -x 1 10
   ```

3. **Database Performance**

   ```bash
   # Check query performance
   psql -d opencode_db -c "SELECT * FROM pg_stat_activity;"

   # Review slow queries
   psql -d opencode_db -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
   ```

4. **Network Performance**

   ```bash
   # Check network latency
   ping -c 10 api.anthropic.com

   # Monitor connection counts
   netstat -ant | grep ESTABLISHED | wc -l
   ```

### 2. Security Updates

#### Security Patch Management

**Frequency**: Weekly, patch Tuesday + 2 days

**Procedure**:

1. **Check for Updates**

   ```bash
   # Check OpenCode updates
   npm outdated opencode-ai

   # Check system packages
   apt list --upgradable  # Ubuntu/Debian
   yum check-update      # RHEL/CentOS

   # Check Zed updates
   # (Check GitHub releases or auto-updater)
   ```

2. **Apply Security Patches**

   ```bash
   # Update OpenCode
   npm update -g opencode-ai

   # Update system packages
   apt update && apt upgrade -y

   # Restart services
   systemctl restart opencode-acp
   ```

3. **Security Scanning**

   ```bash
   # Run vulnerability scan
   npm audit

   # Check file permissions
   find /etc/opencode -type f -exec ls -l {} \; | grep -v "opencode opencode"

   # Verify configurations
   ./scripts/security-check.sh
   ```

### 3. Capacity Planning

#### Resource Usage Analysis

**Procedure**:

1. **Monitor Growth Trends**

   ```bash
   # Analyze session growth
   ./scripts/analyze-sessions.sh --months 3

   # Check storage usage trends
   du -sh /var/lib/opencode/* | sort -hr

   # Monitor API usage
   ./scripts/api-usage-report.sh
   ```

2. **Predict Capacity Needs**

   ```bash
   # Estimate future resource requirements
   ./scripts/capacity-planning.sh --forecast 6months

   # Check current limits
   ulimit -a
   sysctl -a | grep -E "(max_|limit)"
   ```

3. **Plan Scaling Actions**
   - Schedule hardware upgrades
   - Plan service migrations
   - Update monitoring thresholds

## Monthly Operations

### 1. System Maintenance

#### Monthly Maintenance Window

**Schedule**: First Saturday of month, 2:00-4:00 AM

**Procedure**:

1. **Pre-Maintenance Preparation**

   ```bash
   # Notify stakeholders
   # Schedule downtime announcement
   # Prepare rollback plan
   ```

2. **System Maintenance**

   ```bash
   # Stop services gracefully
   systemctl stop opencode-acp

   # Perform maintenance tasks
   ./scripts/monthly-maintenance.sh

   # Start services
   systemctl start opencode-acp
   ```

3. **Post-Maintenance Validation**

   ```bash
   # Verify system health
   ./scripts/health-check.sh

   # Run integration tests
   npm run test:integration

   # Notify stakeholders of completion
   ```

#### Maintenance Tasks

**Database Maintenance**:

```bash
# Vacuum and analyze database
psql -d opencode_db -c "VACUUM ANALYZE;"

# Reindex tables if needed
psql -d opencode_db -c "REINDEX DATABASE opencode_db;"

# Archive old data
./scripts/archive-old-data.sh --months 12
```

**File System Maintenance**:

```bash
# Clean temporary files
find /tmp -name "opencode-*" -mtime +7 -delete

# Clean old logs
find /var/log -name "*.gz" -mtime +90 -delete

# Check disk health
smartctl -H /dev/sda
```

**Configuration Updates**:

```bash
# Review and update configurations
./scripts/review-configs.sh

# Update certificates if needed
./scripts/renew-certificates.sh

# Validate all configurations
./scripts/validate-configs.sh
```

### 2. Compliance and Audit

#### Security Audit

**Procedure**:

1. **Access Review**

   ```bash
   # Review user access
   last | grep opencode

   # Check file permissions
   find /etc/opencode -type f -exec ls -l {} \;

   # Review authentication logs
   grep "authentication" /var/log/opencode-acp.log
   ```

2. **Configuration Audit**

   ```bash
   # Check for insecure configurations
   ./scripts/security-audit.sh

   # Validate encryption settings
   ./scripts/check-encryption.sh

   # Review backup integrity
   ./scripts/verify-backups.sh
   ```

3. **Compliance Check**

   ```bash
   # GDPR compliance check
   ./scripts/gdpr-check.sh

   # Data retention compliance
   ./scripts/retention-check.sh

   # Generate compliance report
   ./scripts/compliance-report.sh
   ```

### 3. Performance Optimization

#### Monthly Performance Tuning

**Procedure**:

1. **Analyze Performance Data**

   ```bash
   # Generate monthly performance report
   ./scripts/monthly-performance-report.sh

   # Identify bottlenecks
   ./scripts/identify-bottlenecks.sh

   # Review optimization opportunities
   ./scripts/optimization-opportunities.sh
   ```

2. **Implement Optimizations**

   ```bash
   # Database optimizations
   ./scripts/optimize-database.sh

   # Configuration tuning
   ./scripts/tune-config.sh

   # Code optimizations (if applicable)
   ./scripts/optimize-code.sh
   ```

3. **Validate Improvements**

   ```bash
   # Run performance benchmarks
   ./scripts/performance-benchmark.sh

   # Compare with previous month
   ./scripts/compare-performance.sh last-month.json this-month.json

   # Update baselines
   ./scripts/update-baselines.sh
   ```

## Quarterly Operations

### 1. Major Updates

#### Version Upgrade Procedure

**Schedule**: Quarterly, during maintenance windows

**Procedure**:

1. **Planning Phase**

   ```bash
   # Review release notes
   # Assess compatibility
   # Plan rollback strategy
   # Schedule downtime
   ```

2. **Testing Phase**

   ```bash
   # Set up staging environment
   ./scripts/setup-staging.sh

   # Test upgrade in staging
   ./scripts/test-upgrade.sh

   # Validate functionality
   ./scripts/validate-upgrade.sh
   ```

3. **Upgrade Phase**

   ```bash
   # Backup current system
   ./scripts/full-backup.sh

   # Perform upgrade
   ./scripts/upgrade-system.sh

   # Run post-upgrade tests
   ./scripts/post-upgrade-tests.sh
   ```

4. **Validation Phase**

   ```bash
   # Full system validation
   ./scripts/full-validation.sh

   # Performance verification
   ./scripts/performance-verification.sh

   # User acceptance testing
   ./scripts/user-acceptance-tests.sh
   ```

### 2. Disaster Recovery Testing

#### Quarterly DR Test

**Procedure**:

1. **Test Preparation**

   ```bash
   # Review DR plan
   ./scripts/review-dr-plan.sh

   # Set up test environment
   ./scripts/setup-dr-test.sh

   # Notify stakeholders
   ```

2. **Failover Testing**

   ```bash
   # Simulate primary failure
   ./scripts/simulate-failure.sh primary

   # Execute failover
   ./scripts/execute-failover.sh

   # Verify failover success
   ./scripts/verify-failover.sh
   ```

3. **Failback Testing**

   ```bash
   # Restore primary system
   ./scripts/restore-primary.sh

   # Execute failback
   ./scripts/execute-failback.sh

   # Verify failback success
   ./scripts/verify-failback.sh
   ```

4. **Test Review**

   ```bash
   # Document test results
   ./scripts/document-dr-test.sh

   # Update DR procedures
   ./scripts/update-dr-procedures.sh

   # Schedule improvements
   ```

## Incident Response

### 1. Incident Classification

#### Severity Levels

| Level        | Description                | Response Time | Communication                   |
| ------------ | -------------------------- | ------------- | ------------------------------- |
| **Critical** | System down, data loss     | 15 minutes    | Immediate all-hands             |
| **High**     | Major functionality broken | 1 hour        | Page on-call, notify management |
| **Medium**   | Degraded performance       | 4 hours       | Create ticket, notify team      |
| **Low**      | Minor issues               | 24 hours      | Log ticket for next day         |

#### Incident Categories

- **Availability**: Service down or unresponsive
- **Performance**: Slow responses or high resource usage
- **Security**: Potential breaches or unauthorized access
- **Data**: Data corruption or loss
- **Configuration**: Misconfigurations causing issues

### 2. Incident Response Procedure

#### Immediate Response (First 15 minutes)

1. **Acknowledge Incident**

   ```bash
   # Check monitoring alerts
   # Acknowledge in incident management system
   # Assess initial impact
   ```

2. **Gather Information**

   ```bash
   # Check system status
   systemctl status opencode-acp

   # Review recent logs
   tail -50 /var/log/opencode-acp.log

   # Check resource usage
   top -b -n 1 | head -20
   ```

3. **Initial Assessment**
   - Determine severity level
   - Identify affected systems
   - Estimate impact and duration
   - Notify appropriate stakeholders

#### Investigation (15-60 minutes)

1. **Detailed Diagnosis**

   ```bash
   # Run diagnostic scripts
   ./scripts/diagnose-issue.sh

   # Check monitoring dashboards
   # Review recent changes
   # Analyze error patterns
   ```

2. **Root Cause Analysis**
   - Identify triggering event
   - Trace error propagation
   - Determine contributing factors
   - Document findings

#### Resolution (1-4 hours)

1. **Implement Fix**

   ```bash
   # Apply immediate workaround
   ./scripts/apply-workaround.sh

   # Implement permanent fix
   ./scripts/implement-fix.sh

   # Test fix in staging
   ./scripts/test-fix.sh
   ```

2. **Deploy Fix**

   ```bash
   # Deploy to production
   ./scripts/deploy-fix.sh

   # Verify fix effectiveness
   ./scripts/verify-fix.sh

   # Monitor for side effects
   ```

#### Post-Incident (4+ hours)

1. **Incident Review**

   ```bash
   # Document incident timeline
   ./scripts/document-incident.sh

   # Conduct post-mortem meeting
   # Identify improvement opportunities
   ```

2. **Follow-up Actions**

   ```bash
   # Implement preventive measures
   ./scripts/implement-prevention.sh

   # Update monitoring and alerting
   ./scripts/update-monitoring.sh

   # Communicate resolution to stakeholders
   ```

### 3. Communication Templates

#### Initial Notification

```
Subject: [INCIDENT] OpenCode ACP - {Severity} - {Brief Description}

Incident Details:
- Severity: {Critical|High|Medium|Low}
- Start Time: {timestamp}
- Affected Systems: {systems}
- Impact: {description}
- Current Status: Investigating

Next Update: Within {timeframe}

On-call: {person}
```

#### Status Updates

```
Subject: [UPDATE] OpenCode ACP Incident - {Status}

Current Status: {Investigating|Identified|Resolving|Resolved}

Latest Information:
- {Current findings}
- {Actions being taken}
- {Expected resolution time}

Next Update: {timeframe}
```

#### Resolution Notification

```
Subject: [RESOLVED] OpenCode ACP Incident - {Brief Description}

Resolution Summary:
- Root Cause: {description}
- Resolution: {actions taken}
- Duration: {time from start to resolution}
- Impact: {affected users/systems}

Follow-up Actions:
- {Preventive measures}
- {Monitoring improvements}
- {Timeline for completion}

Post-mortem scheduled: {date/time}
```

## Monitoring and Alerting

### 1. Monitoring Setup

#### Key Metrics to Monitor

**System Metrics**:

- CPU usage (> 80% warning, > 90% critical)
- Memory usage (> 80% warning, > 90% critical)
- Disk space (> 85% warning, > 95% critical)
- Network connectivity (packet loss > 1%)

**Application Metrics**:

- Response time (> 500ms warning, > 2000ms critical)
- Error rate (> 1% warning, > 5% critical)
- Active sessions (> 80% of limit warning)
- Tool execution failures (> 10% warning)

**Business Metrics**:

- User satisfaction scores (< 4.0 warning)
- Feature usage (< 50% of expected warning)
- SLA compliance (< 99.5% warning)

### 2. Alert Configuration

#### Alert Rules

```yaml
# Prometheus alert rules
groups:
  - name: opencode-acp
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage_percent > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is {{ $value }}%"

      - alert: ServiceDown
        expr: up{job="opencode-acp"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "OpenCode ACP service is down"
          description: "Service has been down for 1 minute"
```

#### Alert Response Procedures

**Critical Alerts**:

1. Immediate notification to on-call engineer
2. Automatic incident creation
3. Stakeholder notification within 15 minutes
4. Escalation if not acknowledged within 5 minutes

**Warning Alerts**:

1. Notification to operations team
2. Ticket creation for investigation
3. Review during next business day
4. Escalation if trend continues

**Info Alerts**:

1. Logged for review
2. Weekly summary review
3. Trend analysis

## Documentation and Training

### 1. Knowledge Base Maintenance

#### Runbook Updates

**Procedure**:

- Review runbooks quarterly
- Update based on incidents and changes
- Validate procedures annually
- Train team on updates

#### Documentation Standards

- Use consistent formatting
- Include screenshots for UI procedures
- Provide troubleshooting decision trees
- Maintain version history

### 2. Team Training

#### Regular Training

**Schedule**:

- Monthly: Operations review meeting
- Quarterly: Incident response training
- Annually: Full system training

**Training Topics**:

- System architecture and components
- Common procedures and troubleshooting
- Incident response and communication
- New features and changes

#### Certification

- Operations team certification
- On-call rotation training
- Backup personnel training
- Cross-training for critical procedures

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Operational Procedures Manual Team
