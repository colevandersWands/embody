# utils/

Pure utility functions for deep object operations. These are general-purpose helpers used
across the codebase for handling nested data structures.

## Utilities

### deep-clone

Creates serializable copies of JavaScript values. Handles nested objects, arrays, and special
types (Date, RegExp, Set, Map) while detecting circular references.

```typescript
import deepClone from './deep-clone.js';

const original = { date: new Date(), nested: { value: 1 } };
const cloned = deepClone(original);
// cloned.date is a new Date instance
// cloned.nested is not the same reference as original.nested
```

Used in trace generation to capture value snapshots without modifying original objects.

### deep-freeze

Recursively freezes an object and all nested properties. Unlike `Object.freeze` which is
shallow, this freezes the entire object tree.

```typescript
import deepFreeze from './deep-freeze.js';

const config = deepFreeze({ nested: { value: 1 } });
config.nested.value = 2; // TypeError in strict mode
```

Used in the dispatch layer to freeze default event configurations, preventing accidental
mutation of shared defaults.

### deep-merge

Recursively merges two objects with user configuration taking precedence. Arrays are
replaced completely (no element-by-element merging).

```typescript
import deepMerge from './deep-merge.js';

const preset = { vars: { read: false, write: true } };
const user = { vars: { read: true } };
const result = deepMerge(preset, user);
// Result: { vars: { read: true, write: true } }
```

Used in configuration to merge user overrides with preset defaults.

## Design Principles

- **Pure functions**: No side effects, same input always produces same output
- **Type preservation**: Generics maintain input types through operations
- **Circular reference safety**: deep-clone detects and handles circular references
- **Serialization-friendly**: deep-clone produces JSON-serializable output
