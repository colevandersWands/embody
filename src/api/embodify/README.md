# embodify

**Chainable, immutable pipeline wrapper for code tracing**

A fluent API for composing code tracing as a chain of immutable operations. Each method returns a new chain link — the original is never mutated. Getters cascade lazily: accessing `.steps` when only code is set triggers the full `code → steps` pipeline on demand.

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
const retraced = base.trace({ config: { presets: 'overview' } });

// base is unchanged — retraced is a separate chain link
base.steps; // original steps
retraced.steps; // retraced steps with different config
```

This enables batch processing with different configurations from the same base.

### Lazy Cascade

Getters compute on demand, following a dependency chain:

```
code → [record()] → steps
```

Accessing `.steps` runs the full pipeline. Each access computes fresh — no caching, no side effects.

```javascript
const chain = embodify({ code: 'let x = 5;' });

// Nothing computed yet
chain.code; // 'let x = 5;' (stored directly)
chain.steps; // computed via record()
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

// 3. Batch processing with same config
const tracer = embodify({ config: { presets: 'detailed' } });
const trace1 = tracer.trace({ code: 'let x = 5;' });
const trace2 = tracer.trace({ code: 'const y = 10;' });
// tracer is unchanged — trace1 and trace2 are independent chain links
```

## API Surface Summary

### Getters

All getters are pure — they compute fresh on each access with no caching.

| Getter           | Type             | Description                              | Cascades From                    |
| ---------------- | ---------------- | ---------------------------------------- | -------------------------------- |
| `.code`          | `string`         | Source code (default `''`)               | —                                |
| `.config`        | `ExpandedConfig` | Fully expanded config (always has value) | —                                |
| `.steps`         | `Step[]`         | Trace events                             | `.code` via `record()`           |
| `.pickledSteps`  | `string`         | JSON-serialized steps                    | `.steps` via `serialize()`       |
| `.pickledConfig` | `string`         | JSON-serialized config                   | `.config` via `JSON.stringify()` |

### Methods

All methods return a new chain link (immutable).

| Method                              | Purpose                | Resets                         |
| ----------------------------------- | ---------------------- | ------------------------------ |
| `.set({ code \| steps \| config })` | Single-property setter | Dependents of changed property |
| `.mergeConfig({ config })`          | Partial config merge   | `steps`                        |
| `.trace({ code?, config? })`        | Full trace execution   | Creates fresh chain link       |

## When to Use `embodify` vs `embody`

|                  | `embody()`            | `embodify()`                                 |
| ---------------- | --------------------- | -------------------------------------------- |
| API Style        | Currying (functional) | Chaining (fluent)                            |
| Result           | Final `TraceResult`   | Chain link (intermediate states)             |
| Lazy evaluation  | No (eager execution)  | Yes (getters compute on demand)              |
| Granular control | Limited               | Full                                         |
| Serialization    | Manual                | Built-in (`.pickledSteps`, `.pickledConfig`) |
| Best for         | Simple trace-and-done | Multi-step workflows, batch processing       |

**Rule of thumb**: Use `embody()` when you need a trace result and you're done. Use `embodify()` when you need to batch-process or control individual pipeline stages.

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
- [API Module Overview](../README.md) — parent module with decision matrix
- [Root API Documentation](../../DOCS.md) — complete `@study-lenses/embody` API reference
- [Configuration System](../../configuring/README.md) — detailed configuration options
- [Developer Guide](../../DEV.md) — architecture and codebase conventions
