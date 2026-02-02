# api

**Public interface for the embody execution tracer**

Four exports at three access levels: simple curried entry points for common workflows, a chainable wrapper for multi-step pipelines, and individual pipeline functions for custom composition. All share pickle support (JSON string auto-parsing) and the object-threading data flow pattern.

## Table of Contents

- [Design Principles](#design-principles)
  - [Three Access Levels](#three-access-levels)
  - [Currying for Reuse](#currying-for-reuse)
  - [Pickle Support](#pickle-support)
- [Quick Start](#quick-start)
- [API Surface Summary](#api-surface-summary)
- [When to Use What](#when-to-use-what)
- [File Structure](#file-structure)
- [Implementation Status](#implementation-status)
- [Links](#links)

## Design Principles

### Three Access Levels

The API is organized into three levels of control, from simplest to most granular:

1. **Entry points** (`embody`, `pickles`) -- curried functions for the main workflow: trace code. One call, one result. Currying enables config reuse without manual caching.

2. **Chainable wrapper** (`embodify`) -- immutable chain links with lazy-cascading getters. Trace once, serialize at any point. For workflows that need intermediate states or batch processing.

3. **Pipeline functions** (`tracing`) -- individual stages (`fillConfig`, `record`, `serialize`, `deserialize`) exposed as a namespace. For custom pipelines, selective stage execution, or integration with external systems.

Each level delegates downward: `embody` calls `fillConfig` + `record` internally. `embodify` calls the same pipeline functions through its chain mechanics. The pipeline functions are the shared foundation.

### Currying for Reuse

`embody` supports three usage patterns:

- **Both parameters** -- immediate execution, returns result
- **First parameter only** -- returns a curried function, caches expensive setup (config normalization)
- **Second parameter only** -- returns a curried function, closes over the data

This enables patterns like: normalize config once, trace 200 student submissions with the cached config.

### Pickle Support

All entry points accept JSON strings wherever they accept objects or arrays. A config object and `'{"presets":"overview"}'` are interchangeable. Steps arrays and `'[{},{},{}]'` are interchangeable. Invalid JSON throws with a descriptive error (consistent across all functions).

This simplifies transport: receive JSON from an API, pass it directly without manual parsing.

## Quick Start

```typescript
import { embody, pickles, embodify, tracing } from '@study-lenses/embody';

// 1. Trace code (simplest path)
const { steps } = embody({ code: 'let x = 5;', config: { presets: 'overview' } });

// 2. Reuse config across multiple traces (currying)
const tracer = embody({ config: { presets: 'detailed' } });
const trace1 = tracer({ code: 'let x = 5' });
const trace2 = tracer({ code: 'const y = 10' });

// 3. Toggle serialization format (steps and/or config)
const { steps: json } = pickles({ steps }); // array → JSON string
const { steps: array } = pickles({ steps: json }); // JSON string → array
const { config: cJson } = pickles({ config: myConfig }); // object → JSON string

// 4. Chainable pipeline for batch processing
const base = embodify({ code: 'let x = 5;' }).trace();
console.log(base.steps); // access traced steps
console.log(base.pickledSteps); // serialized steps

// 5. Custom pipeline from individual stages
const { config } = tracing.fillConfig({ config: { presets: 'overview' } });
const { steps: recorded } = tracing.record({ code: 'let x = 5;', config });
```

## API Surface Summary

| Export     | Type             | Purpose                    | Returns                                          |
| ---------- | ---------------- | -------------------------- | ------------------------------------------------ |
| `embody`   | Curried function | Trace code execution       | `TraceResult` (code, config, steps)              |
| `pickles`  | Function         | Toggle steps/config format | `{ steps?, config? }` toggled to opposite format |
| `embodify` | Chain factory    | Immutable pipeline wrapper | Chain link (getters + methods)                   |
| `tracing`  | Namespace object | Individual pipeline stages | Per-function (see tracing docs)                  |

## When to Use What

| Need                                  | Use                | Why                                                         |
| ------------------------------------- | ------------------ | ----------------------------------------------------------- |
| Trace code, get result, done          | `embody`           | Simplest path. One call returns `{ code, config, steps }`   |
| Trace same config, many codes         | `embody` (curried) | Config-first currying caches normalization                  |
| Serialize/deserialize steps or config | `pickles`          | Bidirectional toggle for one or both fields                 |
| Intermediate pipeline states          | `embodify`         | Lazy getters expose `steps`, `pickledSteps`, `pickledConfig`|
| Batch processing                      | `embodify`         | Chain links are independent, composable                     |
| Custom pipeline composition           | `tracing`          | Mix stages with external systems                            |
| Testing pipeline stages               | `tracing`          | Direct access to each stage's input/output                  |

**Rule of thumb**: Start with `embody`. Move to `embodify` when you need intermediate states or batch processing. Drop to `tracing` when you need custom composition.

## File Structure

```
src/api/
  embody.ts              # Main curried entry: code + config → TraceResult
  pickles.ts             # Serialization toggle: steps/config ↔ JSON string
  tests/
    embody.test.ts
    pickles.test.ts
  embodify/              # Chainable pipeline wrapper
    embodify.ts          # Public entry point
    chain-embodify.ts    # Internal chain builder
    parse-config.ts      # JSON string → config object
    parse-steps.ts       # JSON string → steps array
    validate-field.ts    # Type-checks field values
    resolve-method-config.ts  # Config merge for methods
    README.md            # Conceptual overview
    DOCS.md              # Full technical reference
    tests/
  tracing/               # Individual pipeline functions
    fill-config.ts       # Stage 1: config normalization
    record.ts            # Stage 2: execution recording
    serialize.ts         # Steps → JSON string
    deserialize.ts       # JSON string → Steps
    README.md            # Conceptual overview
    DOCS.md              # Full technical reference
    tests/
```

## Implementation Status

| Function               | Status | Notes                                                   |
| ---------------------- | ------ | ------------------------------------------------------- |
| `embody`               | Real   | Full currying, pickle support, validation               |
| `pickles`              | Real   | Bidirectional toggle with validation                    |
| `embodify`             | Real   | Full chain mechanics, lazy cascade, immutability        |
| `tracing.fillConfig`   | Real   | Full config pipeline (presets, expansion, sanitization) |
| `tracing.record`       | Stub   | Placeholder; execution engine pending                   |
| `tracing.serialize`    | Real   | JSON.stringify wrapper with validation                  |
| `tracing.deserialize`  | Real   | JSON.parse with error handling                          |

## Links

- [Full Technical Reference](./DOCS.md) -- signatures, errors, and internal flow for embody, pickles
- [embodify Documentation](./embodify/README.md) -- chainable pipeline wrapper
- [embodify Technical Reference](./embodify/DOCS.md) -- every getter, method, and cascade mechanic
- [tracing Documentation](./tracing/README.md) -- individual pipeline functions
- [tracing Technical Reference](./tracing/DOCS.md) -- every pipeline stage signature and error
- [Root API Documentation](../../DOCS.md) -- complete `@study-lenses/embody` API reference
- [Configuration System](../configuring/README.md) -- detailed configuration options
- [Developer Guide](../../DEV.md) -- architecture and codebase conventions
