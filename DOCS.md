# Embody API Documentation

API overview for the `@study-lenses/embody` execution tracer. For complete details, see [API Reference](./src/api/DOCS.md).

## Table of Contents

- [Main API Functions](#main-api-functions)
  - [`trace`](#tracelang-code-config)
  - [`tracify`](#tracify)
  - [`embody`](#embody-lang-code-config-)
  - [`embodify`](#embodify)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [TypeScript Types](#typescript-types)

## Main API Functions

Four APIs in two families: **trace family** (throws on error) and **embody family** (returns `{ ok, error }`).

All APIs are **async** — trace execution returns a Promise.

### `trace(lang, code, config?)`

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

const steps = await tracify.lang('chars').code('hello').steps;

// Order doesn't matter
const steps = await tracify.code('hello').lang('chars').steps;
```

For full interface and examples, see [API Reference](./src/api/DOCS.md#tracify).

### `embody({ lang, code, config })`

Object-threading API with smart partial application. Returns `{ ok, error, steps }`.

```typescript
import { embody } from '@study-lenses/embody';

// Full call — await the Promise, then access .steps sync
const result = await embody({ lang: 'chars', code: 'hello', config: null });
if (result.ok) console.log(result.steps);

// Partial application (closure is sync, completing call is async)
const withLang = embody({ lang: 'chars' });
const result = await withLang({ code: 'hello', config: null });
```

For full overloads, closure behavior, and config semantics, see [API Reference](./src/api/DOCS.md#embody-lang-code-config-).

### `embodify()`

Chainable API with recoverable errors. `.set()` is sync, `.trace()` is async.

```typescript
import { embodify } from '@study-lenses/embody';

const chain = await embodify({ lang: 'chars', code: 'hello' }).trace();
if (chain.ok) console.log(chain.steps);

// Recoverable errors — fix with .set()
const bad = embodify({ lang: 123 });
bad.ok; // false
const fixed = bad.set({ lang: 'chars' });
fixed.ok; // true
```

For `.set()`, `.trace()`, and error recovery, see [API Reference](./src/api/DOCS.md#embodify).

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

**Error classes**: `LangUnknownError`, `ConfigInvalidError`, `OptionsSchemaInvalidError`, `OptionsSemanticInvalidError`, `ParseError`, `RuntimeError`, `LimitExceededError`, `InternalError`.

For complete error hierarchy and ownership, see [Errors Reference](./src/errors/README.md).

## Configuration

### Config Structure

User config has two parts: `meta` (execution limits) and `options` (lang-specific):

```typescript
// With meta limits
await trace('chars', 'hello', {
  meta: { max: { steps: 100 } },
});

// With lang-specific options
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
  // ...lang-specific fields
};
```

For complete type definitions, see [src/api/types.ts](./src/api/types.ts).

## Notes

- All APIs are **async** — await the result before accessing `.steps`
- The `lang` parameter is **required** for all APIs
- Config uses `null` for defaults, `undefined` means "waiting" (partial application)

## Links

- [Full API Reference](./src/api/DOCS.md) — complete signatures, error behavior, examples
- [API Decision Matrix](./src/api/README.md) — which API to use when
- [Error Handling](./src/errors/README.md) — error hierarchy and ownership
- [Configuration](./src/configuring/README.md) — options validation and defaults
- [Language Modules](./src/langs/README.md) — how languages are implemented
- [Developer Guide](./DEV.md) — architecture and conventions
