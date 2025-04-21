# Frontend Linting Setup

This project uses ESLint, Prettier, Husky, and lint-staged to ensure code quality and consistency.

## Pre-commit Hooks

We've set up pre-commit hooks that automatically run linting and formatting on your code before you commit. This helps catch issues early and ensures consistent code style across the project.

### How it works

1. When you try to commit your changes, Husky will trigger the pre-commit hook.
2. The pre-commit hook runs lint-staged, which will:
   - Run ESLint on your staged TypeScript and TSX files
   - Run Prettier to format your code
3. If there are any linting errors that can't be automatically fixed, the commit will be blocked.

## Setup Instructions

After cloning the repository, run:

```bash
cd MainProject/MtdrSpring/backend/src/main/frontend
npm install
npm run prepare
```

This will install the necessary dependencies and set up the Husky hooks.

## Manual Linting

You can also run the linter manually:

```bash
# Run ESLint with auto-fix
npm run lint

# Run lint-staged manually (only on staged files)
npm run lint-staged
```

## Common TypeScript Errors

If you're seeing TypeScript errors similar to these that are blocking the CI/CD pipeline:

```
error TS6133: 'statusInfo' is declared but its value is never read.
error TS2322: Type '{ label: ReactNode; color: string; bgcolor: string; }' is not assignable to type 'ReactNode'.
```

You can fix them by:

1. Removing unused variables or commenting them out
2. Fixing type errors by using correct type annotations
3. Using `as any` type casting as a temporary solution (not recommended for long-term)

## Disabling Rules

If you need to temporarily disable a linting rule, you can use ESLint comments:

```typescript
// eslint-disable-next-line no-unused-vars
const unusedVariable = 'This variable is unused but needed';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Code with any types
/* eslint-enable @typescript-eslint/no-explicit-any */
``` 