# Developer Guide

Internal architecture, conventions, and implementation details for `@study-lenses/embody` contributors.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Codebase Conventions](#codebase-conventions)
- [Directory Structure](#directory-structure)
- [Key Design Patterns](#key-design-patterns)
- [Implementation Status](#implementation-status)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Performance Considerations](#performance-considerations)

## Architecture Overview

### Core Pipeline

The tracer follows a strict linear pipeline architecture:

```
Input → fillConfig → instrument → record → trace → filterSteps → Output
```

Each stage:
1. Receives an object with specific keys
2. Processes its responsibility
3. Adds new data while preserving input
4. Returns enriched object for next stage

### Technology Stack

- **Instrumentation**: Aran framework for AST-based code transformation
- **Parser**: Acorn for JavaScript parsing
- **Runtime**: Node.js with ES modules
- **Testing**: Jest with extensive test cases
- **Types**: JSDoc annotations with TypeScript checking

## Codebase Conventions

### 1. Default Export Convention

**CRITICAL**: All internal files use default-only exports. Only `/src/index.ts` provides multiple exports.

```javascript
// ✅ CORRECT - Internal file
export default function myFunction() { ... }

// ❌ WRONG - Internal file with named export
export function myFunction() { ... }
export default myFunction;

// ✅ EXCEPTION - Only in /src/index.ts
export { default as embody } from './embody';
export const internals = { ... };
```

**Rationale**:
- Clear module boundaries
- Better tree-shaking
- Easier testing and mocking
- Predictable import patterns
- File name indicates exported function

### 2. Object-Threading Pattern

Functions accept and return objects with predetermined keys:

```javascript
// Input object with known keys
const input = { code: 'let x = 5', config: expandedConfig };

// Function adds new keys while preserving input
const output = instrument(input);
// Returns: { code, config, instrumented }
```

**Benefits**:
- Explicit data flow
- Easy debugging (inspect objects between stages)
- Composable pipeline stages
- No hidden state

### 3. Pure Functional Approach

- No mutations - always return new objects
- No side effects in core functions
- State passed explicitly through parameters
- Deterministic behavior for testing

### 4. Error Handling Strategy

```javascript
// Graceful degradation for config errors
if (invalidConfig) {
  console.warn('Invalid config value, using default');
  return defaultValue;
}

// Fail fast for critical errors
if (!code) {
  throw new Error('Code is required for instrumentation');
}
```

## Directory Structure

```
/src/
├── index.ts                 # Public API (only file with named exports)
├── embody.ts               # Main entry point with currying
├── squint.ts               # Post-processing filter
├── types/
│   ├── api.ts              # Public TypeScript types
│   └── internal.ts         # Internal type definitions
├── exports/                # Pipeline stages (all default exports)
│   ├── fill-config.ts      # Config normalization
│   ├── instrument.ts       # Code transformation
│   ├── record.ts           # Execution and trace collection
│   ├── trace.ts            # Pipeline orchestrator
│   └── filter-steps.ts     # Post-processing
├── config/                 # Configuration system
│   ├── index.ts            # Config creation and expansion
│   ├── types.ts            # Config TypeScript types
│   ├── defaults/           # Default configurations
│   └── presets/            # Educational presets
├── instrument/             # Aran integration
│   ├── index.ts            # Main instrumentation logic
│   ├── advice/             # Advice functions for trace points
│   └── transform/          # AST transformations
├── record/                 # Execution engine
│   ├── index.ts            # Execution orchestration
│   ├── sandbox.ts          # Isolated execution environment
│   └── collectors/         # Trace event collectors
└── utils/                  # Shared utilities
    ├── deep-clone.ts       # Object cloning
    ├── deep-merge.ts       # Config merging
    └── serialize.ts        # Value serialization
```

Each directory contains its own README.md with specific implementation details.

## Key Design Patterns

### 1. EMPTY Symbol for Currying

Internal implementation detail enabling symmetric partial application:

```javascript
const EMPTY = Symbol('empty');

function embody(input) {
  const code = input.code ?? EMPTY;
  const config = input.config ?? EMPTY;

  if (code === EMPTY) return (next) => embody({ ...next, config });
  if (config === EMPTY) return (next) => embody({ code, ...next });
  // Both provided - execute
}
```

**Important**: EMPTY is never exposed in public API - it's purely internal.

### 2. Config Expansion Strategy

User config → Preset application → Deep merge → Expanded config

```javascript
// User provides shorthand
{ variables: true }

// Expands to full structure
{
  variables: {
    declare: { var: true, let: true, const: true },
    assign: true,
    read: true,
    filter: []
  }
}
```

### 3. Trace Event Structure

Consistent event format across all trace types:

```javascript
{
  type: 'variable.declare',
  name: 'counter',
  value: 0,
  scope: 'function:calculateSum',
  location: { line: 5, column: 8 },
  sequence: 42,
  timestamp: 1234567890
}
```

## Implementation Status

### ✅ Completed

- Configuration system with presets
- Public API with currying
- TypeScript type definitions
- Basic project structure

### 🚧 In Progress

- Aran integration for instrumentation
- Advice functions for trace collection
- Execution sandbox

### 📋 Planned

- Async/await support (v2.0)
- Performance optimizations
- Streaming API for large traces
- Browser compatibility

### Current Stubs

These functions currently return mock data:

- `instrument()` - Returns `{ ...input, instrumented: 'TODO' }`
- `record()` - Returns `{ ...input, steps: [] }`
- `filterSteps()` - Returns `{ steps: input.steps, config: input.config }`

## Development Workflow

### 1. Setup

```bash
npm install
npm run test:watch  # Run tests in watch mode
```

### 2. Making Changes

1. Create feature branch
2. Update relevant default export function
3. Add/update tests
4. Update types in `/src/types/`
5. Run quality checks:
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

### 3. Adding New Pipeline Stage

1. Create file in `/src/exports/`
2. Use default export pattern
3. Follow object-threading:
   ```javascript
   export default function newStage(input) {
     const { existingData, config } = input;
     const newData = process(existingData, config);
     return { ...input, newData };
   }
   ```
4. Add types to `/src/types/api.ts`
5. Wire into pipeline in `trace.ts`

### 4. Conventions Checklist

- [ ] File uses `export default function`
- [ ] Function preserves input object
- [ ] Types added to api.ts
- [ ] Tests cover happy path and edge cases
- [ ] No mutations of input data
- [ ] Errors handled gracefully

## Testing Strategy

### Unit Tests

Each exported function has dedicated test file:

```javascript
// /src/exports/fill-config.test.js
import fillConfig from './fill-config';

test('expands boolean shorthand', () => {
  const result = fillConfig({ config: { variables: true } });
  expect(result.config.variables.declare).toBeDefined();
});
```

### Integration Tests

Pipeline tests in `/tests/integration/`:

```javascript
test('full pipeline execution', () => {
  const result = embody({
    code: 'let x = 5',
    config: { preset: 'detailed' }
  });
  expect(result.steps).toContainEqual(
    expect.objectContaining({ type: 'variable.declare' })
  );
});
```

### Test Cases

Reference implementations in `/tests/cases/`:
- Each case includes: `program.js`, `config.js`, `trace.js`
- Used to verify trace accuracy
- Covers edge cases and language features

## Performance Considerations

### Memory Management

- Trace size limits via `config.limits.maxSteps`
- Streaming API planned for v2.0
- WeakMap for object tagging

### Optimization Strategies

1. **Config caching**: Reuse expanded configs via currying
2. **Lazy evaluation**: Don't process disabled features
3. **Sampling**: Configurable sampling rates for hot paths

### Benchmarks

Run performance tests:

```bash
npm run bench
```

Target metrics:
- < 10x execution slowdown for detailed tracing
- < 5MB memory for 10,000 trace events
- < 100ms config expansion

## Code Quality Tools

### ESLint Configuration

Enforces conventions:

```javascript
// .eslintrc.js
{
  rules: {
    'import/no-default-export': 'off',
    'import/prefer-default-export': 'error',
    'no-param-reassign': 'error',
    'functional/immutable-data': 'warn'
  }
}
```

### Pre-commit Hooks

Using Husky + lint-staged:

```bash
npm run lint-staged  # Runs on staged files
```

### Type Checking

```bash
npm run type-check  # TypeScript validation of JSDoc
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code of conduct
- Pull request process
- Issue templates
- Community guidelines

## Questions?

- Check subdirectory READMEs for component-specific details
- Review test cases for usage examples
- Open an issue for clarification
- See CLAUDE.md for AI assistant context