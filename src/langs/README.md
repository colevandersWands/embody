# Language Modules

This directory contains language-specific tracing implementations. Each language module exports a `record` function and a JSON Schema for options validation.

## Architecture

```
langs/
├── dispatch.ts        # Registry mapping lang IDs to record functions
├── types.ts           # Shared types (StepCore, LangModule, RecordResult, MetaConfig)
├── meta.schema.json   # Cross-lang execution limits schema (SHARED)
├── chars/             # Test language for architecture validation
│   ├── record.ts      # Tracing implementation (async)
│   ├── schema.json    # Options schema (REQUIRED, lang-specific)
│   ├── types.ts       # Language-specific types
│   └── README.md      # Language documentation
└── README.md          # This file
```

## Meta Schema (Execution Limits)

The `meta.schema.json` file defines cross-language execution limits and debugging options. Unlike lang-specific `schema.json` files, this schema is **shared** across all languages.

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

| Schema             | Location                    | Scope     | Purpose                          |
| ------------------ | --------------------------- | --------- | -------------------------------- |
| `meta.schema.json` | `/langs/meta.schema.json`   | All langs | Execution limits, debugging      |
| `schema.json`      | `/langs/<lang>/schema.json` | Per-lang  | Language-specific tracing config |

The API layer validates both schemas independently before calling `record()`.

## What Langs Export

Each language module MUST export:

| Export        | Type        | Description                             |
| ------------- | ----------- | --------------------------------------- |
| `schema.json` | JSON Schema | Options validation and defaults         |
| `record`      | Function    | Async tracing function (see LangModule) |

Each language module MAY export:

| Export          | Type     | Description                             |
| --------------- | -------- | --------------------------------------- |
| `verifyOptions` | Function | Semantic validation (cross-field rules) |

### Schema Export

Every lang exports a JSON Schema file that defines:

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

Langs MAY export a `verifyOptions` function for constraints JSON Schema can't express:

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
function verifyOptions(options: LangOptions): void {
  if (options.strict && options.lenient) {
    throw new OptionsSemanticInvalidError('strict and lenient are mutually exclusive');
  }
}

export default verifyOptions;
```

## Dispatch

The `dispatch` object maps language IDs to their `record` functions:

```typescript
import dispatch from './dispatch.js';

// Get the record function for a language
const charsRecord = dispatch['chars'];

// Call it (async) - returns Promise<RecordResult>
// Note: In practice, API layer prepares meta and options before calling record()
const result = await charsRecord('abc', {
  meta: { max: { steps: null, iterations: null, callstack: null, time: null }, ... },
  options: { direction: 'lr' }
});
// result.steps: [{ step: 1, loc: { line: 1, column: 1 }, char: 'a' }, ...]
// result.config: { meta: {...}, options: { direction: 'lr', remove: [], replace: {} } }
```

## LangModule Interface

Every language module's `record` function must conform to:

```typescript
/**
 * Record function signature - async for consistency across all langs.
 *
 * **Contract**: Receives FULLY FILLED meta AND options from API layer — never partial,
 * never undefined fields. Langs can trust input completely and do pure tracing.
 */
type LangModule<TOptions = unknown, TStep extends StepCore = StepCore> = (
  code: string,
  config: { readonly meta: MetaConfig; readonly options: TOptions },
) => Promise<RecordResult<TStep>>;

type RecordResult<TStep extends StepCore = StepCore> = {
  readonly steps: readonly TStep[];
  readonly config: ResolvedConfig;
};

type ResolvedConfig = {
  readonly meta: MetaConfig; // Execution limits (fully filled)
  readonly options: Record<string, unknown>; // Lang-specific options (fully filled)
};
```

**Key guarantees**:

- `meta` and `options` are always complete and valid
- No defensive coding needed in lang modules
- Execution limits are enforced by the lang module (see Error Handling)

## StepCore Contract

All steps, regardless of language, must include:

```typescript
type StepCore = {
  readonly step: number; // 1-indexed execution order
  readonly loc: {
    readonly line: number; // 1-indexed
    readonly column: number; // 1-indexed
  };
};
```

Language-specific fields extend this base type.

## Adding a New Language

1. Create `langs/<lang>/` directory

2. Create `schema.json` with options schema:

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

3. Implement `record.ts` with tracing logic:

   ```typescript
   /**
    * Trace code execution and return steps.
    * Meta and options are guaranteed complete and valid from API layer.
    */
   async function record(
     code: string,
     config: { readonly meta: MetaConfig; readonly options: YourOptions },
   ): Promise<RecordResult<YourStep>> {
     const { meta, options } = config;

     // Check execution limits (lang responsibility)
     if (meta.max.steps !== null && code.length > meta.max.steps) {
       throw new LimitExceededError('Exceeded max steps', 'steps', code.length);
     }

     // Pure tracing logic - NO validation needed
     // Parse code, collect steps, return result
     return {
       steps,
       config: { meta, options },
     };
   }

   export default record;
   ```

4. Define `types.ts` with step and options types

5. (Optional) Create `verify-options.ts` if you need semantic validation

6. Add to `dispatch.ts` registry

7. API layer imports schema directly (no registry needed)

See `chars/` for a minimal reference implementation.

## Error Handling

Lang modules throw specific error classes for runtime errors:

| Error Class          | When                               | Owner       |
| -------------------- | ---------------------------------- | ----------- |
| `ParseError`         | Code cannot be parsed              | Lang module |
| `RuntimeError`       | Code execution fails               | Lang module |
| `LimitExceededError` | Exceeded max steps/time/iterations | Lang module |

**Note**: Options errors are thrown before `record` is called:

- `OptionsSchemaInvalidError` — thrown by `/configuring` (structural validation)
- `OptionsSemanticInvalidError` — thrown by lang's `verifyOptions()` (semantic validation)

Lang modules receive fully-validated options and only throw these:

```typescript
import { ParseError } from '../errors/parse-error.js';
import { RuntimeError } from '../errors/runtime-error.js';
import { LimitExceededError } from '../errors/limit-exceeded-error.js';

// Lang modules throw these (NOT Options* errors)
throw new ParseError('Unexpected character', { line: 1, column: 5 });
throw new RuntimeError('Division by zero', { line: 3, column: 10 });
throw new LimitExceededError('Exceeded maximum steps (1000)', 'steps', 1001);
```

All error classes extend `EmbodyError` — see [/errors README](../errors/README.md) for details.

## Links

- [/configuring README](../configuring/README.md) — how options are validated
- [/configuring DOCS](../configuring/DOCS.md) — schema format, verifyOptions convention
- [/api README](../api/README.md) — how API uses lang modules
