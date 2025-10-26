#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Setting up Jules integration..."

# 1. Create the 'jules' label if it doesn't exist
echo "Creating 'jules' GitHub label..."
# Check if the label already exists to avoid errors
if ! gh label view jules &>/dev/null; then
  gh label create jules --description "Trigger Jules" --color "7057ff"
  echo "'jules' label created successfully."
else
  echo "'jules' label already exists. Skipping creation."
fi

echo "✅ Jules setup script completed."
echo "
Next steps:
1. Go to your repository's Settings > Secrets and variables > Actions
2. Click New repository secret
3. Name: JULES_API_KEY, Value: your Jules API key
4. (Optional) Customize Jules behavior by editing .github/jules-config.yml
"
