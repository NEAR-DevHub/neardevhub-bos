#!/bin/bash
npm run build:preview -- -a devgovgigs.petersalomonsen.near -c devhub.near
(cd build && bos components deploy devgovgigs.petersalomonsen.near sign-as devgovgigs.petersalomonsen.near network-config mainnet sign-with-access-key-file /home/codespace/devgovgigs.petersalomonsen.near.json send)

