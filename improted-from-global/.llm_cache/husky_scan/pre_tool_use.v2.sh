#!/bin/bash
CMD="$1"
ARGS="$*"

# Block raw redirections
if [[ "$ARGS" == *">"* ]] && [[ "$CMD" == "cat" || "$CMD" == "echo" ]]; then
  echo "❌ Blocked raw redirection. Use 'llm-write'." >&2
  exit 1
fi

# Log command
RUN_ID="${LLM_RUN_ID:-adhoc}"
mkdir -p ".llm_runs/$RUN_ID"
echo "$(date -Iseconds) | EXEC | $CMD $ARGS" >> ".llm_runs/$RUN_ID/exec.log"