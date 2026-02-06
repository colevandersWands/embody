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
- [Incremental Development Workflow](#incremental-development-workflow)
- [Linting Conventions](#linting-conventions)
- [Module Boundaries](#module-boundaries)
- [Code Quality Anti-Patterns](#code-quality-anti-patterns)
- [VS Code Setup](#vs-code-setup)

## Architecture Overview

### Core Pipeline

The tracer follows a strict linear pipeline architecture:

```
Input → prepareConfig (meta + options) → dispatch → record → Output
```

The API layer coordinates:

1. Validates lang/code types
2. Prepares meta config: `prepareConfig(userMeta, metaSchema)`
3. Prepares options: `prepareConfig(userOptions, langSchema)`
4. Calls lang's verifyOptions (if exported)
5. Passes `{ meta, options }` to lang's record function
6. Returns steps to user

Each pipeline stage:

1. Receives an object with specific keys
2. Processes its responsibility
3. Adds new data while preserving input
4. Returns enriched object for next stage

### Technology Stack

- **Instrumentation**: Aran framework for AST-based code transformation
- **Parser**: Acorn for JavaScript parsing
- **Runtime**: Node.js or modern browsers with ES modules
- **Testing**: Jest with extensive test cases
- **Types**: Full TypeScript types

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
| Classes                       | **Banned** (exception: error classes in `/errors`)     |
| Error handling                | Use `instanceof EmbodyError` for catch-all             |
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
import createConfig from './configuring/create.js';
import applyPreset from './configuring/apply-preset.js';

// ❌ WRONG - Barrel imports
import { createConfig, applyPreset } from './configuring/index.js';

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

### 2. Type Location Convention

Types live **with their module**, not in a centralized location.

| Location                | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `src/<module>/types.ts` | Types for that module                     |
| `src/types.ts`          | Type map (namespace barrel for discovery) |
| `src/index.ts`          | Re-exports public types for consumers     |

**Rules:**

1. Each module has its own `types.ts` (if needed)
2. Types stay with the code they document (transparency, portability)
3. Internal code imports directly from module's `types.ts`
4. `/src/types.ts` is a **namespace barrel** — exports submodule types under namespaces for discoverability
5. `/src/index.ts` re-exports consumer-facing types (flat, no namespace)

**The `/src/types.ts` namespace barrel:**

```typescript
// /src/types.ts — Type map for discoverability
export * as api from './api/types.js';
export * as errors from './errors/types.js';
export * as langs from './langs/types.js';
export * as charsLang from './langs/chars/types.js';
export * as configuring from './langs/js/configuring/types.js';
```

This is a **map**, not a flattening barrel. Each namespace preserves origin (`types.langs.StepCore`), making it easy to explore which modules have types and then drill into the source.

**Import patterns:**

```typescript
// ✅ CORRECT - Direct import from module (preferred for internal code)
import type { CallEvent } from '../instrument/types.js';

// ✅ CORRECT - Namespace import for exploration/discovery
import * as types from '../types.js';
const step: types.langs.StepCore = { ... };

// ✅ CORRECT - Destructured namespace for frequent use
import { api, langs } from '../types.js';
const result: api.TraceResult = { ... };

// ✅ CORRECT - Public API import (external consumers)
import type { Step, TraceResult } from '@study-lenses/embody';

// ❌ WRONG - Flattening barrel that hides origin
import type { CallEvent } from '../types/index.js';  // Don't create these
```

**Naming convention:** Language modules use `<name>Lang` suffix (e.g., `charsLang`) to distinguish them from other module types.

**Rationale:**

- Transparency: Types are discoverable where they're used
- Portability: Renaming/moving folders doesn't break unrelated code
- Discoverability: `/src/types.ts` serves as a "table of contents" for types
- Consistency: Parallels `/src/index.ts` as entry point for code

### 2.5. When `any` is OK

The `@typescript-eslint/no-explicit-any` rule is set to **warn** (not error) because `any` has legitimate uses. All `any` usage MUST be justified during code review.

**Philosophy:** Type systems should help, not hinder. Use `any` at boundaries where types are genuinely unknowable, but never as lazy typing for business logic.

**Acceptable uses:**

1. **Dynamic runtime values** — data parsed from JSON, user input, or eval results

   ```typescript
   function parseJSON(text: string): any {
     return JSON.parse(text); // Unknown structure at compile time
   }
   ```

2. **Untyped library boundaries** — wrapping third-party libraries without type definitions

   ```typescript
   function instrumentCode(code: string): any {
     return aranInstrument(code); // Aran returns complex AST structures
   }
   ```

3. **Generic utilities** — functions operating on arbitrary structures

   ```typescript
   function deepClone(obj: any): any {
     // Works on any serializable structure
     return JSON.parse(JSON.stringify(obj));
   }
   ```

4. **Test fixtures** — intentionally breaking types to test error handling

   ```typescript
   it('rejects invalid config', () => {
     const badConfig: any = { preset: 123 }; // Number instead of string
     expect(() => fillConfig(badConfig)).toThrow();
   });
   ```

5. **Stub implementations** — temporary mock data during TDD cycles

   ```typescript
   function record(input: any): any {
     // Stub: return mock trace steps
     return { ...input, steps: [] };
   }
   ```

**Unacceptable uses:**

- Business logic with known types (use proper interfaces)
- Public API parameters (force callers to use correct types)
- Return values from internal functions (be explicit)
- Lazy typing ("I don't know the type so I'll use `any`")

**Code review requirement:** Every `any` type must have a comment explaining WHY it's necessary. Reviewers should challenge `any` usage and suggest specific types when possible.

### 2.6. Using `eslint-disable` Comments

`eslint-disable` comments are a code review tool, NOT a development shortcut.

**Rules:**

1. **Never add `eslint-disable` in initial implementation** — fix the violation instead
2. **Only add during code review** — after discussing with reviewer
3. **Require justification comment** — explain WHY the rule doesn't apply

**Format:**

```typescript
// eslint-disable-next-line rule-name -- Justification for disabling
const problematicCode = ...;
```

**Approval criteria:**

- **Rule genuinely doesn't apply** (not "rule is inconvenient")
- **No reasonable refactor exists** (tried alternatives first)
- **Justification is specific** (not "this is fine" but "X constraint requires Y pattern")

**Example:**

```typescript
// ✅ ACCEPTABLE - Specific justification
// eslint-disable-next-line functional/immutable-data -- Performance-critical hot path,
// benchmarked 10x faster than immutable version, handles 10K+ objects/sec
function deepMergeMutable(target: any, source: any): any {
  Object.assign(target, source);
  return target;
}

// ❌ UNACCEPTABLE - Vague justification
// eslint-disable-next-line functional/immutable-data -- this is fine
function updateConfig(config: any): any {
  config.updated = true;
  return config;
}
```

### 3. Object-Threading Pattern

Functions accept and return objects with predetermined keys:

```javascript
// Input object with known keys
const input = { code: 'let x = 5', config: expandedConfig };

// Function adds new keys while preserving input
const output = record(input);
// Returns: { code, config, steps }
```

**Benefits**:

- Explicit data flow
- Easy debugging (inspect objects between stages)
- Composable pipeline stages
- No hidden state

### 4. Pure Functional Approach

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

### 5. Error Handling Strategy

**Error Classes**: All library errors extend `EmbodyError` (in `/errors`). This enables
catch-all handling while preserving specific error discrimination via `instanceof`.

```javascript
// Catch-all for any embody error
try {
  const steps = await trace('chars', code);
} catch (error) {
  if (error instanceof EmbodyError) {
    showUserError(error.message); // Library error - handle gracefully
  } else {
    throw error; // Not ours - propagate
  }
}

// Specific error handling
try {
  const steps = await trace('chars', code);
} catch (error) {
  if (error instanceof ParseError) {
    highlightSyntaxError(error.loc);
  } else if (error instanceof LangUnknownError) {
    suggestAvailableLanguages(error.cause?.available);
  }
}
```

**Error Class Hierarchy** (flat, all extend `EmbodyError`):

| Class                         | Thrown By            | When                            |
| ----------------------------- | -------------------- | ------------------------------- |
| `ParseError`                  | Lang modules         | Code parsing failed             |
| `RuntimeError`                | Lang modules         | Code execution failed           |
| `LimitExceededError`          | Lang modules         | Exceeded max steps/time         |
| `OptionsSemanticInvalidError` | Lang `verifyOptions` | Cross-field constraint violated |
| `OptionsSchemaInvalidError`   | `/configuring`       | Options don't match JSON Schema |
| `ConfigInvalidError`          | API layer            | `lang`/`code` wrong type        |
| `LangUnknownError`            | API layer            | Language not in dispatch        |
| `InternalError`               | Any layer            | Unexpected error wrapper        |

**Naming Convention**:

- Library errors: `.name` = `'(EmbodyError) ClassName'` (e.g., `'(EmbodyError) LangUnknownError'`)
- Code errors (ParseError, RuntimeError): `.name` = original error name (e.g., `'ParseError'`)

**General Patterns**:

```javascript
// Graceful degradation for config errors
if (invalidConfig) {
  console.warn('Invalid config value, using default');
  return defaultValue;
}

// Fail fast for critical errors (use specific error classes)
if (!code) {
  throw new ConfigInvalidError('code', 'Code is required for instrumentation');
}
```

### 6. Function Conventions

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

### 7. No `this` Keyword

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

### 8. No Mutable Closures

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
// The currying pattern in embody() closes over cached config.
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

### 9. Method Shorthand, Default Empty Object, const

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

### 10. Naming

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

### 11. Imports, Types, Comments

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

### Per-Directory Documentation

Every source directory under `src/` has its own documentation. The level of documentation
depends on the directory's role:

| Directory type         | README.md   | DOCS.md  | Example                                     |
| ---------------------- | ----------- | -------- | ------------------------------------------- |
| **Submodule**          | Required    | Required | `api/`, `configuring/`, `instrument/steps/` |
| **Leaf directory**     | Required    | Optional | `configuring/presets/`, `utils/`            |
| **`tests/` directory** | Exempt      | Exempt   | `api/tests/`                                |
| **`tests/fixtures/`**  | Recommended | Exempt   | `steps/tests/fixtures/`                     |
| **Root `/tests/`**     | Recommended | Exempt   | `/tests/`, `/tests/code-to-steps/`          |

**Submodule heuristic**: A directory is a submodule if it is a direct child of `src/`
(e.g., `api/`, `configuring/`, `instrument/`) or contains subdirectories with source code
(not counting `tests/`).

**README.md** — orientation and context:

- What this module does (1-2 sentences)
- Why it exists / where it fits in the architecture
- Key files and their responsibilities
- Cross-references to parent README for broader context
- Cross-references to child READMEs for deeper detail

**DOCS.md** — technical reference (submodules only):

- Function signatures and parameters
- Return values and types
- Usage examples
- Edge cases and error behavior
- Cross-references to related DOCS.md files

**Cross-referencing**:

- **Parent → Child**: Higher-level docs link to lower-level docs for detail
  (e.g., `src/api/README.md` → `src/api/tracing/README.md`)
- **Child → Parent**: Lower-level docs link to parent for architectural context
- **Sibling**: Cross-reference when modules interact
  (e.g., `tracing/DOCS.md` → `configuring/DOCS.md` for config types)
- Use relative markdown links: `[tracing module](./tracing/README.md)`

**Enforcement**: Code review for humans. For Claude, this is part of TDD workflow step 10
(update docs after each passing increment). Directories that predate this convention are
backfilled incrementally as they are worked on.

Each directory may also have a DEV.md if its conventions vary from the repository's
conventions (e.g., a submodule that requires stateful environment tracking, or uses Aran
which relies on aspect-oriented programming).

### Test Organization

Unit tests live in a `tests/` subdirectory at the same level as the files they test:

```text
src/
  module/
    tests/
      feature.test.ts
    feature.ts
```

This keeps tests close to source (portable when moving directories) without cluttering
the source directory listing.

- Directory name: `tests/` (plural, always)
- File suffix: `.test.ts` (never `.spec.ts`)
- Root `/tests/` directory: integration test fixtures (not unit tests)

## Key Design Patterns

### 1. Undefined Checks for Currying

Functions that support currying use `undefined` checks to detect which
arguments were provided:

```typescript
function embody({ code, config }: { readonly code?: string; readonly config?: UserConfig } = {}) {
  if (code === undefined && config === undefined) {
    throw new Error('embody: expected at least code or config to be provided');
  }
  if (code === undefined) {
    // Config-only: cache expanded config, return function expecting code
    const { config: cachedConfig } = fillConfig({ config });
    return function embodyWithClosedConfig({ code }: { readonly code?: string } = {}) {
      // ...
    };
  }
  if (config === undefined) {
    // Code-only: close over code, return function expecting config
    return function embodyWithClosedCode({ config }: { readonly config?: UserConfig } = {}) {
      // ...
    };
  }
  // Both provided - execute immediately
  return instrumentRecord({ code, ...fillConfig({ config }) });
}
```

**Pickle support**: `embody` accepts JSON strings for `config`. Invalid
JSON config degrades gracefully to default configuration.

All curried API functions validate input types and throw self-documenting
errors (e.g., `'embody: expected code to be a string, got number'`).

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

These functions currently return mock data (see unit tests for full behavioral contracts):

- `record({ code: 'abc' })` → `{ code: 'abc', config, steps: [{},{},{}] }` (one `{}` per character)
- `serialize([{},{}])` → `'[{},{}]'` (JSON.stringify)
- `deserialize({ steps, config })` → parses JSON strings and validates structure

### Config Flow

Config validation and default-filling use pure functions from `/configuring`. The **API layer** coordinates the flow:

```text
User config: { meta?: {...}, options?: {...} }
    ↓
API Layer (coordination)
    ├── 1. Check lang exists (dispatch lookup)
    ├── 2. Validate meta config
    │       └── prepareConfig(userMeta, metaSchema) from /configuring
    ├── 3. Validate options config
    │       └── prepareConfig(userOptions, langSchema) from /configuring
    ├── 4. Call lang's verifyOptions(filledOptions) if exported — throws OptionsSemanticInvalidError
    ↓
Fully-filled, validated { meta, options }
    ↓
Lang record(code, { meta, options }) — enforces limits, pure tracing
```

**User config structure**:

| Part      | Schema                      | Purpose                      |
| --------- | --------------------------- | ---------------------------- |
| `meta`    | `/langs/meta.schema.json`   | Execution limits, timestamps |
| `options` | `/langs/<lang>/schema.json` | Language-specific options    |

**Recommended**: Use `prepareConfig(data, schema)` — wraps expand → fill → validate.

**Individual functions** (for edge cases): All are pure, return data, pipeable:

```typescript
validateConfig(fillDefaults(expandShorthand(data, schema), schema), schema);
```

**Key insight**: `/configuring` imports ONLY from `/errors`. It receives `(data, schema)` — never `langId`. The API layer gets schemas from langs and passes them to configuring.

See [/configuring README](./src/configuring/README.md) for details.

All API functions validate input types and throw self-documenting errors
(e.g., `'trace: expected lang to be string, got number'`).

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
4. Update README.md and DOCS.md in affected directories
5. Update types in `/src/types/`
6. Run quality checks:
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

### 3. Adding New Pipeline Stage

1. Create file in `/src/api/tracing/`
2. Use named-then-export pattern
3. Follow object-threading:

   ```typescript
   function newStage(input) {
     const { existingData, config } = input;
     const newData = process(existingData, config);
     return { ...input, newData };
   }

   export default newStage;
   ```

4. Add types to `/src/types/api.ts`
5. Add tests in `/src/api/tracing/tests/`
6. Wire into pipeline in `trace.ts`

### 4. Conventions Checklist

- [ ] Named function/const, then `export default` at bottom
- [ ] Direct imports from source files (no barrels), always with `.js` extension
- [ ] Function preserves input object (object-threading)
- [ ] Named `function` declarations (arrows only for inline callbacks)
- [ ] No `this` keyword, no mutable closures
- [ ] Default empty object `= {}` on all destructured parameters
- [ ] Verb-first naming; predicates prefixed with `is`/`has`/`can`/`should`
- [ ] Types added to api.ts; prefer `type` over `interface`
- [ ] Tests in `tests/` subdirectory (not alongside source files), `.test.ts` suffix
- [ ] Tests cover happy path and edge cases
- [ ] No mutations of input data
- [ ] Errors handled gracefully
- [ ] README.md exists in directory (DOCS.md too if submodule)
- [ ] JSDoc on public functions; inline comments explain "why"

## Testing Strategy

### Test Organization Convention

All unit tests live in a `tests/` subdirectory co-located with the source they test.
See [Directory Structure § Test Organization](#test-organization) for the full convention.

### Unit Tests

Each exported function has a dedicated test file in the nearest `tests/` subdirectory:

```javascript
// /src/api/tracing/tests/fill-config.test.ts
import fillConfig from '../fill-config.js';

test('expands boolean shorthand', () => {
  const result = fillConfig({ config: { variables: true } });
  expect(result.config.variables.declare).toBeDefined();
});
```

### Integration Tests

Integration test fixtures live in the root `/tests/` directory:

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

Reference implementations in `/tests/code-to-steps/`:

- Each case includes: `code.js`, `config.js`, `steps.js`
- Used to verify trace accuracy
- Covers edge cases and language features

### Testing Conventions

How to write tests, not just where to put them.

#### Test Naming

Use direct description. Implicit arrows (`→`) for compactness when input/output is clear.

```typescript
// Standard — describes what happens
it('returns expanded config with all defaults', () => {...});

// Compact with arrow — input → output
it('string input → parsed object', () => {...});
it('"overview" → variables.read = false', () => {...});
```

#### Describe Block Structure

Top-level `describe` = function name. Nest freely for clarity.

```typescript
describe('createConfig', () => {
  describe('preset application', () => {
    describe('overview preset', () => {
      it('sets variables.read to false', () => {...});
      it('sets variables.write to false', () => {...});
    });

    describe('detailed preset', () => {
      it('sets variables.read to true', () => {...});
    });
  });

  describe('boolean shorthand expansion', () => {
    describe('happy path', () => {...});
    describe('edge cases', () => {...});
    describe('errors', () => {...});
  });
});
```

#### Test Ordering

Within each describe block: **feature/behavior → happy path → edge cases → errors → performance**

```typescript
describe('resolveSteps', () => {
  describe('array input', () => {
    describe('happy path', () => {
      it('passes through array unchanged', () => {...});
      it('preserves reference identity', () => {...});
    });

    describe('edge cases', () => {
      it('handles empty array', () => {...});
    });

    describe('errors', () => {
      it('throws on array with non-object elements', () => {...});
    });
  });

  describe('string input', () => {
    // same structure: happy → edge → error
  });
});
```

#### One Assertion Per Test

Use nested `describe` blocks instead of multiple assertions in one `it`.

```typescript
// ❌ WRONG — multiple assertions hide which failed
it('returns complete config', () => {
  expect(result.preset).toBe('detailed');
  expect(result.variables).toBe(true);
  expect(result.lang).toBeDefined();
});

// ✅ CORRECT — one assertion, grouped by describe
describe('returns complete config', () => {
  it('preset = "detailed"', () => {
    expect(result.preset).toBe('detailed');
  });

  it('variables = true', () => {
    expect(result.variables).toBe(true);
  });

  it('lang is defined', () => {
    expect(result.lang).toBeDefined();
  });
});
```

#### Error Testing

Always use `.toThrow()`. Never use try-catch in tests.

```typescript
// ✅ Basic
it('throws on invalid input', () => {
  expect(() => parseJSON('{bad}')).toThrow();
});

// ✅ With message substring
it('error mentions function name', () => {
  expect(() => embody()).toThrow('embody');
});

// ❌ WRONG — never use try-catch for error testing
it('throws on invalid input', () => {
  try {
    parseJSON('{bad}');
    expect(true).toBe(false);
  } catch (error) {
    expect(error.message).toContain('parse');
  }
});
```

#### Test Data

Inline only. No shared fixtures. Each test is self-contained and independently understandable.

```typescript
// ✅ CORRECT — self-contained
it('merges user override into preset', () => {
  const preset = { variables: { read: false } };
  const user = { variables: { read: true } };
  const result = deepMerge(preset, user);
  expect(result.variables.read).toBe(true);
});

// ❌ WRONG — shared fixture hides what's being tested
describe('deepMerge', () => {
  const sharedPreset = { variables: { read: false } }; // Don't do this

  it('test 1', () => {
    /* uses sharedPreset */
  });
  it('test 2', () => {
    /* uses sharedPreset */
  });
});
```

#### Minimal Logic in Tests

Tests should contain only:

1. The function being tested
2. Bare minimum data setup (inline)

**No control flow** — no `if`, no loops, no try-catch. When you need to test the same behavior
with multiple values, use `it.each`:

```typescript
// ✅ CORRECT — it.each handles iteration cleanly
it.each([
  [false, false],
  [0, false],
  [-0, false],
  ['', false],
  [null, false],
  [undefined, false],
])('%p → Boolean coercion = %p', (value, expected) => {
  expect(Boolean(value)).toBe(expected);
});

// ❌ WRONG — for-of loop in test
for (const value of falsyValues) {
  it(`${value} is falsy`, () => {
    expect(Boolean(value)).toBe(false);
  });
}

// ❌ WRONG — forEach in test (also banned by linter)
falsyValues.forEach((value) => {
  it(`${value} is falsy`, () => {
    expect(Boolean(value)).toBe(false);
  });
});
```

**Why:** Logic in tests hides what's being tested and can mask bugs. `it.each` is declarative —
the framework handles iteration, making the test cases explicit and the intent clear.

#### Skip vs Delete

- **`.skip`** — feature planned but not implemented yet
- **Delete** — no longer relevant
- **No TODO comments** — test names are the documentation

#### No Comments in Tests

Test names and describe blocks are executable documentation. Comments are redundant.

```typescript
// ❌ WRONG — comment repeats what test name says
// Test that config handles empty input
it('handles empty input', () => {...});

// ✅ CORRECT — the test name IS the documentation
it('empty object → default config', () => {...});
```

#### Complete Example

```typescript
import parseJSON from '../parse-json.js';

describe('parseJSON', () => {
  describe('valid JSON string', () => {
    describe('happy path', () => {
      it('object string → parsed object', () => {
        expect(parseJSON('{"a":1}')).toEqual({ a: 1 });
      });

      it('array string → parsed array', () => {
        expect(parseJSON('[1,2,3]')).toEqual([1, 2, 3]);
      });
    });

    describe('edge cases', () => {
      it('empty object string → empty object', () => {
        expect(parseJSON('{}')).toEqual({});
      });

      it('whitespace-padded string → parsed object', () => {
        expect(parseJSON('  {"a":1}  ')).toEqual({ a: 1 });
      });
    });
  });

  describe('invalid input', () => {
    describe('errors', () => {
      it('malformed JSON → throws', () => {
        expect(() => parseJSON('{bad}')).toThrow();
      });

      it('error includes prefix when provided', () => {
        expect(() => parseJSON('{bad}', 'context')).toThrow('context');
      });
    });
  });
});
```

## Performance Considerations

### Memory Management

- Trace size limits via `config.limits.maxSteps`
- WeakMap for object tagging

### Optimization Strategies

1. **Config caching**: Reuse expanded configs via currying
2. **Lazy evaluation**: Don't process disabled features

## Incremental Development Workflow

All development uses TDD with atomic increments. One unit test = one increment of work.

### Phase 0: Documentation Specification (before any code)

Documentation-driven development ensures clarity BEFORE code exists. This phase applies to ALL work — new features, bug fixes, and refactors.

**0.1. Update README.md** — What does this module do? Where does it fit?

- New modules: Create README.md with purpose and architecture
- Existing modules: Update if change affects documented behavior
- Bug fixes: Note if bug reveals documentation gap

**0.2. Update DOCS.md** — Function signatures, parameters, return types, errors, examples

- Document the function as if it already exists
- This becomes the specification that code must fulfill

**0.3. Update types.ts** — Type signatures are executable documentation

- Update type definitions to reflect the new contract
- Types ARE documentation: they specify behavior that code must fulfill
- Type errors after this step become the TODO list for implementation
- If changing existing types, this makes breaking changes explicit upfront

**0.4. Review** — Confirm understanding before writing code

### Phase 1: TDD Implementation

For each behavioral increment:

1. **JSDoc** — document the behavioral contract (mirrors DOCS.md)
2. **Stub function** — create function with stub body
3. **Placeholder types** — `any`/`unknown` to unblock; tighten later
4. **🔍 Lint checkpoint 1** — `npm run lint <new-file>`. Fix violations.
5. **Unit test** — write ONE failing test for the behavior
6. **🔍 Lint checkpoint 2** — `npm run lint <test-file>`. Fix violations.
7. **Implement** — minimal code to pass the test (Red → Green)
8. **🔍 Lint checkpoint 3** — `npm run lint <impl-file>`. Fix violations.
9. **Refactor** — clean up while tests stay green
10. **🔍 Lint checkpoint 4** — final lint on modified files. Should be clean.
11. **Update types** — finalize based on actual implementation
12. **Self-review** — simplest solution? only what requested? junior-maintainable?
13. **Quality checks** — `npm test && npm run lint && npm run type-check`
14. **Verify docs match implementation** — update if behavior changed during TDD
15. **Atomic commit** — one behavior per commit

Use linter feedback as refactoring guide:

- `cognitive-complexity` error? Break into smaller functions
- `prefer-immediate-return`? Inline unnecessary variable
- `no-duplicate-string`? Extract constant

### Session Handoff

Before ending a work session:

1. Update plan file with current state, what's done, what's left
2. Commit all completed increments
3. Note any blockers or open questions

### Atomic Commits

Each passing TDD cycle = one atomic commit:

- One behavior per commit
- Descriptive message: `add: fillConfig expands boolean shorthand`
- Feature branch for planned work batches

### What NOT to Do

- No implementing multiple behaviors before testing
- No skipping the refactor step
- No skipping doc updates ("I'll do it at the end")
- No placeholder types that block test-writing — loosen types to unblock, tighten after
- Each edit should do exactly one thing — if you notice something else to fix, note it and do it separately
- **No full implementations in plans** — plans describe BEHAVIOR and INTENT, not code. Implementation is discovered through TDD. Example: plan says "expand boolean shorthand to full object structure", NOT the actual code that does it

## Linting Conventions

This codebase uses a three-tool pipeline for code quality:

- **ESLint** — enforces logic patterns and code style
- **Prettier** — handles formatting (spaces, quotes, line length)
- **TypeScript** — validates types via `tsc` compiler

These tools work together to automate as many conventions as possible. What can't be automated becomes part of the code review checklist (see `.github/PULL_REQUEST_TEMPLATE.md`).

### Running the Tools

```bash
# Check for violations
npm run lint           # ESLint
npm run format:check   # Prettier
npm run type-check     # TypeScript

# Auto-fix what's fixable
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier auto-format

# Run all checks at once
npm run validate       # lint + type-check + test
```

### Pre-commit Hooks

Husky + lint-staged run automatically before each commit:

- `npm run lint:fix` on staged `.ts`/`.js` files
- `npm run format` on staged `.ts`/`.js`/`.json`/`.md`/`.yml`/`.yaml` files

Most violations get fixed automatically before you even see them.

### Enforced Conventions

These rules are enforced by ESLint and will block commits if violated. See [eslint.config.js](./eslint.config.js) for full configuration.

#### Functional Programming Core

##### No `this` keyword anywhere

```javascript
// ❌ BANNED
class Thing {
  method() {
    return this.value;
  }
}

const obj = {
  method() {
    return this.value; // Even in object methods
  },
};

// ✓ CORRECT
function createThing(value) {
  return {
    getValue() {
      return value; // Closure over parameter
    },
  };
}
```

**Why:** `this` creates implicit context and makes code harder to reason about. Closures are explicit and functional.

##### No classes — use factory functions

```javascript
// ❌ BANNED
class Config {
  constructor(options) {
    this.options = options;
  }
}

// ✓ CORRECT
function createConfig(options = {}) {
  return { options };
}
```

**Why:** Classes tie data to methods and encourage stateful OOP. Factory functions are simpler and more composable.

##### No parameter reassignment

```javascript
// ❌ BANNED
function process(input) {
  input = sanitize(input); // Reassigning parameter
  return input;
}

// ✓ CORRECT
function process(input) {
  const sanitized = sanitize(input);
  return sanitized;
}
```

**Why:** Reassigning parameters is mutation that's hard to track. New bindings are explicit.

#### Functions and Naming

##### All functions must have names

```javascript
// ❌ BANNED
const process = function (x) {
  return x * 2;
}; // Anonymous function assigned

// ✓ CORRECT - Named function declaration
function process(x) {
  return x * 2;
}

// ✓ CORRECT - Short inline arrow (implicit return only)
items.map((x) => x * 2);
```

**Why:** Named functions show up in stack traces and make debugging easier. They also enable hoisting.

##### Arrow functions must use implicit returns (no braces)

```javascript
// ❌ BANNED
const double = (x) => {
  return x * 2;
};
items.forEach((item) => {
  console.log(item);
});

// ✓ CORRECT - Convert to named function
function double(x) {
  return x * 2;
}

function logItem(item) {
  console.log(item);
}
items.forEach(logItem);

// ✓ CORRECT - Arrow only for single expression
items.map((x) => x * 2);
```

**Why:** If an arrow needs braces, it should be a named function. This keeps arrows for simple inline callbacks only.

#### Iteration vs Functional Methods

##### Use for-of loops for side effects, not .forEach()

```javascript
// ❌ BANNED
items.forEach((item) => {
  console.log(item);
  processItem(item);
});

// ✓ CORRECT - Explicit loop for side effects
for (const item of items) {
  console.log(item);
  processItem(item);
}

// ✓ CORRECT - Functional methods for transformations
const doubled = items.map((x) => x * 2);
const filtered = items.filter((x) => x > 10);
const sum = items.reduce((acc, x) => acc + x, 0);
```

**Why:** Clear distinction between imperative (loops, side effects) and functional (map/filter/reduce, transformations). forEach blurs this line and has surprising control flow (`return` only exits the callback).

##### Use the right array method

```javascript
// ❌ AVOID - Use better method
const found = items.filter((x) => x.id === 5)[0]; // → use .find()
const hasMatch = items.find((x) => x > 10) !== undefined; // → use .some()
const copy = Array.from(items); // → use [...items]

// ✓ CORRECT
const found = items.find((x) => x.id === 5);
const hasMatch = items.some((x) => x > 10);
const copy = [...items];
```

**Why:** Each method has one clear purpose. Using the right one makes intent explicit.

#### Imports and Exports

##### Always include .js extension in imports

```javascript
// ❌ BANNED
import createConfig from './create';

// ✓ CORRECT
import createConfig from './create.js';
```

**Why:** Explicit extensions work in both Node ESM and browsers without transformation.

##### No named exports (except src/index.ts and types.ts)

```javascript
// ❌ BANNED (in most files)
export function createConfig() {}
export function applyPreset() {}

// ✓ CORRECT - One default export per file
function createConfig() {}
export default createConfig;
```

**Why:** One export per file = one concept per file. Named exports encourage kitchen-sink modules.

##### Imports must be alphabetically ordered with blank lines between groups

```javascript
// ❌ BANNED
import createConfig from './create.js';
import fs from 'node:fs';
import { someHelper } from '../utils/helper.js';

// ✓ CORRECT - Groups: builtin → external → internal (each alphabetized)
import fs from 'node:fs';

import someExternal from 'some-package';

import createConfig from './create.js';
import { someHelper } from '../utils/helper.js';
```

**Why:** Consistent ordering prevents merge conflicts and makes imports scannable.

#### Style and Syntax

##### Files must be named in kebab-case

```javascript
// ❌ BANNED
CreateConfig.ts;
create_config.ts;
createConfig.ts;

// ✓ CORRECT
create - config.ts;
```

**Why:** One consistent naming scheme. kebab-case is URL-friendly and shell-safe.

##### Use const by default

```javascript
// ❌ AVOID - Use const when possible
let x = 5;
x; // Never reassigned

// ✓ CORRECT
const x = 5;

// ✓ CORRECT - let only when reassigned
let counter = 0;
counter += 1;
```

**Why:** Immutability by default. `let` signals "this will change."

##### Use template literals for string concatenation

```javascript
// ❌ BANNED
const message = 'Hello, ' + name + '!';

// ✓ CORRECT
const message = `Hello, ${name}!`;
```

**Why:** Template literals are clearer and handle multiline strings better. The `+` operator is reserved for math.

##### Use modern syntax

```javascript
// ❌ OLD WAYS
Math.pow(2, 3); // → use **
'hello'.substr(0, 2); // → use .slice()
arr[arr.length - 1]; // → use .at(-1)

// ✓ MODERN
2 ** 3;
'hello'.slice(0, 2);
arr.at(-1);
```

**Why:** Modern syntax is clearer and more expressive. Prefer newer, better APIs.

##### Use type over interface for TypeScript types

```typescript
// ❌ AVOID
interface Config {
  preset: string;
}

// ✓ CORRECT
type Config = {
  preset: string;
};
```

**Why:** `type` is more flexible (unions, intersections) and aligns with functional composition patterns.

### TypeScript Strict Mode

All TypeScript strict checks are enabled in `tsconfig.json`:

- **`strict: true`** — enables all strict type checks
- **`noUnusedLocals`** — no unused variables
- **`noUnusedParameters`** — no unused function parameters
- **`noImplicitReturns`** — all code paths must return
- **`strictNullChecks`** — `null` and `undefined` are distinct types

These catch type errors at compile time. Run `npm run type-check` to verify.

### Manual Review Conventions

These conventions can't be automated and must be checked during code review:

##### Default empty object for destructured parameters

```javascript
// ❌ MISSING DEFAULT
function process({ preset, options }) {
  // Crashes if called with no arguments
}

// ✓ CORRECT
function process({ preset, options } = {}) {
  // Works with process() or process({})
}
```

##### Verb-first function naming

```javascript
// ❌ UNCLEAR
function configProcessor(input) {}
function userValidator(data) {}

// ✓ CORRECT
function processConfig(input) {}
function validateUser(data) {}
```

##### One concept per file

```javascript
// ❌ KITCHEN SINK - utils.ts with 20 unrelated functions
// ✓ CORRECT - deep-clone.ts with one focused utility
```

##### Comments explain "why" not "what"

```javascript
// ❌ USELESS - describes syntax
// Spread the input object
return { ...input, config };

// ✓ USEFUL - explains intent
// Preserve all upstream pipeline data while adding our config
return { ...input, config };
```

##### No mutable closures

```javascript
// ❌ BANNED - closure over mutable variable
let count = 0;
function increment() {
  count += 1; // Mutates closed-over variable
}

// ✓ CORRECT - immutable closure or explicit parameter
function createCounter() {
  let count = 0; // Encapsulated state
  return {
    increment() {
      count += 1;
      return count;
    },
  };
}
```

See `.github/PULL_REQUEST_TEMPLATE.md` for the full manual review checklist.

### Teaching Moments for Linting Errors

Many contributors are JS novices using AI assistants to develop. When linting errors occur, treat them as teaching opportunities.

**When a contributor hits a linting error:**

1. **Explain WHAT and WHY** (not just HOW to fix)
   - "This rule (`unicorn/no-array-for-each`) catches a common pattern..."
   - "The WHY: loops make side effects explicit, array methods are for transformations"

2. **Offer to expand:**
   - "Would you like me to explain the JS concept behind this rule?"
   - Keep it brief by default (2-3 sentences), expand on request

**Common linting errors and what to teach:**

| Rule                             | Concept to Teach                                                                                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unicorn/no-array-for-each`      | Imperative vs functional: `.forEach()` looks functional but can't break/return early. Use `for-of` for side effects, `.map()`/`.filter()` for transforms. |
| `prefer-template`                | Keep `+` for math only. Template literals prevent type coercion bugs.                                                                                     |
| `arrow-body-style`               | Implicit returns signal "pure transform"; braces signal "does more."                                                                                      |
| `func-names`                     | Named functions improve stack traces and enable hoisting.                                                                                                 |
| `functional/no-this-expressions` | `this` binding changes based on call-site. Closures are explicit.                                                                                         |
| `sonarjs/cognitive-complexity`   | Too many nested conditions/loops. Break into smaller named functions.                                                                                     |
| `sonarjs/no-duplicate-string`    | Magic strings → named constants for searchability and refactoring.                                                                                        |

**Example interaction:**

```text
Contributor: "I'm getting a linting error about forEach"

Claude: "That's `unicorn/no-array-for-each`. In this codebase, we use `for-of` loops
for side effects and array methods for transformations. Want me to explain why?"
```

**Don't be patronizing:** Assume intelligence, explain concepts clearly, don't over-simplify.

## Module Boundaries

Import boundaries are enforced via `eslint-plugin-boundaries`. This catches architectural violations at lint time — both humans and LLMs get immediate feedback when breaking the layered architecture.

### Layer Hierarchy

| Layer         | Pattern             | Can Import From                                   |
| ------------- | ------------------- | ------------------------------------------------- |
| `entry`       | `src/index.ts`      | `api` only                                        |
| `api`         | `src/api/*`         | `configuring`, `langs`, `error`, `utils`, `types` |
| `configuring` | `src/configuring/*` | `error`, `utils`, `types`                         |
| `langs`       | `src/langs/**/*`    | `error`, `utils`, `types`                         |
| `error`       | `src/errors/*`      | `types` only                                      |
| `utils`       | `src/utils/*`       | `utils` only (self-imports allowed)               |
| `types`       | `src/types/*`       | nothing (leaf)                                    |

**Key constraints:**

- `utils` can import from other utils (e.g., `deep-freeze` uses `deep-clone`)
- `types` is a true leaf — imports nothing from `src/`
- `langs` cannot import from `api` (would create circular dependency)
- `entry` (`src/index.ts`) only re-exports from `api`

### Error Ownership

Each layer can only import errors it's responsible for throwing:

| Error Class                                                                       | Importable By            |
| --------------------------------------------------------------------------------- | ------------------------ |
| `EmbodyError`                                                                     | `api` only (base class)  |
| `InternalError`                                                                   | any layer (escape hatch) |
| `LangUnknownError`, `ConfigInvalidError`                                          | `api` only               |
| `OptionsSchemaInvalidError`                                                       | `configuring` only       |
| `OptionsSemanticInvalidError`, `ParseError`, `RuntimeError`, `LimitExceededError` | `langs` only             |
| `types.ts` (`SourceLoc`)                                                          | any layer                |

### Configuration

The boundaries plugin requires `eslint-import-resolver-typescript` for TypeScript import resolution:

```javascript
// eslint.config.js
settings: {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
    },
  },
  'boundaries/elements': [
    { type: 'entry', pattern: 'src/index.ts', mode: 'file' },
    { type: 'api', pattern: 'src/api/*', mode: 'file' },
    // ... see eslint.config.js for full configuration
  ],
}
```

### Updating Boundaries

When the architecture evolves:

1. Update `boundaries/elements` patterns in `eslint.config.js`
2. Update `boundaries/element-types` rules for new allowed imports
3. Update this section of DEV.md
4. Run `npm run lint` to verify no violations

## Code Quality Anti-Patterns

Common patterns to avoid in this codebase:

| Anti-Pattern              | Rule                          | Example Fix                                     |
| ------------------------- | ----------------------------- | ----------------------------------------------- |
| **Over-engineering**      | Helper used once? Inline it   | `const x = getX(o)` → `const x = o.x`           |
| **Class addiction**       | Prefer functions over classes | `class X` → `function createX()`                |
| **Future-proofing**       | Don't add unused flexibility  | `options = {}` with unused fields → direct impl |
| **Defensive over-coding** | Validate at boundaries only   | Remove internal re-validation                   |
| **Verbose docs**          | Name + types self-document?   | Only document WHY or non-obvious contracts      |

### Pre-Commit Checklist

Before proposing code, answer YES to ALL:

- [ ] **Simplest solution?** Not most "elegant" or "extensible"
- [ ] **Only what requested?** No future-proofing, no "nice-to-haves"
- [ ] **Helpers used >1x?** If used once, inline it
- [ ] **Validate at boundaries only?** No re-validating internal calls
- [ ] **Junior-maintainable?** Understandable without explanation

**If proposing ANY of these, STOP and simplify:**
Classes, single-use helpers, unused config fields, internal error handling, backwards-compat shims for new code, `_unused` parameter renames, generic solutions when specific works.

## VS Code Setup

The `.vscode/` directory provides workspace configuration for consistent development:

- **settings.json** — Format-on-save, ESLint auto-fix, word wrap at 100 chars, `.js` import extensions
- **extensions.json** — Recommended extensions (ESLint, Prettier, EditorConfig, Jest, spell checker, pretty TS errors)
- **launch.json** — Debug configurations for tests and scripts

Open VS Code → install recommended extensions when prompted → editor is configured.

**Debug configurations:**

- **Debug Current Test File** — open a `.test.ts` file, press F5
- **Debug All Tests** — run full suite with breakpoints
- **Debug Current Script** — debug any `.ts`/`.js` file directly

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
