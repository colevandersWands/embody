/**
 * @file Exhaustive preset for educational execution tracer
 * 
 * Everything enabled for deep analysis - advanced configuration
 * Good for: Debugging complex issues, understanding every detail, research scenarios
 * 
 * Features enabled:
 * - All variable operations using boolean shorthand (every detail captured)
 * - All function operations including `this` binding and yield expressions
 * - All control flow constructs with complete coverage
 * - All operator categories (computing, selecting, mutating)
 * - All modern syntax patterns (destructuring, spread)
 * - All data structure operations (read, write)
 * - All scope types including closure operations (creation, capture, access)
 * - All error handling with complete stack traces
 * - All async operations with timestamps for performance analysis
 * - All module operations (imports, exports)
 * - Advanced JavaScript features (prototype lookup, type coercion)
 * 
 * Uses boolean shorthand (true) to enable all options within each category,
 * providing maximum detail for comprehensive program analysis.
 * 
 * Warning: Generates large traces - suitable for small programs or specific debugging.
 * 
 * @see README.md for complete preset documentation
 */

import { Config } from '../types.js';

const exhaustive: Partial<Config> = {
  variables: true, // boolean shorthand enables all variable operations
  functions: true, // boolean shorthand enables all function operations
  instantiation: true,
  controlFlow: true, // boolean shorthand enables all control flow constructs
  operators: true, // boolean shorthand enables all operator categories
  syntax: true, // boolean shorthand enables all modern syntax patterns
  dataStructures: true, // boolean shorthand enables all data structure operations
  scopes: true, // boolean shorthand enables all scope types including closures
  prototypeLookup: true,
  async: true, // boolean shorthand enables all async operations including timestamps
  modules: true, // boolean shorthand enables all module operations
  coercion: true,
  type: 'script',
  errors: true // boolean shorthand enables all error handling features
};

export default exhaustive;