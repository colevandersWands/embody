# Claude Assistant Context

This file provides specific context for AI assistants working with the `@study-lenses/embody` codebase.

- [Project Overview](#project-overview)
- [Key Technical Context](#key-technical-context)
  - [Architecture](#architecture)
  - [Critical Conventions](#critical-conventions)
    - [1. Export Conventions](#1-export-conventions)
    - [Type Location](#type-location)
    - [2. Object-Threading Pattern](#2-object-threading-pattern)
    - [3. Pure Functional Approach](#3-pure-functional-approach)
    - [4. Function Conventions](#4-function-conventions)
    - [5. No `this` Keyword](#5-no-this-keyword)
    - [6. No Mutable Closures](#6-no-mutable-closures)
    - [7. Method Shorthand in Objects](#7-method-shorthand-in-objects)
    - [8. Default Empty Object for Destructured Parameters](#8-default-empty-object-for-destructured-parameters)
    - [9. Naming](#9-naming)
    - [10. Imports](#10-imports)
    - [11. Types](#11-types)
    - [12. Comments](#12-comments)
    - [13. File Structure](#13-file-structure)
    - [14. Prefer `const`](#14-prefer-const)
  - [Implementation Complexities](#implementation-complexities)
    - [Aran Framework Integration](#aran-framework-integration)
    - [Variable Filtering with Scopes](#variable-filtering-with-scopes)
    - [Async Context Preservation](#async-context-preservation)
    - [Performance Considerations](#performance-considerations)
  - [Type System](#type-system)
  - [Educational Context](#educational-context)
  - [Development Pitfalls to Avoid](#development-pitfalls-to-avoid)
  - [Testing Approach](#testing-approach)
  - [Linting Approach](#linting-approach)
  - [VS Code Setup](#vs-code-setup)
  - [Incremental TDD Workflow](#incremental-tdd-workflow)
    - [Plan Constraints](#plan-constraints)
    - [Per-Increment Steps](#per-increment-steps)
    - [What NOT to Do](#what-not-to-do)
    - [Git: Humans Only](#git-humans-only)
  - [When Working on This Codebase](#when-working-on-this-codebase)
  - [Safety Guardrails](#safety-guardrails)
    - [Risk Assessment](#risk-assessment)
    - [Emergency Brake](#emergency-brake)
    - [Intellectual Honesty](#intellectual-honesty)
    - [Defensive Development](#defensive-development)
    - [LLM Anti-Patterns (Resist These Tendencies)](#llm-anti-patterns-resist-these-tendencies)
      - [Why LLMs Have These Biases](#why-llms-have-these-biases)
      - [What Linting CAN'T Enforce](#what-linting-cant-enforce)
      - [Anti-Patterns to Actively Resist](#anti-patterns-to-actively-resist)
      - [Phrases Claude Should Use](#phrases-claude-should-use)
    - [Linting as Guardrails Against LLM Slop](#linting-as-guardrails-against-llm-slop)
    - [Linting Errors as Teaching Moments](#linting-errors-as-teaching-moments)
- [LLM Collaboration Conventions](#llm-collaboration-conventions)
  - [Types as Generation Constraints](#types-as-generation-constraints)
  - [Predictable File Naming Enables Discovery](#predictable-file-naming-enables-discovery)
  - ["Why" Comments as Intent Signals](#why-comments-as-intent-signals)
  - [Self-Documenting Error Messages](#self-documenting-error-messages)
  - [Structural Consistency](#structural-consistency)
  - [Communication Discipline](#communication-discipline)
  - [Working with Claude](#working-with-claude)
- [References](#references)

## Project Overview

Embody is a JavaScript execution tracer that provides neutral infrastructure for educational tools. It instruments code using the Aran framework to produce detailed execution traces with configurable granularity.

> **⚠️ Plan Mode First:** Discuss changes with Claude in plan mode before implementation. Exceptions: trivial fixes, user says "skip plan mode", or pure research tasks. Plan mode prevents wasted effort from misunderstandings and catches issues before code exists.

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

#### Type Location

Types live in `<module>/types.ts` with the code they document. See DEV.md § Type Location Convention.

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
- Every source directory has a `README.md`; submodules also have `DOCS.md` (see DEV.md § Per-Directory Documentation)

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

### Type System

Uses full TypeScript types:

```typescript
// Base types for composition
type ConfiguredInput<T = {}> = T & { readonly config: ExpandedConfig };

// Function overloads for currying
function embody(input: {
  readonly config: UserConfig | string;
  readonly code: string;
}): TraceResult;
function embody(input: {
  readonly config: UserConfig | string;
}): (input: { readonly code: string }) => TraceResult;
function embody(input: {
  readonly code: string;
}): (input: { readonly config?: UserConfig | string }) => TraceResult;
```

### Educational Context

This is **infrastructure**, not an educational tool itself:

- We provide raw execution traces
- Educational tools interpret the traces
- Config enables different analysis depths
- No pedagogical decisions in our code

### Development Pitfalls to Avoid

1. **Never modify traced objects** - Use WeakMap registry pattern
2. **Maintain immutable scope chains** - Parent/child relationships
3. **Preserve async context** - Sequence numbers are critical
4. **Avoid circular references** - Registry pattern for serialization
5. **Clear trace data properly** - Prevent memory leaks

### Testing Approach

See DEV.md § Testing Strategy for full conventions. Summary:

- Unit tests in `tests/` subdirectory (never alongside source files)
- File suffix: `.test.ts` (never `.spec.ts`)
- One assertion per `it`; nest `describe` blocks for grouping
- Direct description naming with implicit arrows for compactness
- Test ordering: feature → happy path → edge cases → errors → performance
- Inline test data only — no shared fixtures
- `.toThrow()` for errors — no try-catch patterns
- No comments — test names are documentation

### Linting Approach

See DEV.md § Linting Conventions for full details. Summary:

- **Three-tool pipeline**: ESLint (logic/patterns) + Prettier (formatting) + TypeScript (types)
- Most functional/import/style conventions auto-enforced via ESLint
- Pre-commit hooks run `lint:fix` and `format` on staged files
- Manual review for: default `= {}` params, verb-first naming, file granularity, comment quality
- Run `npm run validate` to check all three tools at once

### VS Code Setup

The `.vscode/` directory provides workspace configuration for consistent development:

- **settings.json** — Format-on-save, ESLint auto-fix, word wrap at 100 chars, `.js` import extensions
- **extensions.json** — Recommended extensions (ESLint, Prettier, EditorConfig, Jest, spell checker, pretty TS errors)
- **launch.json** — Debug configurations for tests and scripts

Open VS Code → install recommended extensions when prompted → editor is configured.

Debug configurations:

- **Debug Current Test File** — open a `.test.ts` file, press F5
- **Debug All Tests** — run full suite with breakpoints
- **Debug Current Script** — debug any `.ts`/`.js` file directly

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
4. **🔍 Lint checkpoint 1** — run `npm run lint` on the new file. Fix any violations before proceeding (catches naming, imports, structure early). Repeat until there are no errors, and warnings are acceptable.
5. **Unit test** — write ONE failing test for the behavior
6. **🔍 Lint checkpoint 2** — run `npm run lint` on test file. Fix violations. Repeat until there are no errors, and warnings are acceptable.
7. **Implement** — write minimal code to pass the test (Red → Green)
8. **🔍 Lint checkpoint 3** — run `npm run lint` on implementation. Fix violations. Re-run tests to ensure fixes didn't break behavior. Repeat until there are no errors, and warnings are acceptable.
9. **Refactor** — clean up while tests stay green. **Use linter feedback as refactoring guide**: `cognitive-complexity` error? Break into smaller functions. `prefer-immediate-return`? Inline unnecessary variable. `no-duplicate-string`? Extract constant.
10. **🔍 Lint checkpoint 4** — run `npm run lint` one final time. Should be clean. If not, refactor violated conventions — revert refactor and try different approach. Re-run linting to ensure fixes didn't break behavior. Repeat until there are no errors, and warnings are acceptable.
11. **Update types** — finalize/tighten types based on actual implementation
12. **Self-review** — Run through LLM Anti-Pattern Checklist (see below): simplest solution? only what requested? helpers used >1x? validate at boundaries only? Check conventions: KISS? junior-maintainable? fits existing patterns? Review changes as unified diff (catches accidental deletions). Reality check: did I run it? Did I trigger the exact behavior I changed? Would I bet $100 this works? Flag what you're least confident about for the user to review.
13. **Code quality checks** — run `npm test && npm run lint && npm run type-check`. Show the actual output — don't just claim "tests pass." All must pass.
14. **Update docs** — update ALL-CAPS.md files (CLAUDE.md, DEV.md) AND directory-level README.md/DOCS.md in affected directories after each passing increment
15. **Session handoff** — before ending a session, ensure ALL-CAPS.md docs reflect current state, note in any plan file what's done and what's left, and prompt the user to commit
16. **Atomic commit** — Claude prompts the user to commit this single behavior with a descriptive message (e.g., `add: fillConfig expands boolean shorthand`)

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
16. Ensure `README.md` (and `DOCS.md` for submodules) exists and is current in every directory you modify

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

#### LLM Anti-Patterns (Resist These Tendencies)

##### Why LLMs Have These Biases

Claude and other LLMs develop these tendencies from training data and prediction mechanics:

- **Training on enterprise codebases** (Spring, .NET, Angular) → defaults to OOP patterns (classes, inheritance)
- **Prediction bias toward "more code"** → longer completions score higher in training
- **Pattern completion instinct** → favors familiar structures (classes, try-catch everywhere, config objects)
- **No inherent cost function for simplicity** → doesn't "feel" the burden of maintaining complex code

##### What Linting CAN'T Enforce

Linting catches syntax-level issues. These architectural anti-patterns require active resistance:

- Creating unnecessary abstractions for single-use code
- Adding features that weren't requested ("nice-to-haves", future-proofing)
- Building "extensible" systems for one use case
- Premature optimization before profiling
- Over-generalizing specific solutions into generic frameworks
- Verbose documentation for trivial code

##### Anti-Patterns to Actively Resist

Claude and other LLMs have documented failure modes. Actively resist these patterns:

**Over-Engineering Addiction**

Don't create abstractions, helpers, or configs for one-time operations.

```javascript
// ❌ BAD - Helper used exactly once
function extractPresetName(config) {
  return config?.preset ?? 'detailed';
}
const preset = extractPresetName(userConfig);

// ✓ GOOD - Inline when used once
const preset = userConfig?.preset ?? 'detailed';
```

**Rule**: If a helper is called exactly once, inline it. No exceptions.

**Class Addiction**

Linter blocks classes, but check before proposing.

```javascript
// ❌ BAD - Unnecessary class
class ConfigManager {
  constructor(defaults) {
    this.defaults = defaults;
  }
  create(userConfig) {
    return { ...this.defaults, ...userConfig };
  }
}

// ✓ GOOD - Simple function
function createConfig(userConfig, defaults) {
  return { ...defaults, ...userConfig };
}
```

**Future-Proofing Addiction**

Don't add configuration, extensibility, or feature flags for non-existent requirements.

```javascript
// ❌ BAD - Config for non-existent variants
function process(input, options = {}) {
  const { mode = 'default', strategy = 'simple', fallback = null } = options;
  // Only 'default' mode ever used
}

// ✓ GOOD - YAGNI (You Aren't Gonna Need It)
function process(input) {
  // Direct implementation
}
```

**Rule**: If the user didn't ask for configurability, don't add it.

**Defensive Coding Addiction**

Only validate at system boundaries (user input, external APIs). Trust internal code.

```javascript
// ❌ BAD - Validating internal call
function processConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Invalid');
  // This is INTERNAL, called by fillConfig which already validated
}

// ✓ GOOD - Validate at boundary only
function fillConfig(userInput) {
  if (typeof userInput !== 'object') throw new Error('Config must be object');
  return processConfig(userInput); // Internal call, no re-validation
}
```

**Verbose Documentation Addiction**

Don't write paragraph-length JSDoc for trivial operations. Self-documenting code > verbose comments.

```javascript
// ❌ BAD - Verbose JSDoc for trivial function
/**
 * Extracts the preset name from the configuration object.
 * This function takes a config object and returns the preset property value.
 * If the preset property is not found or is undefined, it returns the default
 * value 'detailed' which represents the balanced intermediate configuration.
 * @param {Object} config - The configuration object containing preset information
 * @returns {string} The preset name, defaulting to 'detailed'
 */
function getPresetName(config) {
  return config?.preset ?? 'detailed';
}

// ✓ GOOD - Code is self-documenting, brief comment if needed
function getPresetName(config) {
  return config?.preset ?? 'detailed';
}

// ✓ GOOD - JSDoc for public API with non-obvious behavior
/**
 * Instruments code and collects execution trace.
 * Async functions return promises; sync code returns trace immediately.
 */
function trace(code, config) { ... }
```

Rule: If the function name and types fully explain what it does, no comment needed. Only document WHY or non-obvious contracts.

##### Phrases Claude Should Use

**When user asks for unnecessary features:**

- "That's future-proofing for a scenario that doesn't exist. YAGNI applies here."
- "That adds configuration for a single use case. Let's implement the specific thing directly."
- "That's abstracting before we have multiple concrete examples. Wait for the second use case."
- "That's defensive validation for internal code we control. Only validate at boundaries."

**When self-correcting over-engineering:**

- "Actually, this is over-engineered. Let me simplify."
- "I was about to create a helper for one call site. Inlining instead."
- "I caught myself adding config fields that aren't needed. Implementing specific solution."
- "That's my class addiction showing. Using a factory function instead."
- "I'm about to future-proof this. Stopping — implement only what's requested."

**When linter catches mistakes:**

- "Linter caught my class addiction — converting to factory function."
- "Cognitive complexity error flagged this function. Breaking into smaller pieces."
- "Linter caught forEach — converting to for-of loop for side effects."
- "prefer-immediate-return caught unnecessary variable. Inlining return."

**LLM Anti-Pattern Checklist**

Before proposing code, answer YES to ALL:

- [ ] **Simplest solution?** Not most "elegant" or "extensible"
- [ ] **Only what requested?** No future-proofing, no "nice-to-haves"
- [ ] **Helpers used >1x?** If used once, inline it
- [ ] **Validate at boundaries only?** No re-validating internal calls
- [ ] **Junior-maintainable?** Understandable without explanation
- [ ] **Refusing banned patterns?** No classes, switch, forEach
- [ ] **No over-engineering?** No config objects for single-use code

If ANY answer is NO → simplify before proposing.

**Emergency Brake: Am I Over-Engineering?**

If you're about to propose code with ANY of these, **STOP** and simplify:

- A class (linter blocks this, but check first)
- A helper function used exactly once
- A configuration object with unused fields
- Error handling for internal function calls
- Backwards compatibility shims for first-time implementation (there's no "backwards" yet!)
- Keeping old unused code "just in case" (delete it, git remembers)
- Renaming unused parameters to `_unused` instead of deleting them
- Generic/abstract solution when specific works
- Comments explaining trivial code ("increment counter")

**Self-Correcting Phrases**

When catching yourself over-engineering:

- "Actually, this is over-engineered. Let me simplify."
- "I was about to create a helper for one call site. Inlining instead."
- "That's future-proofing for a scenario that doesn't exist. Implementing only what's needed."

### Linting as Guardrails Against LLM Slop

**Context:** Many contributors are JS novices using AI assistants (Claude, etc.) to develop. Linting serves dual purposes:

1. **Enforcement** — catch errors, enforce conventions
2. **Teaching** — guide novices toward better JS patterns

Linting blocks common LLM failure modes (forEach addiction, class addiction, defensive over-validation) and creates teaching moments when novices hit errors.

**For Claude:** When linting errors occur, offer teaching moments.

### Linting Errors as Teaching Moments

**When contributor hits a linting error:**

1. **Explain WHAT and WHY** (not just HOW to fix)
   - "This rule (`unicorn/no-array-for-each`) catches a common pattern..."
   - "The WHY: loops make side effects explicit, array methods are for transformations"
   - "In JS, `.forEach()` looks functional but can't break/return early"

2. **Offer teaching moment:**
   - "Would you like me to explain the JS concept behind this rule?"
   - "I can show you examples of when to use loops vs array methods"
   - "Want to understand why this pattern is preferred in this codebase?"

3. **Keep it brief by default, expand on request:**
   - Initial explanation: 2-3 sentences
   - If they ask "why": teach the JS concept
   - If they ask "how": show the fix + why it's better

**Common linting errors to teach:**

- **`unicorn/no-array-for-each`**: Imperative (loops) vs functional (map/filter/reduce) programming. `.forEach()` looks functional but behaves imperatively - you can't break early, can't return values, and it's slower than loops. JS has both paradigms; we use them deliberately.
- **`prefer-template`**: String concatenation semantics, why `+` is for math. Template literals keep `+` operator exclusively for arithmetic, reducing ambiguity and type coercion bugs.
- **`arrow-body-style`**: Implicit vs explicit returns, when arrows are appropriate. Arrow functions with implicit returns are concise for transformations; explicit return blocks signal "this does more than transform."
- **`func-names`**: Hoisting, call stacks, debugging. Named function declarations hoist, improving stack traces and allowing top-down reading. Anonymous arrows don't hoist and show as `<anonymous>` in errors.
- **`functional/no-this-expressions`**: Context binding, closures, why `this` is confusing. `this` binding changes based on call-site, leading to bugs. Closures over parameters are explicit and predictable.
- **`sonarjs/cognitive-complexity`**: Code complexity, readable code, breaking down problems. High cognitive complexity means too many nested conditions/loops. Break into smaller, named functions that each do one thing.
- **`sonarjs/no-duplicate-string`**: Magic strings vs constants. Repeated strings should be named constants for searchability, refactorability, and documentation.

**Example interaction:**

```
Contributor: "I'm getting a linting error about forEach"

Claude: "That's the `unicorn/no-array-for-each` rule. Quick explanation: In this
codebase, we use `for-of` loops for side effects (like logging, modifying external
state) and array methods (`.map()`, `.filter()`) for transformations. The rule helps
keep these patterns distinct.

Would you like me to explain why this distinction matters in JS, or just show you how
to fix it?"

[If yes to teaching]: "Great! Here's the concept: `.forEach()` looks functional but
behaves imperatively - you can't break early, can't return values, and it's slower
than loops. JS has both paradigms, and we use them deliberately:
- Loops (`for`, `for-of`) = imperative, side effects, can break/continue
- Array methods (`.map()`, `.filter()`) = functional, transformations, return new values

This makes code intent clear at a glance."
```

**Don't be patronizing:** Assume intelligence, explain concepts clearly, don't over-simplify.

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
- See src/api/README.md for API module overview and decision matrix
- See config/README.md for configuration options
