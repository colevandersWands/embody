# Tracer Modules

This directory contains tracer implementations. Each tracer module exports a `record` function and a JSON Schema for options validation.

## Architecture

```
tracers/
├── index.ts           # Tracer registry (default) + barrel re-exports (named)
├── types.ts           # Shared types (StepCore, TracerModule, TracerEntry, MetaConfig)
├── meta.schema.json   # Cross-tracer execution limits schema (SHARED)
├── chars/             # Test tracer for architecture validation
│   ├── index.ts              # Barrel: re-exports all pieces as named exports
│   ├── tracer-id.ts          # Tracer ID constant ('chars')
│   ├── record.ts             # Tracing implementation (async)
│   ├── options.schema.json   # Options schema (optional, tracer-specific)
│   ├── verify-options.ts     # Semantic validation (optional)
│   ├── types.ts              # Tracer-specific types
│   └── README.md             # Tracer documentation
└── README.md          # This file
```

**Barrel exception**: Tracer directories use `index.ts` barrel files — a scoped exception to the "no barrel files" convention. Tracers are plugin-like modules with a fixed contract (`tracerId`, `record`, `optionsSchema?`, `verifyOptions?`), so barrels enforce that contract and keep the registry clean. See [DEV.md § Wiring Into Registry](./DEV.md#wiring-into-registry).

**Linting**: Tracer subdirectories are repo-linted by default. Tracers that need different conventions can opt out — see [DEV.md § Linting](./DEV.md#linting).

## Meta Schema (Execution Limits)

The `meta.schema.json` file defines cross-tracer execution limits and debugging options. Unlike tracer-specific `options.schema.json` files, this schema is **shared** across all tracers.

```typescript
type MetaConfig = {
  readonly max: {
    readonly steps: number | null; // Max trace steps (null = unlimited)
    readonly iterations: number | null; // Max loop iterations (null = unlimited)
    readonly callstack: number | null; // Max call depth (null = unlimited)
    readonly time: number | null; // Max execution time in ms (null = unlimited)
  };
  readonly range: readonly [number, number] | null; // Line range to trace (null = full)
  readonly timestamps: boolean; // Include timestamps in steps
  readonly debug: { readonly ast: boolean }; // Attach AST nodes to steps
};
```

**Convention**: `null` means "no limit" (conceptually `Infinity`). JSON Schema can't represent `Infinity`, so we use `null` and the API interprets it.

### Meta vs Options

| Schema                | Location                                  | Scope       | Purpose                        |
| --------------------- | ----------------------------------------- | ----------- | ------------------------------ |
| `meta.schema.json`    | `/tracers/meta.schema.json`               | All tracers | Execution limits, debugging    |
| `options.schema.json` | `/tracers/<tracer>/options.schema.json`   | Per-tracer  | Tracer-specific tracing config |

The API layer validates both schemas independently before calling `record()`.

## What Tracers Export

Each tracer module MUST export (via its `index.ts` barrel):

| Export              | Type     | Description                               |
| ------------------- | -------- | ----------------------------------------- |
| `tracerId`          | string   | Unique tracer identifier (e.g. `'chars'`) |
| `record`            | Function | Async tracing function (see TracerModule) |

Each tracer module MAY export:

| Export              | Type        | Description                             |
| ------------------- | ----------- | --------------------------------------- |
| `optionsSchema`     | JSON Schema | Options validation and defaults         |
| `verifyOptions`     | Function    | Semantic validation (cross-field rules) |

### Schema Export (Optional)

Tracers with configurable options export a JSON Schema file that defines:

- **Type validation** — structural correctness of options
- **Default values** — filled automatically when missing
- **Allowed values** — enums, ranges, patterns

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "direction": {
      "type": "string",
      "enum": ["lr", "rl"],
      "default": "lr"
    }
  },
  "required": ["direction"],
  "additionalProperties": false
}
```

See [/configuring DOCS](../configuring/DOCS.md#json-schema-format) for schema requirements.

### verifyOptions Export (Optional)

Tracers MAY export a `verifyOptions` function for constraints JSON Schema can't express:

```typescript
import { OptionsSemanticInvalidError } from '../errors/options-semantic-invalid-error.js';

/**
 * Semantic validation for cross-field constraints.
 * Called by API layer AFTER structural validation and default filling.
 *
 * @param options - Fully-filled options (never partial)
 * @throws OptionsSemanticInvalidError if constraints violated
 * @returns void on success
 */
function verifyOptions(options: TracerOptions): void {
  if (options.strict && options.lenient) {
    throw new OptionsSemanticInvalidError('strict and lenient are mutually exclusive');
  }
}

export default verifyOptions;
```

## Tracer Registry

The `tracers` registry maps tracer IDs to their modules. It serves dual purpose:

- **Default export**: `Record<string, TracerEntry>` for dynamic string-based lookup (API layer)
- **Named exports**: `chars`, `jsKlve` namespaces for direct tree-shakeable access

```typescript
import tracers from './index.js';

// Dynamic lookup (API layer uses this)
const charsTracer = tracers['chars'];

// Call record (async) - returns Promise<readonly TStep[]>
// Note: In practice, API layer prepares meta and options before calling record()
const steps = await charsTracer.record('abc', {
  meta: { max: { steps: null, iterations: null, callstack: null, time: null }, ... },
  options: { direction: 'lr' }
});

// Tree-shakeable direct access (consumers can use this)
import { chars } from './index.js';
chars.record('abc', { meta, options });
```

## TracerModule Interface

Every tracer module's `record` function must conform to:

```typescript
/**
 * Record function signature - async for consistency across all tracers.
 * Returns just the steps array — config is fully prepared upstream.
 *
 * **Contract**: Receives FULLY FILLED meta AND options from API layer — never partial,
 * never undefined fields. Tracers can trust input completely and do pure tracing.
 */
type TracerModule<TOptions = unknown, TStep extends StepCore = StepCore> = (
  code: string,
  config: { readonly meta: MetaConfig; readonly options: TOptions },
) => Promise<readonly TStep[]>;
```

**Key guarantees**:

- `meta` and `options` are always complete and valid
- No defensive coding needed in tracer modules
- Execution limits are enforced by the tracer module (see Error Handling)

## TracerEntry Type

The tracer registry maps tracer IDs to `TracerEntry` objects:

```typescript
type TracerEntry<TStep extends StepCore = StepCore> = {
  readonly record: TracerModule<unknown, TStep>;
  readonly optionsSchema?: Record<string, unknown>; // Optional for simple tracers
  readonly verifyOptions?: (options: unknown) => void;
};
```

## StepCore Contract

All steps, regardless of tracer, must include ESTree-compliant source locations:

```typescript
type Position = {
  readonly line: number; // 1-indexed (ESTree standard)
  readonly column: number; // 0-indexed (ESTree standard)
};

type SourceLocation = {
  readonly start: Position;
  readonly end: Position;
};

type StepCore = {
  readonly step: number; // 1-indexed execution order
  readonly loc: SourceLocation;
};
```

**ESTree compliance**: Line numbers are 1-indexed (first line is 1), column numbers are 0-indexed (first column is 0). For single-token steps (like chars), `start` equals `end`.

Tracer-specific fields extend this base type.

## Adding a New Tracer

1. Create `tracers/<tracer>/` directory

2. Create `tracer-id.ts` with a unique identifier:

   ```typescript
   const tracerId = 'my-tracer';
   export default tracerId;
   ```

3. (Optional) Create `options.schema.json` if your tracer has configurable options:

   ```json
   {
     "$schema": "https://json-schema.org/draft/2020-12/schema",
     "type": "object",
     "properties": {
       "yourOption": {
         "type": "string",
         "default": "defaultValue"
       }
     },
     "required": ["yourOption"],
     "additionalProperties": false
   }
   ```

   Simple tracers with no options can skip this file — the API layer passes `options: {}`.

4. Implement `record.ts` with tracing logic:

   ```typescript
   /**
    * Trace code execution and return steps.
    * Meta and options are guaranteed complete and valid from API layer.
    */
   async function record(
     code: string,
     config: { readonly meta: MetaConfig; readonly options: YourOptions },
   ): Promise<readonly YourStep[]> {
     const { meta, options } = config;

     // Check execution limits (tracer responsibility)
     if (meta.max.steps !== null && code.length > meta.max.steps) {
       throw new LimitExceededError('Exceeded max steps', 'steps', code.length);
     }

     // Pure tracing logic - NO validation needed
     // Parse code, collect steps, return steps array
     return steps;
   }

   export default record;
   ```

5. Define `types.ts` with step and options types

6. (Optional) Create `verify-options.ts` if you need semantic validation

7. Create `index.ts` barrel that re-exports all pieces as named exports:

   ```typescript
   export { default as tracerId } from './tracer-id.js';
   export { default as record } from './record.js';
   export { default as optionsSchema } from './options.schema.json';
   // export { default as verifyOptions } from './verify-options.js'; // if applicable
   ```

8. Add to `tracers/index.ts` registry

See `chars/` for a minimal reference implementation.

## Error Handling

Tracer modules throw specific error classes for runtime errors:

| Error Class          | When                               | Owner         |
| -------------------- | ---------------------------------- | ------------- |
| `ParseError`         | Code cannot be parsed              | Tracer module |
| `RuntimeError`       | Code execution fails               | Tracer module |
| `LimitExceededError` | Exceeded max steps/time/iterations | Tracer module |

**Note**: Options errors are thrown before `record` is called:

- `OptionsInvalidError` — thrown by `/configuring` (structural validation)
- `OptionsSemanticInvalidError` — thrown by tracer's `verifyOptions()` (semantic validation)

Tracer modules receive fully-validated options and only throw these:

```typescript
import { ParseError } from '../errors/parse-error.js';
import { RuntimeError } from '../errors/runtime-error.js';
import { LimitExceededError } from '../errors/limit-exceeded-error.js';

// Tracer modules throw these (NOT Options* errors)
// Note: SourceLoc uses ESTree format — line is 1-indexed, column is 0-indexed
throw new ParseError('Unexpected character', { line: 1, column: 4 });
throw new RuntimeError('Division by zero', { line: 3, column: 9 });
throw new LimitExceededError('Exceeded maximum steps (1000)', 'steps', 1001);
```

All error classes extend `EmbodyError` — see [/errors README](../errors/README.md) for details.

## Links

- [/configuring README](../configuring/README.md) — how options are validated
- [/configuring DOCS](../configuring/DOCS.md) — schema format, verifyOptions convention
- [/api README](../api/README.md) — how API uses tracer modules
