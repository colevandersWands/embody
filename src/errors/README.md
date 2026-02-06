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
import { trace, EmbodyError, ParseError, LangUnknownError } from '@study-lenses/embody';

try {
  const steps = await trace('chars', 'hello');
} catch (error) {
  // Catch-all: any embody error
  if (error instanceof EmbodyError) {
    console.error('Embody error:', error.message);

    // Specific handling
    if (error instanceof ParseError) {
      console.error(`Parse failed at line ${error.loc.line}`);
    } else if (error instanceof LangUnknownError) {
      console.error(`Unknown language: ${error.lang}`);
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
        ├── LangUnknownError        (API layer)
        ├── ConfigInvalidError      (API layer)
        ├── OptionsSchemaInvalidError   (/configuring)
        ├── OptionsSemanticInvalidError (lang's verifyOptions)
        ├── ParseError              (lang's record)
        ├── RuntimeError            (lang's record)
        ├── LimitExceededError      (lang's record)
        └── InternalError           (any layer)
```

### Error Ownership

| Error Class                   | Thrown By              | When                                         |
| ----------------------------- | ---------------------- | -------------------------------------------- |
| `LangUnknownError`            | API layer              | Language not in dispatch registry            |
| `ConfigInvalidError`          | API layer              | Type validation fails (lang/code not string) |
| `OptionsSchemaInvalidError`   | `/configuring`         | Options don't match JSON Schema              |
| `OptionsSemanticInvalidError` | Lang's `verifyOptions` | Cross-field constraints violated             |
| `ParseError`                  | Lang's `record`        | Code cannot be parsed                        |
| `RuntimeError`                | Lang's `record`        | Execution fails during tracing               |
| `LimitExceededError`          | Lang's `record`        | Execution limit exceeded                     |
| `InternalError`               | Any layer              | Unexpected internal error                    |

## File Structure

```text
src/errors/
  README.md                       # This file
  DOCS.md                         # Full API reference
  types.ts                        # Shared types (SourceLoc)
  embody-error.ts                 # Base class (marker only)
  lang-unknown-error.ts           # API: unknown language
  config-invalid-error.ts         # API: type validation failed
  options-schema-invalid-error.ts # /configuring: schema mismatch
  options-semantic-invalid-error.ts # lang: semantic constraint violated
  parse-error.ts                  # lang: parse failed
  runtime-error.ts                # lang: execution failed
  limit-exceeded-error.ts         # lang: limit exceeded
  internal-error.ts               # any: unexpected error
  tests/
    embody-error.test.ts
    parse-error.test.ts
    ...
```

## Convention Exception

This module uses `class` and `this` keywords, which are banned elsewhere in the codebase. This is the standard JS pattern for error classes — extending `Error` requires a constructor, and constructors require `this`.

ESLint is configured to allow `class`/`this` in `src/errors/**/*.ts`.

## Links

- [Full API Reference](./DOCS.md) — signatures, properties, examples for all error classes
- [API Module](../api/README.md) — which errors each API throws
- [Developer Guide](../../DEV.md) — codebase conventions
