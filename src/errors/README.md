# errors

**Typed error classes for the embody API**

Structured errors that enable both catch-all handling (any embody error) and specific handling (parse errors only). Uses `instanceof` for discrimination — no string codes.

## Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Error Hierarchy](#error-hierarchy)
- [File Structure](#file-structure)
- [Convention Exception](#convention-exception)
- [Links](#links)

## Architecture

### Design Principles

- **Empty base class**: `EmbodyError` exists only for `instanceof` catch-all
- **Specific error classes**: Each error type has its own class with relevant properties
- **No `.code` property**: Use `instanceof` instead of string comparison
- **One file per class**: Tree-shakeable, architecture-enforcing imports

### Benefits

| Benefit                     | How It Helps                                                  |
| --------------------------- | ------------------------------------------------------------- |
| Tree shaking                | Only import errors you throw                                  |
| Architecture enforcement    | Wrong imports are visible code smells                         |
| Test specificity            | Each error class has focused tests                            |
| `instanceof` discrimination | `if (e instanceof ParseError)` cleaner than string comparison |
| Catch-all                   | `if (e instanceof EmbodyError)` catches any embody error      |

## Quick Start

```typescript
import { trace, EmbodyError, ParseError, TracerUnknownError } from '@study-lenses/embody';

try {
  const steps = await trace('chars', 'hello');
} catch (error) {
  // Catch-all: any embody error
  if (error instanceof EmbodyError) {
    console.error('Embody error:', error.message);

    // Specific handling
    if (error instanceof ParseError) {
      console.error(`Parse failed at line ${error.loc.line}`);
    } else if (error instanceof TracerUnknownError) {
      console.error(`Unknown tracer: ${error.tracer}`);
    }
  } else {
    throw error; // Re-throw non-embody errors
  }
}
```

## Error Hierarchy

```text
Error (built-in)
  └── EmbodyError (marker class — never thrown directly)
        ├── TracerUnknownError            (API layer)
        ├── ArgumentInvalidError        (API layer)
        ├── OptionsInvalidError         (/configuring)
        ├── OptionsSemanticInvalidError (tracer's verifyOptions)
        ├── ParseError                  (tracer's record)
        ├── RuntimeError                (tracer's record)
        ├── LimitExceededError          (tracer's record)
        └── InternalError               (any layer)
```

### Error Ownership

| Error Class                   | Thrown By                | When                                     |
| ----------------------------- | ------------------------ | ---------------------------------------- |
| `TracerUnknownError`          | API layer                | Tracer not in tracer registry            |
| `ArgumentInvalidError`        | API layer                | Required arguments have wrong type/value |
| `OptionsInvalidError`         | `/configuring`           | meta/options don't match JSON Schema     |
| `OptionsSemanticInvalidError` | Tracer's `verifyOptions` | Cross-field constraints violated         |
| `ParseError`                  | Tracer's `record`        | Code cannot be parsed                    |
| `RuntimeError`                | Tracer's `record`        | Execution fails during tracing           |
| `LimitExceededError`          | Tracer's `record`        | Execution limit exceeded                 |
| `InternalError`               | Any layer                | Unexpected internal error                |

## File Structure

```text
src/errors/
  README.md                         # This file
  DOCS.md                           # Full API reference
  types.ts                          # Shared types (SourceLoc)
  embody-error.ts                   # Base class (marker only)
  tracer-unknown-error.ts             # API: unknown tracer
  argument-invalid-error.ts         # API: argument type/value invalid
  options-invalid-error.ts          # /configuring: schema mismatch
  options-semantic-invalid-error.ts # tracer: semantic constraint violated
  parse-error.ts                    # tracer: parse failed
  runtime-error.ts                  # tracer: execution failed
  limit-exceeded-error.ts           # tracer: limit exceeded
  internal-error.ts                 # any: unexpected error
  tests/
    embody-error.test.ts
    argument-invalid-error.test.ts
    ...
```

## Convention Exception

This module uses `class` and `this` keywords, which are banned elsewhere in the codebase. This is the standard JS pattern for error classes — extending `Error` requires a constructor, and constructors require `this`.

ESLint is configured to allow `class`/`this` in `src/errors/**/*.ts`.

## Links

- [Full API Reference](./DOCS.md) — signatures, properties, examples for all error classes
- [API Module](../api/README.md) — which errors each API throws
- [Developer Guide](../../DEV.md) — codebase conventions
