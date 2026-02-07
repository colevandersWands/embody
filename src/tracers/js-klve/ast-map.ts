/**
 * @file Mapping between config keys and AST node types.
 *
 * Based on audit of actual tracer output (23 unique types).
 * Config uses semantic groupings; this maps to literal AST type names.
 */

/**
 * Config path → AST node type mapping.
 * Keys are dot-separated paths matching JsKlveNodeConfig structure.
 */
const CONFIG_TO_AST: Readonly<Record<string, string>> = {
  // declarations
  'declarations.variable': 'VariableDeclaration',

  // loops
  'loops.for': 'ForStatement',
  'loops.while': 'WhileStatement',

  // conditionals
  'conditionals.if': 'IfStatement',
  'conditionals.ternary': 'ConditionalExpression',

  // blocks
  'blocks.try': 'TryStatement',
  'blocks.expressionStatement': 'ExpressionStatement',

  // calls
  'calls.call': 'CallExpression',
  'calls.new': 'NewExpression',

  // access
  'access.member': 'MemberExpression',
  'access.identifier': 'Identifier',

  // operators
  'operators.binary': 'BinaryExpression',
  'operators.unary': 'UnaryExpression',
  'operators.logical': 'LogicalExpression',
  'operators.assignment': 'AssignmentExpression',
  'operators.update': 'UpdateExpression',
  'operators.sequence': 'SequenceExpression',

  // literals
  'literals.numeric': 'NumericLiteral',
  'literals.string': 'StringLiteral',
  'literals.boolean': 'BooleanLiteral',
  'literals.array': 'ArrayExpression',
  'literals.object': 'ObjectExpression',

  // functions
  'functions.arrow': 'ArrowFunctionExpression',
  'functions.expression': 'FunctionExpression',
};

/**
 * AST node type → config path mapping (inverted).
 * Used for O(1) lookup during filtering.
 */
const AST_TO_CONFIG: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(CONFIG_TO_AST).map(([configPath, astType]) => [astType, configPath]),
);

/**
 * All AST node types that the tracer produces.
 * Used for validation and default config generation.
 */
const ALL_AST_TYPES: readonly string[] = Object.values(CONFIG_TO_AST);

export { CONFIG_TO_AST, AST_TO_CONFIG, ALL_AST_TYPES };
