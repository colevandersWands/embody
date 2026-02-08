/**
 * @file Type definitions for js-klve tracer.
 */

// === Source Location ===

/**
 * ESTree-compatible source location.
 * Line is 1-indexed, column is 0-indexed.
 */
export type SourceLocation = {
  readonly start: { readonly line: number; readonly column: number };
  readonly end: { readonly line: number; readonly column: number };
};

// === Value Serialization ===

/**
 * Primitive value descriptor.
 */
export type PrimitiveDescriptor =
  | { readonly category: 'primitive'; readonly type: 'string'; readonly value: string }
  | { readonly category: 'primitive'; readonly type: 'boolean'; readonly value: boolean }
  | { readonly category: 'primitive'; readonly type: 'number'; readonly value: number }
  | { readonly category: 'primitive'; readonly type: 'null'; readonly value: null }
  | { readonly category: 'primitive'; readonly type: 'undefined'; readonly value: undefined }
  | { readonly category: 'primitive'; readonly type: 'symbol'; readonly str: string };

/**
 * Compound value descriptor (reference to heap).
 */
export type CompoundDescriptor = {
  readonly category: 'compound';
  readonly at: number;
};

/**
 * Value descriptor node (either primitive or compound).
 */
export type ValueDescriptor = PrimitiveDescriptor | CompoundDescriptor;

/**
 * Heap object for compound values.
 */
export type HeapObject = {
  readonly type: 'object' | 'function' | 'promise' | 'array';
  readonly entries: readonly (readonly [string, ValueDescriptor])[];
  readonly length?: number;
  readonly cname?: string;
};

/**
 * Described value as [descriptor, heap] tuple.
 */
export type DescribedValue = readonly [ValueDescriptor, readonly HeapObject[]];

// === Step Detail (AST metadata) ===

/**
 * Node-type-specific AST metadata included in trace steps.
 * Contains static properties from the AST node (known at compile time).
 * Present on all non-init steps. `action` is always set.
 */
export type JsKlveDetail = {
  readonly action: string;
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

// === Raw Step (from tracer) ===

/**
 * Raw step as produced by the tracer before filtering.
 */
export type RawStep = {
  readonly step: number;
  readonly category: 'init' | 'statement' | 'expression';
  readonly type?: string;
  readonly time?: 'before' | 'after';
  readonly dt?: number;
  readonly loc?: SourceLocation;
  readonly scopes?: readonly Record<string, unknown>[];
  readonly value?: unknown;
  readonly logs?: readonly (readonly unknown[])[];
  readonly detail?: JsKlveDetail;
};

// === Filter Configuration ===

/**
 * Node filter configuration.
 * Grouped semantically, keys map to AST types via ast-map.ts.
 *
 * Based on audit of actual tracer output (23 unique types).
 */
export type JsKlveNodeConfig = {
  readonly declarations?: {
    readonly variable?: boolean; // → VariableDeclaration
  };

  readonly loops?: {
    readonly for?: boolean; // → ForStatement
    readonly while?: boolean; // → WhileStatement
  };

  readonly conditionals?: {
    readonly if?: boolean; // → IfStatement
    readonly ternary?: boolean; // → ConditionalExpression
  };

  readonly blocks?: {
    readonly try?: boolean; // → TryStatement
    readonly expressionStatement?: boolean; // → ExpressionStatement
  };

  readonly calls?: {
    readonly call?: boolean; // → CallExpression
    readonly new?: boolean; // → NewExpression
  };

  readonly access?: {
    readonly member?: boolean; // → MemberExpression
    readonly identifier?: boolean; // → Identifier
  };

  readonly operators?: {
    readonly binary?: boolean; // → BinaryExpression
    readonly unary?: boolean; // → UnaryExpression
    readonly logical?: boolean; // → LogicalExpression
    readonly assignment?: boolean; // → AssignmentExpression
    readonly update?: boolean; // → UpdateExpression
    readonly sequence?: boolean; // → SequenceExpression
  };

  readonly literals?: {
    readonly numeric?: boolean; // → NumericLiteral
    readonly string?: boolean; // → StringLiteral
    readonly boolean?: boolean; // → BooleanLiteral
    readonly array?: boolean; // → ArrayExpression
    readonly object?: boolean; // → ObjectExpression
  };

  readonly functions?: {
    readonly arrow?: boolean; // → ArrowFunctionExpression
    readonly expression?: boolean; // → FunctionExpression
  };
};

/**
 * Name-based step filtering.
 * include: whitelist — only keep steps mentioning these names.
 * exclude: blacklist — remove steps mentioning these names.
 * Mutually exclusive: if both provided, include wins.
 * Nameless steps (ForStatement, literals, etc.) always pass through.
 */
export type JsKlveNameConfig = {
  readonly include?: readonly string[];
  readonly exclude?: readonly string[];
};

/**
 * Filter configuration for post-trace filtering.
 */
export type JsKlveFilterConfig = {
  readonly nodes?: JsKlveNodeConfig;

  readonly names?: JsKlveNameConfig;

  readonly timing?: {
    readonly before?: boolean;
    readonly after?: boolean;
  };

  readonly data?: {
    readonly scopes?: boolean;
    readonly value?: boolean;
    readonly logs?: boolean;
    readonly dt?: boolean;
    readonly loc?: boolean;
  };
};

/**
 * Options for js-klve tracer.
 */
export type JsKlveOptions = {
  readonly filter?: JsKlveFilterConfig;
};

// === Output Step (after filtering) ===

/**
 * Filtered step as returned by record().
 * Extends StepCore from parent embody types.
 */
export type JsKlveStep = {
  readonly step: number;
  readonly category: 'init' | 'statement' | 'expression';
  readonly type?: string;
  readonly time?: 'before' | 'after';
  readonly dt?: number;
  readonly loc?: SourceLocation;
  readonly scopes?: readonly Record<string, unknown>[];
  readonly value?: unknown;
  readonly logs?: readonly (readonly unknown[])[];
  readonly detail?: JsKlveDetail;
};
