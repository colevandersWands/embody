# Developing a Language Tracer

Guide for creating new language tracers as npm workspaces within embody.

## Workspace Setup

### 1. Create Directory Structure

```
src/tracers/<tracer-id>/
├── index.ts               # Barrel: re-exports all pieces as named exports
├── tracer-id.ts           # Tracer ID constant (e.g. 'my-tracer')
├── package.json           # Workspace package
├── tsconfig.json          # Extends root tsconfig
├── record.ts              # Main entry point
├── types.ts               # Options and step types
├── options.schema.json    # JSON Schema for options
├── verify-options.ts      # Semantic validation (optional)
├── README.md              # Overview, quick start, config options
├── DOCS.md                # API reference (optional)
├── DEV.md                 # Development guide (optional)
└── tests/
    └── record.test.ts     # Integration tests
```

### 2. Add to Root Workspaces

In root `package.json`:

```json
{
  "workspaces": ["src/tracers/<tracer-id>"]
}
```

### 3. Create Workspace package.json

```json
{
  "name": "@study-lenses/embody-tracer-<tracer-id>",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/record.js",
  "types": "./dist/record.d.ts",
  "exports": {
    ".": {
      "import": "./dist/record.js",
      "types": "./dist/record.d.ts"
    }
  },
  "peerDependencies": {
    "@study-lenses/embody": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "@study-lenses/embody": {
      "optional": true
    }
  }
}
```

### 4. Create tsconfig.json

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": ["./**/*.ts"],
  "exclude": ["dist", "node_modules"]
}
```

## Linting

### Default: Repo-Linted

By default, tracer subdirectories inherit all repository-level ESLint rules (functional style, naming, imports, module boundaries, etc.). Prettier formatting and TypeScript type-checking also apply to all tracers.

This means:

- `npm run lint` checks your tracer's files
- `npm run format` formats your tracer's files
- Pre-commit hooks enforce lint + format on staged files
- `npm run type-check` validates your tracer's types

### Opting Out of ESLint

If your tracer needs conventions that conflict with the repo's ESLint rules, you can opt out by adding your tracer to the global `ignores` array in the root [eslint.config.js](../../eslint.config.js):

```javascript
{
  ignores: [
    'dist/',
    'node_modules/',
    '**/*.d.ts',
    // Tracer sub-projects that manage their own linting.
    'src/tracers/js-klve/**',
    'src/tracers/your-tracer/**',  // ← add your tracer here
  ],
},
```

After opting out:

- `npm run lint` skips your tracer's files
- Pre-commit ESLint hooks skip your tracer's files
- **Prettier still applies** — formatting consistency reduces diff noise across the repo
- **TypeScript type-checking still applies** — types are the contract between tracers and the API layer

You may optionally bring your own `eslint.config.js` inside your tracer directory for local linting.

### When to Opt Out

- Your tracer wraps a library with conventions that conflict with repo rules (e.g., `this` required by Aran's aspect-oriented API)
- You're an external contributor with established conventions
- Your tracer is experimental and churn would trigger too many lint fixes

### When to Stay Opted In

- Your tracer is maintained by the core team (e.g., `chars`)
- You want the guardrails (functional style, naming, complexity limits)
- Your tracer follows the same patterns as the rest of the codebase

### Current Status

| Tracer    | ESLint    | Prettier | TypeScript | Notes                           |
| --------- | --------- | -------- | ---------- | ------------------------------- |
| `chars`   | repo      | repo     | repo       | Reference tracer, core team     |
| `js-klve` | opted out | repo     | repo       | Aran/Babel require own patterns |

## Required Files

### record.ts

Main entry point with signature matching `/tracers` convention:

```typescript
import type { MetaConfig } from '../types.js';
import type { MyTracerOptions, MyTracerStep } from './types.js';

async function record(
  code: string,
  config: { readonly meta: MetaConfig; readonly options: MyTracerOptions },
): Promise<readonly MyTracerStep[]> {
  const { meta, options } = config;

  // 1. Parse/trace the code
  // 2. Check limits from meta
  // 3. Apply options filtering
  // 4. Return steps (1-indexed)

  return steps;
}

export default record;
```

**Contract:**

- Receives FULLY FILLED config from `/configuring` — never partial
- Returns `Promise<readonly Step[]>` (async for consistency)
- Step numbers are 1-indexed
- Throws: `ParseError`, `RuntimeError`, `LimitExceededError`

### types.ts

Define options and step types:

```typescript
export type MyTracerOptions = {
  readonly filter?: {
    // Options that map to trace behavior
  };
};

export type MyTracerStep = {
  readonly step: number; // 1-indexed
  readonly category: string;
  // ... other step fields
};
```

### options.schema.json

JSON Schema for options validation with defaults:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "filter": {
      "type": "object",
      "properties": {
        // Define filter options with defaults
      },
      "default": {}
    }
  },
  "additionalProperties": false
}
```

## Config-to-Trace Alignment

**Critical principle:** Options must ONLY include features the tracer actually traces.

### Audit Your Tracer

Before finalizing options:

1. Run tracer on sample code
2. Collect all unique output fields/types
3. Map config options 1-to-1 with trace output
4. Remove any config options for untraced features

Example audit script:

```typescript
const steps = await trace(`
  let x = 1;
  for (let i = 0; i < 2; i++) { x += i; }
  console.log(x);
`);

const types = new Set(steps.map((s) => s.type).filter(Boolean));
console.log([...types].sort());
```

### Why This Matters

If config includes options for features that aren't traced:

- Users expect behavior that doesn't exist
- Pedagogically harmful — misleading about what the tracer can show
- Wastes cognitive load on useless options

## Wiring Into Registry

### 1. Create per-tracer barrel (`index.ts`)

Each tracer directory gets a barrel that re-exports its default exports as named exports. This is a **scoped exception** to the "no barrel files" convention — tracers are plugin-like modules with a fixed contract, so barrels enforce that contract and keep the registry clean.

```typescript
// src/tracers/my-tracer/index.ts
export { default as tracerId } from './tracer-id.js';
export { default as record } from './record.js';
export { default as optionsSchema } from './options.schema.json';
// export { default as verifyOptions } from './verify-options.js'; // if applicable
```

### 2. Add to registry (`src/tracers/index.ts`)

The registry file imports each tracer's barrel as a namespace and builds the lookup:

```typescript
import * as myTracer from './my-tracer/index.js';

// Add to named re-exports
export { myTracer };

// Add to registry (default export)
const tracers: Record<string, TracerEntry> = {
  // ... existing entries
  [myTracer.tracerId]: {
    record: myTracer.record as TracerEntry['record'],
    optionsSchema: myTracer.optionsSchema,
  },
};
```

If your tracer has semantic validation (cross-field constraints):

```typescript
[myTracer.tracerId]: {
  record: myTracer.record as TracerEntry['record'],
  optionsSchema: myTracer.optionsSchema,
  verifyOptions: myTracer.verifyOptions as (options: unknown) => void,
},
```

## Error Handling

Use embody's error classes:

```typescript
import ParseError from '../../errors/parse-error.js';
import RuntimeError from '../../errors/runtime-error.js';
import LimitExceededError from '../../errors/limit-exceeded-error.js';

// Syntax errors
throw new ParseError('Unexpected token', { line: 1, column: 5 });

// Runtime errors
throw new RuntimeError('Division by zero', { line: 3, column: 0 });

// Limit exceeded
throw new LimitExceededError('Too many steps', 'steps', actualCount);
```

## Testing Checklist

```typescript
describe('record', () => {
  describe('basic tracing', () => {
    it('produces steps for simple code');
    it('assigns 1-indexed step numbers');
    it('includes required step fields');
  });

  describe('filtering', () => {
    it('respects filter options');
    it('excludes filtered node types');
  });

  describe('error handling', () => {
    it('throws ParseError for syntax errors');
    it('throws RuntimeError for runtime errors');
    it('throws LimitExceededError when exceeding meta.max.steps');
  });
});
```

## Documentation

### README.md Structure

1. Module name and one-line description
2. Credits/source (if adapted)
3. Exports table
4. Configuration overview (link to DOCS.md)
5. Output step structure
6. What gets traced
7. Limitations
8. Files table
9. Links to parent docs

### DOCS.md Structure

1. `record()` signature and parameters
2. Options type definitions
3. Step type definition
4. Config-to-behavior mapping table
5. Code examples
6. Error handling examples

## Browser Compatibility

If your tracer needs to run in browsers:

- Use browser-compatible dependencies (e.g., `@babel/standalone` instead of `@babel/core`)
- Avoid Node.js-specific modules (`fs`, `path`, etc.)
- Test in browser environment
- Document bundle size implications

## Checklist Before PR

- [ ] Workspace set up correctly (`npm install` from root works)
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] Tests pass (`npm test -- --testPathPatterns=<tracer-id>`)
- [ ] README.md follows repo conventions
- [ ] DOCS.md has complete API reference
- [ ] Config options map 1-to-1 with traced features
- [ ] Step numbers are 1-indexed
- [ ] Errors use embody error classes
- [ ] `index.ts` barrel re-exports all pieces
- [ ] `tracer-id.ts` defines unique tracer ID
- [ ] Wired into `tracers/index.ts` registry
