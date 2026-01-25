# Claude Assistant Context

This file provides specific context for AI assistants working with the `@study-lenses/embody` codebase.

## Project Overview

Embody is a JavaScript execution tracer that provides neutral infrastructure for educational tools. It instruments code using the Aran framework to produce detailed execution traces with configurable granularity.

## Key Technical Context

### Architecture

The codebase follows a strict pipeline architecture:
```
Input → fillConfig → instrument → record → trace → filterSteps → Output
```

Each stage uses object-threading: receives an object, adds data, returns enriched object.

### Critical Conventions

#### 1. Default-Only Exports
**EVERY internal file** exports exactly ONE thing as default:
```javascript
// ✅ CORRECT
export default function myFunction() { ... }

// ❌ WRONG (except in /src/index.ts)
export function myFunction() { ... }
export default myFunction;
```

**EXCEPTION**: Only `/src/index.ts` has named exports for public API flexibility.

#### 2. Object-Threading Pattern
All functions follow this pattern:
```javascript
function stage(input) {
  const { existingData } = input;
  const newData = process(existingData);
  return { ...input, newData };
}
```

#### 3. Pure Functional Approach
- No mutations
- No side effects in core functions
- Explicit state passing
- Deterministic behavior

### Implementation Complexities

#### Aran Framework Integration
- AST-based code instrumentation
- Advice functions for trace collection
- Blackbox function handling (instrument calls, not bodies)

#### Variable Filtering with Scopes
- Maintain scope chain through state.parent
- Apply filters at appropriate scope levels
- Handle hoisting, TDZ, closures

#### Async Context Preservation
- Sequence numbers for event ordering
- Context switches in await/yield advice
- Promise resolution timing

#### Performance Considerations
- WeakMap for object tagging (avoid modifications)
- Configurable detail levels
- Trace size limits
- Sampling strategies for hot paths

### Current Implementation Status

**Completed:**
- Configuration system with presets
- Public API with currying
- TypeScript types
- Basic structure

**Stubs (return mock data):**
- `instrument()` - Returns `{ ...input, instrumented: 'TODO' }`
- `record()` - Returns `{ ...input, steps: [] }`
- `filterSteps()` - Returns input unchanged

**Pending (v2.0):**
- Async/await execution
- Promise tracing
- Streaming API
- Browser compatibility

### Type System

Uses hybrid typing approach:
```typescript
// Base types for composition
type ConfiguredInput<T = {}> = T & { config: ExpandedConfig };

// Function overloads for currying
function embody(input: { config: UserConfig; code: string }): TraceResult;
function embody(input: { config: UserConfig }): (input: { code: string }) => TraceResult;
function embody(input: { code: string }): (input: { config?: UserConfig }) => TraceResult;
```

### Educational Context

This is **infrastructure**, not an educational tool itself:
- We provide raw execution traces
- Educational tools interpret the traces
- Config enables different analysis depths
- No pedagogical decisions in our code

Three preset levels:
- `overview`: Minimal, beginner-friendly
- `detailed`: Balanced intermediate (default)
- `exhaustive`: Maximum information

### Development Pitfalls to Avoid

1. **Never modify traced objects** - Use WeakMap registry pattern
2. **Maintain immutable scope chains** - Parent/child relationships
3. **Preserve async context** - Sequence numbers are critical
4. **Avoid circular references** - Registry pattern for serialization
5. **Clear trace data properly** - Prevent memory leaks

### Testing Approach

- Unit tests for each exported function
- Integration tests for full pipeline
- Test cases in `/tests/cases/` with expected traces
- Performance benchmarks for instrumentation overhead

### When Working on This Codebase

1. Follow default export convention strictly
2. Maintain object-threading pattern
3. Keep functions pure and deterministic
4. Add TypeScript types for all public APIs
5. Document stubs as if fully implemented
6. Use graceful degradation for config errors
7. Fail fast for critical errors

## References

- [Aran Framework](https://github.com/lachrist/aran) - AST instrumentation
- [ECMAScript Specification](https://tc39.es/ecma262/) - Language semantics
- See DEV.md for detailed architecture
- See DOCS.md for API documentation
- See config/README.md for configuration options