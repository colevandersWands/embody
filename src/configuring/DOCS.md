# configuring — API Reference

Complete API documentation for configuration validation and default-filling. See [README.md](./README.md) for architecture overview.

## Table of Contents

- [Pure & Pipeable](#pure--pipeable)
- [Schema Agnostic](#schema-agnostic)
- [prepareConfig](#prepareconfigdata-schema)
- [expandShorthand](#expandshorthanddata-schema)
- [fillDefaults](#filldefaultsdata-schema)
- [validateConfig](#validateconfigdata-schema)
- [Error Handling](#error-handling)
- [JSON Schema Format](#json-schema-format)
- [verifyOptions Convention](#verifyoptions-convention)

---

## Pure & Pipeable

All `/configuring` functions are pure and return data. This enables piping:

```typescript
// Each function returns data — pipeable
const result = validateConfig(fillDefaults(expandShorthand(data, schema), schema), schema);

// Or use the wrapper (recommended)
const result = prepareConfig(data, schema);
```

**Key principle**: Functions receive `(data, schema)` and return data. They never mutate inputs, never import from `/langs`, and have zero awareness of where schemas come from.

### Error Summary

| Function          | Throws                      | When                                           |
| ----------------- | --------------------------- | ---------------------------------------------- |
| `expandShorthand` | Never                       | Pure transformation, always succeeds           |
| `fillDefaults`    | Never                       | Pure transformation, always succeeds           |
| `validateConfig`  | `OptionsSchemaInvalidError` | Data doesn't match schema                      |
| `prepareConfig`   | `OptionsSchemaInvalidError` | Data doesn't match schema (via validateConfig) |

---

## Schema Agnostic

These functions work with **any** JSON Schema — they have no knowledge of "meta" vs "options" or which language they're validating for.

```typescript
// The API layer uses the same functions for both meta and options:
const filledMeta = prepareConfig(userMeta ?? {}, metaSchema);
const filledOptions = prepareConfig(userOptions ?? {}, langSchema);
```

**This is intentional**: `/configuring` is a pure utility module. The API layer does all coordination — it knows about meta schemas, lang schemas, and orchestration order. `/configuring` just receives `(data, schema)` and returns validated, filled data.

---

## `prepareConfig(data, schema)`

Convenience wrapper that pipes all three functions in the correct order: expand → fill → validate.

### Signature

```typescript
function prepareConfig(data: unknown, schema: JSONSchema): unknown;
```

### Parameters

| Parameter | Type         | Description                                            |
| --------- | ------------ | ------------------------------------------------------ |
| `data`    | `unknown`    | User-provided data (may be partial, may use shorthand) |
| `schema`  | `JSONSchema` | JSON Schema with defaults                              |

### Return Value

Returns fully-filled, validated data object. Throws on validation failure.

### Example

```typescript
import prepareConfig from './prepare-config.js';

// For lang options
const filledOptions = prepareConfig({ direction: 'rl' }, charsSchema);
// {
//   direction: 'rl',
//   remove: [],
//   replace: {},
//   allowedCharClasses: { lowercase: true, uppercase: true, ... }
// }

// For meta config (same function, different schema)
const filledMeta = prepareConfig({ max: { steps: 100 } }, metaSchema);
// {
//   max: { steps: 100, iterations: null, callstack: null, time: null },
//   range: null,
//   timestamps: false,
//   debug: { ast: false }
// }
```

### Errors

Throws `OptionsSchemaInvalidError` if validation fails (via `validateConfig`).

### Why Use This

- Simpler API layer code (one import, one call)
- Enforces correct order (can't accidentally skip steps)
- Single point of change if pipeline changes

Individual functions are still exported for edge cases or direct testing.

---

## `expandShorthand(data, schema)`

Expands boolean shorthand to full object structure. First step in the pipeline.

### Signature

```typescript
function expandShorthand(data: unknown, schema: JSONSchema): unknown;
```

### Parameters

| Parameter | Type         | Description                             |
| --------- | ------------ | --------------------------------------- |
| `data`    | `unknown`    | Data object (may use boolean shorthand) |
| `schema`  | `JSONSchema` | JSON Schema defining expected structure |

### Return Value

Returns new data object with shorthand expanded. Original input unchanged.

### Detection Heuristic

A field supports shorthand if:

- Schema expects an object with all-boolean properties
- User provided a boolean instead

### Errors

Never throws. Pure transformation that always succeeds.

### Example

```typescript
import expandShorthand from './expand-shorthand.js';

// Input with boolean shorthand
const input = { allowedCharClasses: false };

// Expanded output
const expanded = expandShorthand(input, charsSchema);
// {
//   allowedCharClasses: {
//     lowercase: false,
//     uppercase: false,
//     number: false,
//     punctuation: false,
//     other: false
//   }
// }
```

---

## `fillDefaults(data, schema)`

Fills missing fields with defaults from schema. Second step in the pipeline.

### Signature

```typescript
function fillDefaults(data: unknown, schema: JSONSchema): unknown;
```

### Parameters

| Parameter | Type         | Description                 |
| --------- | ------------ | --------------------------- |
| `data`    | `unknown`    | Data object (may have gaps) |
| `schema`  | `JSONSchema` | JSON Schema with defaults   |

### Return Value

Returns new object with all defaults filled. Original input unchanged.

### Behavior

- Fills missing fields with `default` values from schema
- Coerces types when safe: `"5"` → `5`, `"true"` → `true`
- Removes unknown properties silently
- Handles nested defaults

### Errors

Never throws. Pure transformation that always succeeds.

### Example

```typescript
import fillDefaults from './fill-defaults.js';

const filled = fillDefaults({ direction: 'rl' }, charsSchema);
// {
//   direction: 'rl',
//   remove: [],      // default from schema
//   replace: {}      // default from schema
// }
```

---

## `validateConfig(data, schema)`

Validates data against JSON Schema. Third step in the pipeline.

### Signature

```typescript
function validateConfig(data: unknown, schema: JSONSchema): unknown;
```

### Parameters

| Parameter | Type         | Description                     |
| --------- | ------------ | ------------------------------- |
| `data`    | `unknown`    | Data object to validate         |
| `schema`  | `JSONSchema` | JSON Schema to validate against |

### Return Value

Returns the same data object on success (enables piping). Throws on validation failure.

### Errors

Throws `OptionsSchemaInvalidError` when data doesn't match the schema:

- Wrong type: `"direction must be string"`
- Invalid enum: `"direction must be one of: lr, rl"`
- Missing required field: `"must have required property 'direction'"`

Multiple errors are collected and joined with `;`.

### Example

```typescript
import validateConfig from './validate-config.js';

// Valid — returns data (same reference)
const validated = validateConfig({ direction: 'lr', remove: [], replace: {} }, charsSchema);
console.log(validated === data); // true

// Invalid — throws
validateConfig({ direction: 'invalid' }, charsSchema);
// OptionsSchemaInvalidError: direction must be one of: lr, rl
```

---

## Error Handling

All `/configuring` functions throw `OptionsSchemaInvalidError`:

```typescript
import OptionsSchemaInvalidError from '../errors/options-schema-invalid-error.js';

// Structural validation error (from Ajv)
throw new OptionsSchemaInvalidError(
  'options.direction must be one of: lr, rl',
  'options.direction',
);
```

### Error Message Format

Structural errors include the field path and expected type:

```text
OptionsSchemaInvalidError: options.direction must be string
OptionsSchemaInvalidError: options.remove must be array
OptionsSchemaInvalidError: options.direction must be one of: lr, rl
```

Multiple errors are joined:

```text
OptionsSchemaInvalidError: options.direction must be string; options.remove must be array
```

### Error Ownership

| Error Class                   | Source                   | When                             |
| ----------------------------- | ------------------------ | -------------------------------- |
| `OptionsSchemaInvalidError`   | `/configuring` functions | Options don't match JSON Schema  |
| `OptionsSemanticInvalidError` | Lang's `verifyOptions()` | Cross-field constraints violated |

**Note**: `/configuring` only throws `OptionsSchemaInvalidError`. The `OptionsSemanticInvalidError` is thrown by lang's `verifyOptions()`, which is called by the API layer (not by `/configuring`).

---

## JSON Schema Format

Schemas follow JSON Schema draft 2020-12. They live with their lang module:

```text
src/langs/chars/schema.json
src/langs/js/schema.json      (future)
```

### Example Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "direction": {
      "type": "string",
      "enum": ["lr", "rl"],
      "default": "lr"
    },
    "remove": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "replace": {
      "type": "object",
      "additionalProperties": { "type": "string" },
      "default": {}
    },
    "maxLength": {
      "type": "integer",
      "description": "Optional limit for testing"
    }
  },
  "required": ["direction", "remove", "replace"],
  "additionalProperties": false
}
```

### Key Schema Features Used

| Feature                | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `type`                 | Structural type validation                   |
| `enum`                 | Allowed values for strings                   |
| `default`              | Value to use if field is missing             |
| `required`             | Fields that must be present (after defaults) |
| `additionalProperties` | Reject unknown fields (set to `false`)       |

---

## verifyOptions Convention

Langs MAY export a `verifyOptions()` function for semantic validation (cross-field constraints). The **API layer** calls this — not `/configuring`.

### Contract

```typescript
/**
 * Semantic validation for cross-field constraints.
 * Called by API layer AFTER structural validation and default-filling.
 *
 * @param options - Fully-filled options (never partial)
 * @throws OptionsSemanticInvalidError if constraints violated
 * @returns void on success
 */
function verifyOptions(options: LangOptions): void;
```

### When to Use

Use `verifyOptions()` for constraints that JSON Schema cannot express:

- Cross-field dependencies: "if X is true, Y must be defined"
- Mutual exclusivity: "cannot use both strict and lenient"
- Value ranges with context: "maxIterations must be ≤ maxSteps"

### Example

```typescript
// src/langs/hypothetical/verify-options.ts
import OptionsSemanticInvalidError from '../errors/options-semantic-invalid-error.js';
import type { HypotheticalOptions } from './types.js';

function verifyOptions(options: HypotheticalOptions): void {
  if (options.strict && options.lenient) {
    throw new OptionsSemanticInvalidError('strict and lenient are mutually exclusive');
  }

  if (options.trackClosures && options.scopeDepth < 1) {
    throw new OptionsSemanticInvalidError('scopeDepth must be ≥ 1 when trackClosures is enabled');
  }
}

export default verifyOptions;
```

### Who Calls verifyOptions?

The **API layer** calls `verifyOptions()` — not `/configuring`. This keeps `/configuring` pure and lang-agnostic:

```typescript
// In API layer
import prepareConfig from '../configuring/prepare-config.js';

// API orchestrates — schema comes from lang module via dispatch
const filled = prepareConfig(userOptions, langModule.schema);
langModule.verifyOptions?.(filled); // called by API, not /configuring
```

---

## Links

- [Module Overview](./README.md) — architecture, purpose, what this module does NOT do
- [Langs README](../langs/README.md) — how langs export schemas
- [API README](../api/README.md) — how API layer coordinates validation
