# configuring

Pure utility functions for options validation and default-filling.

This module provides stateless functions that validate options against JSON Schema and fill defaults. It has **no coordination responsibility** — the API layer imports schemas and calls these functions.

## Table of Contents

- [Purpose](#purpose)
- [Architectural Principle](#architectural-principle)
- [Pure & Pipeable](#pure--pipeable)
- [What This Module Does](#what-this-module-does)
- [What This Module Does NOT Do](#what-this-module-does-not-do)
- [Dependencies](#dependencies)
- [File Structure](#file-structure)
- [Links](#links)

## Purpose

Before this module existed, each lang module duplicated:

- Default values
- Merge logic (`{ ...defaults, ...userOptions }`)
- Structural validation (type checking)

This didn't scale — adding a new lang meant copy-pasting validation boilerplate.

**Solution**: Extract validation and default-filling into pure, reusable functions. Langs export JSON Schema, API layer calls these functions with the schema.

## Architectural Principle

`/configuring` is a **collection of pure functions** with **NO coordination responsibility**.

| What it is          | What it is NOT               |
| ------------------- | ---------------------------- |
| Pure functions      | A coordinating layer         |
| Stateless utilities | A registry or lookup service |
| Schema-agnostic     | Lang-aware                   |

**Key design**: Functions receive schema as a parameter. They don't know which lang they're validating — that's the API layer's job.

```typescript
// Functions take (options, schema) — no langId, no registry lookup
const filled = prepareConfig(userOptions, schema);
```

**Module isolation**: `/configuring` imports ONLY from `/errors`. It never imports from `/langs` or `/api`.

## Pure & Pipeable

All functions are pure and return options. This enables composition:

```typescript
// Each function returns options — pipeable
const result = validateConfig(fillDefaults(expandShorthand(options, schema), schema), schema);

// Or use the wrapper (recommended)
const result = prepareConfig(options, schema);
```

**Pipeline order**: expand → fill → validate

| Function          | Purpose                                  | Returns                        |
| ----------------- | ---------------------------------------- | ------------------------------ |
| `expandShorthand` | Expand boolean shorthand to objects      | New options object             |
| `fillDefaults`    | Fill missing fields from schema defaults | New options object             |
| `validateConfig`  | Validate against schema                  | Same options (throws on error) |
| `prepareConfig`   | Wrapper: runs all three in order         | Fully-filled options           |

## What This Module Does

- **Shorthand expansion** — expand `{ field: false }` to `{ field: { a: false, b: false, ... } }`
- **Default filling** — apply defaults from any JSON Schema (via Ajv)
- **Structural validation** — validate options against any JSON Schema (via Ajv)
- **Error formatting** — produce clear `OptionsSchemaInvalidError` messages
- **Return options** — all functions return options (pipeable, pure)

## What This Module Does NOT Do

- **Schema lookup** — API layer imports schemas directly from langs
- **Coordination** — API layer orchestrates the validation flow
- **Semantic validation** — Langs export `verifyOptions()`, API layer calls it
- **Lang/code validation** — API layer validates those types
- **Parsing or tracing** — Lang modules do that

## Dependencies

- **[Ajv](https://ajv.js.org/)** — JSON Schema validator
  - Used for structural validation and default filling
  - `useDefaults: true` fills defaults in one pass
  - `coerceTypes: true` for forgiving input (`"5"` → `5`)
  - Battle-tested, fast, industry standard

## File Structure

```text
src/configuring/
├── README.md               # This file
├── DOCS.md                 # API reference
├── types.ts                # TypeScript types (JSONSchema)
├── expand-shorthand.ts     # expandShorthand(options, schema)
├── fill-defaults.ts        # fillDefaults(options, schema)
├── validate-config.ts     # validateConfig(options, schema)
├── prepare-config.ts       # prepareConfig(options, schema) — wrapper
└── tests/
    ├── expand-shorthand.test.ts
    ├── fill-defaults.test.ts
    ├── validate-config.test.ts
    ├── prepare-config.test.ts
    └── integration.test.ts
```

**Note**: No `schema-registry.ts` — schemas are imported directly by the API layer.

## Links

- [API Reference](./DOCS.md) — function signatures, error types, examples
- [Langs README](../langs/README.md) — how langs export schemas
- [API README](../api/README.md) — how API layer coordinates validation
