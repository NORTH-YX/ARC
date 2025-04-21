#!/bin/bash

# Install dependencies
npm install

# Make Husky scripts executable
mkdir -p .husky
npm run prepare
chmod +x .husky/pre-commit

echo "Pre-commit hooks setup completed!"
echo "Now every time you commit, the linter will run automatically."
echo "To run linting manually, you can use: npm run lint" 