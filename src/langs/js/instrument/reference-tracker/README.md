# Reference Tracker

Internal dependency for the JavaScript execution tracer. Provides reference type tracking functionality used by tracer advice functions to instrument object identity and mutations in execution traces.

## Purpose

This utility is used by the tracer's advice functions to shadow the JavaScript engine's state, maintaining unique identifiers for reference types throughout execution. Each reference receives a tracking ID that appears in the final execution trace, enabling analysis of object identity, mutations, and side effects.

## Architecture

Modular design with separation of concerns:

- **`factory`** - Creates configured tracker instances with shared state
- **`shadow`** - Public interface for advice functions to track values
- **`wrap`** - Core recursive wrapping with unique ID assignment
- **`unwrap`** - Deep restoration of original values from traced objects
- **`isWrapper`** - Pure function for structural validation of TrackedObjects

## API

### factory(options?): { wrap, unwrap, shadow }

Creates a tracker instance with shared state for tracer integration.

```typescript
const tracker = factory({
  secret: Symbol('tracer-instance'),
  id: 1000, // Starting ID for this trace
  record: new WeakMap(), // Shared tracking record
});
```

### shadow(value): TrackedObject

Primary interface for advice functions. Wraps all values with tracking metadata for consistent consumer interface.

```typescript
// In advice function
const trackedObject = tracker.shadow({ data: 123 });
// trackedObject = {
//   value: {
//     data: {value: 123, id: null, secret, type: 'number'}
//   },
//   id: 1001,
//   secret,
//   type: 'Object'
// }

const trackedPrimitive = tracker.shadow(42);
// trackedPrimitive = {value: 42, id: null, secret, type: 'number'}
```

### wrap(value): TrackedObject

Direct wrapping function for internal use. Wraps all values consistently, recursively processing nested reference types.

### unwrap(value): any

Restores original values from tracked objects for final trace output.

### isWrapper(obj): boolean

Pure function for structural validation of TrackedObjects. Validates object shape without checking secret value.

```typescript
// Valid wrapper structure
const valid = { value: 42, id: 123, secret: Symbol(), type: 'number' };
console.log(isWrapper(valid)); // true

// Usage with secret validation
if (isWrapper(obj) && obj.secret === mySecret) {
  // Object is valid TrackedObject with correct secret
}
```

## TrackedObject Interface

```typescript
interface TrackedObject<T = unknown> {
  readonly value: T; // Original wrapped value
  readonly id: number | null; // Unique trace identifier (null for primitives)
  readonly secret: symbol; // Tracer instance verification
  readonly type: string; // Constructor name for trace metadata
}
```

## Integration Notes

- Each tracer instance should use a unique secret symbol
- Starting ID should be coordinated with tracer's ID allocation
- WeakMap record stores only reference types to prevent memory leaks during long traces
- Primitives receive tracking metadata but are not stored in WeakMap for performance
- Circular references are handled safely without infinite recursion
- Identity preservation: unwrap returns original reference when no tracked objects present

## Supported Types

All JavaScript values are wrapped with tracking metadata. Reference types (Object, Array, Map, Set, Function, Date, RegExp, Error, custom class instances) receive unique IDs and are stored in WeakMap. Primitives (string, number, boolean, null, undefined, symbol, bigint) receive `id: null` and are not stored in WeakMap for performance.

## Implementation Details

### ID Counter Thread Safety

- **Single-threaded design**: ID counter is mutable closure variable, not thread-safe
- **Tracer isolation**: Each `factory()` call creates isolated ID counter starting from `options.id`
- **Concurrency**: For multi-threaded environments, create separate tracker instances per thread

### WeakMap Persistence and Memory Management

- **Automatic cleanup**: WeakMap entries are garbage collected when original objects are unreachable
- **No memory leaks**: Tracked objects don't prevent garbage collection of original objects
- **Long trace sessions**: WeakMap grows during execution but shrinks automatically as objects go out of scope
- **Manual cleanup**: Not needed - rely on JavaScript's garbage collection

### Performance Characteristics

- **Primitive wrapping**: Constant time O(1), no WeakMap operations
- **Reference wrapping**: First access O(1) + WeakMap set, subsequent access O(1) WeakMap get
- **Circular references**: Detected via WeakMap cache, prevents infinite recursion
- **Deep structures**: Performance scales linearly with object depth and breadth

### Circular Reference Handling

- **Detection mechanism**: WeakMap tracks objects currently being processed
- **Resolution strategy**: Returns cached wrapper when circular reference detected
- **Unwrapping**: Maintains reference identity during unwrapping process
- **Memory safety**: No stack overflow for circular structures

### Type Validation (`isWrapper`)

- **Structural validation**: Checks object shape without secret value validation
- **Symbol type checking**: Validates `secret` property is symbol type (not just present)
- **Performance**: Pure function with no closure overhead, optimized for repeated calls
- **Type narrowing**: Provides TypeScript type guard for TrackedObject type

### Error Conditions

- **Malformed TrackedObjects**: `isWrapper` returns false for invalid structures
- **Secret mismatch**: Consumers must explicitly check `obj.secret === mySecret`
- **WeakMap failures**: Rare, would throw during Map/Set operations (implementation-dependent)

### Integration Guidelines

- **Memory monitoring**: For very long traces, monitor overall memory usage
- **ID allocation**: Coordinate starting IDs across multiple tracker instances if needed
- **Secret generation**: Use unique symbols per tracer instance to prevent cross-contamination

### Import Extension Strategy

TypeScript files use `.js` extensions in import statements for ES module compatibility with Node.js. This allows the code to work correctly when transpiled to JavaScript while maintaining TypeScript development support. The pattern `import { symbol } from './module.js'` in `.ts` files is intentional and standard for hybrid TS/JS projects.
