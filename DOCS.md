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
  - [Internals Namespace](#internals-namespace)
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
  config: { preset: 'detailed' }
});

// 2. Config-first currying - reuse config for multiple traces
const tracer = embody({ config: { preset: 'overview' } });
const trace1 = tracer({ code: 'let x = 5' });
const trace2 = tracer({ code: 'const y = 10' });

// 3. Code-first currying - apply different configs to same code
const codeTracer = embody({ code: 'let x = 5' });
const overview = codeTracer({ config: { preset: 'overview' } });
const detailed = codeTracer({ config: { preset: 'detailed' } });
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
  config: { variables: { filter: ['counter'] } }
});

// Reuse filter configuration
const filter = squint({ config: { variables: { filter: ['x', 'y'] } } });
const filtered1 = filter({ steps: trace1 });
const filtered2 = filter({ steps: trace2 });

// Apply different filters to same trace
const stepsFilter = squint({ steps: existingTrace });
const varsOnly = stepsFilter({ config: { variables: true, functions: false } });
const funcsOnly = stepsFilter({ config: { variables: false, functions: true } });
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

| Preset | Description | Use Case |
|--------|-------------|----------|
| `overview` | Minimal noise, beginner-friendly | Focus on program behavior (functions, basic control flow) |
| `detailed` | Balanced intermediate analysis | Add variable tracking and scopes (default) |
| `exhaustive` | Maximum information | All features enabled for deep analysis |

```typescript
// Using presets
embody({ code: myCode, config: { preset: 'overview' } });
embody({ code: myCode, config: { preset: 'detailed' } });  // Default
embody({ code: myCode, config: { preset: 'exhaustive' } });
```

### Configuration Options

For complete configuration options and structure, see [config/README.md](./config/README.md).

Configuration follows these principles:
- **Presets**: Three educational presets (`overview`, `detailed`, `exhaustive`) provide different levels of detail
- **Boolean shorthand**: All sections support `true` (enable all) or `false` (disable all)
- **Granular control**: Each feature can be configured with specific options
- **Filtering**: Most sections support filtering by name to focus on specific elements

Example configurations:

```typescript
// Use a preset
embody({ code: myCode, config: { preset: 'detailed' } });

// Track only specific variables
embody({
  code: myCode,
  config: {
    variables: {
      filter: ['result', 'counter', 'index']
    }
  }
});

// Focus on control flow
embody({
  code: myCode,
  config: {
    preset: 'overview',
    controlFlow: true,
    variables: false,
    functions: { calls: true, declarations: false }
  }
});
```

## Advanced Usage

### Internals Namespace

For fine-grained control, internal pipeline functions are exposed:

```typescript
import { internals } from '@study-lenses/embody';

const {
  fillConfig,   // Normalize user config to ExpandedConfig
  instrument,   // Transform code with Aran instrumentation
  record,       // Execute instrumented code and collect trace
  trace,        // Full pipeline orchestrator
  filterSteps   // Apply filters to existing trace
} = internals;

// Custom pipeline usage
const { config } = fillConfig({ config: userConfig });
const { instrumented } = instrument({ code, config });
const { steps } = record({ instrumented, config });
```

### Currying Patterns

Currying enables performance optimization and code reuse:

```typescript
// Performance: Config normalization happens once
const tracer = embody({ config: { preset: 'detailed' } });
// Config is cached and reused
for (const submission of studentSubmissions) {
  const trace = tracer({ code: submission });
  analyze(trace);
}

// Flexibility: Apply multiple configs to same code
const codeUnderTest = embody({ code: complexFunction });
const quickCheck = codeUnderTest({ config: { preset: 'overview' } });
const deepAnalysis = codeUnderTest({ config: { preset: 'exhaustive' } });

// Composition: Build specialized tracers
const variableTracer = embody({
  config: { variables: true, functions: false, controlFlow: false }
});
const functionTracer = embody({
  config: { variables: false, functions: true, controlFlow: false }
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
type ExpandedConfig = Config;  // All fields resolved

// Available preset names
type PresetName = 'overview' | 'detailed' | 'exhaustive';
```

### Using Types

```typescript
import type {
  Step,
  TraceResult,
  UserConfig,
  ExpandedConfig
} from '@study-lenses/embody';

function analyzeTrace(result: TraceResult): void {
  const { steps, config } = result;
  // Type-safe access to trace data
}

const myConfig: UserConfig = {
  preset: 'detailed',
  variables: { filter: ['x', 'y'] }
};
```

## Notes

- Async/await execution is not supported in v1.0 (planned for v2.0)
- The library uses Aran framework for code instrumentation
- Configuration uses graceful degradation - invalid values are ignored with sensible defaults
- All trace events include source location and timing information