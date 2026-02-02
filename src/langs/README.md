# Language Modules

This directory contains language-specific tracing implementations. Each language module provides a `record` function that traces code execution and an `events` object with default configuration.

## Architecture

```
langs/
├── dispatch.ts      # Registry mapping lang IDs to modules
├── types.ts         # Shared types (StepCore, LangModule)
├── chars/           # Test language for architecture validation
│   ├── record.ts    # Tracing implementation
│   ├── events.ts    # Default events configuration
│   └── types.ts     # Language-specific types
└── tests/           # Integration tests
```

## Dispatch

The `dispatch` object maps language IDs to their modules:

```typescript
import dispatch from './dispatch.js';

const lang = dispatch.chars;
const steps = lang.record('abc', lang.events);
// steps: [{ step: 1, loc: { line: 1, column: 1 }, char: 'a' }, ...]
```

## LangModule Interface

Every language module must conform to:

```typescript
type LangModule<TEvents, TStep extends StepCore> = {
  readonly record: (code: string, config: TEvents) => readonly TStep[];
  readonly events: TEvents;
};
```

## StepCore Contract

All steps, regardless of language, must include:

```typescript
type StepCore = {
  readonly step: number;   // 1-indexed execution order
  readonly loc: {
    readonly line: number;   // 1-indexed
    readonly column: number; // 1-indexed
  };
};
```

Language-specific fields extend this base type.

## Adding a New Language

1. Create `langs/<lang>/` directory
2. Implement `record.ts` with tracing logic
3. Define `events.ts` with default configuration
4. Define `types.ts` with step and events types
5. Add to `dispatch.ts` registry

See `chars/` for a minimal reference implementation.
