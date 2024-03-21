#!/bin/bash
echo "This is an example script for deploying a preview environment. Please adjust with your own accounts for widget and contract"

echo "Building preview"
npm run build:preview -- -a devgovgigs.petersalomonsen.near -c truedove38.near

echo "Deploying"
(cd build && bos components deploy devgovgigs.petersalomonsen.near sign-as devgovgigs.petersalomonsen.near network-config mainnet sign-with-access-key-file /home/codespace/devgovgigs.petersalomonsen.near.json send)
