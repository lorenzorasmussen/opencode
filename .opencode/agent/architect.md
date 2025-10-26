---
description: "Specializes in architecture review, standards validation, and high-level system oversight"
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
---

Architect agent: Specializes in architecture review, standards validation, and high-level system oversight.
Separate from specifier to ensure context isolation.
