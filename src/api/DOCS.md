# api — Technical Reference

Complete API documentation for all four tracing functions. See [README.md](./README.md) for overview and decision matrix.

## Table of Contents

- [Error Handling](#error-handling)
  - [EmbodyError (Base Class)](#embodyerror-base-class)
  - [Error Classes](#error-classes)
  - [Validation Timing](#validation-timing)
- [trace(tracer, code, config?)](#tracetracer-code-config)
- [tracify](#tracify)
- [embody({ tracer, code, config })](#embody-tracer-code-config-)
- [embodify()](#embodify)
- [Config Semantics](#config-semantics)
- [Immutability](#immutability)
- [resolvedConfig](#resolvedconfig)

---

## Error Handling

### EmbodyError (Base Class)

All API errors extend `EmbodyError`, enabling catch-all error handling:

```typescript
import { trace, EmbodyError, ParseError } from '@study-lenses/embody';

try {
  const steps = await trace('chars', code);
} catch (error) {
  if (error instanceof EmbodyError) {
    // Handle any embody error
    if (error instanceof ParseError) {
      console.log(`Parse error at line ${error.loc.line}`);
    } else {
      console.log(error.message);
    }
  } else {
    throw error; // Re-throw non-library errors
  }
}
```

### Error Classes

| Error Class                   | Thrown By              | Properties                        |
| ----------------------------- | ---------------------- | --------------------------------- |
| `EmbodyError`                 | Never (base only)      | `message`                         |
| `ArgumentInvalidError`        | API layer              | `field: string`                   |
| `TracerUnknownError`          | API layer              | `tracer: string`                  |
| `OptionsInvalidError`         | `/configuring`         | `path?: string`                   |
| `OptionsSemanticInvalidError` | Lang's `verifyOptions` | `message`                         |
| `ParseError`                  | Lang's `record`        | `loc: SourceLoc` (ESTree format)  |
| `RuntimeError`                | Lang's `record`        | `loc?: SourceLoc` (ESTree format) |
| `LimitExceededError`          | Lang's `record`        | `limit: string`, `actual: number` |
| `InternalError`               | Any layer              | `cause?: Error`                   |

For complete error class documentation, see [errors/DOCS.md](../errors/DOCS.md).

### Validation Timing

All APIs distinguish two error categories:

| Category             | When Detected   | Examples                         |
| -------------------- | --------------- | -------------------------------- |
| **Type errors**      | Compile time    | `tracer: 123`, `code: null`      |
| **Necessity errors** | Lazy (at trace) | Missing `tracer`, missing `code` |
| **Semantic errors**  | Lazy (at trace) | Unknown tracer, parse failure    |

**Why this split?** Type errors are caught by TypeScript at compile time — no runtime overhead. Missing fields might be filled in later (partial application, chaining). Semantic errors require the trace to attempt.

---

## `trace(tracer, code, config?)`

Positional API. Throws on error. **Async** — returns Promise.

### Signature

```typescript
async function trace(tracer: string, code: string, config?: unknown): Promise<StepCore[]>;
```

### Parameters

| Parameter | Type      | Required | Description                                        |
| --------- | --------- | -------- | -------------------------------------------------- |
| `tracer`  | `string`  | Yes      | Tracer identifier (e.g., `'chars'`, `'js'`)        |
| `code`    | `string`  | Yes      | Source code to trace                               |
| `config`  | `unknown` | No       | Tracer-specific options (uses defaults if omitted) |

### Return Value

```typescript
type Position = {
  line: number; // 1-indexed (ESTree standard)
  column: number; // 0-indexed (ESTree standard)
};

type SourceLocation = {
  start: Position;
  end: Position;
};

type StepCore = {
  step: number; // 1-indexed execution order
  loc: SourceLocation; // ESTree-compliant source range
  // ...additional tracer-specific fields
};
```

**ESTree compliance**: Line numbers are 1-indexed, column numbers are 0-indexed. For single-token steps, `start` equals `end`.

### Error Behavior

Throws an `EmbodyError` subclass on any error. Type errors throw immediately (eager validation).

### Examples

```typescript
import { trace } from '@study-lenses/embody';
// import trace from '@study-lenses/embody'; // <- trace is also default export

// Minimal — await the Promise (uses defaults for meta and options)
const steps = await trace('chars', 'hello');

// With options only
const steps = await trace('chars', 'hello', { options: { direction: 'rl' } });

// With meta limits
const steps = await trace('chars', 'hello', { meta: { max: { steps: 100 } } });

// With both meta and options
const steps = await trace('chars', 'hello', {
  meta: { max: { steps: 100 }, timestamps: true },
  options: { direction: 'rl' },
});

// Type error throws immediately (sync, before async work)
trace(123, 'hello'); // throws: "trace: expected tracer to be string, got number"

// Semantic errors throw when Promise rejects
await trace('unknown', 'hello'); // throws: "unknown tracer 'unknown'"
```

---

## `tracify`

Chainable builder API. Throws on error. Results are memoized. **Async** — `.steps` returns Promise.

### Interface

```typescript
const tracify: {
  tracer(value: string): TracifyChain;
  code(value: string): TracifyChain;
  config(value: unknown): TracifyChain;
};

type TracifyChain = {
  tracer(value: string): TracifyChain;
  code(value: string): TracifyChain;
  config(value: unknown): TracifyChain;
  readonly steps: Promise<StepCore[]>; // Triggers trace, rejects on error
  readonly resolvedConfig: ResolvedConfig; // Sync getter (throws if tracer missing)
};
```

### Eager Validation

`.tracer()` and `.code()` throw immediately if passed non-string:

```typescript
tracify.tracer(123); // throws: "tracify.tracer: expected string, got number"
tracify.code(null); // throws: "tracify.code: expected string, got object"
```

### Memoization

Accessing `.steps` multiple times returns the same cached Promise:

```typescript
const chain = tracify.tracer('chars').code('ab');
chain.steps === chain.steps; // true (same Promise reference)
```

### Examples

```typescript
import { tracify } from '@study-lenses/embody';

// Basic usage — await the Promise
const steps = await tracify.tracer('chars').code('hello').steps;

// With config
const steps = await tracify
  .tracer('chars')
  .code('hello')
  .config({ options: { direction: 'rl' } }).steps;

// Order doesn't matter
const steps = await tracify.code('hello').tracer('chars').steps;

// Missing required field — Promise rejects
await tracify.code('hello').steps; // rejects: "tracify: tracer is required"

// Type errors throw immediately (sync, before Promise)
tracify.tracer(123); // throws: "tracify.tracer(): expected string, got number"
```

---

## `embody({ tracer, code, config })`

Object-threading API with smart partial application. **Async** — completing call returns Promise.

Partial calls (missing fields) return closures **synchronously**. Completing calls (all fields present) return `Promise<EmbodyResult>`.

### Signature

```typescript
// Partial call — returns closure (sync)
function embody(partial: { tracer?: string }): EmbodyClosure;
function embody(partial: { code?: string }): EmbodyClosure;
function embody(partial: { tracer?: string; code?: string }): EmbodyClosure;

// Completing call — returns Promise (async)
function embody(complete: {
  tracer: string;
  code: string;
  config: unknown; // null = use defaults, {...} = use this config
}): Promise<EmbodyResult>;
```

### Return Types

**Completing call** (all three fields present, config not `undefined`) — returns `Promise<EmbodyResult>`:

```typescript
type EmbodySuccess = {
  ok: true;
  steps: StepCore[];
  tracer: string;
  code: string;
  config: unknown;
  resolvedConfig: ResolvedConfig;
};

type EmbodyFailure = {
  ok: false;
  error: EmbodyError; // An EmbodyError subclass
  tracer: string;
  code: string;
  config: unknown;
};

type EmbodyResult = EmbodySuccess | EmbodyFailure;
```

**Partial call** (missing fields) — returns `EmbodyClosure` synchronously:

```typescript
type EmbodyClosure = {
  ok: true; // Always true (closures are always valid)
  error: undefined; // Never has error (TypeScript catches type issues)
  tracer: string | undefined; // Current value
  code: string | undefined;
  config: object | undefined;
  steps: undefined; // No trace happened yet (closure, not result)
  // Call returns Promise when completing, closure when still partial
  (remaining: EmbodyInput): Promise<EmbodyResult> | EmbodyClosure;
};
```

### Config Semantics

| Config Value | Behavior                            |
| ------------ | ----------------------------------- |
| `{}`         | Trace with tracer defaults          |
| `undefined`  | Waiting for config (return closure) |
| `{...}`      | Trace with provided config          |
| Key missing  | Same as `undefined`                 |

### Key Overwriting

Later values overwrite earlier ones (no duplicate-key error):

```typescript
const partial = embody({ tracer: 'chars' });
const result = await partial({ tracer: 'js', code: 'x', config: {} });
result.tracer; // 'js' (overwrote 'chars')
```

### Examples

```typescript
import { embody } from '@study-lenses/embody';

// Completing call — await the Promise, then access .steps sync
const result = await embody({ tracer: 'chars', code: 'hello', config: {} });
if (result.ok) console.log(result.steps); // Sync access after await

// Partial application — reuse tracer (partial calls are sync)
const withTracer = embody({ tracer: 'chars' }); // Sync, returns closure
const r1 = await withTracer({ code: 'hello', config: {} }); // Async at completing call
const r2 = await withTracer({ code: 'world', config: {} });

// Inspect closure state before calling (sync access)
const partial = embody({ tracer: 'chars', code: 'hello' });
console.log(partial.tracer); // 'chars'
console.log(partial.ok); // true (valid so far)
console.log(partial.steps); // undefined (no trace yet)

// Custom config with options only
const result = await embody({
  tracer: 'chars',
  code: 'hello',
  config: { options: { remove: ['h'], direction: 'rl' } },
});

// Custom config with meta limits
const result = await embody({
  tracer: 'chars',
  code: 'hello',
  config: {
    meta: { max: { steps: 50 } },
    options: { direction: 'rl' },
  },
});
```

---

## `embodify()`

Chainable API with smart cache invalidation. **Async** — `.trace()` returns Promise.

State building (`.set()`) is sync. Tracing (`.trace()`) is async. After await, `.steps` is sync access. TypeScript validates input types at compile time.

### Interface

```typescript
function embodify(input?: { tracer?: string; code?: string; config?: object }): EmbodifyChain;

type EmbodifyChain = {
  readonly tracer: string | undefined;
  readonly code: string | undefined;
  readonly config: object | undefined;
  readonly resolvedConfig: ResolvedConfig | undefined; // Lazy-computed if tracer present
  readonly steps: readonly StepCore[] | undefined; // Sync access after await .trace()
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined; // An EmbodyError subclass
  set(input: EmbodifyInput): EmbodifyChain; // Sync — returns new chain
  trace(input?: TraceMethodInput): Promise<EmbodifyChain>; // Async — await before accessing .steps
};
```

### Key Differences from embody

| Aspect           | embody                             | embodify                        |
| ---------------- | ---------------------------------- | ------------------------------- |
| Error recovery   | No (poisoned closures)             | Yes (`.trace()` for new result) |
| Config semantics | `null` = trace, `undefined` = wait | `.trace()` always traces        |
| State inspection | Via closure properties             | Via chain getters               |
| Immutability     | Returns new closure/result         | Returns new chain               |

### Smart Cache Invalidation

The chain caches computed values and invalidates only when values **actually change** (not just when keys are provided):

| Value Changed | `steps` Invalidated | `resolvedConfig` Invalidated |
| ------------- | ------------------- | ---------------------------- |
| `tracer`      | Yes                 | Yes                          |
| `code`        | Yes                 | No (config-independent)      |
| `config`      | Yes                 | Yes                          |
| nothing       | No                  | No                           |

```typescript
const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();

// Same value = no invalidation
const chain1 = traced.set({ tracer: 'chars' }); // Same tracer
chain1.steps; // Preserved (no actual change)

// Different value = invalidation
const chain2 = traced.set({ code: 'xyz' }); // Different code
chain2.resolvedConfig; // Preserved (code doesn't affect config)
chain2.steps; // undefined (code changed)

// Empty set = preserve everything
const chain3 = traced.set({});
chain3.steps; // Same as traced.steps
```

### Lazy resolvedConfig

The `resolvedConfig` getter computes on demand when `tracer` is present:

```typescript
const chain = embodify({ tracer: 'chars' });
chain.resolvedConfig; // Computed and cached (no trace needed)
chain.resolvedConfig?.options.direction; // 'lr' (default)

// Returns undefined if tracer is missing or unknown
embodify({}).resolvedConfig; // undefined
embodify({ tracer: 'unknown' }).resolvedConfig; // undefined
```

### .trace() Behavior

`.trace()` returns `Promise<EmbodifyChain>`. It always attempts to execute the trace. It accepts `tracer`, `code`, and `config` to merge with current state:

```typescript
// Basic trace — await the Promise
const chain = embodify({ tracer: 'chars', code: 'ab' });
const traced = await chain.trace();
traced.ok; // true
traced.steps; // [...] (sync access after await)

// .trace() with overrides
const traced = await embodify({ tracer: 'chars' }).trace({ code: 'hello' });

// Missing required field returns error
const traced = await embodify({ tracer: 'chars' }).trace();
traced.ok; // false
traced.error?.message; // "embodify: code is required"
traced.steps; // undefined
```

### Examples

```typescript
import { embodify } from '@study-lenses/embody';

// Basic usage — await .trace(), then access .steps sync
const result = await embodify({ tracer: 'chars', code: 'hello' }).trace();
if (result.ok) console.log(result.steps);

// Build up state (sync), then trace (async)
const chain = await embodify({ tracer: 'chars' }).set({ code: 'hello' }).trace();

// Modify and re-trace
const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
const modified = traced.set({ code: 'xyz' }); // Sync — returns new chain
const retraced = await modified.trace(); // Async — await again

// Access resolvedConfig before tracing (lazy computation)
const chain = embodify({ tracer: 'chars', code: 'hello' });
console.log(chain.resolvedConfig?.options); // Computed on access

// Cache preservation on code change
const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
const modified = traced.set({ code: 'xyz' });
modified.resolvedConfig; // Same as traced (code doesn't affect config)
```

---

## Config Semantics

### embody

| Config Value                       | Behavior                           |
| ---------------------------------- | ---------------------------------- |
| `config: null`                     | Execute trace with tracer defaults |
| `config: {...}`                    | Execute trace with provided config |
| `config: undefined` or key missing | Return closure (waiting)           |

### embodify

`.trace()` always executes. If no config was set anywhere (via `embodify()`, `.set()`, or `.trace()`), tracer defaults are used.

```typescript
// No config anywhere — uses tracer defaults
embodify({ tracer: 'chars', code: 'ab' }).trace();

// Config via initial call
embodify({ tracer: 'chars', code: 'ab', config: { options: { direction: 'rl' } } }).trace();

// Config via .set()
embodify({ tracer: 'chars', code: 'ab' })
  .set({ config: { options: { direction: 'rl' } } })
  .trace();

// Config via .trace()
embodify({ tracer: 'chars', code: 'ab' }).trace({ config: { options: { direction: 'rl' } } });
```

---

## Immutability

All APIs enforce immutability through deep cloning:

1. **Input cloning**: Config objects are cloned on entry
2. **Getter cloning**: `.config`, `.steps`, `.resolvedConfig` return fresh clones
3. **State isolation**: Mutations to returned objects don't affect internal state

```typescript
const config = { options: { remove: ['a'] } };
const result = embody({ tracer: 'chars', code: 'ab', config });

// Mutating original doesn't affect result
config.options.remove.push('b');
result.config.options.remove; // ['a'] (unchanged)

// Mutating returned config doesn't affect internal state
result.config.options.remove.push('c');
result.config.options.remove; // ['a'] (fresh clone each access)
```

---

## resolvedConfig

After a successful trace, `resolvedConfig` contains the fully resolved configuration including all defaults for both meta and options:

```typescript
type ResolvedConfig = {
  meta: MetaConfig; // Execution limits with defaults merged
  options: Record<string, unknown>; // Tracer-specific options with defaults merged
};
```

### Availability

| API        | When Available                                             |
| ---------- | ---------------------------------------------------------- |
| `trace`    | Not returned (use tracify for access)                      |
| `tracify`  | After `.steps` accessed (via `.resolvedConfig`)            |
| `embody`   | In success result (`result.resolvedConfig`)                |
| `embodify` | After successful `.trace()` (via `.resolvedConfig` getter) |

### Example

```typescript
const result = await embody({
  tracer: 'chars',
  code: 'ab',
  config: { meta: { max: { steps: 100 } }, options: { remove: ['a'] } },
});
if (result.ok) {
  console.log(result.resolvedConfig.meta);
  // { max: { steps: 100, iterations: null, callstack: null, time: null }, ... }

  console.log(result.resolvedConfig.options);
  // { remove: ['a'], replace: {}, direction: 'lr', allowedCharClasses: {...} }
}
```

---

## Architecture

### Layer Responsibilities

The library has four layers with distinct responsibilities:

```text
┌─────────────────────────────────────────────────────────────┐
│  API Layer (/api/)                                          │
│  - Validates `tracer` type (must be string)                 │
│  - Validates `code` type (must be string)                   │
│  - COORDINATES config preparation:                          │
│    1. Check tracer exists (registry lookup)                 │
│    2. Validate meta: prepareConfig(meta, metaSchema)        │
│    3. Validate options: prepareConfig(options, tracerSchema)│
│    4. Call tracer's verifyOptions() for semantic validation │
│    5. Pass { meta, options } to tracer module               │
│  - Errors: ArgumentInvalidError, TracerUnknownError           │
├─────────────────────────────────────────────────────────────┤
│  Config Layer (/configuring/)                               │
│  - PURE FUNCTIONS — no coordination, no tracer awareness    │
│  - All functions return data (pipeable)                     │
│  - prepareConfig(data, schema) — wrapper (recommended)      │
│  - expandShorthand(data, schema) — boolean shorthand        │
│  - fillDefaults(data, schema) — default filling             │
│  - validateConfig(data, schema) — structural validation     │
│  - Pipeline order: expand → fill → validate                 │
│  - Errors: OptionsInvalidError                              │
├─────────────────────────────────────────────────────────────┤
│  Tracer Registry (/tracers/index.ts)                        │
│  - Maps tracer IDs ('chars', 'js:klve') to record functions │
│  - Registry + barrel (named re-exports for tree-shaking)    │
├─────────────────────────────────────────────────────────────┤
│  Tracer Modules (/tracers/*/record.ts)                      │
│  - Receives FULLY FILLED { meta, options } (never partial)  │
│  - Enforces execution limits from meta                      │
│  - Pure tracing logic, ZERO validation                      │
│  - Parses and executes code                                 │
│  - Produces step arrays                                     │
│  - Errors: ParseError, RuntimeError, LimitExceededError     │
└─────────────────────────────────────────────────────────────┘
```

### Config Flow

The API layer orchestrates config preparation by importing schemas and calling pure functions:

```typescript
// In API layer (e.g., trace.ts)
import prepareConfig from './prepare-config.js';

// API layer coordinates the flow:
// 1. Get tracer module from registry (includes optionsSchema, record, verifyOptions?)
const tracerModule = tracers[tracer];

// 2. Prepare both meta and options using the API's prepareConfig
//    (internally calls /configuring pure functions for each)
const { meta, options } = prepareConfig(tracer, userConfig);
// userConfig = { meta?: unknown; options?: unknown }

// 3. Call tracer's semantic validator if exported (throws OptionsSemanticInvalidError)
tracerModule.verifyOptions?.(options);

// 4. Pass to tracer module for tracing (receives both meta and options)
const result = await tracerModule.record(code, { meta, options });
```

**Config structure** — user passes `{ meta?, options? }`:

```typescript
// User config (partial — missing fields get defaults)
{
  meta: { max: { steps: 100 } },           // Execution limits
  options: { direction: 'rl' }              // Tracer-specific options
}

// After prepareConfig() — fully filled
{
  meta: { max: { steps: 100, iterations: null, callstack: null, time: null }, ... },
  options: { direction: 'rl', remove: [], replace: [], allowedCharClasses: {...} }
}
```

**Individual /configuring functions** (for edge cases or testing):

```typescript
// All functions are pure and return data (pipeable)
const result = validateConfig(fillDefaults(expandShorthand(userOptions, schema), schema), schema);
```

**Pipeline order**: expand → fill → validate

**Key insight**: `/configuring` functions are pure utilities. They receive `(data, schema)` — not tracerId. They import ONLY from `/errors`. The API layer does all coordination (gets schemas from tracers, calls configuring functions, calls verifyOptions).

### Error Ownership

| Error Class                   | Layer                | Cause                                |
| ----------------------------- | -------------------- | ------------------------------------ |
| `ArgumentInvalidError`        | API                  | `tracer`/`code`/`config` wrong type  |
| `TracerUnknownError`          | API                  | Tracer ID not in tracer registry     |
| `OptionsInvalidError`         | /configuring         | meta/options don't match JSON Schema |
| `OptionsSemanticInvalidError` | Tracer verifyOptions | Cross-field constraints violated     |
| `ParseError`                  | Tracer module        | Code cannot be parsed                |
| `RuntimeError`                | Tracer module        | Code execution fails                 |
| `LimitExceededError`          | Tracer module        | Exceeded max steps/time/iterations   |
| `InternalError`               | Any                  | Unexpected error (wrapped)           |

**Two distinct options errors**:

- `OptionsInvalidError` — thrown by `/configuring` functions (via Ajv) when meta or options don't match the JSON Schema (wrong types, missing required fields)
- `OptionsSemanticInvalidError` — thrown by tracer's `verifyOptions()` (called by API layer) when cross-field constraints are violated

---

## Links

- [API Overview](./README.md) — decision matrix, quick start
- [Config Module](../configuring/README.md) — options validation and defaults
- [Developer Guide](../../DEV.md) — architecture and conventions
