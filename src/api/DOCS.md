# api — Technical Reference

Complete API documentation for all four tracing functions. See [README.md](./README.md) for overview and decision matrix.

## Table of Contents

- [Error Handling](#error-handling)
  - [EmbodyError (Base Class)](#embodyerror-base-class)
  - [Error Classes](#error-classes)
  - [Validation Timing](#validation-timing)
- [trace(lang, code, config?)](#tracelang-code-config)
- [tracify](#tracify)
- [embody({ lang, code, config })](#embody-lang-code-config-)
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
| `ConfigInvalidError`          | API layer              | `field: string`                   |
| `LangUnknownError`            | API layer              | `lang: string`                    |
| `OptionsSchemaInvalidError`   | `/configuring`         | `path?: string`                   |
| `OptionsSemanticInvalidError` | Lang's `verifyOptions` | `message`                         |
| `ParseError`                  | Lang's `record`        | `loc: { line, column }`           |
| `RuntimeError`                | Lang's `record`        | `loc?: { line, column }`          |
| `LimitExceededError`          | Lang's `record`        | `limit: string`, `actual: number` |
| `InternalError`               | Any layer              | `cause?: Error`                   |

For complete error class documentation, see [errors/DOCS.md](../errors/DOCS.md).

### Validation Timing

All APIs distinguish three error categories:

| Category             | When Detected       | Examples                        |
| -------------------- | ------------------- | ------------------------------- |
| **Type errors**      | Eager (immediately) | `lang: 123`, `code: null`       |
| **Necessity errors** | Lazy (at trace)     | Missing `lang`, missing `code`  |
| **Semantic errors**  | Lazy (at trace)     | Unknown language, parse failure |

**Why this split?** Type errors are programming mistakes — catch them immediately. Missing fields might be filled in later (partial application). Semantic errors require the trace to attempt.

---

## `trace(lang, code, config?)`

Positional API. Throws on error. **Async** — returns Promise.

### Signature

```typescript
async function trace(lang: string, code: string, config?: unknown): Promise<StepCore[]>;
```

### Parameters

| Parameter | Type      | Required | Description                                      |
| --------- | --------- | -------- | ------------------------------------------------ |
| `lang`    | `string`  | Yes      | Language identifier (e.g., `'chars'`, `'js'`)    |
| `code`    | `string`  | Yes      | Source code to trace                             |
| `config`  | `unknown` | No       | Lang-specific options (uses defaults if omitted) |

### Return Value

```typescript
type StepCore = {
  step: number; // 1-indexed execution order
  loc: { line: number; column: number }; // 1-indexed source location
  // ...additional lang-specific fields
};
```

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
trace(123, 'hello'); // throws: "trace: expected lang to be string, got number"

// Semantic errors throw when Promise rejects
await trace('unknown', 'hello'); // throws: "unknown language 'unknown'"
```

---

## `tracify`

Chainable builder API. Throws on error. Results are memoized. **Async** — `.steps` returns Promise.

### Interface

```typescript
const tracify: {
  lang(value: string): TracifyChain;
  code(value: string): TracifyChain;
  config(value: unknown): TracifyChain;
};

type TracifyChain = {
  lang(value: string): TracifyChain;
  code(value: string): TracifyChain;
  config(value: unknown): TracifyChain;
  readonly steps: Promise<StepCore[]>; // Triggers trace, rejects on error
  readonly resolvedConfig: Promise<ResolvedConfig>; // Resolves after trace completes
  readonly ok: true; // Always true (throws on error)
};
```

### Eager Validation

`.lang()` and `.code()` throw immediately if passed non-string:

```typescript
tracify.lang(123); // throws: "tracify.lang: expected string, got number"
tracify.code(null); // throws: "tracify.code: expected string, got object"
```

### Memoization

Accessing `.steps` multiple times returns the same cached Promise:

```typescript
const chain = tracify.lang('chars').code('ab');
chain.steps === chain.steps; // true (same Promise reference)
```

### Examples

```typescript
import { tracify } from '@study-lenses/embody';

// Basic usage — await the Promise
const steps = await tracify.lang('chars').code('hello').steps;

// With config
const steps = await tracify
  .lang('chars')
  .code('hello')
  .config({ options: { direction: 'rl' } }).steps;

// Order doesn't matter
const steps = await tracify.code('hello').lang('chars').steps;

// Missing required field — Promise rejects
await tracify.code('hello').steps; // rejects: "tracify: lang is required"

// Type errors throw immediately (sync, before Promise)
tracify.lang(123); // throws: "tracify.lang(): expected string, got number"
```

---

## `embody({ lang, code, config })`

Object-threading API with smart partial application. **Async** — completing call returns Promise.

Partial calls (missing fields) return closures **synchronously**. Completing calls (all fields present) return `Promise<EmbodyResult>`.

### Signature

```typescript
// Partial call — returns closure (sync)
function embody(partial: { lang?: string }): EmbodyClosure;
function embody(partial: { code?: string }): EmbodyClosure;
function embody(partial: { lang?: string; code?: string }): EmbodyClosure;

// Completing call — returns Promise (async)
function embody(complete: {
  lang: string;
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
  lang: string;
  code: string;
  config: unknown;
  resolvedConfig: ResolvedConfig;
};

type EmbodyFailure = {
  ok: false;
  error: EmbodyError; // An EmbodyError subclass
  lang: string;
  code: string;
  config: unknown;
};

type EmbodyResult = EmbodySuccess | EmbodyFailure;
```

**Partial call** (missing fields) — returns `EmbodyClosure` synchronously:

```typescript
type EmbodyClosure = {
  ok: boolean; // true = valid so far, false = type error
  error?: EmbodyError; // Present if ok = false (ConfigInvalidError)
  lang: unknown; // Current value (may be invalid type)
  code: unknown;
  config: unknown;
  steps: undefined; // No trace happened yet (closure, not result)
  // Call returns Promise when completing, closure when still partial
  (remaining: EmbodyInput): Promise<EmbodyResult> | EmbodyClosure;
};
```

### Config Semantics

| Config Value | Behavior                            |
| ------------ | ----------------------------------- |
| `null`       | Trace with language defaults        |
| `undefined`  | Waiting for config (return closure) |
| `{...}`      | Trace with provided config          |
| Key missing  | Same as `undefined`                 |

### Poisoned Closures (Not Recoverable)

Type errors create "poisoned" closures. Once poisoned, calling the closure always returns the same error:

```typescript
const bad = embody({ lang: 123 }); // type error
bad.ok; // false
bad.error.message; // "embody: type errors - lang must be string"

// Calling poisoned closure returns same error
const result = bad({ code: 'hello', config: null });
result.ok; // false (cannot recover)
```

**Error accumulation**: All type errors are collected in one message:

```typescript
const bad = embody({ lang: 123, code: 456 });
bad.error.message; // "embody: type errors - lang must be string, code must be string"
```

### Duplicate Key Detection

Providing a key that was already set returns an error:

```typescript
const partial = embody({ lang: 'chars' });
const result = partial({ lang: 'js', code: 'x', config: null });
result.ok; // false
result.error.message; // "embody: 'lang' was already provided"
```

### Examples

```typescript
import { embody } from '@study-lenses/embody';

// Completing call — await the Promise, then access .steps sync
const result = await embody({ lang: 'chars', code: 'hello', config: null });
if (result.ok) console.log(result.steps); // Sync access after await

// Partial application — reuse lang (partial calls are sync)
const withLang = embody({ lang: 'chars' }); // Sync, returns closure
const r1 = await withLang({ code: 'hello', config: null }); // Async at completing call
const r2 = await withLang({ code: 'world', config: null });

// Inspect closure state before calling (sync access)
const partial = embody({ lang: 'chars', code: 'hello' });
console.log(partial.lang); // 'chars'
console.log(partial.ok); // true (valid so far)
console.log(partial.steps); // undefined (no trace yet)

// Custom config with options only
const result = await embody({
  lang: 'chars',
  code: 'hello',
  config: { options: { remove: ['h'], direction: 'rl' } },
});

// Custom config with meta limits
const result = await embody({
  lang: 'chars',
  code: 'hello',
  config: {
    meta: { max: { steps: 50 } },
    options: { direction: 'rl' },
  },
});
```

---

## `embodify()`

Chainable API with recoverable errors. **Async** — `.trace()` returns Promise.

State building (`.set()`) is sync. Tracing (`.trace()`) is async. After await, `.steps` is sync access.

### Interface

```typescript
function embodify(input?: { lang?: unknown; code?: unknown; config?: unknown }): EmbodifyChain;

type EmbodifyChain = {
  readonly lang: unknown;
  readonly code: unknown;
  readonly config: unknown;
  readonly resolvedConfig: ResolvedConfig | undefined;
  readonly steps: readonly StepCore[] | null; // Sync access after await .trace()
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined; // An EmbodyError subclass
  set(input: EmbodifyInput): EmbodifyChain; // Sync — returns new chain
  trace(input?: TraceMethodInput): Promise<EmbodifyChain>; // Async — await before accessing .steps
};
```

### Key Differences from embody

| Aspect           | embody                             | embodify                        |
| ---------------- | ---------------------------------- | ------------------------------- |
| Error recovery   | No (poisoned closures)             | Yes (`.set()` can clear errors) |
| Config semantics | `null` = trace, `undefined` = wait | `.trace()` always traces        |
| State inspection | Via closure properties             | Via chain getters               |
| Immutability     | Returns new closure/result         | Returns new chain               |

### Recoverable Errors

Errors can be fixed via `.set()` or `.trace()`:

```typescript
const bad = embodify({ lang: 123 });
bad.ok; // false
bad.error.message; // "embodify: type errors - lang must be string"

// Fix with .set()
const fixed = bad.set({ lang: 'chars' });
fixed.ok; // true
fixed.error; // undefined
```

### .trace() Behavior

`.trace()` returns `Promise<EmbodifyChain>`. It always attempts to execute the trace. It accepts `lang`, `code`, and `config` to merge with current state:

```typescript
// .trace() can fix errors and execute — await the Promise
const chain = embodify({ lang: 123, code: 'ab' });
const traced = await chain.trace({ lang: 'chars' });
traced.ok; // true (error cleared, trace succeeded)
traced.steps; // [...] (sync access after await)

// .trace() can introduce new errors
const chain = embodify({ lang: 'chars', code: 'ab' });
const traced = await chain.trace({ lang: 123 });
traced.ok; // false (new type error)
traced.steps; // null (trace didn't run)
```

### Examples

```typescript
import { embodify } from '@study-lenses/embody';

// Basic usage — await .trace(), then access .steps sync
const result = await embodify({ lang: 'chars', code: 'hello' }).trace();
if (result.ok) console.log(result.steps);

// Build up state (sync), then trace (async)
const chain = await embodify({ lang: 'chars' }).set({ code: 'hello' }).trace();

// Modify and re-trace
const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();
const modified = traced.set({ code: 'xyz' }); // Sync — returns new chain
const retraced = await modified.trace(); // Async — await again

// Form validation pattern (sync validation before async trace)
const chain = embodify({ lang: userLang, code: userCode });
if (!chain.ok) {
  showError(chain.error.message); // Sync validation feedback
} else {
  const result = await chain.trace(); // Async trace
  if (result.ok) console.log(result.steps);
}
```

---

## Config Semantics

### embody

| Config Value                       | Behavior                             |
| ---------------------------------- | ------------------------------------ |
| `config: null`                     | Execute trace with language defaults |
| `config: {...}`                    | Execute trace with provided config   |
| `config: undefined` or key missing | Return closure (waiting)             |

### embodify

`.trace()` always executes. If no config was set anywhere (via `embodify()`, `.set()`, or `.trace()`), language defaults are used.

```typescript
// No config anywhere — uses lang defaults
embodify({ lang: 'chars', code: 'ab' }).trace();

// Config via initial call
embodify({ lang: 'chars', code: 'ab', config: { options: { direction: 'rl' } } }).trace();

// Config via .set()
embodify({ lang: 'chars', code: 'ab' })
  .set({ config: { options: { direction: 'rl' } } })
  .trace();

// Config via .trace()
embodify({ lang: 'chars', code: 'ab' }).trace({ config: { options: { direction: 'rl' } } });
```

---

## Immutability

All APIs enforce immutability through deep cloning:

1. **Input cloning**: Config objects are cloned on entry
2. **Getter cloning**: `.config`, `.steps`, `.resolvedConfig` return fresh clones
3. **State isolation**: Mutations to returned objects don't affect internal state

```typescript
const config = { options: { remove: ['a'] } };
const result = embody({ lang: 'chars', code: 'ab', config });

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
  options: Record<string, unknown>; // Lang-specific options with defaults merged
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
  lang: 'chars',
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
│  - Validates `lang` type (must be string)                   │
│  - Validates `code` type (must be string)                   │
│  - COORDINATES config preparation:                          │
│    1. Check lang exists (dispatch lookup)                   │
│    2. Validate meta: prepareConfig(meta, metaSchema)        │
│    3. Validate options: prepareConfig(options, langSchema)  │
│    4. Call lang's verifyOptions() for semantic validation   │
│    5. Pass { meta, options } to lang module                 │
│  - Errors: ConfigInvalidError, LangUnknownError             │
├─────────────────────────────────────────────────────────────┤
│  Config Layer (/configuring/)                               │
│  - PURE FUNCTIONS — no coordination, no lang awareness      │
│  - All functions return data (pipeable)                     │
│  - prepareConfig(data, schema) — wrapper (recommended)      │
│  - expandShorthand(data, schema) — boolean shorthand        │
│  - fillDefaults(data, schema) — default filling             │
│  - validateConfig(data, schema) — structural validation     │
│  - Pipeline order: expand → fill → validate                 │
│  - Errors: OptionsSchemaInvalidError                        │
├─────────────────────────────────────────────────────────────┤
│  Dispatch (/langs/dispatch.ts)                              │
│  - Maps lang IDs ('chars', 'js', 'py') to record functions  │
│  - Simple registry pattern                                  │
├─────────────────────────────────────────────────────────────┤
│  Lang Modules (/langs/*/record.ts)                          │
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
// 1. Get lang module from dispatch (includes schema, record, verifyOptions?)
const langModule = dispatch(lang);

// 2. Prepare both meta and options using the API's prepareConfig
//    (internally calls /configuring pure functions for each)
const { meta, options } = prepareConfig(lang, userConfig);
// userConfig = { meta?: unknown; options?: unknown }

// 3. Call lang's semantic validator if exported (throws OptionsSemanticInvalidError)
langModule.verifyOptions?.(options);

// 4. Pass to lang module for tracing (receives both meta and options)
const result = await langModule.record(code, { meta, options });
```

**Config structure** — user passes `{ meta?, options? }`:

```typescript
// User config (partial — missing fields get defaults)
{
  meta: { max: { steps: 100 } },           // Execution limits
  options: { direction: 'rl' }              // Lang-specific options
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

**Key insight**: `/configuring` functions are pure utilities. They receive `(data, schema)` — not langId. They import ONLY from `/errors`. The API layer does all coordination (gets schemas from langs, calls configuring functions, calls verifyOptions).

### Error Ownership

| Error Class                   | Layer              | Cause                              |
| ----------------------------- | ------------------ | ---------------------------------- |
| `ConfigInvalidError`          | API                | `lang` or `code` wrong type        |
| `LangUnknownError`            | API                | Lang ID not in dispatch registry   |
| `OptionsSchemaInvalidError`   | /configuring       | Options don't match JSON Schema    |
| `OptionsSemanticInvalidError` | Lang verifyOptions | Cross-field constraints violated   |
| `ParseError`                  | Lang module        | Code cannot be parsed              |
| `RuntimeError`                | Lang module        | Code execution fails               |
| `LimitExceededError`          | Lang module        | Exceeded max steps/time/iterations |
| `InternalError`               | Any                | Unexpected error (wrapped)         |

**Two distinct options errors**:

- `OptionsSchemaInvalidError` — thrown by `/configuring` functions (via Ajv) when options don't match the lang's JSON Schema (wrong types, missing required fields)
- `OptionsSemanticInvalidError` — thrown by lang's `verifyOptions()` (called by API layer) when cross-field constraints are violated

---

## Links

- [API Overview](./README.md) — decision matrix, quick start
- [Config Module](../configuring/README.md) — options validation and defaults
- [Developer Guide](../../DEV.md) — architecture and conventions
