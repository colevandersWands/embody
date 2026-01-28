# tracing

**Individual pipeline functions for fine-grained code tracing control**

The low-level building blocks behind `embody` and `embodify`. Each function handles one stage of the tracing pipeline: normalize config, instrument code, record execution, filter results, serialize/deserialize. Use these directly when you need custom pipelines, selective stage execution, or integration with external systems.

## Table of Contents

- [Design Principles](#design-principles)
  - [Object-Threading](#object-threading)
  - [Graceful Degradation](#graceful-degradation)
  - [Stage Independence](#stage-independence)
- [Quick Start](#quick-start)
- [Pipeline Overview](#pipeline-overview)
- [API Surface Summary](#api-surface-summary)
- [Implementation Status](#implementation-status)
- [File Structure](#file-structure)
- [Links](#links)

## Design Principles

### Object-Threading

Every function receives a plain object, validates at the boundary, enriches it with new data, and returns the enriched object. Input fields are preserved in the output so downstream stages have access to all prior data.

```typescript
// instrument preserves code and config, adds instrumented
const { code, config, instrumented } = instrument({ code: 'let x = 5;', config });
```

### Graceful Degradation

Missing optional parameters resolve to sensible defaults (empty string for code, empty array for steps, default config for config). Type errors at boundaries throw descriptive errors with the function name, expected type, and actual type.

### Stage Independence

Each function is usable standalone or composed with others. `fillConfig` doesn't know about `instrument`, `record` doesn't know about `filterSteps`. The only composition-aware function is `instrumentRecord`, which orchestrates `instrument` + `record` as a convenience.

## Quick Start

```typescript
import { tracing } from '@study-lenses/embody';

const {
  fillConfig,
  instrument,
  record,
  instrumentRecord,
  filterSteps,
  serialize,
  deserialize,
} = tracing;

// Custom pipeline: normalize config, instrument, record
const { config } = fillConfig({ config: { presets: 'overview' } });
const { instrumented } = instrument({ code: 'let x = 5;', config });
const { steps } = record({ instrumented, config });

// Or use the orchestrator for instrument + record in one step
const result = instrumentRecord({ code: 'let x = 5;', config });
// result: { code, config, steps }

// Post-processing
const { steps: filtered } = filterSteps({ steps, config });

// Serialization round-trip
const json = serialize({ steps });
const restored = deserialize({ serializedSteps: json });
```

## Pipeline Overview

```
fillConfig ─→ instrument ─→ record ─→ [filterSteps]
                  └── instrumentRecord ──┘
                                     serialize ⟷ deserialize
```

`fillConfig` normalizes user configuration. `instrument` transforms code with Aran hooks. `record` executes instrumented code and collects trace events. `instrumentRecord` combines instrument + record. `filterSteps` post-processes existing traces. `serialize`/`deserialize` handle JSON conversion.

## API Surface Summary

| Function | Stage | Input | Output | Purpose |
| --- | --- | --- | --- | --- |
| `fillConfig` | 1 | `{ config? }` | `{ config }` | UserConfig to ExpandedConfig |
| `instrument` | 2 | `{ code?, config? }` | `{ code, config, instrumented }` | Code to instrumented code |
| `record` | 3 | `{ instrumented?, config? }` | `{ instrumented, config, steps }` | Execute and collect trace |
| `instrumentRecord` | 2+3 | `{ code?, config? }` | `{ code, config, steps }` | instrument + record combined |
| `filterSteps` | post | `{ steps?, config? }` | `{ steps, config }` | Filter existing trace |
| `serialize` | util | `{ steps }` | `string` | Step[] to JSON string |
| `deserialize` | util | `{ serializedSteps }` | `Step[]` | JSON string to Step[] |

## Implementation Status

| Function | Status | Notes |
| --- | --- | --- |
| `fillConfig` | Real | Full config pipeline (presets, expansion, sanitization) |
| `instrument` | Stub | Placeholder transforms code; Aran integration pending |
| `record` | Stub | Placeholder produces empty objects; execution engine pending |
| `instrumentRecord` | Real | Orchestrates instrument + record |
| `filterSteps` | Stub | Pass-through; filtering logic pending |
| `serialize` | Real | JSON.stringify wrapper with validation |
| `deserialize` | Real | JSON.parse with error handling |

## File Structure

```
src/api/tracing/
  fill-config.ts         # Stage 1: config normalization
  instrument.ts          # Stage 2: code instrumentation
  record.ts              # Stage 3: execution recording
  instrument-record.ts   # Stages 2+3 orchestrator
  filter-steps.ts        # Post-processing filter
  serialize.ts           # Steps to JSON string
  deserialize.ts         # JSON string to Steps
  tests/
    fill-config.test.ts
    instrument.test.ts
    record.test.ts
    instrument-record.test.ts
    filter-steps.test.ts
    serialize.test.ts
    deserialize.test.ts
```

## Links

- [Full Technical Reference](./DOCS.md) -- every function signature, parameter, error, and example
- [Root API Documentation](../../DOCS.md) -- complete `@study-lenses/embody` API reference
- [Configuration System](../../configuring/README.md) -- detailed configuration options
- [embodify (chainable wrapper)](../embodify/README.md) -- fluent API built on these functions
