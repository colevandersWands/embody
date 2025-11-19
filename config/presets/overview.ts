/**
 * @file Overview preset for educational execution tracer
 *
 * High-level execution flow only - beginner-friendly configuration
 * Good for: Understanding program structure, following main logic
 *
 * Features enabled:
 * - Variable declarations (all types except implicit globals)
 * - Variable assignments (to see data flow)
 * - Function calls and declarations (core execution flow)
 * - Object instantiation (new expressions)
 * - Conditional branching (if/else decisions)
 * - Global, function, and module scopes
 * - Error handling basics (throw/catch)
 * - Basic async operations (await)
 * - Data structure reads (property access)
 *
 * Features disabled:
 * - Variable reads (reduces noise)
 * - Loop conditions and switch statements (too much detail)
 * - Operators (focus on higher-level flow)
 * - Block scopes and closures (advanced concepts)
 * - Modern syntax patterns (spread, destructuring)
 * - Prototype lookups and coercion (advanced concepts)
 *
 * @see README.md for complete preset documentation
 */

import { Config } from '../types.js';

const overview: Partial<Config> = {
  variables: {
    declare: { var: true, let: true, const: true, function: true, implicit: false },
    assign: true,
    read: false,
    filter: []
  },
  functions: {
    calls: true,
    declarations: true,
    returns: false,
    this: false,
    yield: false,
    filter: []
  },
  instantiation: true,
  controlFlow: true,
  operators: false,
  syntax: false,
  dataStructures: { read: true, write: false },
  scopes: {
    global: true,
    functions: true,
    blocks: false,
    modules: true,
    closures: false,
    filter: []
  },
  prototypeLookup: false,
  async: { await: true, timestamps: false },
  modules: true,
  coercion: false,
  type: 'script',
  errors: {
    try: false,
    throw: true,
    catch: true,
    finally: false,
    unhandled: true,
    stackTrace: false
  }
};

export default overview;
