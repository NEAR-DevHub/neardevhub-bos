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

# Check if sed is installed
if ! command_exists sed; then
  echo "sed is not installed. Installing..."
  sudo apt-get update
  sudo apt-get install -y sed
fi

# Check if bos is installed
if ! command_exists bos; then
    # Install bos
    echo "bos-cli is not installed. Installing..."
    curl --proto '=https' --tlsv1.2 -LsSf https://github.com/FroVolod/bos-cli-rs/releases/download/v0.3.1/bos-cli-v0.3.1-installer.sh | sh
fi

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
        -s|--signer)
            SIGNER_ID="$2"
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

# Check if account is provided
if [[ -z "$ACCOUNT_ID" ]]; then
    echo "Error: Account is not provided. Please provide the account to deploy the widgets to."
    exit 1
fi

if [[ -z "$SIGNER_ID" ]]; then
    SIGNER_ID="$ACCOUNT_ID"
fi

# Check if network is provided but not contract
if [[ "$NETWORK_ENV" == "testnet" && -z "$CONTRACT_ID" ]]; then
    echo "Error: Network is set to testnet but no contract is provided. Please specify a contract to use with testnet."
    exit 1
fi

# Update the value in replacements.json
REPLACEMENTS_JSON="replacements.$NETWORK_ENV.json"

if [ -f "$REPLACEMENTS_JSON" ]; then
    # Replace the value in the JSON file

     jq --arg ACCOUNT_ID "$ACCOUNT_ID" --arg CONTRACT_ID "$CONTRACT_ID" ".[\"$CREATOR_REPL\"] = \"$ACCOUNT_ID\" | .[\"$CONTRACT_REPL\"] = \"$CONTRACT_ID\"" "$REPLACEMENTS_JSON" > "$REPLACEMENTS_JSON.tmp"
else
    echo "Error: $REPLACEMENTS_JSON file not found."
    exit 1
fi

# Read the content of the .tmp file
REPLACEMENTS=$(cat "$REPLACEMENTS_JSON.tmp")

# Extract all keys (placeholders to be replaced)
keys=$(echo "$REPLACEMENTS" | jq -r 'keys[]')

# Use find to get all .jsx files
FILES=$(find src -type f -name "*.jsx")

echo "Building widgets..."

# If the build directory exists, delete it
if [ -d "build" ]; then
    rm -rf build
fi

# Iterate over each .jsx file
for file in $FILES
do
    # Create corresponding directory structure in build/src folder
    mkdir -p "build/$(dirname "$file")"

    # Define the output path
    outfile="build/$file"
    cp "$file" "$outfile"  # initialize outfile with the original file content
done

echo "Making replacements..."

# Iterate over each .jsx file again for replacements
for file in $FILES
do
    outfile="build/$file"
    # Iterate over each key to get the replacement value
    for key in $keys; do
        replace=$(jq -r ".[\"$key\"]" "$REPLACEMENTS_JSON.tmp")

        search="\${$key}"

        sed -i "" "s|$search|$replace|g" "$outfile"
    done
done

cd build

# Run bos-loader with updated replacements
~/.cargo/bin/bos components deploy "${ACCOUNT_ID}" sign-as "${SIGNER_ID}"
