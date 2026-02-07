/**
 * Type declarations for @babel/standalone
 *
 * Defines types for the subset of Babel API used by the tracer.
 */

declare module '@babel/standalone' {
  export interface TransformOptions {
    plugins?: Array<unknown>;
    presets?: Array<unknown>;
    filename?: string;
    sourceType?: 'script' | 'module' | 'unambiguous';
    [key: string]: unknown;
  }

  export interface TransformResult {
    code: string | null;
    map: unknown | null;
    ast: unknown | null;
  }

  export function transform(code: string, options?: TransformOptions): TransformResult;

  export const availablePlugins: Record<string, unknown>;
  export const availablePresets: Record<string, unknown>;

  export function registerPlugin(name: string, plugin: unknown): void;
  export function registerPreset(name: string, preset: unknown): void;

  // Babel types namespace
  export namespace types {
    // Base node types
    interface Node {
      type: string;
      [key: string]: unknown;
    }

    interface Expression extends Node {}
    interface Statement extends Node {}
    interface Pattern extends Node {}

    // Specific node types used by tracer
    interface StringLiteral extends Expression {
      type: 'StringLiteral';
      value: string;
    }

    interface BooleanLiteral extends Expression {
      type: 'BooleanLiteral';
      value: boolean;
    }

    interface NumericLiteral extends Expression {
      type: 'NumericLiteral';
      value: number;
    }

    interface NullLiteral extends Expression {
      type: 'NullLiteral';
    }

    interface Identifier extends Expression, Pattern {
      type: 'Identifier';
      name: string;
    }

    interface ArrayExpression extends Expression {
      type: 'ArrayExpression';
      elements: Array<Expression | null>;
    }

    interface ObjectExpression extends Expression {
      type: 'ObjectExpression';
      properties: Array<ObjectProperty>;
    }

    interface ObjectProperty extends Node {
      type: 'ObjectProperty';
      key: Expression;
      value: Expression;
    }

    interface CallExpression extends Expression {
      type: 'CallExpression';
      callee: Expression;
      arguments: Array<Expression>;
    }

    interface MemberExpression extends Expression {
      type: 'MemberExpression';
      object: Expression;
      property: Expression;
      computed: boolean;
    }

    interface AssignmentExpression extends Expression {
      type: 'AssignmentExpression';
      operator: string;
      left: Expression | Pattern;
      right: Expression;
    }

    interface BinaryExpression extends Expression {
      type: 'BinaryExpression';
      operator: string;
      left: Expression;
      right: Expression;
    }

    interface UnaryExpression extends Expression {
      type: 'UnaryExpression';
      operator: string;
      argument: Expression;
      prefix: boolean;
    }

    interface SequenceExpression extends Expression {
      type: 'SequenceExpression';
      expressions: Array<Expression>;
    }

    interface ThisExpression extends Expression {
      type: 'ThisExpression';
    }

    interface ArrowFunctionExpression extends Expression {
      type: 'ArrowFunctionExpression';
      params: Array<Pattern>;
      body: Expression | BlockStatement;
    }

    interface FunctionExpression extends Expression {
      type: 'FunctionExpression';
      id: Identifier | null;
      params: Array<Pattern>;
      body: BlockStatement;
    }

    interface BlockStatement extends Statement {
      type: 'BlockStatement';
      body: Array<Statement>;
    }

    interface ExpressionStatement extends Statement {
      type: 'ExpressionStatement';
      expression: Expression;
    }

    interface ReturnStatement extends Statement {
      type: 'ReturnStatement';
      argument: Expression | null;
    }

    interface IfStatement extends Statement {
      type: 'IfStatement';
      test: Expression;
      consequent: Statement;
      alternate: Statement | null;
    }

    interface WhileStatement extends Statement {
      type: 'WhileStatement';
      test: Expression;
      body: Statement;
    }

    interface ForStatement extends Statement {
      type: 'ForStatement';
      init: Expression | Statement | null;
      test: Expression | null;
      update: Expression | null;
      body: Statement;
    }

    interface BreakStatement extends Statement {
      type: 'BreakStatement';
    }

    interface TryStatement extends Statement {
      type: 'TryStatement';
      block: BlockStatement;
      handler: CatchClause | null;
      finalizer: BlockStatement | null;
    }

    interface CatchClause extends Node {
      type: 'CatchClause';
      param: Pattern | null;
      body: BlockStatement;
    }

    interface VariableDeclaration extends Statement {
      type: 'VariableDeclaration';
    }

    interface FunctionDeclaration extends Statement {
      type: 'FunctionDeclaration';
    }

    interface UpdateExpression extends Expression {
      type: 'UpdateExpression';
      operator: '++' | '--';
      argument: Expression;
      prefix: boolean;
    }

    // LVal is any valid left-hand side of an assignment
    type LVal = Identifier | MemberExpression | Pattern;

    // Builder functions
    function stringLiteral(value: string): StringLiteral;
    function booleanLiteral(value: boolean): BooleanLiteral;
    function numericLiteral(value: number): NumericLiteral;
    function nullLiteral(): NullLiteral;
    function identifier(name: string): Identifier;
    function arrayExpression(elements?: Array<Expression | null>): ArrayExpression;
    function objectExpression(properties?: Array<ObjectProperty>): ObjectExpression;
    function objectProperty(
      key: Expression,
      value: Expression,
      computed?: boolean,
      shorthand?: boolean,
    ): ObjectProperty;
    function callExpression(callee: Expression, args?: Array<Expression>): CallExpression;
    function memberExpression(
      object: Expression,
      property: Expression,
      computed?: boolean,
    ): MemberExpression;
    function assignmentExpression(
      operator: string,
      left: Expression | Pattern,
      right: Expression,
    ): AssignmentExpression;
    function binaryExpression(
      operator: string,
      left: Expression,
      right: Expression,
    ): BinaryExpression;
    function unaryExpression(
      operator: string,
      argument: Expression,
      prefix?: boolean,
    ): UnaryExpression;
    function sequenceExpression(expressions: Array<Expression>): SequenceExpression;
    function thisExpression(): ThisExpression;
    function arrowFunctionExpression(
      params: Array<Pattern>,
      body: Expression | BlockStatement,
    ): ArrowFunctionExpression;
    function functionExpression(
      id: Identifier | null,
      params: Array<Pattern>,
      body: BlockStatement,
    ): FunctionExpression;
    function blockStatement(body?: Array<Statement>): BlockStatement;
    function expressionStatement(expression: Expression): ExpressionStatement;
    function returnStatement(argument?: Expression | null): ReturnStatement;
    function ifStatement(
      test: Expression,
      consequent: Statement,
      alternate?: Statement | null,
    ): IfStatement;
    function whileStatement(test: Expression, body: Statement): WhileStatement;
    function forStatement(
      init: Expression | Statement | null,
      test: Expression | null,
      update: Expression | null,
      body: Statement,
    ): ForStatement;
    function breakStatement(): BreakStatement;
    function tryStatement(
      block: BlockStatement,
      handler?: CatchClause | null,
      finalizer?: BlockStatement | null,
    ): TryStatement;
    function catchClause(param: Pattern | null, body: BlockStatement): CatchClause;

    // Type guards
    function isExpression(node: Node | null | undefined): node is Expression;
    function isMemberExpression(node: Node | null | undefined): node is MemberExpression;
    function isFunctionDeclaration(node: Node | null | undefined): node is FunctionDeclaration;
    function isForStatement(node: Node | null | undefined): node is ForStatement;
    function isWhileStatement(node: Node | null | undefined): node is WhileStatement;
    function isBlockStatement(node: Node | null | undefined): node is BlockStatement;
    function isReturnStatement(node: Node | null | undefined): node is ReturnStatement;
    function isVariableDeclaration(node: Node | null | undefined): node is VariableDeclaration;
    function isAssignmentExpression(node: Node | null | undefined): node is AssignmentExpression;
    function isCallExpression(node: Node | null | undefined): node is CallExpression;
    function isUpdateExpression(node: Node | null | undefined): node is UpdateExpression;
  }
}
