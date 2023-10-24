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
NETWORK_ENV="testnet"
CREATOR_REPL="REPL_DEVHUB"
CONTRACT_REPL="REPL_DEVHUB_CONTRACT"
REPLACE_ACCOUNT=false
REPLACE_CONTRACT=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -a|--account)
            ACCOUNT_ID="$2"
            REPLACE_ACCOUNT=true
            shift
            shift
            ;;
        -c|--contract)
            CONTRACT_ID="$2"
            REPLACE_CONTRACT=true
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
    # Copy the content of the original JSON file to a temp one
    cp "$REPLACEMENTS_JSON" "$REPLACEMENTS_JSON.tmp"

    # If ACCOUNT_ID is not provided as an argument, get it from the replacements file
    if [ "$REPLACE_ACCOUNT" != true ]; then
        ACCOUNT_ID=$(jq -r ".[\"$CREATOR_REPL\"]" "$REPLACEMENTS_JSON")
    fi

    # Replace the value in the JSON file only if the arguments are provided
    if [ "$REPLACE_ACCOUNT" = true ]; then
        jq --arg ACCOUNT_ID "$ACCOUNT_ID" ".[\"$CREATOR_REPL\"] = \"$ACCOUNT_ID\"" "$REPLACEMENTS_JSON.tmp" > temp.json && mv temp.json "$REPLACEMENTS_JSON.tmp"
    fi

    if [ "$REPLACE_CONTRACT" = true ]; then
        jq --arg CONTRACT_ID "$CONTRACT_ID" ".[\"$CONTRACT_REPL\"] = \"$CONTRACT_ID\"" "$REPLACEMENTS_JSON.tmp" > temp.json && mv temp.json "$REPLACEMENTS_JSON.tmp"
    fi
else
    echo "Error: $REPLACEMENTS_JSON file not found."
    exit 1
fi

# Run bos-loader with updated replacements
~/.cargo/bin/bos-loader "$ACCOUNT_ID" --path src -r "$REPLACEMENTS_JSON.tmp"
