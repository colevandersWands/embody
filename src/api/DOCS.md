# api -- Technical Reference

Detailed signatures, error reference, and internal flow for the three top-level entry points: `embody`, `squint`, and `pickles`. For the chainable wrapper and pipeline functions, see [embodify/DOCS.md](./embodify/DOCS.md) and [tracing/DOCS.md](./tracing/DOCS.md).

## Table of Contents

- [`embody({ code?, config? })`](#embody-code-config-)
  - [Signature and Overloads](#signature-and-overloads)
  - [Parameters](#parameters)
  - [Return Value](#return-value)
  - [Currying Patterns](#currying-patterns)
  - [Internal Flow](#internal-flow)
  - [Error Reference](#error-reference)
  - [Examples](#examples)
- [`squint({ steps?, config? })`](#squint-steps-config-)
  - [Signature and Overloads](#signature-and-overloads-1)
  - [Parameters](#parameters-1)
  - [Return Value](#return-value-1)
  - [Currying Patterns](#currying-patterns-1)
  - [Internal Flow](#internal-flow-1)
  - [Error Reference](#error-reference-1)
  - [Examples](#examples-1)
- [`pickles({ steps?, config? })`](#pickles-steps-config-)
  - [Signature and Overloads](#signature-and-overloads-2)
  - [Bidirectional Behavior](#bidirectional-behavior)
  - [Error Reference](#error-reference-2)
  - [Examples](#examples-2)
- [Shared Patterns](#shared-patterns)
  - [Pickle Support](#pickle-support)
  - [Currying Convention](#currying-convention)
  - [Validation Convention](#validation-convention)
- [Links](#links)

---

## `embody({ code?, config? })`

Main entry point for tracing JavaScript code execution. Instruments and executes code to produce a detailed trace of execution events. Supports currying for config or code reuse.

### Signature and Overloads

```typescript
// Overload 1: Both parameters — immediate execution
function embody(input: {
  readonly config: UserConfig | string;
  readonly code: string;
}): TraceResult;

// Overload 2: Config-only — returns curried function expecting code
function embody(input: {
  readonly config: UserConfig | string;
}): (input: { readonly code: string }) => TraceResult;

// Overload 3: Code-only — returns curried function expecting config
function embody(input: {
  readonly code: string;
}): (input: { readonly config?: UserConfig | string }) => TraceResult;
```

### Parameters

| Parameter | Type                   | Required                    | Default | Description                                          |
| --------- | ---------------------- | --------------------------- | ------- | ---------------------------------------------------- |
| `code`    | `string`               | At least one of code/config | —       | JavaScript source code to trace                      |
| `config`  | `UserConfig \| string` | At least one of code/config | —       | Configuration object or JSON string (pickle support) |

### Return Value

When both parameters are provided (or after curried invocation):

```typescript
type TraceResult = {
  readonly code: string; // Original source code
  readonly config: ExpandedConfig; // Fully normalized configuration
  readonly steps: readonly Step[]; // Array of trace events
};
```

When only one parameter is provided, returns a curried function (see Currying Patterns).

### Currying Patterns

**Config-first** (most common for batch processing):

```typescript
// Config is normalized once, cached in closure
const tracer = embody({ config: { presets: 'detailed' } });

// Each call reuses the cached config
const trace1 = tracer({ code: 'let x = 5' });
const trace2 = tracer({ code: 'const y = 10' });
```

Internally: `fillConfig` runs once during currying. Each subsequent call runs only `instrumentRecord`.

**Code-first** (for comparing configs on the same code):

```typescript
const codeTracer = embody({ code: 'let x = 5' });

// Each call normalizes its own config
const overview = codeTracer({ config: { presets: 'overview' } });
const detailed = codeTracer({ config: { presets: 'detailed' } });
```

Internally: code is closed over. Each subsequent call runs `fillConfig` + `instrumentRecord`.

### Internal Flow

```
embody({ code, config })
  │
  ├─ deserialize({ config })        # Parse JSON string if config is a string
  │
  ├─ fillConfig({ config })          # Normalize UserConfig → ExpandedConfig
  │
  └─ instrumentRecord({ code, config })
       ├─ instrument({ code, config })   # Code → instrumented code (Aran)
       └─ record({ instrumented, config }) # Execute → Step[]
```

When curried with config-first, `deserialize` + `fillConfig` run at curry time. When curried with code-first, they run at invocation time.

### Error Reference

| Error Message                                                     | Trigger                                  |
| ----------------------------------------------------------------- | ---------------------------------------- |
| `embody: expected code to be a string, got {type}`                | `code` provided but not a string         |
| `embody: expected config to be an object or string, got {type}`   | `config` is not an object or string      |
| `embody: expected config to be a plain object, got {array\|null}` | `config` is an array or null             |
| `embody: expected at least code or config to be provided`         | Neither `code` nor `config` given        |
| `embody: curried with config, but no code was provided`           | Curried function called without `code`   |
| `embody: curried with code, but no config was provided`           | Curried function called without `config` |

Additionally, `deserialize` may throw if `config` is an invalid JSON string.

### Examples

```typescript
import { embody } from '@study-lenses/embody';

// Immediate execution
const result = embody({
  code: 'let x = 5; x += 1;',
  config: { presets: 'detailed' },
});
console.log(result.steps); // Step[]
console.log(result.config); // ExpandedConfig (fully normalized)
console.log(result.code); // 'let x = 5; x += 1;' (preserved)

// Pickle support — config as JSON string
const result2 = embody({
  code: 'let x = 5;',
  config: '{"presets":"overview"}',
});

// Batch processing with config-first currying
const tracer = embody({ config: { presets: 'overview' } });
const traces = submissions.map((code) => tracer({ code }));
```

---

## `squint({ steps?, config? })`

Post-processing filter for existing trace steps. Applies configuration filters to an existing trace without re-executing the code. Supports currying for filter or steps reuse.

### Signature and Overloads

```typescript
// Overload 1: Both parameters — immediate filtering
function squint(input: {
  readonly steps: readonly Step[] | string;
  readonly config: UserConfig | string;
}): FilterResult;

// Overload 2: Config-only — returns curried function expecting steps
function squint(input: {
  readonly config: UserConfig | string;
}): (input: { readonly steps: readonly Step[] | string }) => FilterResult;

// Overload 3: Steps-only — returns curried function expecting config
function squint(input: {
  readonly steps: readonly Step[] | string;
}): (input: { readonly config?: UserConfig | string }) => FilterResult;
```

### Parameters

| Parameter | Type                   | Required                     | Default | Description                                             |
| --------- | ---------------------- | ---------------------------- | ------- | ------------------------------------------------------- |
| `steps`   | `Step[] \| string`     | At least one of steps/config | —       | Trace events to filter, or JSON string (pickle support) |
| `config`  | `UserConfig \| string` | At least one of steps/config | —       | Filter configuration, or JSON string (pickle support)   |

### Return Value

When both parameters are provided (or after curried invocation):

```typescript
type FilterResult = {
  readonly steps: readonly Step[]; // Filtered trace events
  readonly config: ExpandedConfig; // Configuration used for filtering
};
```

### Currying Patterns

**Config-first** (apply same filter to multiple traces):

```typescript
const filter = squint({
  config: { lang: { bindings: { filter: { include: ['x', 'y'] } } } },
});

const filtered1 = filter({ steps: trace1Steps });
const filtered2 = filter({ steps: trace2Steps });
```

Internally: `fillConfig` runs once during currying. Each subsequent call runs only `filterSteps`.

**Steps-first** (apply different filters to same trace):

```typescript
const stepsFilter = squint({ steps: existingTrace });

const varsOnly = stepsFilter({ config: { lang: { bindings: true, functions: false } } });
const funcsOnly = stepsFilter({ config: { lang: { bindings: false, functions: true } } });
```

Internally: steps are closed over. Each subsequent call runs `fillConfig` + `filterSteps`.

### Internal Flow

```
squint({ steps, config })
  │
  ├─ deserialize({ steps, config })  # Parse JSON strings for both steps and config
  │
  ├─ fillConfig({ config })           # Normalize UserConfig → ExpandedConfig
  │
  └─ filterSteps({ steps, config })   # Apply filters to trace events
```

### Error Reference

| Error Message                                                     | Trigger                                  |
| ----------------------------------------------------------------- | ---------------------------------------- |
| `squint: expected steps to be an array or string, got {type}`     | `steps` is not an array or string        |
| `squint: expected config to be an object or string, got {type}`   | `config` is not an object or string      |
| `squint: expected config to be a plain object, got {array\|null}` | `config` is an array or null             |
| `squint: expected at least steps or config to be provided`        | Neither `steps` nor `config` given       |
| `squint: curried with config, but no steps were provided`         | Curried function called without `steps`  |
| `squint: curried with steps, but no config was provided`          | Curried function called without `config` |

Additionally, `deserialize` may throw if `steps` or `config` is an invalid JSON string.

### Examples

```typescript
import { squint } from '@study-lenses/embody';

// Immediate filtering
const filtered = squint({
  steps: existingTrace,
  config: { lang: { bindings: { filter: { include: ['counter'] } } } },
});

// Pickle support — both steps and config as JSON strings
const filtered2 = squint({
  steps: '[{"category":"binding","event":"assign"}]',
  config: '{"presets":"overview"}',
});

// Reusable filter for classroom batch
const overviewFilter = squint({ config: { presets: 'overview' } });
const results = studentTraces.map((steps) => overviewFilter({ steps }));
```

---

## `pickles({ steps?, config? })`

Bidirectional serialization toggle for trace steps and/or configuration. Each field toggles independently: arrays/objects serialize to JSON strings, JSON strings deserialize to arrays/objects. Pass one or both fields. No currying, no pipeline awareness.

### Signature and Overloads

```typescript
// --- Steps-only (2 overloads) ---
function pickles(input: { readonly steps: readonly Step[] }): { readonly steps: string };
function pickles(input: { readonly steps: string }): { readonly steps: readonly Step[] };

// --- Config-only (2 overloads) ---
function pickles(input: { readonly config: UserConfig }): { readonly config: string };
function pickles(input: { readonly config: string }): { readonly config: UserConfig };

// --- Combined (4 overloads) ---
function pickles(input: { readonly steps: readonly Step[]; readonly config: UserConfig }): {
  readonly steps: string;
  readonly config: string;
};
function pickles(input: { readonly steps: string; readonly config: string }): {
  readonly steps: readonly Step[];
  readonly config: UserConfig;
};
function pickles(input: { readonly steps: readonly Step[]; readonly config: string }): {
  readonly steps: string;
  readonly config: UserConfig;
};
function pickles(input: { readonly steps: string; readonly config: UserConfig }): {
  readonly steps: readonly Step[];
  readonly config: string;
};
```

### Bidirectional Behavior

Each field toggles independently based on its runtime type:

| Field    | Input Type            | Output Type           | Operation                        |
| -------- | --------------------- | --------------------- | -------------------------------- |
| `steps`  | `Step[]` (array)      | `string` (JSON)       | Serializes via `serialize()`     |
| `steps`  | `string` (JSON)       | `Step[]` (array)      | Deserializes via `deserialize()` |
| `config` | `UserConfig` (object) | `string` (JSON)       | Serializes via `serialize()`     |
| `config` | `string` (JSON)       | `UserConfig` (object) | Deserializes via `deserialize()` |

When both fields are provided, each toggles independently. The result object contains only the fields that were provided.

### Error Reference

| Error Message                                                    | Trigger                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `pickles: expected at least steps or config to be provided`      | Neither `steps` nor `config` given                          |
| `pickles: expected steps to be an array or string, got {type}`   | `steps` is not an array or string                           |
| `pickles: expected config to be an object or string, got {type}` | `config` is not an object or string (including null, array) |

Additionally, `deserialize` throws if a JSON string field is malformed.

### Examples

```typescript
import { pickles } from '@study-lenses/embody';

// Steps: array → JSON string
const { steps: json } = pickles({ steps: [{}, {}, {}] });
// json === '[{},{},{}]'

// Steps: JSON string → array
const { steps: array } = pickles({ steps: '[{},{},{}]' });
// array === [{}, {}, {}]

// Config: object → JSON string
const { config: cJson } = pickles({ config: { presets: 'overview' } });
// cJson === '{"presets":"overview"}'

// Config: JSON string → object
const { config: cObj } = pickles({ config: '{"presets":"overview"}' });
// cObj === { presets: 'overview' }

// Combined: toggle each independently
const result = pickles({
  steps: [{}, {}],
  config: '{"presets":"overview"}',
});
// result === { steps: '[{},{}]', config: { presets: 'overview' } }

// Round-trip
const original = [{ category: 'binding', event: 'assign' }];
const { steps: serialized } = pickles({ steps: original });
const { steps: restored } = pickles({ steps: serialized });
// restored deep-equals original
```

---

## Shared Patterns

### Pickle Support

All three entry points accept JSON strings wherever they accept objects or arrays. This convention is called "pickle support" throughout the codebase.

- `embody`: `config` accepts `UserConfig | string`
- `squint`: both `steps` and `config` accept their respective type or `string`
- `pickles`: both `steps` and `config` accept their respective type or `string` (and return the opposite)

JSON strings are parsed via the `deserialize` tracing function. Invalid JSON throws a descriptive error. This is consistent across all functions -- no silent fallback to defaults.

### Currying Convention

Both `embody` and `squint` follow the same currying pattern:

1. **Both parameters provided** -- execute immediately, return result
2. **First parameter only** -- return a function that expects the second parameter
3. **Second parameter only** -- return a function that expects the first parameter

The curried function validates its input and throws if the missing parameter is not provided. There is no "call with no parameters" pattern -- at least one parameter must be given at construction time.

### Validation Convention

All three functions validate at the boundary (first lines of the function body):

1. Type-check each parameter against expected types
2. Reject `null` and arrays masquerading as objects
3. Throw descriptive errors with: function name, expected type, actual type
4. Only after validation: proceed to business logic

This follows the codebase's graceful degradation principle for config (sensible defaults) and fail-fast principle for type errors (descriptive throws).

## Links

- [API Module Overview](./README.md) -- design principles, decision matrix, file structure
- [embodify Technical Reference](./embodify/DOCS.md) -- chainable pipeline wrapper
- [tracing Technical Reference](./tracing/DOCS.md) -- individual pipeline functions
- [Root API Documentation](../../DOCS.md) -- complete `@study-lenses/embody` API reference
- [Configuration System](../configuring/README.md) -- configuration options and presets
- [TypeScript Types](../types/api.ts) -- all public type definitions
