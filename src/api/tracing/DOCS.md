# tracing -- Technical Documentation

Complete reference for the individual pipeline functions exposed via `tracing`. For a high-level overview and design principles, see [README.md](./README.md).

## Table of Contents

- [`fillConfig`](#fillconfig-config-)
- [`instrument`](#instrument-code-config-)
- [`record`](#record-instrumented-config-)
- [`instrumentRecord`](#instrumentrecord-code-config-)
- [`filterSteps`](#filtersteps-steps-config-)
- [`serialize`](#serialize-steps--config-)
- [`deserialize`](#deserialize-steps-config-)
- [Object-Threading Pattern](#object-threading-pattern)
- [Error Reference](#error-reference)
- [Testing Overview](#testing-overview)

---

## `fillConfig({ config? })`

Normalizes user configuration into a fully expanded configuration object. First stage of the tracing pipeline.

### Signature

```typescript
function fillConfig({ config }: FillConfigInput = {}): FillConfigOutput;
```

### Parameters

- `config` (UserConfig, optional) -- partial user configuration. When `undefined`, returns the default expanded configuration.

### Returns

`{ config: ExpandedConfig }` -- object containing the fully normalized configuration with all fields resolved, defaults applied, presets expanded, and boolean shorthands converted to objects.

### Throws

- `Error('fillConfig: expected config to be a plain object, got ...')` -- if config is provided but is not a plain object (e.g., array, string, number, null)

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { fillConfig } = tracing;

// Default config (no arguments)
const { config } = fillConfig({});
// config: complete ExpandedConfig with all defaults

// With preset
const { config } = fillConfig({ config: { presets: 'overview' } });
// config: overview preset applied and expanded

// With partial config
const { config } = fillConfig({
  config: { lang: { bindings: { events: { read: false } } } },
});
// config: defaults applied with read=false override

// Undefined config (same as empty)
const { config } = fillConfig({ config: undefined });
// config: complete ExpandedConfig with all defaults
```

### Remarks

The configuration pipeline runs four stages internally:

1. **Preset application** -- if `presets` field is set, merge preset values
2. **Default merge** -- deep-merge user config on top of defaults
3. **Shorthand expansion** -- convert boolean values to full objects
4. **Sanitization** -- remove unknown fields, fix wrong types with graceful degradation

Invalid values silently fall back to defaults rather than throwing.

---

## `instrument({ code?, config? })`

Instruments JavaScript code for execution tracing using the Aran framework. Second stage of the tracing pipeline. Transforms raw JavaScript code to include instrumentation hooks that generate trace events during execution.

### Signature

```typescript
function instrument({
  code,
  config,
}: { readonly code?: string; readonly config?: ExpandedConfig } = {}): InstrumentOutput;
```

### Parameters

- `code` (string, optional) -- JavaScript source code to instrument. Defaults to `''` (empty string).
- `config` (ExpandedConfig, optional) -- expanded configuration controlling what instrumentation hooks are inserted. Defaults to `createConfig({})`.

### Returns

`{ code, config, instrumented }` -- object preserving the original code and config, adding the instrumented version of the code with Aran advice hooks.

### Throws

- `Error('instrument: expected code to be a string, got ...')` -- if code is provided but is not a string
- `Error('instrument: expected config to be an object, got ...')` -- if config is provided but is not a plain object

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { fillConfig, instrument } = tracing;

// Instrument with pre-filled config
const { config } = fillConfig({ config: { presets: 'detailed' } });
const { instrumented } = instrument({
  code: 'let x = 5; console.log(x);',
  config,
});
// instrumented: code with Aran advice hooks for detailed tracing

// Empty code
const { instrumented } = instrument({});
// instrumented: '' (empty string)

// Default config
const result = instrument({ code: 'let x = 5;' });
// result.config: default ExpandedConfig
// result.code: 'let x = 5;' (preserved)
// result.instrumented: instrumented version
```

### Remarks

The instrumentation process:

1. **Parse** the code into an AST
2. **Apply Aran transformations** based on which config features are enabled
3. **Generate instrumented code** with advice hooks at relevant AST nodes
4. **Return** both original and instrumented versions

Graceful fallback: if instrumentation fails (e.g., syntax error in the source code), returns the original code with metadata explaining the fallback reason. This ensures the pipeline can continue even with problematic code.

---

## `record({ instrumented?, config? })`

Executes instrumented code and records the execution trace. Third stage of the tracing pipeline. Runs the instrumented code in a controlled environment and collects trace events generated by the Aran advice functions.

### Signature

```typescript
function record({
  instrumented,
  config,
}: { readonly instrumented?: string; readonly config?: ExpandedConfig } = {}): RecordOutput;
```

### Parameters

- `instrumented` (string, optional) -- instrumented JavaScript code (output from `instrument`). Defaults to `''` (empty string).
- `config` (ExpandedConfig, optional) -- expanded configuration controlling execution limits and what events are recorded. Defaults to `createConfig({})`.

### Returns

`{ instrumented, config, steps }` -- object preserving the instrumented code and config, adding the trace steps array collected during execution.

### Throws

- `Error('record: expected instrumented to be a string, got ...')` -- if instrumented is provided but is not a string
- `Error('record: expected config to be an object, got ...')` -- if config is provided but is not a plain object

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { fillConfig, instrument, record } = tracing;

// Full pipeline: config → instrument → record
const { config } = fillConfig({ config: { presets: 'detailed' } });
const { instrumented } = instrument({ code: 'let x = 5;', config });
const { steps } = record({ instrumented, config });
// steps: array of trace events from execution

// Empty instrumented code
const { steps } = record({});
// steps: [] (empty array)
```

### Remarks

Execution limits are controlled via the config's `meta` field:

| Limit               | Config Path              | Effect                       |
| ------------------- | ------------------------ | ---------------------------- |
| `maxSteps`          | `meta.maxSteps`          | Stop after N trace events    |
| `maxMemory`         | `meta.maxMemory`         | Stop when trace exceeds N MB |
| `maxRecursionDepth` | `meta.maxRecursionDepth` | Stop at recursion depth N    |
| `maxExecutionTime`  | `meta.maxExecutionTime`  | Stop after N milliseconds    |

When any limit is reached, execution stops gracefully and returns a partial trace with metadata indicating which limit was hit.

Async/await execution is not supported in v1.0. This feature is planned for v2.0.

---

## `instrumentRecord({ code?, config? })`

Complete pipeline orchestrator combining `instrument` and `record` into a single call. Threads configuration through both stages while preserving the original code in the output. This is the main internal orchestrator called by `embody` after configuration processing.

### Signature

```typescript
function instrumentRecord({
  code,
  config,
}: { readonly code?: string; readonly config?: ExpandedConfig } = {}): TraceOutput;
```

### Parameters

- `code` (string, optional) -- JavaScript source code to trace. Defaults to `''` (empty string).
- `config` (ExpandedConfig, optional) -- expanded configuration for both instrumentation and recording. Defaults to `createConfig({})`.

### Returns

`{ code, config, steps }` -- object with the original source code, the expanded config used, and the array of trace events from execution.

### Throws

- `Error('instrumentRecord: expected code to be a string, got ...')` -- if code is provided but is not a string
- `Error('instrumentRecord: expected config to be an object, got ...')` -- if config is provided but is not a plain object

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { fillConfig, instrumentRecord } = tracing;

// Trace code with pre-filled config
const { config } = fillConfig({ config: { presets: 'overview' } });
const { code, steps } = instrumentRecord({
  code: 'let x = 5; console.log(x);',
  config,
});
// code: 'let x = 5; console.log(x);' (preserved)
// steps: array of trace events

// Trace with default config
const result = instrumentRecord({ code: 'let x = 5;' });
// result.config: default ExpandedConfig
// result.steps: trace events

// Empty code
const { steps } = instrumentRecord({});
// steps: [] (empty array)
```

### Remarks

The object-threading flow:

```
instrumentRecord({ code, config })
  │
  ├─→ instrument({ code, config })
  │     └─→ { code, config, instrumented }
  │                              │
  └─→ record({ instrumented, config })
        └─→ { instrumented, config, steps }
  │
  └─→ return { code, config, steps }
```

1. Calls `instrument({ code, config })` to get `instrumented`
2. Calls `record({ instrumented, config })` to get `steps`
3. Returns `{ code, config, steps }` preserving the original source code

This is equivalent to calling `instrument` and `record` manually but avoids exposing the intermediate `instrumented` value when you only need the final trace.

---

## `filterSteps({ steps?, config? })`

Filters existing trace steps based on configuration settings. Post-processing stage that applies configuration filters to an existing trace, allowing different analytical perspectives without re-executing the code. This is the core implementation behind the `squint` public API function.

### Signature

```typescript
function filterSteps({
  steps,
  config,
}: { readonly steps?: readonly Step[]; readonly config?: ExpandedConfig } = {}): FilterStepsOutput;
```

### Parameters

- `steps` (Step[], optional) -- array of trace events to filter. Defaults to `[]` (empty array).
- `config` (ExpandedConfig, optional) -- expanded configuration controlling which events pass the filter. Defaults to `createConfig({})`.

### Returns

`{ steps, config }` -- object with the filtered steps array and the config used for filtering.

### Throws

- `Error('filterSteps: expected steps to be an array, got ...')` -- if steps is provided but is not an array
- `Error('filterSteps: expected config to be an object, got ...')` -- if config is provided but is not a plain object

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { fillConfig, instrumentRecord, filterSteps } = tracing;

// Full pipeline: trace → filter
const { config } = fillConfig({ config: { presets: 'exhaustive' } });
const { steps } = instrumentRecord({ code: 'let x = 5;', config });

// Re-filter with a different config
const overviewConfig = fillConfig({ config: { presets: 'overview' } }).config;
const { steps: filtered } = filterSteps({ steps, config: overviewConfig });
// filtered: subset of steps matching overview-level detail

// Filter with specific variable focus
const focusConfig = fillConfig({
  config: { lang: { bindings: { filter: { include: ['x'] } } } },
}).config;
const { steps: xOnly } = filterSteps({ steps, config: focusConfig });
// xOnly: only trace events related to variable 'x'

// Empty steps
const { steps: empty } = filterSteps({});
// empty: [] (empty array)
```

### Remarks

The filtering applies the same configuration structure used for tracing, but to post-process existing data:

- **Category disabled** (e.g., `lang.bindings: false`) -- all events in that category are removed
- **Specific filters** (e.g., `lang.bindings.filter.include: ['x']`) -- only matching events pass
- **Multiple criteria** are combined based on the configuration hierarchy

This is the function that `squint` delegates to after normalizing its inputs.

---

## `serialize({ steps? | config? })`

Serializes trace steps or configuration into a JSON string. Pass exactly one of `steps` or `config`. Utility function for persisting trace data or transmitting it between systems.

### Signature

```typescript
// Overload: steps → JSON string
function serialize(input: { readonly steps: readonly Step[] }): string;

// Overload: config → JSON string
function serialize(input: { readonly config: UserConfig }): string;
```

### Parameters

Pass exactly one of:

- `steps` (Step[], required in steps overload) -- array of trace steps to serialize. Throws if not an array.
- `config` (UserConfig, required in config overload) -- configuration object to serialize. Throws if not a plain object.

### Returns

`string` -- JSON string representation of the provided field.

### Throws

- `Error('serialize: expected steps to be an array, got ...')` -- if steps is not an array
- `Error('serialize: expected config to be a plain object, got ...')` -- if config is null, array, or primitive
- `Error('serialize: expected steps or config to be provided (neither given)')` -- if neither field is provided

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { serialize, deserialize } = tracing;

// Serialize trace steps
const json = serialize({ steps: [{}, {}, {}] });
// json: '[{},{},{}]'

// Serialize config
const configJson = serialize({ config: { presets: 'overview' } });
// configJson: '{"presets":"overview"}'

// Round-trip with deserialize
const { steps } = deserialize({ steps: json });
// steps: [{}, {}, {}]

const { config } = deserialize({ config: configJson });
// config: { presets: 'overview' }
```

### Remarks

Thin wrapper around `JSON.stringify`. The primary value is consistent validation: always call `serialize` rather than `JSON.stringify` directly to get consistent error messages when the input is missing or the wrong type. Both `steps` and `config` are validated before serialization -- arrays that aren't `Step[]`, or objects that aren't plain objects (null, arrays), are rejected with descriptive errors.

---

## `deserialize({ steps?, config? })`

General-purpose parsing and validation layer for the tracing pipeline. Handles both directions: JSON string to parsed value, and already-parsed value to validated passthrough. Accepts both `steps` and `config` fields independently.

### Signature

```typescript
function deserialize({ steps, config }: DeserializeInput = {}): DeserializeOutput;
```

### Parameters

- `steps` (string | Step[], optional) -- JSON string to parse into Step[], or an existing Step array to validate and pass through. Returns `undefined` when not provided.
- `config` (string | UserConfig, optional) -- JSON string to parse into UserConfig, or an existing config object to validate and pass through. Returns `undefined` when not provided.

### Returns

`{ steps, config }` -- object with parsed/validated values. Fields not provided in the input are `undefined` in the output.

```typescript
type DeserializeOutput = {
  readonly steps: readonly Step[] | undefined;
  readonly config: UserConfig | undefined;
};
```

### Throws

- `Error('deserialize: expected steps to be a string or array, got ...')` -- if steps is not a string, array, or undefined
- `Error('deserialize: expected steps to be an array, got ...')` -- if a JSON string parses to a non-array value
- `Error('deserialize: expected every step to be an object, got ... at index ...')` -- if any step element is not an object
- `Error('deserialize: expected config to be a plain object, got ...')` -- if config is not a plain object (including after JSON parsing)
- `Error('deserialize: invalid JSON for steps -- ...')` -- if steps string is not valid JSON
- `Error('deserialize: invalid JSON for config -- ...')` -- if config string is not valid JSON

### Examples

```typescript
import { tracing } from '@study-lenses/embody';
const { deserialize } = tracing;

// Parse JSON string steps
const { steps } = deserialize({ steps: '[{},{}]' });
// steps: [{}, {}]

// Passthrough existing array (validated)
const { steps } = deserialize({ steps: [{}, {}] });
// steps: [{}, {}]

// Parse JSON string config
const { config } = deserialize({ config: '{"presets":"overview"}' });
// config: { presets: 'overview' }

// Passthrough existing config (validated)
const { config } = deserialize({ config: { presets: 'overview' } });
// config: { presets: 'overview' }

// Both fields
const result = deserialize({
  steps: '[{},{}]',
  config: '{"presets":"overview"}',
});
// result.steps: [{}, {}]
// result.config: { presets: 'overview' }

// No arguments -- both undefined
const { steps, config } = deserialize();
// steps: undefined
// config: undefined

// Invalid JSON throws
deserialize({ steps: '{bad json' });
// Error: deserialize: invalid JSON for steps -- ...

// Non-object step elements throw
deserialize({ steps: '[1, 2, 3]' });
// Error: deserialize: expected every step to be an object, got number at index 0
```

### Remarks

This function serves as the parsing/validation boundary for the pipeline. It validates both string inputs (via JSON.parse) and already-parsed inputs (via type checks). Each field is resolved independently -- providing `steps` without `config` is valid, and vice versa.

Internal dependencies:

- `resolveSteps` (from `src/steps/`) -- handles string parsing, array passthrough, and element validation for steps
- `validateSteps` (from `src/steps/`) -- ensures parsed value is an array of objects
- `parseJSON` (from `src/utils/`) -- shared JSON.parse wrapper with descriptive error messages
- `isExpandableObject` (from `configuring/utils/`) -- plain object predicate for config validation
- `resolveConfig` (local) -- orchestrates config parsing and validation
- `describeType` (local) -- error message helper for type descriptions

---

## Object-Threading Pattern

The core architectural pattern shared by all pipeline functions:

```
Input: { code, config }
  ↓
fillConfig: { config? } → { config: ExpandedConfig }
  ↓
instrument: { code, config } → { code, config, instrumented }
  ↓
record: { instrumented, config } → { instrumented, config, steps }
  ↓
instrumentRecord: combines instrument + record → { code, config, steps }
  ↓
filterSteps: { steps, config } → { steps, config }
```

Each stage follows the same contract:

1. **Receives** a plain object with predetermined keys
2. **Validates** inputs at the boundary (throws descriptive errors for wrong types)
3. **Resolves defaults** for missing optional values
4. **Processes** the data
5. **Returns** an enriched object preserving input data while adding new fields

This pattern enables:

- **Composability** -- stages can be combined in any order
- **Debuggability** -- each stage's output is inspectable
- **Flexibility** -- skip stages or add custom stages between them

The `serialize` and `deserialize` functions are utilities that don't follow the threading pattern strictly -- they transform data format rather than enriching an object.

---

## Error Reference

All error messages include the function name and a description of what was expected vs received.

| Error Message                                                                | Function         | Trigger                                    |
| ---------------------------------------------------------------------------- | ---------------- | ------------------------------------------ |
| `'fillConfig: expected config to be a plain object, got ...'`                | fillConfig       | config is array, primitive, or null        |
| `'instrument: expected code to be a string, got ...'`                        | instrument       | code is not a string                       |
| `'instrument: expected config to be an object, got ...'`                     | instrument       | config is array, primitive, or null        |
| `'record: expected instrumented to be a string, got ...'`                    | record           | instrumented is not a string               |
| `'record: expected config to be an object, got ...'`                         | record           | config is array, primitive, or null        |
| `'instrumentRecord: expected code to be a string, got ...'`                  | instrumentRecord | code is not a string                       |
| `'instrumentRecord: expected config to be an object, got ...'`               | instrumentRecord | config is array, primitive, or null        |
| `'filterSteps: expected steps to be an array, got ...'`                      | filterSteps      | steps is not an array                      |
| `'filterSteps: expected config to be an object, got ...'`                    | filterSteps      | config is array, primitive, or null        |
| `'serialize: expected steps to be an array, got ...'`                        | serialize        | steps is not an array                      |
| `'serialize: expected config to be a plain object, got ...'`                 | serialize        | config is null, array, or primitive        |
| `'serialize: expected steps or config to be provided (neither given)'`       | serialize        | neither steps nor config provided          |
| `'resolveSteps: expected steps to be a string or array, got ...'`            | resolveSteps     | steps is not string, array, or undefined   |
| `'validateSteps: expected steps to be an array, got ...'`                    | validateSteps    | JSON string parses to non-array            |
| `'validateSteps: expected every step to be an object, got ... at index ...'` | validateSteps    | step element is not an object              |
| `'resolveSteps: invalid JSON for steps -- ...'`                              | resolveSteps     | steps string is malformed JSON             |
| `'deserialize: expected config to be a plain object, got ...'`               | deserialize      | config is null, array, or primitive        |
| `'deserialize: expected config to be a string or object, got ...'`           | deserialize      | config is not string, object, or undefined |
| `'deserialize: invalid JSON for config -- ...'`                              | deserialize      | config string is malformed JSON            |

---

## Testing Overview

Seven test files, one per function, in the `tests/` directory:

| File                        | Covers                                                                      |
| --------------------------- | --------------------------------------------------------------------------- |
| `fill-config.test.ts`       | Config normalization, preset application, defaults, invalid input           |
| `instrument.test.ts`        | Code instrumentation, validation, empty code, default config                |
| `record.test.ts`            | Execution recording, validation, empty input, execution limits              |
| `instrument-record.test.ts` | Pipeline orchestration, object-threading, validation                        |
| `filter-steps.test.ts`      | Step filtering, validation, empty steps, default config                     |
| `serialize.test.ts`         | JSON serialization (steps + config), missing input, wrong types, round-trip |
| `deserialize.test.ts`       | JSON deserialization, passthrough validation, error handling                |

All tests follow the pattern: valid inputs, boundary validation (wrong types throw), missing inputs (defaults applied), and edge cases (empty strings, empty arrays).
