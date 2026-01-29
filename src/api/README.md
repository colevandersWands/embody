# api

**Public interface for the embody execution tracer**

Five exports at three access levels: simple curried entry points for common workflows, a chainable wrapper for multi-step pipelines, and individual pipeline functions for custom composition. All share pickle support (JSON string auto-parsing) and the object-threading data flow pattern.

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

1. **Entry points** (`embody`, `squint`, `pickles`) -- curried functions for the two most common workflows: trace code and filter traces. One call, one result. Currying enables config reuse without manual caching.

2. **Chainable wrapper** (`embodify`) -- immutable chain links with lazy-cascading getters. Trace once, branch into multiple filtered views, serialize at any point. For workflows that need intermediate states or comparison.

3. **Pipeline functions** (`tracing`) -- individual stages (`fillConfig`, `instrument`, `record`, `filterSteps`, `serialize`, `deserialize`) exposed as a namespace. For custom pipelines, selective stage execution, or integration with external systems.

Each level delegates downward: `embody` calls `fillConfig` + `instrumentRecord` internally. `embodify` calls the same pipeline functions through its chain mechanics. The pipeline functions are the shared foundation.

### Currying for Reuse

Both `embody` and `squint` support three usage patterns:

- **Both parameters** -- immediate execution, returns result
- **First parameter only** -- returns a curried function, caches expensive setup (config normalization)
- **Second parameter only** -- returns a curried function, closes over the data

This enables patterns like: normalize config once, trace 200 student submissions with the cached config.

### Pickle Support

All entry points accept JSON strings wherever they accept objects or arrays. A config object and `'{"presets":"overview"}'` are interchangeable. Steps arrays and `'[{},{},{}]'` are interchangeable. Invalid JSON throws with a descriptive error (consistent across all functions).

This simplifies transport: receive JSON from an API, pass it directly without manual parsing.

## Quick Start

```typescript
import { embody, squint, pickles, embodify, tracing } from '@study-lenses/embody';

// 1. Trace code (simplest path)
const { steps } = embody({ code: 'let x = 5;', config: { presets: 'overview' } });

// 2. Reuse config across multiple traces (currying)
const tracer = embody({ config: { presets: 'detailed' } });
const trace1 = tracer({ code: 'let x = 5' });
const trace2 = tracer({ code: 'const y = 10' });

// 3. Filter existing trace without re-executing
const filtered = squint({ steps, config: { presets: 'overview' } });

// 4. Toggle serialization format (steps and/or config)
const { steps: json } = pickles({ steps }); // array → JSON string
const { steps: array } = pickles({ steps: json }); // JSON string → array
const { config: cJson } = pickles({ config: myConfig }); // object → JSON string

// 5. Chainable pipeline with branching
const base = embodify({ code: 'let x = 5;' }).trace();
const overview = base.filterSteps({ config: { presets: 'overview' } });
const exhaustive = base.filterSteps({ config: { presets: 'exhaustive' } });

// 6. Custom pipeline from individual stages
const { config } = tracing.fillConfig({ config: { presets: 'overview' } });
const { instrumented } = tracing.instrument({ code: 'let x = 5;', config });
const { steps: recorded } = tracing.record({ instrumented, config });
```

## API Surface Summary

| Export     | Type             | Purpose                    | Returns                                          |
| ---------- | ---------------- | -------------------------- | ------------------------------------------------ |
| `embody`   | Curried function | Trace code execution       | `TraceResult` (code, config, steps)              |
| `squint`   | Curried function | Filter existing trace      | `FilterResult` (steps, config)                   |
| `pickles`  | Function         | Toggle steps/config format | `{ steps?, config? }` toggled to opposite format |
| `embodify` | Chain factory    | Immutable pipeline wrapper | Chain link (getters + methods)                   |
| `tracing`  | Namespace object | Individual pipeline stages | Per-function (see tracing docs)                  |

## When to Use What

| Need                                  | Use                | Why                                                         |
| ------------------------------------- | ------------------ | ----------------------------------------------------------- |
| Trace code, get result, done          | `embody`           | Simplest path. One call returns `{ code, config, steps }`   |
| Trace same config, many codes         | `embody` (curried) | Config-first currying caches normalization                  |
| Filter existing trace                 | `squint`           | Post-processing without re-execution                        |
| Same filter, many traces              | `squint` (curried) | Config-first currying caches normalization                  |
| Serialize/deserialize steps or config | `pickles`          | Bidirectional toggle for one or both fields                 |
| Trace once, filter many ways          | `embodify`         | Immutable branching from any chain link                     |
| Intermediate pipeline states          | `embodify`         | Lazy getters expose `instrumented`, `steps`, `pickledSteps` |
| Batch processing with comparison      | `embodify`         | Chain links are independent, composable                     |
| Custom pipeline composition           | `tracing`          | Mix stages with external systems                            |
| Skip stages (e.g., instrument only)   | `tracing`          | Each function is standalone                                 |
| Testing pipeline stages               | `tracing`          | Direct access to each stage's input/output                  |

**Rule of thumb**: Start with `embody`. Move to `embodify` when you need branching or intermediate states. Drop to `tracing` when you need custom composition.

## File Structure

```
src/api/
  embody.ts              # Main curried entry: code + config → TraceResult
  squint.ts              # Post-filter curried entry: steps + config → FilterResult
  pickles.ts             # Serialization toggle: steps/config ↔ JSON string
  tests/
    embody.test.ts
    squint.test.ts
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
    instrument.ts        # Stage 2: code instrumentation
    record.ts            # Stage 3: execution recording
    instrument-record.ts # Stages 2+3 orchestrator
    filter-steps.ts      # Post-processing filter
    serialize.ts         # Steps → JSON string
    deserialize.ts       # JSON string → Steps
    README.md            # Conceptual overview
    DOCS.md              # Full technical reference
    tests/
```

## Implementation Status

| Function                   | Status | Notes                                                   |
| -------------------------- | ------ | ------------------------------------------------------- |
| `embody`                   | Real   | Full currying, pickle support, validation               |
| `squint`                   | Real   | Full currying, pickle support, validation               |
| `pickles`                  | Real   | Bidirectional toggle with validation                    |
| `embodify`                 | Real   | Full chain mechanics, lazy cascade, immutability        |
| `tracing.fillConfig`       | Real   | Full config pipeline (presets, expansion, sanitization) |
| `tracing.instrument`       | Stub   | Placeholder; Aran integration pending                   |
| `tracing.record`           | Stub   | Placeholder; execution engine pending                   |
| `tracing.instrumentRecord` | Real   | Orchestrates instrument + record                        |
| `tracing.filterSteps`      | Stub   | Pass-through; filtering logic pending                   |
| `tracing.serialize`        | Real   | JSON.stringify wrapper with validation                  |
| `tracing.deserialize`      | Real   | JSON.parse with error handling                          |

## Links

- [Full Technical Reference](./DOCS.md) -- signatures, errors, and internal flow for embody, squint, pickles
- [embodify Documentation](./embodify/README.md) -- chainable pipeline wrapper
- [embodify Technical Reference](./embodify/DOCS.md) -- every getter, method, and cascade mechanic
- [tracing Documentation](./tracing/README.md) -- individual pipeline functions
- [tracing Technical Reference](./tracing/DOCS.md) -- every pipeline stage signature and error
- [Root API Documentation](../../DOCS.md) -- complete `@study-lenses/embody` API reference
- [Configuration System](../configuring/README.md) -- detailed configuration options
- [Developer Guide](../../DEV.md) -- architecture and codebase conventions
