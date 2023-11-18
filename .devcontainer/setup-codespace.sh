#!/bin/bash
set -e

npm install
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/mpeterdev/bos-loader/releases/download/v0.7.1/bos-loader-v0.7.1-installer.sh | sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/FroVolod/bos-cli-rs/releases/download/v0.3.1/bos-cli-v0.3.1-installer.sh | sh
npx playwright install-deps
npx playwright install
