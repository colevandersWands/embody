# errors — Technical Reference

Complete API documentation for all error classes. See [README.md](./README.md) for overview.

## Table of Contents

- [EmbodyError (Base Class)](#embodyerror-base-class)
- [Error Handling Patterns](#error-handling-patterns)
- [Specific Error Classes](#specific-error-classes)
  - [TracerUnknownError](#tracerunknownerror)
  - [ArgumentInvalidError](#argumentinvaliderror)
  - [OptionsInvalidError](#optionsinvaliderror)
  - [OptionsSemanticInvalidError](#optionssemanticinvaliderror)
  - [ParseError](#parseerror)
  - [RuntimeError](#runtimeerror)
  - [LimitExceededError](#limitexceedederror)
  - [InternalError](#internalerror)

---

## EmbodyError (Base Class)

**Purpose**: Catch-all base class that enables consumers to distinguish embody library errors from other errors.

### Why It Exists

When using embody in a try-catch block, you often want to:

1. Handle embody-specific errors (show user-friendly messages, retry, etc.)
2. Let other errors propagate (bugs, network errors, etc.)

`EmbodyError` makes this distinction trivial with a single `instanceof` check.

### Interface

```typescript
class EmbodyError extends Error {
  readonly name: 'EmbodyError';
  readonly message: string;
}
```

### Usage

```typescript
import { trace, EmbodyError } from '@study-lenses/embody';

try {
  const steps = await trace('chars', userCode);
} catch (error) {
  if (error instanceof EmbodyError) {
    // Any embody error — handle gracefully
    showUserError(error.message);
  } else {
    // Not our error — let it propagate
    throw error;
  }
}
```

### Important Notes

- **Never thrown directly** — always use a specific subclass
- **All embody errors extend this** — `instanceof EmbodyError` catches any of them
- **Marker class pattern** — exists only for the `instanceof` check

---

## Error Handling Patterns

### Pattern 1: Catch-All (Recommended for UI)

Handle any embody error uniformly:

```typescript
import { trace, EmbodyError } from '@study-lenses/embody';

try {
  const steps = await trace('chars', code);
  render(steps);
} catch (error) {
  if (error instanceof EmbodyError) {
    showError(error.message);
  } else {
    throw error; // Re-throw non-library errors
  }
}
```

### Pattern 2: Specific Handling

Handle different errors differently:

```typescript
import { trace, EmbodyError, ParseError, TracerUnknownError } from '@study-lenses/embody';

try {
  const steps = await trace(tracer, code);
} catch (error) {
  if (error instanceof ParseError) {
    highlightErrorLine(error.loc.line, error.loc.column);
    showError(`Syntax error: ${error.message}`);
  } else if (error instanceof TracerUnknownError) {
    showError(`Tracer "${error.tracer}" is not supported`);
  } else if (error instanceof EmbodyError) {
    // Catch-all for other embody errors
    showError(error.message);
  } else {
    throw error;
  }
}
```

### Pattern 3: Safe APIs (No Try-Catch Needed)

Use `embody` or `embodify` for explicit error handling:

```typescript
import { embody, ParseError } from '@study-lenses/embody';

const result = await embody({ tracer: 'chars', code, config: null });

if (result.ok) {
  render(result.steps);
} else {
  // result.error is an EmbodyError subclass
  if (result.error instanceof ParseError) {
    highlightErrorLine(result.error.loc.line);
  }
  showError(result.error.message);
}
```

---

## Specific Error Classes

### TracerUnknownError

Thrown when the requested tracer is not in the tracer registry.

#### Thrown By

API layer (`trace`, `tracify`, `embody`, `embodify`)

#### Interface

```typescript
class TracerUnknownError extends EmbodyError {
  readonly name: 'TracerUnknownError';
  readonly tracer: string; // The unknown tracer that was requested
}
```

#### Constructor

```typescript
new TracerUnknownError(tracer: string)
```

#### Example

```typescript
import { trace, TracerUnknownError } from '@study-lenses/embody';

try {
  await trace('unknown-tracer', 'code');
} catch (error) {
  if (error instanceof TracerUnknownError) {
    console.log(error.tracer); // 'unknown-tracer'
    console.log(error.message); // "Unknown tracer 'unknown-tracer'"
  }
}
```

---

### ArgumentInvalidError

Thrown when required function arguments have wrong type or value.

#### Thrown By

API layer (`trace`, `tracify`, `embody`, `embodify`)

#### Interface

```typescript
class ArgumentInvalidError extends EmbodyError {
  readonly name: '(EmbodyError) ArgumentInvalidError';
  readonly field: string; // Which argument was invalid ('tracer', 'code', 'config')
}
```

#### Constructor

```typescript
new ArgumentInvalidError(field: string, message: string)
```

#### Example

```typescript
import { trace, ArgumentInvalidError } from '@study-lenses/embody';

try {
  await trace(123 as any, 'code'); // tracer should be string
} catch (error) {
  if (error instanceof ArgumentInvalidError) {
    console.log(error.field); // 'tracer'
    console.log(error.message); // "trace: expected tracer to be string, got number"
  }
}
```

---

### OptionsInvalidError

Thrown when user-provided meta or options don't match the JSON Schema.

#### Thrown By

`/configuring` module (structural validation)

#### Interface

```typescript
class OptionsInvalidError extends EmbodyError {
  readonly name: '(EmbodyError) OptionsInvalidError';
  readonly path?: string; // JSON path to invalid field (e.g., 'options.direction')
}
```

#### Constructor

```typescript
new OptionsInvalidError(message: string, path?: string)
```

#### Example

```typescript
import { trace, OptionsInvalidError } from '@study-lenses/embody';

try {
  await trace('chars', 'ab', { options: { direction: 'invalid' } });
} catch (error) {
  if (error instanceof OptionsInvalidError) {
    console.log(error.path); // 'options.direction'
    console.log(error.message); // "direction must be one of: lr, rl"
  }
}
```

---

### OptionsSemanticInvalidError

Thrown when options pass schema validation but violate cross-field constraints.

#### Thrown By

Tracer's `verifyOptions()` function (semantic validation)

#### Interface

```typescript
class OptionsSemanticInvalidError extends EmbodyError {
  readonly name: 'OptionsSemanticInvalidError';
  // No additional properties — message contains constraint details
}
```

#### Constructor

```typescript
new OptionsSemanticInvalidError(message: string)
```

#### Example

```typescript
import { trace, OptionsSemanticInvalidError } from '@study-lenses/embody';

try {
  // Hypothetical constraint: strict and lenient are mutually exclusive
  await trace('hypothetical', 'code', { options: { strict: true, lenient: true } });
} catch (error) {
  if (error instanceof OptionsSemanticInvalidError) {
    console.log(error.message); // "strict and lenient are mutually exclusive"
  }
}
```

---

### ParseError

Thrown when the code cannot be parsed.

#### Thrown By

Tracer's `record()` function

#### Interface

```typescript
class ParseError extends EmbodyError {
  readonly name: 'ParseError';
  readonly loc: SourceLoc; // Where the parse error occurred
}

type SourceLoc = {
  readonly line: number; // 1-indexed line number (ESTree standard)
  readonly column: number; // 0-indexed column number (ESTree standard)
};
```

**ESTree compliance**: Follows the [ESTree specification](https://github.com/estree/estree/blob/master/es5.md#node-objects). Line numbers are 1-indexed, column numbers are 0-indexed.

#### Constructor

```typescript
new ParseError(message: string, loc: SourceLoc)
```

#### Example

```typescript
import { trace, ParseError } from '@study-lenses/embody';

try {
  await trace('chars', 'code with ‽ interrobang'); // chars rejects interrobang
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.loc.line); // 1
    console.log(error.loc.column); // 10 (0-indexed column)
    console.log(error.message); // "Unexpected character: ‽"
  }
}
```

---

### RuntimeError

Thrown when code execution fails during tracing.

#### Thrown By

Tracer's `record()` function

#### Interface

```typescript
class RuntimeError extends EmbodyError {
  readonly name: 'RuntimeError';
  readonly loc?: SourceLoc; // Where the runtime error occurred (if known)
}
```

#### Constructor

```typescript
new RuntimeError(message: string, loc?: SourceLoc)
```

#### Example

```typescript
import { trace, RuntimeError } from '@study-lenses/embody';

try {
  await trace('js', 'throw new Error("boom")');
} catch (error) {
  if (error instanceof RuntimeError) {
    console.log(error.message); // "boom"
    console.log(error.loc?.line); // 1 (if available)
  }
}
```

---

### LimitExceededError

Thrown when execution exceeds configured limits.

#### Thrown By

Tracer's `record()` function

#### Interface

```typescript
class LimitExceededError extends EmbodyError {
  readonly name: 'LimitExceededError';
  readonly limit: string; // Which limit was exceeded ('steps', 'time', 'iterations')
  readonly actual: number; // The value that exceeded the limit
}
```

#### Constructor

```typescript
new LimitExceededError(message: string, limit: string, actual: number)
```

#### Example

```typescript
import { trace, LimitExceededError } from '@study-lenses/embody';

try {
  await trace('js', 'while(true) {}', { meta: { maxSteps: 1000 } });
} catch (error) {
  if (error instanceof LimitExceededError) {
    console.log(error.limit); // 'steps'
    console.log(error.actual); // 1001
    console.log(error.message); // "Exceeded maximum steps (1000)"
  }
}
```

---

### InternalError

Thrown for unexpected internal errors (bugs, invariant violations).

#### Thrown By

Any layer (catch-all for unexpected errors)

#### Interface

```typescript
class InternalError extends EmbodyError {
  readonly name: 'InternalError';
  readonly cause?: Error; // The original error, if wrapping
}
```

#### Constructor

```typescript
new InternalError(message: string, cause?: Error)
```

#### Example

```typescript
import { trace, InternalError } from '@study-lenses/embody';

try {
  await trace('chars', 'code');
} catch (error) {
  if (error instanceof InternalError) {
    console.log(error.message); // "Unexpected error during tracing"
    console.log(error.cause); // Original error object
    // Report bug to maintainers
  }
}
```

---

## Type Exports

```typescript
// Available from main package
import type { SourceLoc } from '@study-lenses/embody';

// Or from errors module directly
import type { SourceLoc } from './errors/types.js';
```
