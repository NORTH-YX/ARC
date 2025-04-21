# Oracle JavaBot Frontend

This is the frontend application for Oracle JavaBot, built with React, TypeScript, and Vite.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview the production build:
```bash
npm run preview
```

## Project Structure

- `/src`: Source code
  - `/api`: API client and services
  - `/assets`: Static assets (images, etc.)
  - `/components`: Reusable UI components
  - `/contexts`: React contexts for state management
  - `/hooks`: Custom React hooks
  - `/interfaces`: TypeScript interfaces and types
  - `/layouts`: Page layout components
  - `/modules`: Feature-specific modules
  - `/utils`: Utility functions
  - `/views`: Page components

## Technologies

- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- React Query (TanStack Query)
- Styled Components
- Zustand (State Management)

## Proxy Configuration

The development server is configured to proxy API requests to `http://localhost:8080`.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Development Setup

### Prerequisites
- Node.js (version 20 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install
```

### Running the application
```bash
# Start development server
npm run dev
```

### Building for production
```bash
# Build the application
npm run build
```

## Code Quality

### Pre-commit Hooks

This project uses pre-commit hooks to ensure code quality and consistency. When you try to commit changes, ESLint and Prettier will automatically run on the staged files to check for issues and format your code.

To set up the pre-commit hooks:

```bash
# Quick setup
bash setup-hooks.sh

# Manual setup
npm install
npm run prepare
chmod +x .husky/pre-commit
```

### Linting

To manually run the linter:

```bash
# Run ESLint with auto-fix
npm run lint
```

For more details on linting, see [LINTING.md](./LINTING.md).
