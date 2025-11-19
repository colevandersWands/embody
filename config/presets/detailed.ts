/**
 * @file Detailed preset for educational execution tracer
 * 
 * Balanced granularity configuration - intermediate analysis (default preset)
 * Good for: Most educational scenarios, debugging, step-through execution
 * 
 * Features enabled:
 * - Full variable operations (declare, assign, read including implicit globals)
 * - Complete function tracing (calls, declarations, returns, yield)
 * - All control flow constructs (conditionals, loops, switches, breaks)
 * - Computing, selecting, and mutating operators
 * - Modern syntax patterns (destructuring enabled, spread disabled)
 * - Complete data structure operations (read and write)
 * - Global, function, block, and module scopes (closures disabled)
 * - Comprehensive error handling with stack traces
 * - Async operations without timestamps
 * - Module operations enabled
 * 
 * Features disabled:
 * - `this` binding (advanced concept)
 * - Closure operations (advanced - creation, capture, access)
 * - Spread syntax (noise for intermediate level)
 * - Prototype lookup and coercion (advanced concepts)
 * - Async timestamps (performance consideration)
 * 
 * Provides balanced detail without overwhelming intermediate learners.
 * 
 * @see README.md for complete preset documentation
 */

import { Config } from '../types.js';

const detailed: Partial<Config> = {
  variables: { 
    declare: { var: true, let: true, const: true, function: true, implicit: true },
    assign: true, 
    read: true, 
    filter: [] 
  },
  functions: {
    calls: true,
    declarations: true,
    returns: true,
    this: false,
    yield: true,
    filter: []
  },
  instantiation: true,
  controlFlow: { conditionals: true, loops: true, switches: true, breaks: true, filter: [] },
  operators: { computing: true, selecting: true, mutating: true, filter: [] },
  syntax: { destructuring: true, spread: false },
  dataStructures: { read: true, write: true },
  scopes: { 
    global: true, 
    functions: true, 
    blocks: true, 
    modules: true,
    closures: { creation: false, capture: false, access: false },
    filter: [] 
  },
  prototypeLookup: false,
  async: { await: true, timestamps: false },
  modules: true,
  coercion: false,
  type: 'script',
  errors: {
    try: true,
    throw: true,
    catch: true,
    finally: true,
    unhandled: true,
    stackTrace: true
  }
};

export default detailed;