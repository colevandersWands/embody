# Chars Language Module

A minimal test language for architecture validation. Treats any string as a sequence of characters and produces one step per character.

## Purpose

Chars exists to validate the multi-language tracer architecture without the complexity of real language parsing. It's useful for:

- Testing dispatch routing
- Validating StepCore contract compliance
- Integration testing without language-specific edge cases
- Quick prototyping of new features

## Configuration

```typescript
type CharsEvents = {
  remove: string[];              // Characters to exclude from steps
  replace: Record<string, string>; // Character substitutions
  direction: 'lr' | 'rl';        // Traversal direction
};
```

### Default Events

```typescript
{
  remove: [],
  replace: {},
  direction: 'lr'  // left-to-right
}
```

## Output

Each step includes:

```typescript
type CharsStep = {
  step: number;      // 1-indexed execution order
  loc: {
    line: number;    // Always 1 (single line)
    column: number;  // 1-indexed original position
  };
  char: string;      // Character at this position (after replacement)
};
```

## Examples

### Basic Traversal

```typescript
record('abc', { remove: [], replace: {}, direction: 'lr' });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'a' },
//   { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
//   { step: 3, loc: { line: 1, column: 3 }, char: 'c' }
// ]
```

### Right-to-Left

```typescript
record('abc', { remove: [], replace: {}, direction: 'rl' });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'c' },
//   { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
//   { step: 3, loc: { line: 1, column: 3 }, char: 'a' }
// ]
```

### Remove Filter

```typescript
record('abc', { remove: ['b'], replace: {}, direction: 'lr' });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'a' },
//   { step: 2, loc: { line: 1, column: 3 }, char: 'c' }
// ]
// Note: step renumbered, column preserves original position
```

### Replace Filter

```typescript
record('abc', { remove: [], replace: { a: 'x' }, direction: 'lr' });
// [
//   { step: 1, loc: { line: 1, column: 1 }, char: 'x' },
//   { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
//   { step: 3, loc: { line: 1, column: 3 }, char: 'c' }
// ]
```

## Files

| File | Purpose |
|------|---------|
| `record.ts` | Core traversal logic |
| `events.ts` | Default configuration |
| `types.ts` | CharsEvents, CharsStep, Direction types |
