## Summary

<!-- Brief description of what this PR does and why -->

## Changes

<!-- List the specific changes made -->

-
-
-

## Testing

- [ ] Ran `npm run validate` (lint + typecheck + tests all pass)
- [ ] Tested the specific feature/fix manually

## Code Quality Checklist

### Automated (must pass before merge)

- [ ] `npm run lint` exits with zero errors
- [ ] `npm run format:check` passes (or ran `npm run format`)
- [ ] `npm run type-check` passes
- [ ] `npm test` passes (all tests green)

### Manual Review Conventions (honor system)

**Function & File Conventions:**

- [ ] Destructured object parameters have `= {}` default
- [ ] Function names are verb-first (`processConfig` not `configProcessor`)
- [ ] One concept per file (no kitchen-sink modules)
- [ ] Functions use `function` declarations (not `const fn = () =>`)

**Code Simplicity (LLM Anti-Patterns):**

- [ ] No helper functions used exactly once (inline them)
- [ ] No configuration objects with unused fields
- [ ] No error handling for internal function calls (only at boundaries)
- [ ] No backwards-compatibility shims for first-time implementations
- [ ] No future-proofing for non-existent requirements

**Comments & Documentation:**

- [ ] Comments explain "why" not "what" (or are removed)
- [ ] No verbose JSDoc for trivial operations
- [ ] Updated README.md/DOCS.md in affected directories

**Advanced Conventions:**

- [ ] No mutable closures (closures over `let` variables)
- [ ] No `this` keyword (except low-level instrumentation)

## Related Issues

<!-- Link any related issues: Fixes #123, Related to #456 -->
