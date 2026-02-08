# js-klve API Reference

Complete API documentation for the JavaScript execution tracer.

## record(code, config)

Main entry point for tracing JavaScript code execution.

### Signature

```typescript
function record(
  code: string,
  config: { readonly meta: MetaConfig; readonly options: JsKlveOptions },
): Promise<readonly JsKlveStep[]>;
```

### Parameters

| Parameter        | Type            | Description                          |
| ---------------- | --------------- | ------------------------------------ |
| `code`           | `string`        | JavaScript source code to trace      |
| `config.meta`    | `MetaConfig`    | Execution limits from `/configuring` |
| `config.options` | `JsKlveOptions` | Filter configuration                 |

### Returns

`Promise<readonly JsKlveStep[]>` — Array of execution steps, 1-indexed.

### Throws

| Error                | Condition                                   |
| -------------------- | ------------------------------------------- |
| `ParseError`         | Syntax errors in the code                   |
| `RuntimeError`       | Runtime errors during execution             |
| `LimitExceededError` | Trace exceeds `meta.max.steps` (step count) |
| `LimitExceededError` | Trace exceeds `meta.max.time` (elapsed ms)  |

## JsKlveOptions

Filter configuration for controlling trace output.

```typescript
type JsKlveOptions = {
  readonly filter?: JsKlveFilterConfig;
};
```

## JsKlveFilterConfig

Hierarchical configuration for filtering trace steps.

```typescript
type JsKlveFilterConfig = {
  readonly nodes?: JsKlveNodeConfig;
  readonly names?: JsKlveNameConfig;
  readonly timing?: {
    readonly before?: boolean; // Include pre-execution steps
    readonly after?: boolean; // Include post-execution steps
  };
  readonly data?: {
    readonly scopes?: boolean; // Include scope chain
    readonly value?: boolean; // Include expression values
    readonly logs?: boolean; // Include console.log captures
    readonly dt?: boolean; // Include timing info
    readonly loc?: boolean; // Include source location
  };
};
```

### Defaults

All boolean options default to `true` (include everything). `names` defaults to no filtering (all names pass through).

## JsKlveNodeConfig

Node type filter configuration. Each key maps to one or more AST node types.

```typescript
type JsKlveNodeConfig = {
  readonly declarations?: { readonly variable?: boolean };
  readonly loops?: { readonly for?: boolean; readonly while?: boolean };
  readonly conditionals?: { readonly if?: boolean; readonly ternary?: boolean };
  readonly blocks?: { readonly try?: boolean; readonly expressionStatement?: boolean };
  readonly calls?: { readonly call?: boolean; readonly new?: boolean };
  readonly access?: { readonly member?: boolean; readonly identifier?: boolean };
  readonly operators?: {
    readonly binary?: boolean;
    readonly unary?: boolean;
    readonly logical?: boolean;
    readonly assignment?: boolean;
    readonly update?: boolean;
    readonly sequence?: boolean;
  };
  readonly literals?: {
    readonly numeric?: boolean;
    readonly string?: boolean;
    readonly boolean?: boolean;
    readonly array?: boolean;
    readonly object?: boolean;
  };
  readonly functions?: { readonly arrow?: boolean; readonly expression?: boolean };
};
```

### Config to AST Mapping

| Config Key                   | AST Node Type             |
| ---------------------------- | ------------------------- |
| `declarations.variable`      | `VariableDeclaration`     |
| `loops.for`                  | `ForStatement`            |
| `loops.while`                | `WhileStatement`          |
| `conditionals.if`            | `IfStatement`             |
| `conditionals.ternary`       | `ConditionalExpression`   |
| `blocks.try`                 | `TryStatement`            |
| `blocks.expressionStatement` | `ExpressionStatement`     |
| `calls.call`                 | `CallExpression`          |
| `calls.new`                  | `NewExpression`           |
| `access.member`              | `MemberExpression`        |
| `access.identifier`          | `Identifier`              |
| `operators.binary`           | `BinaryExpression`        |
| `operators.unary`            | `UnaryExpression`         |
| `operators.logical`          | `LogicalExpression`       |
| `operators.assignment`       | `AssignmentExpression`    |
| `operators.update`           | `UpdateExpression`        |
| `operators.sequence`         | `SequenceExpression`      |
| `literals.numeric`           | `NumericLiteral`          |
| `literals.string`            | `StringLiteral`           |
| `literals.boolean`           | `BooleanLiteral`          |
| `literals.array`             | `ArrayExpression`         |
| `literals.object`            | `ObjectExpression`        |
| `functions.arrow`            | `ArrowFunctionExpression` |
| `functions.expression`       | `FunctionExpression`      |

## JsKlveNameConfig

Name-based step filtering. Operates on the name-like fields in each step's `detail`: `name`, `target`, `callee`, `property`.

```typescript
type JsKlveNameConfig = {
  readonly include?: readonly string[]; // whitelist
  readonly exclude?: readonly string[]; // blacklist
};
```

### Semantics

| Config                               | Mode           | Behavior                                                     |
| ------------------------------------ | -------------- | ------------------------------------------------------------ |
| `{ include: ['x'] }`                 | Whitelist      | Only keep steps mentioning `'x'` + nameless structural steps |
| `{ exclude: ['console'] }`           | Blacklist      | Remove steps mentioning `'console'`, keep everything else    |
| `{ include: ['x'], exclude: ['y'] }` | Whitelist wins | `include` takes precedence, `exclude` is ignored             |
| `{}` or absent                       | No filtering   | All steps pass through                                       |

### Key Behaviors

- **Nameless steps always survive**: Steps without name-like `detail` fields (ForStatement, literals, BinaryExpression without target) pass through in both modes. Structural context is always preserved.
- **Init step always survives**: The step 0 init step is never filtered.
- **Step-level only**: Entire steps are removed/kept. Scope objects are NOT modified by name filtering.
- **Name fields checked**: `detail.name`, `detail.target`, `detail.callee`, `detail.property`. Only non-null string values count.
- **Exact match**: Names are matched exactly (no wildcards or regex).

### Pipeline Position

```text
raw steps → filter(node type + timing) → filter(names) → map(stripData) → output
```

Name filtering runs after node/timing filters and before data stripping.

### Name Filter Examples

```typescript
// Only trace what happens to variable 'x'
const options: JsKlveOptions = {
  filter: {
    names: { include: ['x'] },
  },
};

// Hide all console-related steps
const options: JsKlveOptions = {
  filter: {
    names: { exclude: ['log', 'console'] },
  },
};
```

## JsKlveStep

Output step structure.

```typescript
type JsKlveStep = {
  readonly step: number;
  readonly category: 'init' | 'statement' | 'expression';
  readonly type?: string;
  readonly time?: 'before' | 'after';
  readonly loc?: {
    readonly start: { readonly line: number; readonly column: number };
    readonly end: { readonly line: number; readonly column: number };
  };
  readonly scopes?: readonly Record<string, unknown>[];
  readonly value?: unknown;
  readonly logs?: readonly unknown[][];
  readonly dt?: number;
  readonly detail?: JsKlveDetail;
};
```

### Step Fields

| Field      | Type              | Description                                |
| ---------- | ----------------- | ------------------------------------------ |
| `step`     | `number`          | 1-indexed execution order                  |
| `category` | `string`          | `'init'`, `'statement'`, or `'expression'` |
| `type`     | `string?`         | AST node type (e.g., `'ForStatement'`)     |
| `time`     | `string?`         | `'before'` or `'after'` execution          |
| `loc`      | `SourceLocation?` | Source code position                       |
| `scopes`   | `Record<...>[]?`  | Variable scopes (innermost first)          |
| `value`    | `unknown?`        | Expression result (after-steps only)       |
| `logs`     | `unknown[][]?`    | console.log captures at this step          |
| `dt`       | `number?`         | Milliseconds since trace start             |
| `detail`   | `JsKlveDetail?`   | Node-type-specific AST metadata            |

## JsKlveDetail

Node-type-specific AST metadata included in trace steps. Contains static properties from the AST node (known at compile time, not runtime). Present on all non-init steps.

```typescript
type JsKlveDetail = {
  readonly action?: string;
  readonly operator?: string;
  readonly prefix?: boolean;
  readonly kind?: string;
  readonly computed?: boolean;
  readonly name?: string | null;
  readonly arity?: number;
  readonly target?: string | null;
  readonly property?: string | null;
  readonly callee?: string | null;
  readonly method?: boolean;
  readonly optional?: boolean;
  readonly async?: boolean;
  readonly generator?: boolean;
  readonly hasAlternate?: boolean;
  readonly hasCatch?: boolean;
  readonly hasFinally?: boolean;
  readonly hasInit?: boolean;
  readonly hasTest?: boolean;
  readonly hasUpdate?: boolean;
  readonly expressionBody?: boolean;
  readonly elementCount?: number;
  readonly propertyCount?: number;
};
```

### Fields

| Field            | Type              | Description                                                      |
| ---------------- | ----------------- | ---------------------------------------------------------------- |
| `action`         | `string?`         | Semantic classification (e.g. `'compute'`, `'assign'`, `'loop'`) |
| `operator`       | `string?`         | Operator characters (e.g. `+`, `===`, `&&`)                      |
| `prefix`         | `boolean?`        | Prefix vs postfix for unary/update                               |
| `kind`           | `string?`         | Declaration kind: let, const, var                                |
| `computed`       | `boolean?`        | Computed vs dot member access                                    |
| `name`           | `string \| null?` | Identifier or function name                                      |
| `arity`          | `number?`         | Param count (functions) or arg count (calls)                     |
| `target`         | `string \| null?` | Variable being written to (null for complex targets)             |
| `property`       | `string \| null?` | Property name for dot access (null when computed)                |
| `callee`         | `string \| null?` | Function/method being called (null for anonymous)                |
| `method`         | `boolean?`        | Whether call is a method invocation (`obj.f()` vs `f()`)         |
| `optional`       | `boolean?`        | Optional chaining (`?.`); only present when true                 |
| `async`          | `boolean?`        | Async function; only present when true                           |
| `generator`      | `boolean?`        | Generator function; only present when true                       |
| `hasAlternate`   | `boolean?`        | IfStatement/ConditionalExpression has else/alternate branch      |
| `hasCatch`       | `boolean?`        | TryStatement has a catch handler                                 |
| `hasFinally`     | `boolean?`        | TryStatement has a finally block                                 |
| `hasInit`        | `boolean?`        | ForStatement has an init clause                                  |
| `hasTest`        | `boolean?`        | ForStatement has a test clause                                   |
| `hasUpdate`      | `boolean?`        | ForStatement has an update clause                                |
| `expressionBody` | `boolean?`        | ArrowFunctionExpression uses expression body (not block)         |
| `elementCount`   | `number?`         | Number of elements in ArrayExpression                            |
| `propertyCount`  | `number?`         | Number of properties in ObjectExpression                         |

### Action Values

The `action` field groups 24 AST node types into 14 semantic categories:

| Action      | AST Types                                                                        |
| ----------- | -------------------------------------------------------------------------------- |
| `read`      | Identifier                                                                       |
| `access`    | MemberExpression                                                                 |
| `assign`    | AssignmentExpression                                                             |
| `update`    | UpdateExpression                                                                 |
| `declare`   | VariableDeclaration                                                              |
| `call`      | CallExpression                                                                   |
| `construct` | NewExpression                                                                    |
| `compute`   | BinaryExpression, UnaryExpression, LogicalExpression, SequenceExpression         |
| `branch`    | IfStatement, ConditionalExpression                                               |
| `loop`      | ForStatement, WhileStatement                                                     |
| `protect`   | TryStatement                                                                     |
| `evaluate`  | ExpressionStatement                                                              |
| `define`    | ArrowFunctionExpression, FunctionExpression                                      |
| `literal`   | NumericLiteral, StringLiteral, BooleanLiteral, ArrayExpression, ObjectExpression |

### Which Types Get Which Fields

| AST Type                  | `action`  | `operator` | `prefix` | `kind` | `computed` | `name` | `arity` | `target` | `property` | `callee` | `method` | `optional` | `async` | `generator` | structural                  |
| ------------------------- | --------- | ---------- | -------- | ------ | ---------- | ------ | ------- | -------- | ---------- | -------- | -------- | ---------- | ------- | ----------- | --------------------------- |
| `BinaryExpression`        | compute   | yes        | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `LogicalExpression`       | compute   | yes        | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `AssignmentExpression`    | assign    | yes        | —        | —      | —          | —      | —       | yes      | —          | —        | —        | —          | —       | —           | —                           |
| `UnaryExpression`         | compute   | yes        | yes      | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `UpdateExpression`        | update    | yes        | yes      | —      | —          | —      | —       | yes      | —          | —        | —        | —          | —       | —           | —                           |
| `VariableDeclaration`     | declare   | —          | —        | yes    | —          | —      | —       | yes      | —          | —        | —        | —          | —       | —           | —                           |
| `MemberExpression`        | access    | —          | —        | —      | yes        | —      | —       | —        | yes        | —        | —        | if true    | —       | —           | —                           |
| `Identifier`              | read      | —          | —        | —      | —          | yes    | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `CallExpression`          | call      | —          | —        | —      | —          | —      | yes     | —        | —          | yes      | yes      | —          | —       | —           | —                           |
| `NewExpression`           | construct | —          | —        | —      | —          | —      | yes     | —        | —          | yes      | yes      | —          | —       | —           | —                           |
| `ArrowFunctionExpression` | define    | —          | —        | —      | —          | —      | yes     | —        | —          | —        | —        | —          | if true | —           | expressionBody              |
| `FunctionExpression`      | define    | —          | —        | —      | —          | yes    | yes     | —        | —          | —        | —        | —          | if true | if true     | —                           |
| `IfStatement`             | branch    | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | hasAlternate                |
| `ConditionalExpression`   | branch    | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | hasAlternate                |
| `ForStatement`            | loop      | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | hasInit, hasTest, hasUpdate |
| `WhileStatement`          | loop      | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `TryStatement`            | protect   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | hasCatch, hasFinally        |
| `ExpressionStatement`     | evaluate  | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `SequenceExpression`      | compute   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `NumericLiteral`          | literal   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `StringLiteral`           | literal   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `BooleanLiteral`          | literal   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | —                           |
| `ArrayExpression`         | literal   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | elementCount                |
| `ObjectExpression`        | literal   | —          | —        | —      | —          | —      | —       | —        | —          | —        | —        | —          | —       | —           | propertyCount               |

"if true" means the field is only present when the value is `true` (omitted when `false`).

## Examples

### Basic Tracing

```typescript
import record from './record.js';

const steps = await record('const x = 1 + 2;', {
  meta: {
    max: { steps: null, iterations: null, callstack: null, time: null },
    range: null,
    timestamps: false,
    debug: { ast: false },
  },
  options: {},
});

console.log(steps.length); // Multiple steps covering the declaration
```

### Filter to After-Only

```typescript
const steps = await record('const x = 1 + 2;', {
  meta: defaultMeta,
  options: {
    filter: {
      timing: { before: false, after: true },
    },
  },
});
// Only steps with time === 'after' (plus init step)
```

### Filter by Node Type

```typescript
const steps = await record('for (let i = 0; i < 3; i++) { console.log(i); }', {
  meta: defaultMeta,
  options: {
    filter: {
      nodes: {
        loops: { for: true },
        calls: { call: true },
        // Everything else excluded
        literals: { numeric: false, string: false, boolean: false, array: false, object: false },
        access: { member: false, identifier: false },
      },
    },
  },
});
// Only ForStatement and CallExpression steps
```

### Minimal Output

```typescript
const steps = await record(code, {
  meta: defaultMeta,
  options: {
    filter: {
      timing: { before: false, after: true },
      data: { scopes: false, logs: false, dt: false },
    },
  },
});
// Steps have only: step, category, type, time, loc, value
```

### Track Variable Changes

```typescript
const steps = await record('let x = 0; x = x + 1; x = x * 2;', {
  meta: defaultMeta,
  options: {},
});

// Find assignment steps
const assignments = steps.filter((s) => s.type === 'AssignmentExpression' && s.time === 'after');
assignments.forEach((s) => {
  console.log(`Step ${s.step}: assigned ${s.value}`);
});
```

### Focus on Specific Variables

```typescript
// Only see steps involving variable 'x' (declarations, assignments, reads)
const steps = await record('let x = 0; let y = 1; x = x + y;', {
  meta: defaultMeta,
  options: {
    filter: {
      names: { include: ['x'] },
    },
  },
});
// Steps mentioning 'y' are removed; structural steps (loops, etc.) kept
```

## Trace Anatomy

A complete reference for everything a js-klve trace contains. Given input code, the tracer produces an array of steps representing the program's execution. This section documents every field, every step category, and what information is available at each point.

### The Init Step

Every trace begins with exactly one `init` step (step 0). It captures the program's initial state before any code executes:

```typescript
{
  step: 0,
  category: 'init',
  scopes: [{ /* global-scope variables */ }],
  logs: [],
  dt: 0,
}
```

The init step has no `type`, `time`, `loc`, `value`, or `detail`. It exists so consumers can see the starting scope (e.g., variables hoisted by the runtime).

### Step Categories

| Category     | Meaning                      | `type` present? | `time` present? | `value` present?                     |
| ------------ | ---------------------------- | --------------- | --------------- | ------------------------------------ |
| `init`       | Program start (step 0 only)  | No              | No              | No                                   |
| `statement`  | A statement node executing   | Yes             | Yes             | No (statements don't produce values) |
| `expression` | An expression node executing | Yes             | Yes             | Yes (on `after` steps)               |

### Timing: Before and After

Most steps come in pairs — a `before` step (about to execute) and an `after` step (just executed):

- **`before`**: The node is about to execute. `scopes` show the current variable values. No `value` yet.
- **`after`**: The node just finished. For expressions, `value` contains the result. `scopes` may have changed (e.g., after an assignment).

Statements only have meaningful `before`/`after` for statements with side effects. Block statements (`{ }`) are skipped.

### Core Fields (Always Present)

| Field      | On every step? | Description                                |
| ---------- | -------------- | ------------------------------------------ |
| `step`     | Yes            | 1-indexed execution order (init is step 0) |
| `category` | Yes            | `'init'`, `'statement'`, or `'expression'` |

### Conditional Fields

These fields are present on non-init steps but can be stripped by the `data` filter config:

| Field    | Default            | What it contains                                                                                                                 | When absent                        |
| -------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `type`   | Always on non-init | AST node type string (e.g., `'ForStatement'`, `'BinaryExpression'`)                                                              | Never absent on non-init steps     |
| `time`   | Always on non-init | `'before'` or `'after'`                                                                                                          | Never absent on non-init steps     |
| `loc`    | Included           | Source position: `{ start: { line, column }, end: { line, column } }`. Line is 1-indexed, column is 0-indexed.                   | Stripped when `data.loc: false`    |
| `scopes` | Included           | Array of scope objects, innermost first. Each scope is `Record<string, unknown>` mapping variable names to their current values. | Stripped when `data.scopes: false` |
| `value`  | Included           | The expression's result value (only on `after` expression steps). For statements, always absent.                                 | Stripped when `data.value: false`  |
| `logs`   | Included           | Array of `console.log()` argument arrays captured at this step. Each call is one inner array.                                    | Stripped when `data.logs: false`   |
| `dt`     | Included           | Milliseconds elapsed since trace start (`Date.now() - t0`).                                                                      | Stripped when `data.dt: false`     |
| `detail` | Always on non-init | Node-type-specific AST metadata object. See [JsKlveDetail](#jsklvedetail) section.                                               | Only absent on init step           |

### What Each Node Type Tells You

Below is every traced node type, what information it provides, and an example of the step content.

#### Statements

**VariableDeclaration** (`let x = 1;`)

```typescript
// before
{ step: 1, category: 'statement', type: 'VariableDeclaration', time: 'before',
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
  scopes: [{ x: undefined }], detail: { action: 'declare', kind: 'let', target: 'x' } }
// after
{ step: N, category: 'statement', type: 'VariableDeclaration', time: 'after',
  scopes: [{ x: 1 }], detail: { action: 'declare', kind: 'let', target: 'x' } }
```

Key info: `detail.kind` tells you `let`/`const`/`var`. `detail.target` is the declared variable name (null for destructuring patterns).

**ForStatement** (`for (let i = 0; i < 3; i++) { ... }`)

```typescript
{ step: N, category: 'statement', type: 'ForStatement', time: 'before',
  scopes: [{ i: 0 }],
  detail: { action: 'loop', hasInit: true, hasTest: true, hasUpdate: true } }
```

Key info: `detail.hasInit`/`hasTest`/`hasUpdate` reflect which for-loop clauses are present. All `false` for `for (;;)`.

**WhileStatement** (`while (x > 0) { ... }`)

```typescript
{ step: N, category: 'statement', type: 'WhileStatement', time: 'before',
  scopes: [{ x: 3 }], detail: { action: 'loop' } }
```

**IfStatement** (`if (x > 0) { ... } else { ... }`)

```typescript
{ step: N, category: 'statement', type: 'IfStatement', time: 'before',
  scopes: [{ x: 1 }], detail: { action: 'branch', hasAlternate: true } }
```

Key info: `detail.hasAlternate` is `true` when an `else` clause exists, `false` without one.

**TryStatement** (`try { ... } catch (e) { ... } finally { ... }`)

```typescript
{ step: N, category: 'statement', type: 'TryStatement', time: 'before',
  detail: { action: 'protect', hasCatch: true, hasFinally: true } }
```

Key info: `detail.hasCatch`/`hasFinally` reflect which clauses are present.

**ExpressionStatement** (`x + 1;`)

```typescript
{ step: N, category: 'statement', type: 'ExpressionStatement', time: 'before',
  detail: { action: 'evaluate' } }
```

#### Expressions — Operators

**BinaryExpression** (`1 + 2`)

```typescript
// after
{ step: N, category: 'expression', type: 'BinaryExpression', time: 'after',
  value: 3, detail: { action: 'compute', operator: '+' } }
```

**LogicalExpression** (`true && false`) — `detail: { action: 'compute', operator: '&&' }`

**UnaryExpression** (`!true`) — `detail: { action: 'compute', operator: '!', prefix: true }`

**AssignmentExpression** (`x = 1`)

```typescript
// after
{ step: N, category: 'expression', type: 'AssignmentExpression', time: 'after',
  value: 1, scopes: [{ x: 1 }],
  detail: { action: 'assign', operator: '=', target: 'x' } }
```

`detail.target` is `null` when the assignment target is complex (e.g., `obj.x = 1`).

**UpdateExpression** (`x++`)

```typescript
// after
{ step: N, category: 'expression', type: 'UpdateExpression', time: 'after',
  value: 0, // postfix returns old value
  detail: { action: 'update', operator: '++', prefix: false, target: 'x' } }
```

#### Expressions — Access

**MemberExpression** (`obj.x` or `obj[expr]`)

```typescript
// dot access
{ step: N, category: 'expression', type: 'MemberExpression', time: 'after',
  value: /* resolved value */,
  detail: { action: 'access', computed: false, property: 'x' } }

// computed access
{ step: N, ..., detail: { action: 'access', computed: true, property: null } }

// optional chaining (obj?.x)
{ step: N, ..., detail: { action: 'access', computed: false, property: 'x', optional: true } }
```

**Identifier** (`x`)

```typescript
{ step: N, category: 'expression', type: 'Identifier', time: 'after',
  value: /* current value of x */,
  detail: { action: 'read', name: 'x' } }
```

#### Expressions — Calls

**CallExpression** (`f(1, 2)` or `obj.method(1)`)

```typescript
// simple call
{ step: N, category: 'expression', type: 'CallExpression', time: 'after',
  value: /* return value */,
  detail: { action: 'call', arity: 2, callee: 'f', method: false } }

// method call
{ step: N, ...,
  detail: { action: 'call', arity: 1, callee: 'method', method: true } }

// anonymous callee: (x => x)(1)
{ step: N, ...,
  detail: { action: 'call', arity: 1, callee: null, method: false } }
```

**NewExpression** (`new Foo(1)`) — same detail shape as CallExpression, but `action: 'construct'`.

#### Expressions — Functions

**ArrowFunctionExpression** (`(a, b) => a + b`)

```typescript
// expression body: (a, b) => a + b
{ step: N, category: 'expression', type: 'ArrowFunctionExpression', time: 'after',
  value: /* the function object */,
  detail: { action: 'define', arity: 2, expressionBody: true } }

// block body: (a, b) => { return a + b; }
{ step: N, ..., detail: { action: 'define', arity: 2, expressionBody: false } }

// async arrow
{ step: N, ..., detail: { action: 'define', arity: 2, expressionBody: true, async: true } }
```

Key info: `detail.expressionBody` distinguishes `=> expr` from `=> { ... }`.

**FunctionExpression** (`function foo(x) { return x; }`)

```typescript
{ step: N, category: 'expression', type: 'FunctionExpression', time: 'after',
  value: /* the function object */,
  detail: { action: 'define', name: 'foo', arity: 1 } }

// anonymous: function(x) { ... }
{ step: N, ..., detail: { action: 'define', name: null, arity: 1 } }

// async generator: async function* gen() { ... }
{ step: N, ..., detail: { action: 'define', name: 'gen', arity: 0, async: true, generator: true } }
```

#### Expressions — Literals

**NumericLiteral** (`42`), **StringLiteral** (`"hello"`), **BooleanLiteral** (`true`)

```typescript
{ step: N, category: 'expression', type: 'NumericLiteral', time: 'after',
  value: 42, detail: { action: 'literal' } }
```

**ArrayExpression** (`[1, 2]`)

```typescript
{ step: N, category: 'expression', type: 'ArrayExpression', time: 'after',
  value: [1, 2], detail: { action: 'literal', elementCount: 2 } }
```

**ObjectExpression** (`{ a: 1, b: 2 }`)

```typescript
{ step: N, category: 'expression', type: 'ObjectExpression', time: 'after',
  value: { a: 1, b: 2 }, detail: { action: 'literal', propertyCount: 2 } }
```

#### Expressions — Other

**ConditionalExpression** (`a ? b : c`)

```typescript
{ step: N, category: 'expression', type: 'ConditionalExpression', time: 'after',
  value: /* result */, detail: { action: 'branch', hasAlternate: true } }
```

Ternaries always have `hasAlternate: true` (both branches are syntactically required).

**SequenceExpression** (`(a, b)`)

```typescript
{ step: N, category: 'expression', type: 'SequenceExpression', time: 'after',
  value: /* last value */, detail: { action: 'compute' } }
```

### Scope Chain

The `scopes` array represents the scope chain at each step, innermost scope first:

```typescript
scopes: [
  { x: 1, y: 2 }, // innermost (current block)
  { outerVar: 'hello' }, // enclosing scope
  {
    /* global scope */
  }, // outermost
];
```

Scope entries use the pattern `varName (!)` when a scope was created by the tracer's internal transformations (e.g., for-loop desugaring) rather than existing in the original code. These "synthetic" scopes are flagged so consumers can hide them if desired.

### Console Log Captures

The `logs` field captures `console.log()` calls made during execution. Each element is an array of the arguments passed to a single `console.log()` call:

```typescript
// Code: console.log("a", 1); console.log("b");
// On a step after both calls:
logs: [['a', 1], ['b']];
```

Logs accumulate — each step's `logs` includes all captures up to that point.

### What Is NOT in the Trace

The following information is **not** available in js-klve trace steps:

| Missing Information          | Why                                                                        |
| ---------------------------- | -------------------------------------------------------------------------- |
| Branch taken (if/else)       | Runtime decision, requires instrumentation changes                         |
| Loop iteration count         | Requires per-loop counter instrumentation                                  |
| Which catch/finally executed | Runtime control flow, not static AST metadata                              |
| Call stack depth             | Requires stack tracking instrumentation                                    |
| Destructuring target names   | `const { a, b } = obj` — `target` is null; decomposition is consumer-level |
| Computed property values     | `obj[expr]` — `property` is null; the value is runtime-only                |
| Closure relationships        | Which function closes over which variables                                 |
| Prototype chain              | Object inheritance structure                                               |
| `this` binding               | Runtime context, not extractable at compile time                           |

## Error Handling

```typescript
import ParseError from '../../errors/parse-error.js';
import RuntimeError from '../../errors/runtime-error.js';
import LimitExceededError from '../../errors/limit-exceeded-error.js';

try {
  await record(code, config);
} catch (error) {
  if (error instanceof ParseError) {
    console.log(`Syntax error at line ${error.loc.line}, column ${error.loc.column}`);
  } else if (error instanceof RuntimeError) {
    console.log(`Runtime error: ${error.message}`);
  } else if (error instanceof LimitExceededError) {
    console.log(`Limit exceeded (${error.limit}): ${error.actual}`);
    // error.limit is 'steps' or 'time'
  }
}
```
