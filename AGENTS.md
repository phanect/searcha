# AI Guidelines for Searcha

This document provides context for AI coding agents working on the Searcha monorepo.

## Quick Start

**What is Searcha?**

- A TypeScript monorepo (pnpm workspace) with 5 packages
- Makes data lists searchable
- Uses React 19.x, Node.js 24.x, TypeScript 5.x

**Key Files:**

- `package.json` - Root workspace config
- `pnpm-workspace.yaml` - Workspace definition
- `tsconfig.json` - Root TypeScript config
- `eslint.config.ts` - Linting rules

## Project Packages

1. **backend** - Node.js server with Firebase
2. **form-builder** - Reusable React form component
3. **frontend** - Main React web application
4. **multiselect** - Reusable multiselect component
5. **use-memo-value** - React hooks utility

## Essential Rules

### ✅ DO:

- Use TypeScript for all new code
- Write functional React components
- Use explicit type annotations
- Run eslint after changes
- Check for usages before modifying exports

### ❌ DON'T:

- Use `any` types
- Modify `pnpm-lock.yaml` directly
- Modify files listed in .gitignore
- Touch `firebaseConfig.ts` without credentials
- Create plain JavaScript files
- Hardcode secrets/credentials

## Code Patterns

### Function Declaration

```typescript
export const myFunction = (param: string): boolean => {
  return param.length > 0;
};
```

### React Component

```typescript
interface MyComponentProps {
  title: string;
  onSubmit?: (value: string) => void;
}

export const MyComponent = ({ title, onSubmit }: MyComponentProps) => {
  // Component body
};
```

### Type Definition

```typescript
// In types.ts or component.ts
export interface MyType {
  id: string;
  name: string;
}

export type MyUnion = 'option1' | 'option2';
```

## When Implementing Features

1. **Check the package** - Which package owns this code?
2. **Review types** - Look at `types.ts` in the same package
3. **Find similar patterns** - See how the codebase does this
4. **Update imports** - Ensure all files are properly imported
5. **Test types** - Verify TypeScript compiles

## Monorepo Patterns

### Importing within workspace

```typescript
// From same package
import { utils } from '../utils';

// From another package (if in dependencies)
import { FormComponent } from '@phanect/searcha-form-builder';
```

### Package dependencies

- Each package has its own `package.json`
- Add dependencies with: `pnpm add <pkg> --filter=<package-name>`

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Type errors in IDE | Run `pnpm exec tsc --noEmit` |
| ESLint warnings | Run `pnpm exec eslint --fix`, or if it does not fix the warnings, check `eslint.config.ts` and fix style issues |
| Import not found | Verify package is in dependencies, use correct path |
| React version mismatch | Ensure using React 19.x patterns |

## File Structure Reference

```
projects/
├── backend/
│   └── src/
│       ├── firebaseConfig.ts (⚠️ sensitive)
│       ├── index.ts
│       ├── types/
│       └── [features]/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── types/
│       └── utils/
│
├── form-builder/
│   └── src/
│       ├── Form.tsx (core)
│       ├── Fields/
│       └── types.ts
│
├── multiselect/
│   └── src/
│       ├── MultiSelect.tsx (core)
│       └── components/
│
└── use-memo-value/
    └── src/
```

## Tips for Better Code

1. **Type First**: Define types before implementation
2. **Export Public APIs**: Clear distinction between public and private code
3. **Consistent Naming**: PascalCase for components, camelCase for functions
4. **Comments for Why**: Explain non-obvious decisions
5. **Keep Components Small**: Single responsibility principle

## Testing Your Changes

```bash
# Check types across monorepo
pnpm exec tsc --noEmit

# Run linter
pnpm exec eslint

# Check specific package
cd projects/frontend && pnpm exec tsc --noEmit
```

## Need Help?

- Consult `AGENTS.md` for detailed guidelines
- Check existing code for patterns
- Review `README.md` in each package
- Look at similar implementations first

---

**Remember**: TypeScript strict mode, ESLint compliance, and clear types make better code.
