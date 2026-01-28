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
import createConfig from './configuring/create.js';
import applyPreset from './configuring/apply-preset.js';

// ❌ WRONG - Barrel imports (except public API)
import { createConfig, applyPreset } from './configuring/index.js';
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
- Unit tests in `tests/` subdirectory at the same level as source files

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
- Public API with currying (embody, squint, embodify, pickles)
- Full TypeScript types with overloads
- Pickle support (JSON string auto-parsing for config and steps)
- Type validation with self-documenting error messages
- Comprehensive unit tests for all API and pipeline functions
- EMPTY sentinel removed (replaced by `undefined` checks)

**Stubs (return mock data — see unit tests for behavioral contracts):**

- `instrument('abc')` → `{ code: 'abc', config, instrumented: 'a b c' }`
- `record('a b c')` → `{ instrumented: 'a b c', config, steps: [{},{},{}] }`
- `filterSteps(steps)` → passthrough (returns `{ steps, config }` unchanged)
- `serialize([{},{}])` → `'[{},{}]'` (JSON.stringify)
- `deserialize({ steps, config })` → delegates to:
  - `resolveSteps` (from `src/steps/`) for steps parsing/validation
  - `parseJSON` (from `src/utils/`) for JSON string parsing
  - `isExpandableObject` (from `configuring/utils/`) for config validation
- `instrumentRecord('abc')` → `{ code: 'abc', config, steps: [{},{},{}] }`
- `fillConfig({})` → `{ config: createConfig({}) }`

**Steps Module (`src/steps/`):**

- `resolveSteps()` - resolves steps from JSON string or array passthrough
- `validateSteps()` - validates array of step objects
- Foundation for future steps-managing submodule

**Pending (v2.0):**

- Async/await execution
- Promise tracing
- Streaming API
- Browser compatibility

### Type System

Uses full TypeScript types:

```typescript
// Base types for composition
type ConfiguredInput<T = {}> = T & { readonly config: ExpandedConfig };

// Function overloads for currying
function embody(input: { readonly config: UserConfig | string; readonly code: string }): TraceResult;
function embody(input: { readonly config: UserConfig | string }): (input: { readonly code: string }) => TraceResult;
function embody(input: { readonly code: string }): (input: { readonly config?: UserConfig | string }) => TraceResult;
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

- Unit tests in `tests/` subdirectory co-located with each module (never alongside source files)
- File suffix: `.test.ts` (never `.spec.ts`)
- Integration test fixtures in root `/tests/` directory
- Test cases in `/tests/code-to-steps/` with expected traces
- Performance benchmarks for instrumentation overhead

### Incremental TDD Workflow

All development plans MUST use TDD and incremental development. One unit test = one increment of work.

#### Plan Constraints

- Plans MUST NOT include already-implemented functions — code is developed incrementally
- Plans start with a brief context line referencing completed work ("building on existing `fillConfig`"), then list ONLY unimplemented work
- Each passing TDD cycle = one atomic commit on a feature branch. Claude prompts the user; the user executes.
- Before starting work, Claude must verify understanding with the user: what will be built, what constraints apply, what success looks like
- Before writing any code, explain in plain language what you're about to do and why — this gives the user a chance to course-correct before code exists

#### Per-Increment Steps

For each small unit of behavior (one unit test):

1. **JSDoc** — document the behavioral contract first
2. **Stub function** — create the function with stub body matching the contract
3. **Placeholder types** — `any`/`unknown` or more detailed if already known; types should help prototyping, not hinder it
4. **Unit test** — write ONE failing test for the behavior
5. **Implement** — write minimal code to pass the test (Red → Green)
6. **Refactor** — clean up while tests stay green (→ Refactor)
7. **Update types** — finalize/tighten types based on actual implementation
8. **Self-review** — conventions followed? KISS? junior-maintainable? fits existing patterns? Review your changes as a unified diff (catches accidental deletions). Reality check: did I run it? Did I trigger the exact behavior I changed? Would I bet $100 this works? Flag what you're least confident about for the user to review.
9. **Code quality checks** — run ALL tests, linting, and type-checks for impacted code. Show the actual output — don't just claim "tests pass."
10. **Update ALL-CAPS.md docs** — always update relevant markdown docs (CLAUDE.md, DEV.md, DOCS.md, README.md) in both the submodule and root after each passing increment
11. **Session handoff** — before ending a session, ensure ALL-CAPS.md docs reflect current state, note in any plan file what's done and what's left, and prompt the user to commit
12. **Atomic commit** — Claude prompts the user to commit this single behavior with a descriptive message (e.g., `add: fillConfig expands boolean shorthand`)

Before starting a planned batch of work, Claude prompts the user to create a feature branch. After the last increment, Claude prompts the user to push and consider a PR or merge to main.

#### What NOT to Do

- No planning functions that already exist
- No implementing multiple behaviors before testing
- No skipping the refactor step
- No skipping doc updates ("I'll do it at the end")
- No placeholder types that block test-writing — loosen types to unblock, tighten after
- Each edit should do exactly one thing — if you notice something else to fix, note it and do it separately
- Claude must interrupt and redirect if the user tries to skip planning, documentation, tests, or quality checks — even if they insist

#### Git: Humans Only

Claude MUST NOT run any git command that creates, modifies, or deletes history. Git is the bulwark against runaway AI — only humans touch the history.

**Allowed** (read-only):

- `git status`, `git diff`, `git log`, `git show`, `git blame`, `git branch --list`, `git stash list`

**Forbidden** (modifies history):

- `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git revert`, `git cherry-pick`, `git tag`, `git stash push/pop/drop`, `git commit --amend`, `git push --force`, and any other command that writes to the git history

**Instead:** Claude prompts the human for all git actions:

- **Before a sprint:** "Create a feature branch from main for this work"
- **After each passing TDD cycle:** "This increment passes all checks — ready for an atomic commit: `add: [one-line description of the behavior]`"
- **After the last increment:** "Sprint complete — ready to push and open a PR or merge to main"

### When Working on This Codebase

1. **Follow the Incremental TDD Workflow above** for all development work
2. Follow export conventions strictly (named-then-export, no barrels)
3. Import directly from source files (no barrel imports), always with `.js` extension
4. Maintain object-threading pattern
5. Keep functions pure and deterministic
6. Use named `function` declarations (arrows only for inline callbacks)
7. No `this` keyword, no mutable closures
8. Default empty object `= {}` on all destructured parameters
9. Verb-first naming; predicates prefixed with `is`/`has`/`can`/`should`
10. Prefer `type` over `interface`; types in `types.ts` files
11. Add TypeScript types for all public APIs
12. JSDoc for public functions; inline comments explain "why"
13. Document stubs as if fully implemented
14. Throw on invalid input (consistent with all `/tracing` functions); fail fast for critical errors
15. Place tests in `tests/` subdirectory (not alongside source files), use `.test.ts` suffix

### Safety Guardrails

Claude must actively protect the codebase — especially from its own worst tendencies.

#### Risk Assessment

Before starting any task involving multiple files, refactoring, cleanup, or architectural changes, Claude must warn the user and push toward incremental breakdown. If the user insists on a large unplanned change, Claude should refuse and explain why. These patterns are especially dangerous and must never be repeated:

- "Simplification" refactors that break working functionality
- Architectural rewrites that replace working systems with broken ones
- File deletion sprees that remove working code
- Over-abstraction that makes simple things complex
- Enthusiastic agreement to large changes without risk assessment

#### Emergency Brake

Work stops immediately if:

- Scope creeps beyond the original plan
- Test failures that aren't immediately understood
- Breaking changes to public APIs without explicit approval
- Claude catches itself skipping workflow steps

#### Intellectual Honesty

When Claude doesn't know something — say so explicitly, then suggest how to find out (read a file, check docs, search). Never guess confidently; novice developers will trust confident-sounding nonsense. When stuck, say "I'm stuck" or "I need you to check this manually" — asking for help is better than shipping broken code. If Claude catches itself using false confidence or agreeing without critical analysis, stop and correct: "Actually, let me be more direct:" then restate factually.

#### Defensive Development

Never edit a file without reading it first in the current session — mental models from training data or previous sessions are stale. Before changing existing code, understand why it exists: "What was this code protecting against? What breaks if I change it?" When something breaks, don't pile more code on top — revert to the last known working state and try a different approach.

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
    preset +
    '"',
);
```

### Structural Consistency

Every file follows the same layout: imports → helpers → main function → export.
This lets LLMs predict structure and generate code that fits without searching
the codebase first.

### Communication Discipline

- No false confidence: never claim something works without running it
- No sycophancy: never agree with an approach just because the user suggested it
- Express uncertainty with confidence levels ("~80% confident this is correct")
- When uncertain, investigate first rather than confirming assumptions
- Lead with problems and risks, not optimism

### Working with Claude

Contributing to this project is also a learning experience in human-LLM collaboration. To get the most from it:

- Treat Claude as an iterative partner, not a one-shot solution
- Save your state (git commit) before letting Claude make large changes — if it doesn't work, start fresh rather than wrestling with corrections
- Core business logic needs close human oversight; peripheral features can run more autonomously
- Look for transferable patterns: how functional approaches aid reasoning, how type systems encode domain knowledge, when abstraction helps vs hurts, how process discipline scales across complexity

## References

- [Aran Framework](https://github.com/lachrist/aran) - AST instrumentation
- [ECMAScript Specification](https://tc39.es/ecma262/) - Language semantics
- See DEV.md for architecture and code conventions
- See DOCS.md for API documentation
- See config/README.md for configuration options
