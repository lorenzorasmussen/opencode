---
description: "Execute comprehensive test suite with coverage analysis, intelligent failure diagnosis, and automated improvement suggestions across multiple languages and frameworks"
agent: "build"
subagent: "tests"
argument-hint: "--coverage --verbose --fix --parallel --watch --language --framework"
---

## 5-Phase Test Execution & Quality Assurance Workflow

### Phase 1: Test Environment Setup & Validation

**Objective:** Ensure test environment is properly configured and all dependencies are available

**Key Activities:**
- **Framework Detection**: Automatically identify the project's testing framework (Jest, pytest, cargo-test, etc.) and programming language
- **Environment Validation**: Check for test directories, configuration files, and required dependencies
- **Dependency Resolution**: Install missing test dependencies and ensure all packages are available
- **Configuration Verification**: Validate test configuration files and environment variables

**Adaptation Strategies:**
- **JavaScript/TypeScript**: Detect package.json scripts, check for Jest/Vitest/Mocha configuration
- **Python**: Verify pytest/unittest setup, check requirements.txt or pyproject.toml
- **Rust**: Confirm cargo test configuration and optional coverage tools
- **Cross-platform**: Handle different operating systems and environment setups

**Success Criteria:**
- Test framework properly detected and configured
- All test dependencies installed and accessible
- Test environment variables and configurations validated
- No blocking issues preventing test execution

***

### Phase 2: Test Execution with Comprehensive Coverage

**Objective:** Run full test suite with coverage analysis and detailed reporting

**Key Activities:**
- **Test Suite Execution**: Run all tests using the detected framework with appropriate configuration
- **Coverage Collection**: Generate detailed coverage reports showing which code paths are tested
- **Result Analysis**: Parse test output to identify successes, failures, and performance metrics
- **Report Generation**: Create human-readable and machine-readable coverage reports

**Execution Strategies:**
- **Unit Tests**: Execute individual function and component tests
- **Integration Tests**: Run tests that verify component interactions
- **End-to-End Tests**: Execute full workflow tests when available
- **Performance Tests**: Include timing and resource usage analysis

**Coverage Analysis:**
- **Line Coverage**: Percentage of executable lines executed during testing
- **Branch Coverage**: Analysis of conditional logic and decision points
- **Function Coverage**: Verification that all functions are called during tests
- **Statement Coverage**: Overall code execution coverage metrics

**Reporting Options:**
- **Console Output**: Real-time progress with clear pass/fail indicators
- **HTML Reports**: Interactive coverage reports with drill-down capabilities
- **JSON/XML Output**: Machine-readable formats for CI/CD integration
- **Threshold Validation**: Automatic checking against coverage requirements

**Adaptation Strategies:**
- **Different Frameworks**: Use framework-specific commands and options
- **Parallel Execution**: Distribute tests across multiple cores when possible
- **Selective Testing**: Run only affected tests when in watch mode
- **Incremental Coverage**: Support for partial coverage analysis in large projects

***

### Phase 3: Failure Analysis & Diagnostic Reporting

**Objective:** Analyze test failures, categorize issues, and provide actionable insights

**Key Activities:**
- **Failure Classification**: Categorize test failures by type (unit, integration, environment, timeout)
- **Pattern Recognition**: Identify common failure patterns and root causes
- **Impact Assessment**: Evaluate the severity and scope of test failures
- **Diagnostic Reporting**: Generate detailed reports with specific error information

**Failure Categories:**
- **Unit Test Failures**: Issues with individual functions, methods, or components
- **Integration Failures**: Problems with component interactions or data flow
- **Environment Failures**: Database connections, network issues, or configuration problems
- **Timeout Failures**: Tests that exceed time limits or hang indefinitely
- **Assertion Failures**: Tests that fail because actual behavior doesn't match expectations

**Root Cause Analysis:**
- **Code Logic Errors**: Incorrect algorithms, boundary condition handling, or business logic flaws
- **Environment Issues**: Missing dependencies, incorrect configurations, or external service failures
- **Test Quality Problems**: Poor test design, flaky tests, or inadequate test data
- **Performance Issues**: Slow operations, resource constraints, or timing-sensitive failures

**Diagnostic Strategies:**
- **Error Message Analysis**: Parse test output for specific error patterns and stack traces
- **Log Analysis**: Review application logs for additional context and debugging information
- **Dependency Checking**: Verify all required services and resources are available
- **Configuration Validation**: Ensure test environments match production configurations

**Improvement Recommendations:**
- **Test Data Issues**: Suggest better test data setup and fixtures
- **Mocking Strategies**: Recommend appropriate use of mocks and stubs
- **Error Handling**: Identify missing error handling in application code
- **Performance Optimization**: Suggest improvements for slow or timing-dependent tests

***

### Phase 4: Automated Fix Generation & Test Repair

**Objective:** Generate automated fixes for common test issues and suggest code improvements

**Key Activities:**
- **Pattern-Based Fixes**: Apply automated solutions for common test problems
- **Configuration Corrections**: Fix test configuration and environment issues
- **Dependency Resolution**: Address missing packages and import problems
- **Test Structure Improvements**: Suggest better test organization and patterns

**Automated Fix Categories:**

**Environment & Configuration Fixes:**
- **Missing Dependencies**: Automatically install required test packages
- **Configuration Errors**: Fix test runner settings and options
- **Environment Variables**: Set up required environment configurations
- **Path Issues**: Resolve import and module path problems

**Test-Specific Fixes:**
- **Timeout Issues**: Adjust timeout values for slow operations
- **Async Handling**: Fix promises, async/await patterns, and timing issues
- **Mock Setup**: Configure proper mocking for external dependencies
- **Test Data**: Generate or fix test data and fixtures

**Code Quality Improvements:**
- **Import Optimization**: Clean up unused imports and dependencies
- **Error Handling**: Add proper error handling in test code
- **Assertion Improvements**: Enhance test assertions for better validation
- **Test Structure**: Reorganize tests for better maintainability

**Repair Workflow:**
- **Failure Isolation**: Identify and isolate specific failing tests
- **Root Cause Analysis**: Determine underlying causes of test failures
- **Fix Application**: Apply appropriate fixes based on failure patterns
- **Validation**: Re-run tests to verify fixes are effective

**Safety Considerations:**
- **Non-Breaking Changes**: Only apply fixes that won't break existing functionality
- **Backup Creation**: Preserve original code before applying fixes
- **Review Recommendations**: Flag complex fixes for manual review
- **Rollback Capability**: Provide easy rollback options for applied fixes

***

### Phase 5: Quality Assurance & Continuous Improvement

**Objective:** Execute comprehensive quality checks and establish continuous improvement processes

**Key Activities:**
- **Quality Metrics Calculation**: Generate overall quality scores and health indicators
- **Trend Analysis**: Compare current results with historical data
- **Improvement Planning**: Identify areas for test suite enhancement
- **Process Optimization**: Suggest workflow improvements and automation opportunities

**Quality Assurance Dimensions:**

**Test Suite Health:**
- **Coverage Trends**: Monitor coverage improvements over time
- **Failure Rates**: Track test reliability and flakiness
- **Execution Time**: Analyze performance and identify slowdowns
- **Maintenance Burden**: Assess test code quality and upkeep requirements

**Code Quality Integration:**
- **Static Analysis**: Integrate with linting and code quality tools
- **Security Scanning**: Include security vulnerability checks
- **Performance Monitoring**: Track application performance metrics
- **Documentation Coverage**: Ensure test documentation completeness

**Continuous Improvement Strategies:**

**Test Suite Evolution:**
- **Gap Analysis**: Identify missing test scenarios and edge cases
- **Refactoring Opportunities**: Suggest test code improvements
- **Technology Updates**: Recommend framework or tool upgrades
- **Best Practice Adoption**: Implement industry testing standards

**Process Optimization:**
- **Automation Enhancement**: Increase test automation coverage
- **Feedback Loop Improvement**: Speed up failure diagnosis and resolution
- **Resource Optimization**: Improve test execution efficiency
- **Team Productivity**: Enhance developer experience with testing tools

**Reporting & Communication:**
- **Stakeholder Updates**: Provide clear status reports for different audiences
- **Trend Visualization**: Create dashboards for long-term monitoring
- **Alert Systems**: Implement notifications for quality regressions
- **Knowledge Sharing**: Document lessons learned and best practices

**Adaptation Strategies:**
- **Project Scaling**: Adjust processes for growing codebases and teams
- **Technology Changes**: Adapt to new frameworks and language features
- **Regulatory Requirements**: Meet industry standards and compliance needs
- **Team Dynamics**: Support different team sizes and experience levels

## Command Usage Examples

**Basic test execution:**
```bash
/test
# Comprehensive test suite execution with intelligent analysis
```

**Coverage-focused testing:**
```bash
/test --coverage
# Detailed coverage analysis with gap identification
```

**Development workflow:**
```bash
/test --watch
# Continuous testing during development
```

**CI/CD integration:**
```bash
/test --parallel --coverage
# Optimized for automated environments
```

**Framework-specific execution:**
```bash
/test --framework jest --language typescript
# Explicit framework specification when needed
```

## Integration & Automation

**Development Workflow Integration:**
- Pre-commit hooks for test validation
- IDE integration for test running and debugging
- Code review integration for test coverage checks

**CI/CD Pipeline Integration:**
- Parallel test execution across multiple agents
- Coverage reporting to external services
- Quality gate enforcement with configurable thresholds

**Team Collaboration Features:**
- Test result sharing and discussion
- Automated assignment of failing test fixes
- Knowledge base integration for common issues

This comprehensive testing approach adapts to project needs while maintaining high quality standards and providing actionable insights for continuous improvement.
