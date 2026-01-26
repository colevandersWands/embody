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
- **Runtime**: Node.js or modern browsers with ES modules
- **Testing**: Jest with extensive test cases
- **Types**: JSDoc annotations with TypeScript checking

## Codebase Conventions

> This codebase is designed to be accessible for first-time contributors and less experienced developers. Conventions prioritize
> learnability, debuggability, and consistency over brevity or "idiomatic JS."

### Conventions Summary

| Situation                     | Convention                                             |
| ----------------------------- | ------------------------------------------------------ |
| Non-trivial function          | Named `function` declaration                           |
| Inline callback (trivial)     | Arrow OK: `user => user.id`, `n => n > 0`              |
| Arrow assigned to variable    | **Not allowed** — use named `function` declaration     |
| Arrow with body block `{}`    | **Not allowed** — use named `function` declaration     |
| Callback (non-trivial)        | Extract as named `function`, pass by name              |
| Hoisting below call site      | Encouraged for readability                             |
| `this` keyword                | **Banned** (functional codebase)                       |
| Classes                       | **Banned** (use factory functions)                     |
| Mutable closures              | **Banned** (instrumentation exception, same as `this`) |
| Immutable closures            | OK (e.g. currying over cached config)                  |
| Method shorthand in objects   | Allowed (`{ process() {} }`)                           |
| Variable bindings             | Prefer `const`; `let` only when reassignment needed    |
| Export                        | Define first, `export default` at bottom               |
| Import paths                  | Always include `.js` extension                         |
| Multiple things from one file | Split into separate files                              |
| Destructured object params    | Default empty object: `{ ... } = {}`                   |
| Boolean functions             | Prefix with `is`/`has`/`can`/`should`                  |

### 1. Export Conventions

**CRITICAL**: All internal files use default-only exports with named-then-export pattern.

```javascript
// ✅ CORRECT - Named function, then export at bottom
function myFunction() { ... }

export default myFunction;

// ✅ CORRECT - Constants follow same pattern
const MY_CONSTANT = Symbol('description');

export default MY_CONSTANT;

// ❌ WRONG - Inline default export (poor tooling support)
export default function myFunction() { ... }

// ❌ WRONG - Named exports in internal files
export function myFunction() { ... }
```

**NO BARREL FILES**: Import directly from the source file. No internal `index.ts` re-exports.

```javascript
// ✅ CORRECT - Direct imports
import createConfig from './config/create.js';
import applyPreset from './config/apply-preset.js';

// ❌ WRONG - Barrel imports
import { createConfig, applyPreset } from './config/index.js';

// ✅ EXCEPTION - Public API only
import { embody, pipeline } from '@study-lenses/embody';
```

**Rationale**:

- Explicit dependency graph (no indirection)
- Better tree-shaking
- No circular dependency traps
- IDE "go to definition" works directly
- Tooling gets function names from declarations
- Simpler mental model for contributors

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

- No mutations — always return new objects
- No side effects in core functions
- State passed explicitly through parameters
- Deterministic behavior for testing
- Prefer `const`; use `let` only when reassignment is genuinely needed (loop counters, accumulators)

Enforced via `eslint-plugin-functional`:

| Rule                   | Setting | Rationale                                                                       |
| ---------------------- | ------- | ------------------------------------------------------------------------------- |
| `no-this-expressions`  | error   | Core convention, no exceptions in user code                                     |
| `no-classes`           | error   | Core convention, factory functions instead                                      |
| `immutable-data`       | warn    | Catches accidental mutations; warn lets learners see the issue without blocking |
| `prefer-readonly-type` | warn    | Good TypeScript hygiene; educational signal                                     |
| `no-let`               | off     | `const` preferred by convention, but `let` in loops and accumulators is fine    |
| `no-loop-statements`   | off     | `for...of` is more readable than recursion for learners                         |
| `no-mixed-types`       | off     | Object-threading naturally mixes data and function types                        |

See the [ESLint Configuration](#eslint-configuration) section for full rule definitions.

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

### 5. Function Conventions

Use **named `function` declarations** by default. Arrow functions (`=>`) are
allowed only as short, single-expression forms with implicit return — the kind
you can parse at a glance.

This is one rule with two faces, not a rule with an exception.

#### Arrow Functions: When They're Fine

Arrow functions are allowed **only** as anonymous inline callbacks when **all**
of these hold:

1. **Single expression** with implicit return (no `{` body block)
2. **At a glance** — you can read it without slowing down
3. **Inline as a callback** — not assigned to a variable

```javascript
// ✅ — trivial transforms and predicates, inline
users.map((user) => user.id);
items.filter((item) => item.enabled);
values.some((v) => v === null);
amounts.reduce((sum, n) => sum + n, 0);

// ✅ — simple compound expressions are fine
items.filter((item) => item.active && item.visible);
nodes.find((node) => node.type === 'call' || node.type === 'apply');
```

```javascript
// ❌ — not at a glance: too much logic for an inline arrow
items.filter((item) => item.status === 'active' && item.role === 'admin' && !item.suspended);

// ❌ — assigned to a variable: use a named function declaration
const extractId = (user) => user.id;

// ❌ — has a body block: use a named function declaration
const process = (config) => {
  const expanded = expandShorthand(config);
  return applyPreset(expanded);
};

// ❌ — anonymous function expression: name it
const ids = users.map(function (user) {
  return user.id;
});
```

**The test**: Can you read it without slowing down? Is it inline? If both yes,
arrow is fine. If you hesitate on either, name it as a `function` declaration.
This is a judgment call enforced through code review, not a character count.

#### Named `function` Declarations: Everything Else

Anything that isn't a quick inline expression is a **named `function` declaration**.

```javascript
// ✅ — named function declaration
function processConfig(config) {
  const expanded = expandShorthand(config);
  return applyPreset(expanded);
}
```

#### Callbacks Longer Than a Quick Expression

When a callback grows beyond a simple expression, **extract it** as a named
`function` declaration and pass the name into the chain.

```javascript
// ✅ — extracted named functions, passed by name
const results = users.filter(isActiveAdmin).map(formatUserSummary);

function isActiveAdmin(user) {
  return user.status === 'active' && user.role === 'admin' && !user.suspended;
}

function formatUserSummary(user) {
  return {
    id: user.id,
    display: `${user.firstName} ${user.lastName}`,
    since: user.createdAt.toISOString(),
  };
}

// ❌ — multi-line callbacks inlined in the chain
const results = users
  .filter(function (user) {
    return user.status === 'active' && user.role === 'admin' && !user.suspended;
  })
  .map(function (user) {
    return {
      id: user.id,
      display: `${user.firstName} ${user.lastName}`,
      since: user.createdAt.toISOString(),
    };
  });
```

**Why?**

- `users.filter(isActiveAdmin)` reads like English
- Named functions show in stack traces
- Extracted functions are independently testable
- Forces naming, which clarifies intent

#### Hoisting for Readability

Defining a `function` below where its name is first used is encouraged
when it improves readability — high-level flow at the top, implementation
details below.

```javascript
// ✅ — main flow reads top-down, details defined below
const pipeline = buildPipeline(config);
const result = executePipeline(pipeline, code);
return formatOutput(result);

function buildPipeline(config) {
  // ...
}

function executePipeline(pipeline, code) {
  // ...
}

function formatOutput(result) {
  // ...
}
```

**Note**: Only `function` declarations hoist. This is one reason arrows are
restricted to inline callbacks — if you're naming something for reuse, a
`function` declaration gives you hoisting and a stack trace name for free.

#### Why These Rules?

| Concern        | How it's addressed                                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Readability    | One-line arrows read naturally inline; named functions read like prose in chains                                                   |
| Stack traces   | Named `function` declarations always show; trivial inline arrows rarely need to                                                    |
| Debuggability  | Extracted named functions have clear breakpoint targets                                                                            |
| Testability    | Extracted functions are independently testable                                                                                     |
| Cognitive load | Two clear categories (quick inline expression → arrow, everything else → `function`) instead of "always function + exception list" |
| Hoisting       | `function` declarations hoist; arrows are inline-only, so hoisting isn't a concern for them                                        |

### 6. No `this` Keyword

This is a functional codebase. The `this` keyword is banned.

```javascript
// ❌ BANNED - using `this`
const counter = {
  count: 0,
  increment() {
    this.count++; // NO
  },
};

// ❌ BANNED - class with `this`
class Counter {
  count = 0;
  increment() {
    this.count++; // NO
  }
}
```

**Why?**

- `this` is the #1 source of confusion in JavaScript
- Binding rules are complex and error-prone (`.bind()`, arrow vs function, etc.)
- Functional patterns are easier to reason about
- State is explicit, not hidden in object context
- Easier to test (no mocking `this`)

**Exception**: Low-level AST/instrumentation code may use `this` when interfacing
with libraries that require it. These modules should be clearly marked and are
intended for advanced contributors only.

### 7. No Mutable Closures

Closures over **mutable** variables (`let`, reassigned bindings) are banned in core code.
Pass state explicitly rather than closing over mutable variables.

```javascript
// ✅ CORRECT - pure function, state as parameter
function incrementCount(state) {
  return { ...state, count: state.count + 1 };
}

// Pipeline-style (this codebase's pattern):
function addStep(traceState, newStep) {
  return { ...traceState, steps: [...traceState.steps, newStep] };
}
```

```javascript
// ❌ BANNED - closure over mutable state
// Hidden state has the same testability/debuggability problems as `this`.
function createCounter(initialCount = 0) {
  let count = initialCount;

  return {
    increment() {
      count++; // mutation hidden inside closure
      return count; // state only observable through method calls
    },
    getCount() {
      return count;
    },
  };
}
```

```javascript
// ✅ OK - closure over immutable values
// The currying pattern in embody() and squint() closes over cached config.
// This is fine because the closed-over value is never mutated.
function embodyWithClosedConfig({ code }) {
  // cachedConfig was set once and never changes
  return trace({ code, config: cachedConfig });
}
```

**Why ban mutable closures?**

- Closures over mutable state create the same problems as `this`, just with different syntax
- State is invisible and impossible to inspect (hidden `let` variables)
- Functions become untestable without setup sequences
- Harder to debug (state is trapped in closures, not in the data)
- Violates this codebase's object-threading pattern

**Key distinction**: Closing over **immutable** values (like a cached config) is fine.
Closing over **mutable** variables (like `let count`) is banned.

**Exception**: Low-level AST/instrumentation code may use mutable closures when
interfacing with libraries that require stateful patterns. This is the same boundary
as the `this` exception — these modules should be clearly marked and are intended
for advanced contributors only.

### 8. Method Shorthand, Default Empty Object, const

**Method shorthand**: Use method shorthand syntax in object literals. The `function`
keyword convention applies to declarations and callbacks, not object methods.

```javascript
// ✅ CORRECT - method shorthand
const pipeline = {
  process() {
    // implementation
  },
  validate() {
    // implementation
  },
};

// ❌ AVOID - verbose form in objects
const pipeline = {
  process: function process() {
    // implementation
  },
};
```

**Default empty object**: All functions that destructure object parameters should
provide a default empty object. This is a code review convention, not linted.

```javascript
// ✅ CORRECT - default empty object
function processConfig({ preset = 'detailed', variables = true } = {}) {
  // safe to call as processConfig() with no arguments
}

// ❌ AVOID - no default
function processConfig({ preset = 'detailed', variables = true }) {
  // processConfig() throws: Cannot destructure property of undefined
}
```

**Prefer `const`**: Use `let` only when reassignment is genuinely needed
(loop counters, accumulators). This is a convention, not an ESLint error.

```javascript
// ✅ PREFERRED
const config = createConfig(options);
const steps = trace(code);

// ✅ OK when needed
let total = 0;
for (const step of steps) {
  total += step.duration;
}

// ❌ AVOID - const works here
let config = createConfig(options); // never reassigned
```

### 9. Naming

**Functions: verb first**

```javascript
// ✅ CORRECT
function extractId(user) {}
function isActive(item) {}
function hasPermission(user, action) {}
function createConfig(options) {}

// ❌ AVOID - noun first or unclear
function userId(user) {} // Is this getting or setting?
function activeCheck(item) {} // Noun, not verb
```

**Predicates**: Boolean-returning functions start with `is`, `has`, `can`, `should`:

```javascript
function isValid(input) {}
function hasChildren(node) {}
function canEdit(user, document) {}
function shouldRetry(error) {}
```

**Callbacks: describe the transform**

```javascript
// ✅ CLEAR - says what it extracts/checks
function extractId(user) {
  return user.id;
}
function isEnabled(feature) {
  return feature.enabled;
}
function toUpperCase(str) {
  return str.toUpperCase();
}

// ❌ UNCLEAR
function mapUser(user) {} // Map to what?
function filterItem(item) {} // Filter by what criteria?
```

### 10. Imports, Types, Comments

**Imports**: Always include `.js` extension. Group and order:

```javascript
// 1. External dependencies (node_modules)
import { describe, it } from 'vitest';

// 2. Internal modules (relative paths)
import processConfig from './process-config.js';
import validateInput from '../utils/validate-input.js';

// 3. Type imports (last)
import type { Config } from './types.js';
import type { Step } from '../types/api.js';
```

**Types**: Prefer `type` over `interface`. Each module can have a `types.ts` file
for its type definitions.

```typescript
// ✅ PREFERRED
type Config = {
  preset: string;
  variables: boolean;
};

// ✅ OK for extension/declaration merging
interface Config {
  preset: string;
}
```

**Comments**: JSDoc for public functions. Inline comments explain **why**, not what.

```javascript
// ❌ WRONG - says what (obvious from code)
// Loop through users
for (const user of users) {
}

// ✅ CORRECT - says why (not obvious)
// Skip inactive users to avoid rate limiting on the API
for (const user of users.filter(isActive)) {
}
```

## Directory Structure

**Convention**: One concept per file, named after its default export. `kebab-case`
for all files and directories. Match filename to export: `createConfig` → `create.ts`.

Each directory contains its own README.md, and sometimes DOCS.md or DEV.md if it's conventions vary from the larger repository's conventions (eg. a submodule may require stateful environment tracking, or use Aran which relies on aspect-oriented programming).

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

- [ ] Named function/const, then `export default` at bottom
- [ ] Direct imports from source files (no barrels), always with `.js` extension
- [ ] Function preserves input object (object-threading)
- [ ] Named `function` declarations (arrows only for inline callbacks)
- [ ] No `this` keyword, no mutable closures
- [ ] Default empty object `= {}` on all destructured parameters
- [ ] Verb-first naming; predicates prefixed with `is`/`has`/`can`/`should`
- [ ] Types added to api.ts; prefer `type` over `interface`
- [ ] Tests cover happy path and edge cases
- [ ] No mutations of input data
- [ ] Errors handled gracefully
- [ ] JSDoc on public functions; inline comments explain "why"

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
    config: { preset: 'detailed' },
  });
  expect(result.steps).toContainEqual(expect.objectContaining({ type: 'variable.declare' }));
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
- WeakMap for object tagging

### Optimization Strategies

1. **Config caching**: Reuse expanded configs via currying
2. **Lazy evaluation**: Don't process disabled features

## Code Quality Tools

### ESLint Configuration

Full rule set enforcing codebase conventions:

```jsonc
{
  "plugins": ["functional", "unicorn"],
  "rules": {
    // --- Functional core (errors) ---
    "functional/no-this-expressions": "error",
    "functional/no-classes": "error",
    "no-invalid-this": "error",
    "@typescript-eslint/no-this-alias": "error",

    // --- Functional style (warnings) ---
    "functional/immutable-data": ["warn", { "ignoreAccessorPattern": ["module.exports"] }],
    "functional/prefer-readonly-type": "warn",

    // --- Functional style (off — too strict for pedagogical codebase) ---
    "functional/no-let": "off",
    "functional/no-loop-statements": "off",
    "functional/no-mixed-types": "off",

    // --- Functions and naming ---
    "func-names": ["error", "always"],
    "no-param-reassign": "error",

    // --- Imports ---
    "import/extensions": ["error", "always"],
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling"],
        "newlines-between": "always",
      },
    ],
    "import/prefer-default-export": "off",

    // --- TypeScript ---
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    // --- File naming ---
    "unicorn/filename-case": ["error", { "case": "kebabCase" }],
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts", "**/test/**/*.ts"],
      "rules": {
        "functional/immutable-data": "off",
        "functional/prefer-readonly-type": "off",
      },
    },
  ],
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
