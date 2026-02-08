# api

**Public interface for the embody execution tracer**

Four APIs organized into two families: **trace family** (throws on error) for scripts and REPLs, **embody family** (returns `{ ok, error }`) for production pipelines and UIs.

## Table of Contents

- [Two API Families](#two-api-families)
- [Quick Start](#quick-start)
- [Decision Matrix](#decision-matrix)
- [File Structure](#file-structure)
- [Links](#links)

## Two API Families

### Trace Family (Throws)

For quick scripts, REPLs, and contexts where you want errors to propagate naturally. **Async** — await for trace execution.

| API       | Style      | Use Case                          |
| --------- | ---------- | --------------------------------- |
| `trace`   | Positional | Simple one-liner, immediate trace |
| `tracify` | Chainable  | Builder pattern, memoized results |

```typescript
// trace - positional arguments, await the Promise
const steps = await trace('chars', 'ab');

// tracify - chainable builder, await .steps
const steps = await tracify.tracer('chars').code('ab').steps;
```

### Embody Family (Safe)

For production code, UI applications, and contexts where you need explicit error handling. **Async** — await marks trace execution.

| API        | Style             | Use Case                             |
| ---------- | ----------------- | ------------------------------------ |
| `embody`   | Object + closures | Smart partial application, pipelines |
| `embodify` | Chainable + `.ok` | Recoverable errors, form validation  |

```typescript
// embody - completing call returns Promise, .steps is sync after await
const result = await embody({ tracer: 'chars', code: 'ab', config: {} });
if (result.ok) console.log(result.steps);

// embodify - .trace() returns Promise, .steps is sync after await
const chain = await embodify({ tracer: 'chars', code: 'ab' }).trace();
if (chain.ok) console.log(chain.steps);
```

## Quick Start

```typescript
import { trace, tracify, embody, embodify } from '@study-lenses/embody';

// 1. Simplest: trace with positional args (throws on error)
const steps = await trace('chars', 'hello');

// 2. Chainable throws: build up then await .steps
const steps = await tracify.tracer('chars').code('hello').steps;

// 3. Safe with closures: partial application (partial is sync, completing is async)
const withLang = embody({ tracer: 'chars' }); // Sync — returns closure
const result = await withLang({ code: 'hello', config: {} }); // Async
if (result.ok) console.log(result.steps); // Sync access after await

// 4. Safe chainable: .set() is sync, .trace() is async
const chain = await embodify({ tracer: 'chars' }).set({ code: 'hello' }).trace();
if (chain.ok) console.log(chain.steps); // Sync access after await
```

## Decision Matrix

| Need                              | Use        | Why                                             |
| --------------------------------- | ---------- | ----------------------------------------------- |
| Quick script, errors should throw | `trace`    | Simplest, positional args                       |
| Build up trace config gradually   | `tracify`  | Chainable, memoized, throws on error            |
| Production code, explicit errors  | `embody`   | Returns `{ ok, error }`, smart closures         |
| Form validation, error recovery   | `embodify` | Chainable, `.ok` status, errors can be cleared  |
| Reuse tracer across traces        | `embody`   | Partial closure caches tracer                   |
| Inspect state before tracing      | `embody`   | Closure has `.tracer`, `.code`, `.config` props |
| Modify state, re-trace            | `embodify` | `.set()` returns new chain, `.trace()` again    |

**Rule of thumb:**

- **Throws OK?** → Use `trace` or `tracify`
- **Need `{ ok, error }`?** → Use `embody` or `embodify`
- **Partial application?** → Use `embody`
- **Recoverable errors?** → Use `embodify`

## Config Flow

When you pass config to any API, both meta and options are prepared before reaching the tracer module:

```text
User: trace('chars', 'ab', { meta: { max: { steps: 100 } }, options: { direction: 'rl' } })
         │
         ▼
    API Layer (orchestration)
    ├── 1. Validates tracer/code types
    ├── 2. Gets tracer module from registry (includes optionsSchema)
    ├── 3. Validates meta config
    │       └── prepareConfig(userMeta, metaSchema) from /configuring
    ├── 4. Validates options config
    │       └── prepareConfig(userOptions, langSchema) from /configuring
    ├── 5. Calls tracer's verifyOptions() for semantic validation (if exported)
         │
         ▼
    Tracer Module
    ├── Receives FULLY FILLED { meta, options }
    ├── Enforces execution limits from meta
    ├── Pure tracing, no validation needed
         │
         ▼
    Steps returned to user
```

### Config Structure

User config has two independent parts:

| Part      | Schema Location                         | Purpose                             |
| --------- | --------------------------------------- | ----------------------------------- |
| `meta`    | `/tracers/meta.schema.json`             | Execution limits, timestamps, debug |
| `options` | `/tracers/<tracer>/options.schema.json` | Tracer-specific tracing options     |

Each part is validated independently — meta errors don't affect options validation and vice versa.

**Key guarantee**: Tracer modules receive complete, validated config — never partial, never invalid types.

**Module isolation**: `/configuring` is pure utilities that receive `(data, schema)`. The API layer gets schemas from tracers and passes them to configuring functions.

## File Structure

```text
src/api/
  trace.ts               # Positional: trace(tracer, code, config?) → steps | throws
  tracify.ts             # Chainable throws: tracify.tracer().code().steps
  embody.ts              # Smart closures: embody({ tracer, code, config }) → result | closure
  embodify.ts            # Chainable safe: .set() + .trace() → chain with .ok
  tests/
    embody.test.ts
    embodify.test.ts
    tracify.test.ts
  README.md              # This file
  DOCS.md                # Full API reference
```

## Links

- [Full API Reference](./DOCS.md) — signatures, errors, behaviors for all four APIs
- [Config Module](../configuring/README.md) — how options are validated and filled
- [Developer Guide](../../DEV.md) — architecture and codebase conventions
