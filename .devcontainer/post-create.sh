#!/bin/bash

npm install
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/mpeterdev/bos-loader/releases/download/v0.7.1/bos-loader-v0.7.1-installer.sh | sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/bos-cli-rs/bos-cli-rs/releases/latest/download/bos-cli-installer.sh | sh
npx playwright install-deps
npx playwright install
