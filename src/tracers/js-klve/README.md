# js-klve Tracer Module

JavaScript execution tracer adapted from [jsviz.klve.nl](https://jsviz.klve.nl). Uses Babel to instrument code and captures step-by-step execution data including variable scopes, expression values, and console output.

## Credits

Adapted from:

- [jsviz.klve.nl](https://jsviz.klve.nl) - Original visualization tool
- [Observable notebook](https://observablehq.com/@kelleyvanevert/visualizing-js-execution-2-w-o-generators) - Design writeup
- [GitHub repo](https://github.com/kelleyvanevert/js_execution_stepping_through_meta_syntactic_transform) - Original source

## Exports

| Export              | Type        | Required | Description                     |
| ------------------- | ----------- | -------- | ------------------------------- |
| `tracerId`          | string      | Yes      | `'js:klve'`                     |
| `record`            | Function    | Yes      | JavaScript execution tracer     |
| `optionsSchema`     | JSON Schema | Yes      | Options validation and defaults |

js-klve does NOT export `verifyOptions` — the hierarchical filter config has no cross-field constraints.

## Configuration

Options are validated and filled by [`/configuring`](../../configuring/README.md) before reaching `record`.

See [DOCS.md](./DOCS.md) for the complete filter configuration reference.

### Quick Example

```typescript
// Filter to only show after-evaluation steps for loops and binary operators
const options: JsKlveOptions = {
  filter: {
    timing: { before: false, after: true },
    nodes: {
      loops: { for: true, while: true },
      operators: { binary: true },
    },
    data: { scopes: false, value: true },
  },
};

// Focus trace on specific variable(s)
const options: JsKlveOptions = {
  filter: {
    names: { include: ['x', 'y'] }, // only steps mentioning x or y
  },
};
```

## Output

Each step includes:

```typescript
type JsKlveStep = {
  readonly step: number; // 1-indexed execution order
  readonly category: 'init' | 'statement' | 'expression';
  readonly type?: string; // AST node type (e.g., 'ForStatement')
  readonly time?: 'before' | 'after';
  readonly loc?: SourceLocation; // Source position
  readonly scopes?: readonly Record<string, unknown>[]; // Variable scopes
  readonly value?: unknown; // Expression value (after evaluation)
  readonly logs?: readonly unknown[][]; // console.log captures
  readonly dt?: number; // Milliseconds since trace start
  readonly detail?: JsKlveDetail; // Node-type-specific AST metadata
};
```

## What Gets Traced

The tracer captures execution of:

**Statements:**

- Variable declarations (`let`, `const`, `var`)
- Loops (`for`, `while`)
- Conditionals (`if`)
- Control flow (`try`, `expressionStatement`)

**Expressions:**

- Function calls and `new` expressions
- Member access and identifiers
- All operators (binary, unary, logical, assignment, update, sequence)
- Literals (numeric, string, boolean, array, object)
- Function expressions and arrow functions

## Browser Compatibility

Uses `@babel/standalone` for browser-compatible code transformation. Bundle size is ~2.8MB but provides drop-in Babel functionality without Node.js dependencies.

## Execution Limits

| Limit                  | Supported | Enforcement    | Notes                                      |
| ---------------------- | --------- | -------------- | ------------------------------------------ |
| `meta.max.steps`       | Yes       | During tracing | Throws when step count exceeds limit       |
| `meta.max.time`        | Yes       | During tracing | Throws when elapsed ms exceeds limit       |
| `meta.max.iterations`  | No        | —              | Not implemented (requires instrumentation) |
| `meta.max.callstack`   | No        | —              | Not implemented (requires instrumentation) |

## Limitations

- Executes code using `Function()` constructor (similar security implications as `eval`)
- Converts `let`/`const` to `var` internally for scope tracking
- Async/await timing may not perfectly reflect actual execution order
- Large or infinite loops are terminated by `meta.max.time` if set; without a time limit, they may hang

## Files

| File                  | Purpose                            |
| --------------------- | ---------------------------------- |
| `index.ts`            | Barrel: re-exports as named        |
| `tracer-id.ts`        | Tracer ID constant (`'js:klve'`)   |
| `record.ts`           | Entry point (adapts tracer to API) |
| `options.schema.json` | JSON Schema for filter options     |
| `tracer.ts`           | Core Babel instrumentation         |
| `filter-steps.ts`     | Post-execution step filtering      |
| `ast-map.ts`          | Config key → AST node type mapping |
| `types.ts`            | JsKlveOptions, JsKlveStep, etc.    |
| `DOCS.md`             | Complete API reference             |
| `README.md`           | This file                          |

## Links

- [Parent README](../README.md) — tracer module architecture
- [DOCS.md](./DOCS.md) — complete API reference
- [/configuring](../../configuring/README.md) — how options are validated
