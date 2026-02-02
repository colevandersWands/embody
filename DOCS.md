# Embody API Documentation

Complete API reference and usage guide for the `@study-lenses/embody` execution tracer.

## Table of Contents

- [Main API Functions](#main-api-functions)
  - [`embody`](#embody-code-config)
  - [`embodify`](#embodify-code-config-steps)
  - [Default Export](#default-export)
- [Configuration](#configuration)
  - [Presets](#presets)
  - [Configuration Options](#configuration-options)
- [Advanced Usage](#advanced-usage)
  - [Pipeline Namespace](#pipeline-namespace)
  - [Currying Patterns](#currying-patterns)
  - [Chainable Pipeline (`embodify`)](#chainable-pipeline-embodify)
  - [Object-Threading](#object-threading)
- [TypeScript Types](#typescript-types)

## Main API Functions

### `embody({ code?, config? })`

Main entry point for tracing JavaScript code execution. Instruments and executes code to produce a detailed trace of execution events.

#### Parameters

- `code` (string, optional): JavaScript code to trace
- `config` (UserConfig, optional): Configuration object or preset name

#### Returns

```typescript
{
  code: string;        // Original source code
  config: ExpandedConfig;  // Normalized configuration used
  steps: Step[];       // Array of trace events
}
```

#### Usage Patterns

The function supports three usage patterns through currying:

```typescript
import { embody } from '@study-lenses/embody';

// 1. Both parameters - immediate execution
const trace = embody({
  code: 'let x = 5; console.log(x);',
  config: { presets: 'detailed' },
});

// 2. Config-first currying - reuse config for multiple traces
const tracer = embody({ config: { presets: 'overview' } });
const trace1 = tracer({ code: 'let x = 5' });
const trace2 = tracer({ code: 'const y = 10' });

// 3. Code-first currying - apply different configs to same code
const codeTracer = embody({ code: 'let x = 5' });
const overview = codeTracer({ config: { presets: 'overview' } });
const detailed = codeTracer({ config: { presets: 'detailed' } });
```

#### Pickle Support

Config can be passed as a JSON string — it is auto-parsed:

```typescript
// JSON string config is auto-parsed
const trace = embody({ code: 'let x = 5', config: '{"presets":"overview"}' });

// Invalid JSON degrades gracefully to default config
const trace = embody({ code: 'let x = 5', config: '{bad json' });
```

### Default Export

Simple tracing function that returns just the steps array.

```typescript
import trace from '@study-lenses/embody';

const steps = trace('let x = 5; console.log(x);');
// Returns: Step[] (array of trace events)

// With config object
const steps = trace('let x = 5', { presets: 'overview' });

// Config can be a JSON string (pickle support)
const steps = trace('let x = 5', '{"presets":"overview"}');
```

Useful for quick scripts or when you don't need configuration or source code in the result.

### `embodify({ code?, config?, steps? })`

Chainable, immutable pipeline wrapper for multi-step tracing workflows. Returns a chain link object with lazy-cascading getters and pipeline methods. Every method returns a new chain link — the original is never mutated.

#### Parameters

- `code` (string, optional): Source code to trace
- `config` (UserConfig | string, optional): Configuration object or JSON string
- `steps` (Step[] | string, optional): Pre-existing trace steps array or JSON string

#### Returns

Chain link with:

- **Getters**: `code`, `config`, `steps`, `pickledSteps`, `pickledConfig`
- **Methods**: `set()`, `mergeConfig()`, `trace()`

All getters cascade lazily (e.g., accessing `.steps` when only code is set runs the full pipeline on demand). All methods return new immutable chain links.

#### Usage Examples

```typescript
import { embodify } from '@study-lenses/embody';

// Simple trace
const result = embodify({ code: 'let x = 5;' }).trace();
console.log(result.steps);

// Lazy cascade — steps computed on access
const steps = embodify({ code: 'let x = 5;' }).steps;

// Batch processing
const tracer = embodify({ config: {} });
const results = codes.map((c) => tracer.trace({ code: c }).steps);
```

#### Full Documentation

See [embodify API Reference](./src/api/embodify/DOCS.md) for complete documentation of every getter, method, cascade behavior, config resolution, and use case recipe.

For detailed signatures and error reference of the top-level entry points (`embody`, `pickles`), see the [API module reference](./src/api/DOCS.md).

## Configuration

### Presets

Three educational presets provide different levels of detail:

| Preset       | Description                      | Use Case                                                  |
| ------------ | -------------------------------- | --------------------------------------------------------- |
| `overview`   | Minimal noise, beginner-friendly | Focus on program behavior (functions, basic control flow) |
| `detailed`   | Balanced intermediate analysis   | Add variable tracking and scopes (default)                |
| `exhaustive` | Maximum information              | All features enabled for deep analysis                    |

```typescript
// Using presets
embody({ code: myCode, config: { presets: 'overview' } });
embody({ code: myCode, config: { presets: 'detailed' } }); // Default
embody({ code: myCode, config: { presets: 'exhaustive' } });
```

### Configuration Options

For complete configuration options and structure, see [config/README.md](./src/configuring/README.md).

Configuration follows these principles:

- **Two-layer structure**: `meta` (output format) and `lang` (JavaScript features to trace)
- **Presets**: Three educational presets (`overview`, `detailed`, `exhaustive`) provide different levels of detail
- **Boolean shorthand**: All sections support `true` (enable all) or `false` (disable all)
- **Granular control**: Each feature can be configured with specific options
- **Filtering**: Most sections support filtering by name to focus on specific elements

Example configurations:

```typescript
// Use a preset
embody({ code: myCode, config: { presets: 'detailed' } });

// Track only specific variables
embody({
  code: myCode,
  config: {
    lang: {
      bindings: {
        filter: { include: ['result', 'counter', 'index'] },
      },
    },
  },
});

// Focus on control flow
embody({
  code: myCode,
  config: {
    presets: 'overview',
    lang: {
      controlFlow: true,
      bindings: false,
      functions: {
        events: { call: { arguments: true }, definition: false },
      },
    },
  },
});

// Add timing information for async
embody({
  code: myCode,
  config: {
    meta: { timestamps: true },
    lang: {
      functions: {
        events: {
          coroutines: { await: true },
        },
      },
    },
  },
});
```

## Advanced Usage

### Pipeline Namespace

For detailed signatures of `embody` and `pickles`, see the [API module documentation](./src/api/DOCS.md).

For fine-grained control, internal pipeline functions are exposed:

```typescript
import { tracing } from '@study-lenses/embody';

const {
  fillConfig, // Normalize user config to ExpandedConfig
  record, // Execute code and collect trace
  serialize, // Convert Step[] to JSON string
  deserialize, // Parse { steps?, config? } — delegates to steps/ and utils/ modules
} = tracing;

// Custom pipeline usage
const { config } = fillConfig({ config: userConfig });
const { steps } = record({ code, config });
```

For complete technical documentation of each pipeline function, including signatures, parameters, error handling, and the object-threading pattern, see [tracing module documentation](./src/api/tracing/DOCS.md).

### Currying Patterns

Currying enables performance optimization and code reuse:

```typescript
// Performance: Config normalization happens once
const tracer = embody({ config: { presets: 'detailed' } });
// Config is cached and reused
for (const submission of studentSubmissions) {
  const trace = tracer({ code: submission });
  analyze(trace);
}

// Flexibility: Apply multiple configs to same code
const codeUnderTest = embody({ code: complexFunction });
const quickCheck = codeUnderTest({ config: { presets: 'overview' } });
const deepAnalysis = codeUnderTest({ config: { presets: 'exhaustive' } });

// Composition: Build specialized tracers
const variableTracer = embody({
  config: {
    lang: { bindings: true, functions: false, controlFlow: false },
  },
});
const functionTracer = embody({
  config: {
    lang: { bindings: false, functions: true, controlFlow: false },
  },
});
```

### Chainable Pipeline (`embodify`)

For workflows requiring intermediate states or batch processing, `embodify` provides an immutable chainable alternative to `embody`:

```typescript
import { embodify } from '@study-lenses/embody';

// Batch process multiple code snippets
const tracer = embodify({ config: { presets: 'detailed' } });
const results = codes.map((code) => tracer.trace({ code }).steps);

// Serialize for storage or transport
const base = embodify({ code: studentCode, config: {} }).trace();
const serialized = base.pickledSteps;
```

Key differences from `embody()`:

- **Chaining** instead of currying
- **Lazy cascade** — getters compute on demand
- **Granular control** — trace as separate step
- **Built-in serialization** via `.pickledSteps` and `.pickledConfig`

See [embodify module documentation](./src/api/embodify/README.md) for design principles and full API surface.

### Object-Threading

Understanding the internal data flow pattern:

```
Input: { code, config }
  ↓
fillConfig: { config } → { config: ExpandedConfig }
  ↓
record: { code, config } → { code, config, steps }
```

Each stage:

- Receives an object with predetermined keys
- Preserves input data while adding new fields
- Returns enriched object for the next stage

## TypeScript Types

Public types are exported from the main package:

```typescript
import type { Step, TraceResult, UserConfig } from '@study-lenses/embody';
```

### Core Types

```typescript
// Single trace event
type Step = SpecificTraceEvent;

// Complete trace result
interface TraceResult {
  code: string;
  config: ExpandedConfig;
  steps: Step[];
}

// Filter result
interface FilterResult {
  steps: Step[];
  config: ExpandedConfig;
}
```

### Configuration Types

```typescript
// User-provided configuration
type UserConfig = Partial<Config>;

// Normalized configuration after processing
type ExpandedConfig = Config; // All fields resolved

// Available preset names
type PresetName = 'overview' | 'detailed' | 'exhaustive';
```

### Using Types

```typescript
import type { Step, TraceResult, Config, ExpandedConfig } from '@study-lenses/embody';

function analyzeTrace(result: TraceResult): void {
  const { steps, config } = result;
  // Type-safe access to trace data
}

const myConfig: Partial<Config> = {
  presets: 'detailed',
  lang: {
    bindings: {
      filter: { include: ['x', 'y'] },
    },
  },
};
```

### Pipeline Types

```typescript
// Serialize/Deserialize
type SerializeInput = { readonly steps: readonly Step[] } | { readonly config: UserConfig };
type SerializeOutput = string;
type DeserializeInput = {
  readonly steps?: string | readonly Step[];
  readonly config?: string | UserConfig;
};
type DeserializeOutput = {
  readonly steps: readonly Step[] | undefined;
  readonly config: UserConfig | undefined;
};

// Pickles (bidirectional toggle for steps and/or config)
type PicklesInput = {
  readonly steps?: readonly Step[] | string;
  readonly config?: UserConfig | string;
};
type PicklesOutput =
  | { readonly steps: string }
  | { readonly steps: readonly Step[] }
  | { readonly config: string }
  | { readonly config: UserConfig }
  | { readonly steps: string; readonly config: string }
  | { readonly steps: readonly Step[]; readonly config: UserConfig }
  | { readonly steps: string; readonly config: UserConfig }
  | { readonly steps: readonly Step[]; readonly config: string };
```

## Notes

- **New Configuration Structure**: Config now uses `{ presets, meta, lang }` structure. See [config/README.md](./src/configuring/README.md) for details
- Configuration is split into `meta` (output format) and `lang` (JavaScript features to trace)
- The `presets` field replaces the old `preset` field (note the plural)
- Async/await execution is not supported in v1.0 (planned for v2.0)
- The library uses Aran framework for code instrumentation
- Invalid JSON input throws (consistent with the tracing pipeline). Configuration with unknown keys is silently ignored with sensible defaults
- All trace events include source location and timing information

### Configuration Migration

For users migrating from old structure, key changes:

- `preset` → `presets`
- `variables.*` → `lang.bindings.*`
- `functions.*` → `lang.functions.*`
- `async.timestamps` → `meta.timestamps`
- See full migration table in [config/README.md](./src/configuring/README.md#field-migration-reference)
