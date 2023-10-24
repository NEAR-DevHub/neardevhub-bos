#!/bin/bash

# Function to check if a command is available
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if jq is installed
if ! command_exists jq; then
  echo "jq is not installed. Installing..."
  sudo apt-get update
  sudo apt-get install -y jq
fi

# Check if bos-loader is installed
if ! command_exists bos-loader; then
    # Install bos-loader
    echo "bos-loader is not installed. Installing..."
    curl --proto '=https' --tlsv1.2 -LsSf https://github.com/mpeterdev/bos-loader/releases/download/v0.7.1/bos-loader-v0.7.1-installer.sh | sh
fi

# Define default values
ACCOUNT_ID="devgovgigs.near"
CONTRACT_ID="devgovgigs.near"
NETWORK_ENV="mainnet"
CREATOR_REPL="REPL_DEVHUB"
CONTRACT_REPL="REPL_DEVHUB_CONTRACT"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -a|--account)
            ACCOUNT_ID="$2"
            shift
            shift
            ;;
        -c|--contract)
            CONTRACT_ID="$2"
            shift
            shift
            ;;
        -n|--network)
            NETWORK_ENV="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Convert NETWORK_ENV to lowercase
NETWORK_ENV=$(echo "$NETWORK_ENV" | tr '[:upper:]' '[:lower:]')

echo "NETWORK_ENV: $NETWORK_ENV"

# Update the value in replacements.json
REPLACEMENTS_JSON="replacements.$NETWORK_ENV.json"

if [ -f "$REPLACEMENTS_JSON" ]; then
    # Replace the value in the JSON file

     jq --arg ACCOUNT_ID "$ACCOUNT_ID" --arg CONTRACT_ID "$CONTRACT_ID" ".[\"$CREATOR_REPL\"] = \"$ACCOUNT_ID\" | .[\"$CONTRACT_REPL\"] = \"$CONTRACT_ID\"" "$REPLACEMENTS_JSON" > "$REPLACEMENTS_JSON.tmp"
else
    echo "Error: $REPLACEMENTS_JSON file not found."
    exit 1
fi

# Run bos-loader with updated replacements
~/.cargo/bin/bos-loader "$ACCOUNT_ID" --path src -r "$REPLACEMENTS_JSON.tmp"
