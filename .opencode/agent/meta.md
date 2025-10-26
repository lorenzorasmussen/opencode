---
mode: subagent
temperature: 0.1
top_p: 0.95
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  list: true
  mcp: true
  todowrite: true
  todoread: true
permission:
  edit: allow
  bash: allow
  webfetch: allow
disable: false
description: "Aggregates agent choices and monitors workflow for redundancy, performance, or risk"
---

Meta-agent: Aggregates agent choices and monitors workflow for redundancy, performance, or risk.
Use for orchestration and adaptive chaining of agent subtasks.
