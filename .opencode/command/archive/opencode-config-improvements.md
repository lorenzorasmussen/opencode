# Improvements for opencode-agent-configurator (to be renamed "opencode-config")

## Current Functionality
The opencode-agent-configurator agent sorts .md files into "agent" and "command" directories based on their YAML headers:
- Files with `mode:` field → "agent" directory
- Files with `agent:` field → "command" directory
- Files with neither → remain in original directory

## Proposed Improvements

### 1. Rename Agent
- Rename from "opencode-agent-configurator" to "opencode-config" for brevity

### 2. Enhanced Logic

#### 2.1 Content-Based Classification
When YAML headers don't have the required fields, the agent should analyze the content:
- Files containing "You are the [Name] agent" → classify as agent with appropriate mode
- Files describing utility functions → classify as command with appropriate agent
- Documentation about agent functionality → likely an agent file
- Documentation about command usage → likely a command file

#### 2.2 Decision Framework
- **Agent files** (`mode:` field): Autonomous entities with decision-making capabilities
- **Command files** (`agent:` field): Action-oriented utilities executed by other agents

#### 2.3 Interactive Classification
- For ambiguous files, provide options for user confirmation
- Show file content preview before making classification decisions
- Allow user to override automatic classifications

### 3. Better Insights

#### 3.1 Classification Confidence Levels
- **High confidence**: Clear YAML header fields
- **Medium confidence**: Clear content indicators
- **Low confidence**: Requires manual review

#### 3.2 Quality Assurance
- Validate that all files are properly classified after sorting
- Provide summary statistics of classification results
- Flag files that remain unclassified in the root directory

#### 3.3 Consistency Checks
- Ensure consistent naming conventions across classified files
- Verify that agent and command directories have appropriate content
- Check for potential misclassifications

### 4. Additional Capabilities

#### 4.1 Batch Operations
- Process multiple directories at once
- Handle large codebases efficiently

#### 4.2 Reversion Capability
- Option to undo classification if needed
- Maintain backup of original file positions

#### 4.3 Reporting
- Generate detailed reports of classification decisions
- Show before/after directory structure
- Highlight any files that required manual intervention

### 5. Usage Examples

#### Basic Sorting
```
/opencode-config --sort --directory [path]
```

#### Detailed Classification with Reporting
```
/opencode-config --sort --analyze --report --directory [path]
```

#### Interactive Mode
```
/opencode-config --sort --interactive --directory [path]
```

### 6. Key Insights for Better Performance

1. **Agent vs Command Distinction**:
   - Agents have autonomous behavior and decision-making capabilities (defined by `mode:`)
   - Commands are action-oriented utilities executed by other agents (defined by `agent:`)

2. **Directory Structure**:
   - agent/: For autonomous agents with decision-making capabilities
   - command/: For utility commands and action-oriented tools
   - root/: Should have minimal files after classification

3. **Classification Accuracy**:
   - Prioritize content analysis when YAML headers are insufficient
   - Use pattern matching for common agent/command indicators
   - Maintain consistency across similar file types