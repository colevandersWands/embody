# Embody API Documentation

Complete API reference and usage guide for the `@study-lenses/embody` execution tracer.

## Table of Contents

- [Main API Functions](#main-api-functions)
  - [`embody`](#embody-code-config)
  - [`squint`](#squint-steps-config)
  - [Default Export](#default-export)
- [Configuration](#configuration)
  - [Presets](#presets)
  - [Configuration Options](#configuration-options)
- [Advanced Usage](#advanced-usage)
  - [Pipeline Namespace](#pipeline-namespace)
  - [Currying Patterns](#currying-patterns)
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
  config: { presets: 'detailed' }
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

### `squint({ steps?, config? })`

Post-processing filter for existing trace steps. Applies configuration filters to an existing trace without re-executing the code.

#### Parameters

- `steps` (Step[], optional): Array of trace events to filter
- `config` (UserConfig, optional): Filter configuration

#### Returns

```typescript
{
  steps: Step[];           // Filtered trace events
  config: ExpandedConfig;  // Configuration used
  metadata?: {             // Optional filtering metadata
    requestedButNotPresent?: string[];
    totalFiltered?: number;
    filteringSummary?: Record<string, number>;
  }
}
```

#### Usage Examples

```typescript
import { squint } from '@study-lenses/embody';

// Filter existing trace
const filtered = squint({
  steps: existingTrace,
  config: {
    lang: {
      bindings: { filter: { include: ['counter'] } }
    }
  }
});

// Reuse filter configuration
const filter = squint({
  config: {
    lang: {
      bindings: { filter: { include: ['x', 'y'] } }
    }
  }
});
const filtered1 = filter({ steps: trace1 });
const filtered2 = filter({ steps: trace2 });

// Apply different filters to same trace
const stepsFilter = squint({ steps: existingTrace });
const varsOnly = stepsFilter({
  config: {
    lang: { bindings: true, functions: false }
  }
});
const funcsOnly = stepsFilter({
  config: {
    lang: { bindings: false, functions: true }
  }
});
```

### Default Export

Simple tracing function that returns just the steps array without metadata.

```typescript
import embodyTrace from '@study-lenses/embody';

const steps = embodyTrace('let x = 5; console.log(x);');
// Returns: Step[] (array of trace events)
```

Useful for quick scripts or when you don't need configuration or source code in the result.

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

For complete configuration options and structure, see [config/README.md](./config/README.md).

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
        filter: { include: ['result', 'counter', 'index'] }
      }
    }
  }
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
        events: { call: { arguments: true }, definition: false }
      }
    }
  }
});

// Add timing information for async
embody({
  code: myCode,
  config: {
    meta: { timestamps: true },
    lang: {
      functions: {
        events: {
          coroutines: { await: true }
        }
      }
    }
  }
});
```

## Advanced Usage

### Pipeline Namespace

For fine-grained control, internal pipeline functions are exposed:

```typescript
import { pipeline } from '@study-lenses/embody';

const {
  fillConfig, // Normalize user config to ExpandedConfig
  instrument, // Transform code with Aran instrumentation
  record, // Execute instrumented code and collect trace
  trace, // Full pipeline orchestrator
  filterSteps // Apply filters to existing trace
} = pipeline;

// Custom pipeline usage
const { config } = fillConfig({ config: userConfig });
const { instrumented } = instrument({ code, config });
const { steps } = record({ instrumented, config });
```

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
    lang: { bindings: true, functions: false, controlFlow: false }
  }
});
const functionTracer = embody({
  config: {
    lang: { bindings: false, functions: true, controlFlow: false }
  }
});
```

### Object-Threading

Understanding the internal data flow pattern:

```
Input: { code, config }
  ↓
fillConfig: { config } → { config: ExpandedConfig }
  ↓
instrument: { code, config } → { code, config, instrumented }
  ↓
record: { instrumented, config } → { instrumented, config, steps }
  ↓
trace: combines → { code, config, steps }
  ↓
filterSteps: { steps, config } → { steps, config, metadata? }
```

Each stage:

- Receives an object with predetermined keys
- Preserves input data while adding new fields
- Returns enriched object for the next stage

## TypeScript Types

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

// Filter result with metadata
interface FilterResult {
  steps: Step[];
  config: ExpandedConfig;
  metadata?: {
    requestedButNotPresent?: string[];
    totalFiltered?: number;
    filteringSummary?: Record<string, number>;
  };
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
      filter: { include: ['x', 'y'] }
    }
  }
};
```

## Notes

- **New Configuration Structure**: Config now uses `{ presets, meta, lang }` structure. See [config/README.md](./src/config/README.md) for details
- Configuration is split into `meta` (output format) and `lang` (JavaScript features to trace)
- The `presets` field replaces the old `preset` field (note the plural)
- Async/await execution is not supported in v1.0 (planned for v2.0)
- The library uses Aran framework for code instrumentation
- Configuration uses graceful degradation - invalid values are ignored with sensible defaults
- All trace events include source location and timing information

### Configuration Migration

For users migrating from old structure, key changes:

- `preset` → `presets`
- `variables.*` → `lang.bindings.*`
- `functions.*` → `lang.functions.*`
- `async.timestamps` → `meta.timestamps`
- See full migration table in [config/README.md](./src/config/README.md#field-migration-reference)
