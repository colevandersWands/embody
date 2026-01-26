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

#### 1. Export Conventions

**EVERY internal file** exports exactly ONE thing as default, using named-then-export pattern:

```javascript
// ✅ CORRECT - Named function, then export (better tooling support)
function myFunction() { ... }

export default myFunction;

// ✅ CORRECT - Constants follow same pattern
const MY_CONSTANT = Symbol('description');

export default MY_CONSTANT;

// ❌ WRONG - Inline default (poor debugger/IDE support)
export default function myFunction() { ... }

// ❌ WRONG - Named exports in internal files
export function myFunction() { ... }
```

**NO BARREL FILES**: Import directly from the file that defines it. No `index.ts` re-exports except `/src/index.ts`.

```javascript
// ✅ CORRECT - Direct imports
import createConfig from './config/create.js';
import applyPreset from './config/apply-preset.js';

// ❌ WRONG - Barrel imports (except public API)
import { createConfig, applyPreset } from './config/index.js';
```

**CONSTANTS**: Live in `/src/constants/` folder, one per file.

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

#### 4. Function Conventions
- Use named `function` declarations by default
- Arrow functions ONLY as anonymous inline callbacks: single expression, implicit return, readable at a glance
- Arrows NEVER assigned to variables (`const fn = () => ...` is banned)
- Non-trivial callbacks: extract as named `function` declarations, pass by name
- Hoisting encouraged: define helper functions below where they're first called

#### 5. No `this` Keyword
Banned. Exception: low-level instrumentation code interfacing with libraries that require it.

#### 6. No Mutable Closures
Closures over mutable variables (`let`, reassigned bindings) are banned.
Closures over immutable values (cached config in currying) are fine.

#### 7. Method Shorthand in Objects
Use `{ process() {} }` not `{ process: function process() {} }`.

#### 8. Default Empty Object for Destructured Parameters
All destructured object params get `= {}` default:
```javascript
function processConfig({ preset = 'detailed' } = {}) {}
```

#### 9. Naming
- Functions: verb-first (`extractId`, `createConfig`, `isActive`)
- Predicates: prefix with `is`/`has`/`can`/`should`
- Callbacks: describe the transform (`extractId` not `mapUser`)

#### 10. Imports
- Always include `.js` extension
- Group: externals → internals → type imports (separated by blank lines)

#### 11. Types
- Prefer `type` over `interface`
- Types live in `types.ts` files per module

#### 12. Comments
- JSDoc for public functions
- Inline comments explain WHY, not WHAT

#### 13. File Structure
- One concept per file, named after its default export
- `kebab-case` for all files and directories

#### 14. Prefer `const`
Use `let` only when reassignment is genuinely needed (loop counters, accumulators).

> See DEV.md § Codebase Conventions for full rationale and examples.

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

1. Follow export conventions strictly (named-then-export, no barrels)
2. Import directly from source files (no barrel imports), always with `.js` extension
3. Maintain object-threading pattern
4. Keep functions pure and deterministic
5. Use named `function` declarations (arrows only for inline callbacks)
6. No `this` keyword, no mutable closures
7. Default empty object `= {}` on all destructured parameters
8. Verb-first naming; predicates prefixed with `is`/`has`/`can`/`should`
9. Prefer `type` over `interface`; types in `types.ts` files
10. Add TypeScript types for all public APIs
11. JSDoc for public functions; inline comments explain "why"
12. Document stubs as if fully implemented
13. Use graceful degradation for config errors; fail fast for critical errors

## LLM Collaboration Conventions

This codebase is maintained by humans and LLMs working together. These conventions
help AI assistants generate correct, fitting code on the first attempt.

### Types as Generation Constraints

Complete TypeScript types prevent LLMs from guessing:

```typescript
// ✅ GOOD - LLM knows exactly what to produce
type ExpandedConfig = {
  preset: PresetName;
  variables: boolean;
  flowControl: boolean;
  expressions: boolean;
};

// ❌ VAGUE - LLM will guess field names and types
type Config = Record<string, any>;
```

### Predictable File Naming Enables Discovery

Consistent `kebab-case` filenames and one-concept-per-file means LLMs can predict where
code lives without searching. `fill-config.ts` is discoverable; `utils.ts` is not.

### "Why" Comments as Intent Signals

LLMs parse syntax fine — they can't infer _intent_. Comments that explain "why" serve
as intent signals that guide AI-generated modifications.

```javascript
// ❌ USELESS - describes syntax
// Spread the input object
return { ...input, config };

// ✅ USEFUL - describes intent
// Preserve all upstream pipeline data while adding our config
return { ...input, config };
```

### Self-Documenting Error Messages

Error messages should contain enough context to be debuggable by both humans and LLMs.
Include what was expected, what was received, and where the error occurred.

```javascript
// ❌ VAGUE
throw new Error('invalid config');

// ✅ DEBUGGABLE
throw new Error(
  'fillConfig: expected preset to be one of "overview", "detailed", "exhaustive", got "' +
    preset + '"',
);
```

### Structural Consistency

Every file follows the same layout: imports → helpers → main function → export.
This lets LLMs predict structure and generate code that fits without searching
the codebase first.

## References

- [Aran Framework](https://github.com/lachrist/aran) - AST instrumentation
- [ECMAScript Specification](https://tc39.es/ecma262/) - Language semantics
- See DEV.md for architecture and code conventions
- See DOCS.md for API documentation
- See config/README.md for configuration options