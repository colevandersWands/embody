# Embody API Documentation

API overview for the `@study-lenses/embody` execution tracer. For complete details, see [API Reference](./src/api/DOCS.md).

## Table of Contents

- [Main API Functions](#main-api-functions)
  - [`trace`](#tracetracer-code-config)
  - [`tracify`](#tracify)
  - [`embody`](#embody-tracer-code-config-)
  - [`embodify`](#embodify)
  - [`Tracer`](#tracer) (class-based, throws)
  - [`Embodier`](#embodier) (class-based, safe)
  - [`embodyTrace`](#embodytrace) (callback-style, ES5)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [TypeScript Types](#typescript-types)

## Main API Functions

Seven APIs in three families:

- **Trace family** (throws on error): `trace`, `tracify`, `Tracer` class
- **Embody family** (returns `{ ok, error }`): `embody`, `embodify`, `Embodier` class
- **Callback-style API** (ES5 compatible): `embodyTrace`

All APIs are **async** — trace execution returns a Promise (or invokes callback for `embodyTrace`).

### `trace(tracer, code, config?)`

Simplest API — positional arguments, returns steps array. Throws on error. Also available as default export.

```typescript
import trace from '@study-lenses/embody';
// or: import { trace } from '@study-lenses/embody';

// Minimal usage
const steps = await trace('chars', 'hello');

// With config
const steps = await trace('chars', 'hello', { options: { direction: 'rl' } });
```

For full parameters and error behavior, see [API Reference](./src/api/DOCS.md#tracelang-code-config).

### `tracify`

Chainable builder API. Throws on error. Results are memoized.

```typescript
import { tracify } from '@study-lenses/embody';

const steps = await tracify.tracer('chars').code('hello').steps;

// Order doesn't matter
const steps = await tracify.code('hello').tracer('chars').steps;
```

For full interface and examples, see [API Reference](./src/api/DOCS.md#tracify).

### `embody({ tracer, code, config })`

Object-threading API with smart partial application. Returns `{ ok, error, steps }`.

```typescript
import { embody } from '@study-lenses/embody';

// Full call — await the Promise, then access .steps sync
const result = await embody({ tracer: 'chars', code: 'hello', config: null });
if (result.ok) console.log(result.steps);

// Partial application (closure is sync, completing call is async)
const withTracer = embody({ tracer: 'chars' });
const result = await withTracer({ code: 'hello', config: null });
```

For full overloads, closure behavior, and config semantics, see [API Reference](./src/api/DOCS.md#embody-tracer-code-config-).

### `embodify()`

Chainable API with recoverable errors. `.set()` is sync, `.trace()` is async.

```typescript
import { embodify } from '@study-lenses/embody';

const chain = await embodify({ tracer: 'chars', code: 'hello' }).trace();
if (chain.ok) console.log(chain.steps);

// Recoverable errors — fix with .set()
const bad = embodify({ tracer: 123 });
bad.ok; // false
const fixed = bad.set({ tracer: 'chars' });
fixed.ok; // true
```

For `.set()`, `.trace()`, and error recovery, see [API Reference](./src/api/DOCS.md#embodify).

### `Tracer`

Class-based API with OOP style. Throws on error. Lazy evaluation with `.steps` getter.

```typescript
import { Tracer } from '@study-lenses/embody';

const tracer = new Tracer('txt:chars');
tracer.code = 'hello';
tracer.config = { meta: { max: { steps: 50 } } };

const steps = await tracer.steps; // Lazy trace on first access
```

For complete class interface, cache invalidation, and setter behavior, see [API Reference](./src/api/DOCS.md#tracer-class).

### `Embodier`

Class-based API with explicit error handling. Returns `.ok`/`.error` state. Explicit `.trace()` method.

```typescript
import { Embodier } from '@study-lenses/embody';

const embodier = new Embodier('txt:chars');
embodier.code = 'hello';
embodier.config = {};

await embodier.trace(); // Explicit execution, mutates instance
if (embodier.ok) {
  console.log(embodier.steps); // Sync access after trace()
} else {
  console.error(embodier.error);
}
```

For complete class interface, error state management, and trace method, see [API Reference](./src/api/DOCS.md#embodier-class).

### `embodyTrace`

Node.js error-first callback API. Pure ES5 implementation (learning tool to explore pre-ES6 patterns). Supports argument overloading for optional config.

```typescript
import { embodyTrace } from '@study-lenses/embody';

// With config
embodyTrace('txt:chars', 'hello', { meta: { max: { steps: 50 } } }, function (err, result) {
  if (err) throw err;
  console.log('Steps:', result.steps.length);
});

// Without config (3-arg form)
embodyTrace('txt:chars', 'hello', function (err, result) {
  if (err) return console.error(err);
  console.log(result.steps);
});
```

For complete callback signature, error delivery semantics, and result structure, see [API Reference](./src/api/DOCS.md#embodytrace).

## Error Handling

All embody errors extend `EmbodyError` for catch-all handling:

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
    throw error; // Re-throw non-embody errors
  }
}
```

**Error classes**: `TracerUnknownError`, `ArgumentInvalidError`, `OptionsInvalidError`, `OptionsSemanticInvalidError`, `ParseError`, `RuntimeError`, `LimitExceededError`, `InternalError`.

For complete error hierarchy and ownership, see [Errors Reference](./src/errors/README.md).

## Configuration

### Config Structure

User config has two parts: `meta` (execution limits) and `options` (tracer-specific):

```typescript
// With meta limits
await trace('chars', 'hello', {
  meta: { max: { steps: 100 } },
});

// With tracer-specific options
await trace('chars', 'hello', {
  options: { direction: 'rl' },
});

// Both
await trace('chars', 'hello', {
  meta: { max: { steps: 100 }, timestamps: true },
  options: { direction: 'rl' },
});
```

For full configuration options and validation, see [Configuration Reference](./src/configuring/README.md).

## TypeScript Types

Public types are exported from the main package:

```typescript
import type { StepCore } from '@study-lenses/embody';

// StepCore — single trace event
type StepCore = {
  step: number; // 1-indexed execution order
  loc: { line: number; column: number }; // 1-indexed source location
  // ...tracer-specific fields
};
```

For complete type definitions, see [src/api/types.ts](./src/api/types.ts).

## Notes

- All APIs are **async** — await the result before accessing `.steps`
- The `tracer` parameter is **required** for all APIs
- Config uses `null` for defaults, `undefined` means "waiting" (partial application)

## Links

- [Full API Reference](./src/api/DOCS.md) — complete signatures, error behavior, examples
- [API Decision Matrix](./src/api/README.md) — which API to use when
- [Error Handling](./src/errors/README.md) — error hierarchy and ownership
- [Configuration](./src/configuring/README.md) — options validation and defaults
- [Tracer Modules](./src/tracers/README.md) — how tracers are implemented
- [Developer Guide](./DEV.md) — architecture and conventions
