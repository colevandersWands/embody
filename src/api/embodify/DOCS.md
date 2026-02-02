# embodify — Technical Documentation

Complete reference for the `embodify` chainable pipeline wrapper. For a high-level overview and design principles, see [README.md](./README.md).

## Table of Contents

- [Constructor](#embodify-constructor)
- [Chain Link Getters](#chain-link-getters)
  - [`.code`](#code)
  - [`.config`](#config)
  - [`.steps`](#steps)
  - [`.pickledSteps`](#pickledsteps)
  - [`.pickledConfig`](#pickledconfig)
- [Chain Link Methods](#chain-link-methods)
  - [`.set()`](#set)
  - [`.mergeConfig()`](#mergeconfig)
  - [`.trace()`](#trace)
- [Cascade Behavior](#cascade-behavior)
- [Config Resolution in Methods](#config-resolution-in-methods)
- [Immutability Guarantees](#immutability-guarantees)
- [Use Case Recipes](#use-case-recipes)
- [Error Reference](#error-reference)
- [Internal Architecture](#internal-architecture)
- [Conceptual ChainLink Type](#conceptual-chainlink-type)
- [Testing Overview](#testing-overview)

## Constructor

### `embodify(options?)`

```typescript
function embodify(options?: {
  code?: string;
  config?: UserConfig | string;
  steps?: Step[] | string;
}): ChainLink;
```

Creates a chainable pipeline wrapper. All parameters are optional. String values for `config` and `steps` are auto-parsed as JSON.

#### Parameters

- `code` (string, optional) — source code to trace.
- `config` (UserConfig | string, optional) — configuration object or JSON string. Invalid JSON throws. Expanded via `createConfig()`.
- `steps` (Step[] | string, optional) — pre-existing trace steps array or JSON string. Deserialized via `deserialize()` when string.

#### Returns

Chain link object with getters and methods (see sections below).

#### Throws

- `Error('code must be a string')` — if `code` is not a string
- `Error('config must be a plain object or JSON string')` — if `config` is wrong type
- `Error('steps must be an array or JSON string')` — if `steps` is wrong type

#### Construction Examples

```javascript
import { embodify } from '@study-lenses/embody';

// 1. Empty — all defaults
const e = embodify();
e.code; // ''
e.steps; // []
e.config; // default ExpandedConfig

// 2. With code — cascade computes steps on demand
const e = embodify({ code: 'let x = 5;' });
e.code; // 'let x = 5;'
e.steps; // cascaded via record()

// 3. With config — preset applied and expanded
const e = embodify({ config: { presets: 'overview' } });
e.config; // full ExpandedConfig with overview preset

// 4. With pre-existing steps
const e = embodify({ steps: [{}, {}, {}] });
e.steps; // [{}, {}, {}]

// 5. With JSON strings — auto-parsed
const e = embodify({
  config: '{"presets":"overview"}',
  steps: '[{},{}]',
});
e.config; // expanded overview config
e.steps; // [{}, {}]
```

## Chain Link Getters

All getters are pure — they compute fresh on each access with no caching or side effects.

### `.code`

- **Type**: `string`
- **Default**: `''` (empty string when not set)

Returns the source code stored in this chain link.

```javascript
embodify({ code: 'abc' }).code; // 'abc'
embodify().code; // ''
```

### `.config`

- **Type**: `ExpandedConfig`
- **Default**: `createConfig({})` (fully expanded default config)

Always has a value. When a config is provided at construction or via methods, it is expanded through `createConfig()`. Always contains `lang` and `meta` sections.

```javascript
embodify().config; // default ExpandedConfig
embodify({ config: { presets: 'overview' } }).config; // overview ExpandedConfig
```

### `.steps`

- **Type**: `Step[]`
- **Default**: `[]` (empty array when nothing is set)
- **Cascades from**: `.code` via `record()`

Cascade priority:

1. If `_steps` was explicitly set, returns that value
2. If `_code` is set (but not `_steps`), calls `record({ code, config })`
3. If nothing is set, returns `[]`

```javascript
embodify({ code: 'abc' }).steps; // cascaded via record()
embodify({ steps: [{}, {}] }).steps; // [{}, {}] (stored directly)
embodify().steps; // []
```

### `.pickledSteps`

- **Type**: `string`
- **Cascades from**: `.steps` via `serialize()`

JSON-serialized version of `.steps`. Triggers the full cascade if steps aren't already set.

```javascript
embodify({ steps: [{}, {}] }).pickledSteps; // '[{},{}]'
embodify().pickledSteps; // '[]'
```

### `.pickledConfig`

- **Type**: `string`
- **Cascades from**: `.config` via `JSON.stringify()`

JSON-serialized version of `.config`.

```javascript
const pickled = embodify().pickledConfig;
JSON.parse(pickled); // { presets: 'detailed', meta: {...}, lang: {...} }
```

## Chain Link Methods

All methods return a new chain link. The original is never mutated.

### `.set()`

```typescript
.set(input?: {
  code?: string;
  steps?: Step[] | string;
  config?: UserConfig | string;
}): ChainLink
```

Sets exactly one property at a time. Multiple properties throw. Empty or no-arg call is a no-op (returns new chain link with same state). Pickle-aware: `config` and `steps` accept JSON strings.

#### Reset Behavior

When a property is set, its dependents are reset (cleared to null, triggering lazy cascade on next access):

| Property Set | Preserves | Resets (lazy cascade) |
| ------------ | --------- | --------------------- |
| `code`       | `config`  | `steps`               |
| `steps`      | `config`  | `code` (→ `''`)       |
| `config`     | `code`    | `steps`               |

#### Throws

- `Error('set() accepts exactly one of: code, steps, config')` — if multiple properties provided
- Type validation errors (same as constructor)

#### Examples

```javascript
const base = embodify({ code: 'abc', config: {} }).trace();

// Set new code — steps recompute lazily
const e2 = base.set({ code: 'xy' });
e2.code; // 'xy'
e2.steps; // recomputed from 'xy'
e2.config; // preserved from base

// Set new config — code preserved, steps recompute
const e3 = base.set({ config: { presets: 'overview' } });
e3.code; // 'abc' (preserved)
e3.config; // overview config

// Set steps — code becomes ''
const e4 = base.set({ steps: [{}, {}, {}, {}] });
e4.steps; // [{}, {}, {}, {}]
e4.code; // '' (reset)

// JSON string steps auto-parsed
const e5 = base.set({ steps: '[{},{}]' });
e5.steps; // [{}, {}]

// No-op — new chain link with same state
const e6 = base.set();
const e7 = base.set({});
```

### `.mergeConfig()`

```typescript
.mergeConfig(options?: {
  config?: UserConfig | string;
}): ChainLink
```

Merges partial config on top of the current chain config. Preserves `code`. Resets `steps` (config-dependent values).

When a **preset** is specified in the merge, the entire config is replaced (preset = "give me this whole profile").

No-op if no config provided.

#### Examples

```javascript
const base = embodify({ code: 'abc', config: {} });

// Partial merge — only changes specified fields
const e2 = base.mergeConfig({
  config: { lang: { bindings: { events: { read: false } } } },
});
e2.config.lang.bindings.events.read; // false (overridden)
e2.config.lang.bindings.events.assign; // true (preserved from base)

// Preset merge — replaces entire config
const e3 = base.mergeConfig({ config: { presets: 'overview' } });
// e3.config is the full overview config

// Steps recompute lazily after merge
const traced = base.trace();
const e4 = traced.mergeConfig({
  config: { lang: { bindings: { events: { read: false } } } },
});
e4.code; // 'abc' (preserved)
e4.steps; // recomputed
```

### `.trace()`

```typescript
.trace(options?: {
  code?: string;
  config?: UserConfig | string;
}): ChainLink
```

Full trace execution. Records execution trace from code (override or chain code or empty string).

Config override is narrowly merged on top of chain config.

#### Examples

```javascript
// From code
const e = embodify({ code: 'abc' }).trace();
e.steps; // trace events
e.code; // 'abc' (preserved)

// With code override
const e2 = embodify({ code: 'abc' }).trace({ code: 'xy' });
e2.steps; // trace events for 'xy'

// With config override (narrowly merged)
const e3 = embodify({ code: 'abc', config: {} }).trace({
  config: { lang: { bindings: { events: { read: false } } } },
});
e3.config.lang.bindings.events.read; // false
e3.config.lang.bindings.events.assign; // true

// Empty — traces empty string
const e4 = embodify({}).trace();
e4.steps; // []
```

## Cascade Behavior

The cascade is the core mechanism that makes `embodify` work. When a getter is accessed and the corresponding internal value is `null` (not explicitly set), it cascades down the dependency chain:

```
                                          serialize()
                                              │
┌──────┐         record()         ┌───────┐ ──→ ┌──────────────┐
│ code │ ───────────────────────→ │ steps │     │ pickledSteps │
└──────┘                          └───────┘     └──────────────┘
```

### Key behaviors

- **No caching**: Getters compute fresh on each access. This keeps behavior pure and predictable.
- **`null` = "not provided"**: Internal state uses `null` to mean "this value was not explicitly set — cascade to compute it". This is distinct from empty string or empty array, which mean "explicitly set to empty".
- **Cascade stops at explicit values**: If `_steps` is explicitly set, `.steps` returns it directly without re-recording from code.

### Cascade examples

```javascript
// Only code set → cascade
const e = embodify({ code: 'abc' });
e.steps; // cascades: record({ code: 'abc', config })

// Steps set → no cascade
const e = embodify({ steps: [{}, {}] });
e.steps; // [{}, {}] (stored directly)
```

## Config Resolution in Methods

Methods that accept a config override (`.trace()`) use `resolveMethodConfig()` to determine the effective config:

| Chain Config | Method Override | Result                                          |
| ------------ | --------------- | ----------------------------------------------- |
| Present      | Present         | Override narrowly merged on top of chain config |
| Present      | Absent          | Chain config as-is                              |
| Default      | Present         | Override narrowly merged on top of defaults     |
| Default      | Absent          | Defaults as-is                                  |

### Narrow expansion

When a config override is provided, it goes through `createNarrowConfig()` before merging. This expands only the fields present in the override (rather than expanding the entire config to defaults), so the merge only changes what you specified.

```javascript
const base = embodify({ code: 'abc', config: {} });

// Override merges narrowly — only changes read, preserves everything else
const e = base.trace({
  config: { lang: { bindings: { events: { read: false } } } },
});
e.config.lang.bindings.events.read; // false (from override)
e.config.lang.bindings.events.assign; // true (preserved from chain)
```

### JSON string overrides

Method config overrides also accept JSON strings. Invalid JSON throws (consistent with all tracing functions).

```javascript
// JSON string config in methods
embodify({ code: 'abc' }).trace({ config: '{"presets":"overview"}' });
```

## Immutability Guarantees

No method or getter mutates the original chain link. Every operation that changes state returns a new chain link.

```javascript
const base = embodify({ code: 'abc', config: {} }).trace();

// .set() does not mutate original
base.set({ config: { presets: 'overview' } });
base.code; // still 'abc'
base.steps; // still original steps

// .set({ code }) does not mutate original
base.set({ code: 'xy' });
base.code; // still 'abc'

// .mergeConfig() does not mutate original
base.mergeConfig({ config: { lang: { bindings: { events: { read: false } } } } });
base.config.lang.bindings.events.read; // still true
```

## Use Case Recipes

### A. Granular Pipeline Control

Trace code and inspect results.

```javascript
const traced = embodify({ code: 'abc', config: {} }).trace();
console.log(traced.steps); // trace events
```

### B. Batch Processing

Reuse a configured chain as a factory for multiple traces.

```javascript
const tracer = embodify({ config: {} });
const results = ['abc', 'xy'].map((c) => tracer.trace({ code: c }).steps);
// results[0] → steps for 'abc'
// results[1] → steps for 'xy'
```

### C. Update Config Mid-Chain

Merge config after tracing to recompute with adjusted settings.

```javascript
const traced = embodify({ code: 'abc', config: {} }).trace();
const e = traced.mergeConfig({
  config: { lang: { bindings: { events: { read: false } } } },
});
e.steps; // recomputed with merged config
e.config.lang.bindings.events.read; // false
```

## Error Reference

| Error Message                                        | Trigger                                                  |
| ---------------------------------------------------- | -------------------------------------------------------- |
| `'code must be a string'`                            | `code` value is not a string (in constructor or `.set()` |
| `'config must be a plain object or JSON string'`     | `config` is not an object, not a string, is null, or is an array |
| `'steps must be an array or JSON string'`            | `steps` is not an array and not a string                 |
| `'set() accepts exactly one of: code, steps, config'` | Multiple properties passed to `.set()`                   |

All validation happens eagerly at the boundary (constructor and `.set()`). Internal chain operations do not throw for type issues.

## Internal Architecture

Six files compose the `embodify` module:

**`embodify.ts`** — Public entry point. Validates user input (exclusive pair, type checks via `validateField`), parses config and steps from JSON strings, then delegates to the internal chain builder. This is the only file consumers import.

**`chain-embodify.ts`** — Internal chain builder. Constructs the chain link object with lazy-cascading getters and pipeline methods. No validation — callers are responsible for valid input. Uses `null` for "not provided" to drive cascade logic. Every method returns a new chain link via recursive call to `chainEmbodify()`.

**`parse-config.ts`** — Parses config from JSON string to object. `undefined`/`null` → `{}`. Invalid JSON throws (via `deserialize`). Objects pass through unchanged.

**`parse-steps.ts`** — Parses steps from JSON string to array via `deserialize()`. Arrays pass through unchanged.

**`resolve-method-config.ts`** — Resolves effective config for pipeline method calls. When override is provided: parses it, narrowly expands via `createNarrowConfig()`, deep-merges on top of chain config. When no override: chain config passes through.

**`validate-field.ts`** — Type-checks a single field value by key. Throws descriptive errors for type mismatches. No-op if value is `undefined`. Used by both `embodify()` constructor and `.set()` method.

## Conceptual ChainLink Type

The chain link returned by `embodify()` is not formally typed — the current implementation uses `any`. This is a known gap for future typing work. The conceptual type is:

```typescript
type ChainLink = {
  // Getters (lazy cascade, pure, no caching)
  readonly code: string;
  readonly config: ExpandedConfig;
  readonly steps: Step[];
  readonly pickledSteps: string;
  readonly pickledConfig: string;

  // Methods (return new ChainLink)
  set(input?: {
    code?: string;
    steps?: Step[] | string;
    config?: UserConfig | string;
  }): ChainLink;

  mergeConfig(options?: { config?: UserConfig | string }): ChainLink;

  trace(options?: {
    code?: string;
    config?: UserConfig | string;
  }): ChainLink;
};
```

## Testing Overview

The test suite is organized into 5 phases with 30 TDD increments, following the development plan.

### Stub Convention

Tests use stub implementations for the pipeline functions:

- `record()` creates empty objects per character: `'abc'` → `[{}, {}, {}]`

Real usage produces actual trace events — the stub patterns (`'abc' → [{},{},{}]`) appear only in tests.

### Test Phases

| Phase                       | Increments | Focus                                                                          |
| --------------------------- | ---------- | ------------------------------------------------------------------------------ |
| 1. Construction & Getters   | 1–5        | Empty construction, values, exclusive pair, JSON parsing, pickle serialization |
| 2. Setter Methods           | 6–12       | `.set()` for each property, `.mergeConfig()`, edge cases, validation           |
| 3. Pipeline Methods         | 14–21      | `.trace()` with overrides and edge cases                                       |
| 4. Config Resolution        | 25–26      | Four-case config matrix, JSON string configs in methods                        |
| 5. Integration & Edge Cases | 27–29      | Lazy recomputation, immutability, full use cases, edge cases                   |

### Test Files

| File                            | Tests | Covers                                          |
| ------------------------------- | ----- | ----------------------------------------------- |
| `embodify.test.ts`              | ~80   | Full API surface (30 increments)                |
| `parse-config.test.ts`          | 5     | JSON parsing, invalid JSON, null/undefined      |
| `parse-steps.test.ts`           | 3     | Array pass-through, JSON deserialization        |
| `resolve-method-config.test.ts` | 10    | Override merging, JSON parsing, preset handling |
| `validate-field.test.ts`        | 18    | Type validation for all field types             |

Config tests use real configs (the config module is fully functional, not stubbed).
