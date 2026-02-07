# Chars Language Module

A minimal test language for architecture validation. Treats any string as a sequence of characters and produces one step per character.

## Purpose

Chars exists to validate the multi-language tracer architecture without the complexity of real language parsing. It's useful for:

- Testing dispatch routing
- Validating StepCore contract compliance
- Integration testing without language-specific edge cases
- Quick prototyping of new features

## Exports

| Export        | Type        | Required | Description                     |
| ------------- | ----------- | -------- | ------------------------------- |
| `schema.json` | JSON Schema | Yes      | Options validation and defaults |
| `record`      | Function    | Yes      | Character traversal tracer      |

Chars does NOT export `verifyOptions` — it has no cross-field constraints.

## Configuration

Options are validated and filled by [`/configuring`](../../configuring/README.md) before reaching `record`.

```typescript
type CharsOptions = {
  readonly remove: readonly string[]; // Characters to exclude from steps
  readonly replace: Readonly<Record<string, string>>; // Character substitutions
  readonly direction: 'lr' | 'rl'; // Traversal direction
  readonly allowedCharClasses: AllowedCharClasses; // Which character classes to include
};

type CharClass = 'lowercase' | 'uppercase' | 'number' | 'punctuation' | 'other';
type AllowedCharClasses = { readonly [K in CharClass]: boolean };
```

### Schema Defaults

```json
{
  "remove": [],
  "replace": {},
  "direction": "lr",
  "allowedCharClasses": {
    "lowercase": true,
    "uppercase": true,
    "number": true,
    "punctuation": true,
    "other": true
  }
}
```

### Character Classes

Characters are classified into these categories:

| Class         | Pattern           | Examples            |
| ------------- | ----------------- | ------------------- |
| `lowercase`   | `[a-z]`           | a, b, z             |
| `uppercase`   | `[A-Z]`           | A, B, Z             |
| `number`      | `[0-9]`           | 0, 5, 9             |
| `punctuation` | `[!-/:-@[-\`{-~]` | !, @, #, $, %, ...  |
| `other`       | everything else   | spaces, newlines, ü |

Set a class to `false` to exclude all characters in that class from output.

**Shorthand**: Pass `true` or `false` instead of the full object to enable/disable all classes at once. Expanded by `/configuring` before reaching `record`.

See [`schema.json`](./schema.json) for the full JSON Schema.

### Contract

The `record` function receives **fully-filled options** — all fields present, all types validated. No defensive coding needed.

## Output

Each step includes:

```typescript
type CharsStep = {
  readonly step: number; // 1-indexed execution order
  readonly loc: {
    readonly line: number; // Always 1 (single line)
    readonly column: number; // 1-indexed original position
  };
  readonly char: string; // Character at this position (after replacement)
};
```

## Examples

### Basic Traversal

```typescript
record('abc', { options: { remove: [], replace: {}, direction: 'lr' } });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'a' },
//   { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
//   { step: 3, loc: { line: 1, column: 3 }, char: 'c' }
// ]
```

### Right-to-Left

```typescript
record('abc', { options: { remove: [], replace: {}, direction: 'rl' } });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'c' },
//   { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
//   { step: 3, loc: { line: 1, column: 3 }, char: 'a' }
// ]
```

### Remove Filter

```typescript
record('abc', { options: { remove: ['b'], replace: {}, direction: 'lr' } });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'a' },
//   { step: 2, loc: { line: 1, column: 3 }, char: 'c' }
// ]
// Note: step renumbered, column preserves original position
```

### Replace Filter

```typescript
record('abc', {
  options: { remove: [], replace: { a: 'x' }, direction: 'lr', allowedCharClasses: allTrue },
});
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'x' },
//   { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
//   { step: 3, loc: { line: 1, column: 3 }, char: 'c' }
// ]
```

### Character Class Filter

```typescript
// Only include lowercase letters (exclude uppercase and numbers)
record('aB1c', {
  options: {
    remove: [],
    replace: {},
    direction: 'lr',
    allowedCharClasses: {
      lowercase: true,
      uppercase: false,
      number: false,
      punctuation: true,
      other: true,
    },
  },
});
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'a' },
//   { step: 2, loc: { line: 1, column: 4 }, char: 'c' }
// ]
// Note: B at column 2 and 1 at column 3 are excluded
```

## Files

| File          | Purpose                       |
| ------------- | ----------------------------- |
| `schema.json` | JSON Schema for options       |
| `record.ts`   | Core traversal logic          |
| `types.ts`    | CharsOptions, CharsStep types |
| `README.md`   | This file                     |

## Links

- [Parent README](../README.md) — tracer module architecture
- [/configuring](../../configuring/README.md) — how options are validated
