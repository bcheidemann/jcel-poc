#!/usr/bin/env bash

cd ./topsort || exit
npm install && npm run build

cd ../utils || exit
npm install && npm run build

cd ../poc || exit
npm install

clear

echo "Setup complete."
