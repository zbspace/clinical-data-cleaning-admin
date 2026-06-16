#!/bin/bash
npx --yes create-vite@latest vite-project --template react-ts
cp -r vite-project/* .
cp -r vite-project/.[!.]* .
rm -rf vite-project
