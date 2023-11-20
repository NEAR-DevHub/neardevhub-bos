#!/bin/bash

# Function to check if a command is available
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if bos-loader is installed
if ! command_exists bos-loader; then
    # Install bos-loader
    echo "bos-loader is not installed. Installing..."
    curl --proto '=https' --tlsv1.2 -LsSf https://github.com/mpeterdev/bos-loader/releases/download/v0.7.1/bos-loader-v0.7.1-installer.sh | sh
fi

ACCOUNT_ID="devhub.near"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -a|--account)
            ACCOUNT_ID="$2"   
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run bos-loader with updated replacements
~/.cargo/bin/bos-loader "$ACCOUNT_ID" --path build/src
