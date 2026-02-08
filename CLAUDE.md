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
  - [Incremental TDD Workflow](#incremental-tdd-workflow)
    - [Claude-Specific Workflow Notes](#claude-specific-workflow-notes)
    - [Git: Humans Only](#git-humans-only)
    - [Context Compaction Protocol](#context-compaction-protocol)
  - [When Working on This Codebase](#when-working-on-this-codebase)
  - [Safety Guardrails](#safety-guardrails)
    - [Risk Assessment](#risk-assessment)
    - [Emergency Brake](#emergency-brake)
    - [Intellectual Honesty](#intellectual-honesty)
    - [Defensive Development](#defensive-development)
    - [LLM Anti-Patterns (Resist These Tendencies)](#llm-anti-patterns-resist-these-tendencies)
    - [Linting as Guardrails](#linting-as-guardrails)
    - [Linting Errors as Teaching Moments](#linting-errors-as-teaching-moments)
- [LLM Collaboration Conventions](#llm-collaboration-conventions)
  - [Code Organization for LLM Generation](#code-organization-for-llm-generation)
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
Input → fillConfig → record → Output
```

Each stage uses object-threading: receives an object, adds data, returns enriched object.

### Critical Conventions

#### 1. Export Conventions

- **One default export per file**: Named function/const, then `export default` at bottom
- **No barrel files**: Import directly from source files (no `index.ts` re-exports except `/src/index.ts` and `src/tracers/**/index.ts` — tracer barrels are a scoped exception for plugin-like modules)
- **Always `.js` extension** in imports

```javascript
// ✅ CORRECT
function myFunction() { ... }
export default myFunction;

// ❌ WRONG
export default function() { ... }  // inline default
export function myFunction() { ... }  // named export
import { x } from './index.js';  // barrel import
```

See DEV.md §1. Export Conventions for full rationale.

#### Type Location

Types live in `<module>/types.ts` with the code they document.

| Location                | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `src/<module>/types.ts` | Types for that module                     |
| `src/types.ts`          | Type map (namespace barrel for discovery) |
| `src/index.ts`          | Re-exports public types for consumers     |

Internal code imports directly from module's `types.ts`. The `/src/types.ts` file is a **namespace barrel** that serves as a "table of contents" — open it to see which modules have types.

See DEV.md § Type Location Convention for full details.

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

Full TypeScript types with function overloads for currying support. See `src/types/api.ts` for type definitions.

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

### Incremental TDD Workflow

All development uses TDD with atomic increments. See DEV.md § Incremental Development Workflow for the full process.

#### Claude-Specific Workflow Notes

**Plan constraints:**

- Plans MUST NOT include already-implemented functions — code is developed incrementally
- Plans start with a brief context line referencing completed work, then list ONLY unimplemented work
- **Plans describe BEHAVIOR, not code** — never include full implementations in plans. TDD discovers implementation. Example: "expand boolean shorthand to full object structure" is correct; pasting the actual code is wrong
- Before starting work, verify understanding with the user: what will be built, what constraints apply, what success looks like
- Before writing any code, explain in plain language what you're about to do and why

**During TDD cycles:**

- Run lint checkpoints on specific modified files, not the whole codebase: `npm run lint <file>`
- At step 12 (self-review): Run through LLM Anti-Pattern Checklist. Reality check: did I run it? Did I trigger the exact behavior I changed? Would I bet $100 this works? Flag what you're least confident about for the user to review.
- At step 13: Show actual output from quality checks — don't just claim "tests pass"

**Git prompts** (Claude prompts, user executes):

- Before a sprint: "Create a feature branch from main for this work"
- After each passing TDD cycle: "Ready for atomic commit: `add: [description]`"
- After the last increment: "Sprint complete — ready to push and open a PR or merge to main"

**Interrupt and redirect** if the user tries to skip planning, documentation, tests, or quality checks — even if they insist.

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

### Context Compaction Protocol

Long sessions hit context limits, triggering automatic summarization. Claude must proactively manage this to minimize context loss.

#### Trigger Mechanisms

**Proactive (Claude's judgment):**

- ~80% through estimated context window
- Long multi-file implementation sessions
- After 10+ incremental commits without break
- Conversation dense with code diffs and file reads

**User-initiated:**

- User says `/checkpoint`, "context check", or similar
- User explicitly asks about context capacity

#### Compaction Preparation Checklist

When context is approaching capacity, Claude MUST:

1. **Update plan file** — capture current state, what's done, what's left
2. **Update docs** — ensure CLAUDE.md/DEV.md/README.md reflect current reality
3. **Prompt user to commit** — atomic checkpoint before compaction
4. **Summarize active context** — write session summary to plan file:
   - Current branch and recent commits
   - Files being modified
   - Open questions or blockers
   - Next immediate task
5. **Alert the user** with this format:

```text
⚠️ Context approaching capacity.

I've documented the current state:
- Plan file: [path]
- Branch: [current branch]
- Last commit: [summary]
- Next task: [what's next]

Ready for session handoff or continuation after compaction.
```

#### Post-Compaction Recovery

After context resets (new session or compaction):

1. Re-read CLAUDE.md, DEV.md, relevant README.md files
2. Read plan file to restore session context
3. Verify understanding with user before resuming: "Based on the plan file, I understand we were working on X. Is that correct?"

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

LLMs have documented failure modes from training data biases. Actively resist:

| Anti-Pattern         | Rule                             | Example Fix                                     |
| -------------------- | -------------------------------- | ----------------------------------------------- |
| **Over-engineering** | Helper used once? Inline it      | `const x = getX(o)` → `const x = o.x`           |
| **Class addiction**  | Linter blocks, but check first   | `class X` → `function createX()`                |
| **Future-proofing**  | User didn't ask? Don't add it    | `options = {}` with unused fields → direct impl |
| **Defensive coding** | Validate at boundaries only      | Remove internal re-validation                   |
| **Verbose docs**     | Name + types explain? Skip JSDoc | Only document WHY or non-obvious contracts      |

##### Pre-Proposal Checklist

Before proposing code, answer YES to ALL:

- [ ] **Simplest solution?** Not most "elegant" or "extensible"
- [ ] **Only what requested?** No future-proofing, no "nice-to-haves"
- [ ] **Helpers used >1x?** If used once, inline it
- [ ] **Validate at boundaries only?** No re-validating internal calls
- [ ] **Junior-maintainable?** Understandable without explanation

**If proposing ANY of these, STOP and simplify:**
Classes, single-use helpers, unused config fields, internal error handling, backwards-compat shims for new code, `_unused` parameter renames, generic solutions when specific works.

**Self-correction phrases:**

- "Actually, this is over-engineered. Let me simplify."
- "I was about to create a helper for one call site. Inlining instead."
- "That's future-proofing for a scenario that doesn't exist."

### Linting as Guardrails

Linting blocks common LLM failure modes (forEach addiction, class addiction, defensive over-validation). See DEV.md §Linting Conventions for rule details.

### Linting Errors as Teaching Moments

When linting errors occur, treat them as teaching opportunities — explain WHAT and WHY, not just how to fix. See DEV.md §Teaching Moments for Linting Errors for the full guide with common rules and example interactions.

## LLM Collaboration Conventions

This codebase is maintained by humans and LLMs working together.

### Code Organization for LLM Generation

The conventions in DEV.md are designed to help LLMs generate correct code on the first attempt:

- **Complete TypeScript types** prevent guessing field names/types
- **Predictable `kebab-case` filenames** enable discovery without searching
- **"Why" comments** signal intent that syntax can't convey
- **Self-documenting error messages** include context for debugging
- **Structural consistency** (imports → helpers → main → export) enables prediction

### Communication Discipline

- No false confidence: never claim something works without running it
- No sycophancy: never agree with an approach just because the user suggested it
- Express uncertainty with confidence levels ("~80% confident this is correct")
- When uncertain, investigate first rather than confirming assumptions
- Lead with problems and risks, not optimism

### Working with Claude

- Treat Claude as an iterative partner, not a one-shot solution
- Save your state (git commit) before letting Claude make large changes — if it doesn't work, start fresh rather than wrestling with corrections
- Core business logic needs close human oversight; peripheral features can run more autonomously

## References

- [Aran Framework](https://github.com/lachrist/aran) - AST instrumentation
- [ECMAScript Specification](https://tc39.es/ecma262/) - Language semantics
- See DEV.md for architecture and code conventions (including error handling in §5)
- See DOCS.md for API documentation
- See src/api/README.md for API module overview and decision matrix
- See src/errors/README.md for error classes and `instanceof` handling patterns
- See src/configuring/README.md for configuration validation and options
- See src/tracers/README.md for tracer module conventions
