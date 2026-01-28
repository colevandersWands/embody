# embodify

**Chainable, immutable pipeline wrapper for code tracing**

A fluent API for composing code instrumentation, execution, and filtering as a chain of immutable operations. Each method returns a new chain link — the original is never mutated. Getters cascade lazily: accessing `.steps` when only code is set triggers the full `code → instrumented → steps` pipeline on demand.

## Table of Contents

- [Design Principles](#design-principles)
  - [Immutability](#immutability)
  - [Lazy Cascade](#lazy-cascade)
  - [Pickle-Awareness](#pickle-awareness)
- [Quick Start](#quick-start)
- [API Surface Summary](#api-surface-summary)
  - [Getters](#getters)
  - [Methods](#methods)
- [When to Use `embodify` vs `embody`](#when-to-use-embodify-vs-embody)
- [File Structure](#file-structure)
- [Links](#links)

## Design Principles

### Immutability

Every method returns a new chain link. The original is never touched.

```javascript
const base = embodify({ code: 'let x = 5;', config: {} }).trace();
const filtered = base.filterSteps({ config: { presets: 'overview' } });

// base is unchanged — filtered is a separate chain link
base.steps;     // original steps
filtered.steps; // filtered steps
```

This enables branching: trace once, filter multiple times from the same base.

### Lazy Cascade

Getters compute on demand, following a dependency chain:

```
code → [instrument()] → instrumented → [record()] → steps
```

If only `code` is set, accessing `.instrumented` runs `instrument()` internally. Accessing `.steps` runs the full pipeline. Each access computes fresh — no caching, no side effects.

```javascript
const chain = embodify({ code: 'let x = 5;' });

// Nothing computed yet
chain.code;          // 'let x = 5;' (stored directly)
chain.instrumented;  // computed via instrument()
chain.steps;         // computed via instrument() + record()
```

### Pickle-Awareness

Config and steps accept JSON strings in addition to objects and arrays. Invalid JSON throws (consistent with all tracing functions).

```javascript
// These are equivalent:
embodify({ config: { presets: 'overview' } });
embodify({ config: '{"presets":"overview"}' });

// Invalid JSON → default config (no error thrown)
embodify({ config: '{bad json' });

// Steps from JSON string (auto-deserialized)
embodify({ steps: '[{},{},{}]' });
```

## Quick Start

```javascript
import { embodify } from '@study-lenses/embody';

// 1. Simple trace
const result = embodify({ code: 'let x = 5;' }).trace();
console.log(result.steps); // Array of execution trace events

// 2. Lazy cascade — steps computed on access (no explicit .trace() needed)
const steps = embodify({ code: 'let x = 5;' }).steps;

// 3. Branch and compare
const base = embodify({ code, config: { presets: 'detailed' } }).trace();
const overview = base.filterSteps({ config: { presets: 'overview' } });
const exhaustive = base.filterSteps({ config: { presets: 'exhaustive' } });
// base is unchanged — overview and exhaustive are independent branches
```

## API Surface Summary

### Getters

All getters are pure — they compute fresh on each access with no caching.

| Getter           | Type             | Description                               | Cascades From                      |
| ---------------- | ---------------- | ----------------------------------------- | ---------------------------------- |
| `.code`          | `string`         | Source code (default `''`)                 | —                                  |
| `.config`        | `ExpandedConfig` | Fully expanded config (always has value)   | —                                  |
| `.instrumented`  | `string`         | Instrumented code                          | `.code` via `instrument()`         |
| `.steps`         | `Step[]`         | Trace events                               | `.instrumented` via `record()`     |
| `.pickledSteps`  | `string`         | JSON-serialized steps                      | `.steps` via `serialize()`         |
| `.pickledConfig` | `string`         | JSON-serialized config                     | `.config` via `JSON.stringify()`   |

### Methods

All methods return a new chain link (immutable).

| Method                                              | Purpose                  | Resets                           |
| --------------------------------------------------- | ------------------------ | -------------------------------- |
| `.set({ code \| instrumented \| steps \| config })` | Single-property setter   | Dependents of changed property   |
| `.mergeConfig({ config })`                          | Partial config merge     | `instrumented`, `steps`          |
| `.instrument({ config? })`                          | Explicit instrumentation | `steps`                          |
| `.trace({ code?, instrumented?, config? })`         | Full trace execution     | Creates fresh chain link         |
| `.filterSteps({ steps?, config? })`                 | Filter trace data        | Creates filtered chain link      |

## When to Use `embodify` vs `embody`

|                    | `embody()`                         | `embodify()`                              |
| ------------------ | ---------------------------------- | ----------------------------------------- |
| API Style          | Currying (functional)              | Chaining (fluent)                         |
| Result             | Final `TraceResult`                | Chain link (intermediate states)          |
| Branching          | Not supported                      | Branch from any chain link                |
| Lazy evaluation    | No (eager execution)               | Yes (getters compute on demand)           |
| Granular control   | Limited (instrument + record together) | Full (instrument, trace, filter separately) |
| Serialization      | Manual                             | Built-in (`.pickledSteps`, `.pickledConfig`) |
| Best for           | Simple trace-and-done              | Multi-step workflows, comparison, batch   |

**Rule of thumb**: Use `embody()` when you need a trace result and you're done. Use `embodify()` when you need to branch, compare, batch-process, or control individual pipeline stages.

## File Structure

```
src/api/embodify/
  embodify.ts              # Public entry point (validates, parses, delegates)
  chain-embodify.ts        # Internal chain builder (getters + methods)
  parse-config.ts          # JSON string → config object
  parse-steps.ts           # JSON string → steps array (via deserialize)
  resolve-method-config.ts # Merges method config overrides on chain config
  validate-field.ts        # Type-checks individual field values
  tests/
    embodify.test.ts              # Main test suite (30 TDD increments)
    parse-config.test.ts          # Config parsing tests
    parse-steps.test.ts           # Steps parsing tests
    resolve-method-config.test.ts # Config resolution tests
    validate-field.test.ts        # Validation tests
```

## Links

- [Full API Reference](./DOCS.md) — every getter, method, cascade mechanic, and use case recipe
- [Root API Documentation](../../DOCS.md) — complete `@study-lenses/embody` API reference
- [Configuration System](../../configuring/README.md) — detailed configuration options
- [Developer Guide](../../DEV.md) — architecture and codebase conventions
