#!/bin/bash

# Loop through all .md files in the current directory
for file in *.md; do
  if [ -f "$file" ]; then
    # Extract the first 5 lines to check for YAML header
    first5lines=$(head -n 5 "$file")
    
    # Check if the file has an 'agent:' field in the YAML header (first 5 lines)
    if echo "$first5lines" | grep -q '^---$' && echo "$first5lines" | grep -q '^agent:'; then
      echo "Moving $file to command directory (has 'agent:' field)"
      mv "$file" command/
    # Check if the file has a 'mode:' field in the YAML header (first 5 lines)
    elif echo "$first5lines" | grep -q '^---$' && echo "$first5lines" | grep -q '^mode:'; then
      echo "Moving $file to agent directory (has 'mode:' field)"
      mv "$file" agent/
    else
      echo "Keeping $file in current directory (no 'agent:' or 'mode:' field)"
    fi
  fi
done

echo "Sorting complete!"