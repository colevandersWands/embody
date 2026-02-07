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

| Error                | Condition                       |
| -------------------- | ------------------------------- |
| `ParseError`         | Syntax errors in the code       |
| `RuntimeError`       | Runtime errors during execution |
| `LimitExceededError` | Trace exceeds `meta.max.steps`  |

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

All options default to `true` (include everything).

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
    console.log(`Too many steps: ${error.actual} > ${config.meta.max.steps}`);
  }
}
```
