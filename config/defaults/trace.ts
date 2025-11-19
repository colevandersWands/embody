/**
 * @file Default configuration for educational execution tracer
 *
 * Provides the complete default configuration values for configuring what appears in the trace array.
 *
 * @see README.md for comprehensive documentation
 */

import { Config } from '../types.js';

/**
 * === PRESET vs GRANULAR RESPONSIBILITY ===
 *
 * This config file defines ALL possible trace events (maximum granularity).
 * Presets (defined elsewhere) create learning progressions by enabling
 * subsets of these options:
 *
 * PROGRESSION EXAMPLE - Understanding Variables:
 *
 * Level 1: "variables-basic"
 *   - Only var/let/const declarations
 *   - Only available/assign/read events
 *   - Mental model: "Variables hold values"
 *
 * Level 2: "variables-hoisting"
 *   - Adds declare event
 *   - Shows var vs let/const differences
 *   - Mental model: "JavaScript reads code twice"
 *
 * Level 3: "variables-tdz"
 *   - Distinguishes declare from available
 *   - Shows temporal dead zone
 *   - Mental model: "let/const have a limbo state"
 *
 * Level 4: "bindings-complete"
 *   - Adds parameters, catch, implicit globals
 *   - Full lifecycle tracking
 *   - Mental model: "Everything that creates a named value"
 *
 * The granular configs below are the "atoms" - presets combine them
 * into "molecules" matching different pedagogical needs.
 */
const defaultConfig: Config = {
  // === PRESET SYSTEM ===
  // presets hide full trace & meta configurations, hard-coded in the /presets directory
  // any additional manual configs will override the preset configs
  presets: 'variables',
  // ? array of presets, which will be merged in the precedence they are listed
  //    or better as an object with preset fields? avoids sneaky trace changes based on sequence
  /* other possible preset options
    behavior, strategy, implementation
    granularity levels
    variables, functions, controlFlow, expressions

  */

  // === META-CONFIGS ===
  // would nesting these be more clear?  pro: semantic grouping, con: nesting

  // will result in trace termination and a warning log entry
  maxIterations: null,
  maxCallstack: null, // simpler to implement than `maxRecursion` (eg. mutual recursion)

  // which selection of code to trace.  should this be flat?
  range: {
    // number -> line, or [num, num] -> [line, char]
    start: 1,
    end: 1000
  },

  timestamps: false, // only helpful when tracing async code

  // === LANGUAGE FEATURES ===

  // Laurent: better term for this?
  semantics: true, // label trace entries as 'statement', 'expression', 'value', or ... other?

  /**
   * === BINDINGS CONFIGURATION ===
   *
   * RESPONSIBILITY BOUNDARY:
   * This granular config provides MAXIMUM detail for all binding types.
   * Presets will selectively enable/disable these options to create
   * progressive learning experiences:
   *
   * PRESET EXAMPLES:
   *
   * "variables" preset (beginner - text-surface intuition):
   *   - declarative: { var: true, let: true, const: true, function: false, import: false }
   *   - implicit: { all false }
   *   - available: true, initialize: true, assign: true
   *   - declare: false (hoisting is "magic" at this level)
   *
   * "scope-aware" preset (intermediate - understands hoisting):
   *   - declarative: { all true }
   *   - implicit: { global: true, others false }
   *   - declare: true (now we explain hoisting)
   *   - Shows TDZ, scope chain
   *
   * "full-bindings" preset (advanced - spec-adjacent):
   *   - All options enabled
   *   - Shows parameters, catch bindings, implicit globals
   *   - Complete lifecycle: declare → available → initialize → assign
   */
  bindings: {
    // --- WHICH bindings to trace (syntactic categories) ---

    // Bindings created with explicit declaration keywords
    // Beginner presets focus on these as "variables"
    declarative: {
      var: true, //
      let: true,
      const: true,
      function: true,
      import: true
    },

    // Bindings created without declaration keywords
    // Hidden in most beginner presets - these are "advanced" concepts
    implicit: {
      global: true,       // x = 5 creates global (often a bug!)
      parameters: true,   // function(param) {} - revealed in "functions" preset
      catch: true         // catch(e) {} - revealed in "error-handling" preset
    },

    /**
     * --- BINDING LIFECYCLE EVENTS ---
     *
     * Different presets reveal different lifecycle granularity:
     *   Beginner sees:    available → assign
     *   Intermediate:     declare → available → assign
     *   Advanced:         declare → available → initialize → assign
     *
     * EVENT TIMELINE EXAMPLES:
     *
     * var x = 5:
     *   Scope entry → declare + available + initialize(undefined)
     *   At line     → assign(5)
     *
     * let y = 5:
     *   Scope entry → declare (enters TDZ)
     *   At line     → available + initialize(5)
     *
     * function foo() {}:
     *   Scope entry → declare + available + initialize(function)
     *
     * parameter:
     *   Function call → available + initialize(argValue)
     *
     * global (x = 5):
     *   At line → available + initialize(5)
     */

    // When binding enters scope (hoisting phase for var/function/let/const)
    // Hidden in beginner presets - hoisting is "behind the curtain"
    declare: true,

    // When binding becomes usable without error
    // Core event for all presets - "when can I use this?"
    available: true,

    // When binding gets its first value
    // - var: initialized to undefined at hoist, then "assigned" at declaration line
    // - function: initialized to function at hoist
    // - let/const: initialized at declaration line (same time as available)
    // - parameters: initialized at function call
    // Beginner presets might hide this distinction
    initialize: true,

    // Subsequent value changes after initialization
    // Essential for all presets - tracking value mutations
    assign: true,

    // When binding value is accessed
    // Essential for all presets - tracking data flow
    read: true,

    filter: [] // if non-empty, trace only these variable names
  },

  // ? should this be under .references ?
  properties: {
    // would this also be triggered by class method definition?
    create: {
      literal: true,
      // interpolated: true,
      computed: true
    },
    access: true,
    remove: true, // because "delete" can't be a key in strict mode
    optionalChaining: true, // obj?.prop

    getters: true,
    setters: true,

    lookup: true, // when the prototype chain is accessed ??? can this be determined and calculated?  This is central enoguh to JS that I want to trace it and ship it with the first version
    // requires some dynamic analysis to know if a propoerty is own or not, but could we do it simply enough by checking an object when it's accessed?  (acknowledging the perfornamce hit of course)
    // how detailed? how to represent? { category: prototype, event: lookup, chain: [this, Array]? }
    // only triggered when propoerty is not found on object _and_ .lookup is set to true

    with: true // Aran only works in strict mode(?), so this is here for funzies
  },

  // !! representing these in trace will be thorny
  references: {
    creation: true,
    access: true,
    mutation: true,

    idPrefix: '',
    circular: true,
    format: 'full' // or 'diff' or 'id' or 'none'
  },

  // placeholder name for now
  // ?? Laurent, are these traceable ??  and how does the des/spre trace-relate to the related declarations?
  // expansions: {
  extractions: {
    destructure: true, // [a, b] = array, {x, y} = object
    spread: true // ...spread operations in calls/literals
  },

  // backlogging if/how to trace built-in data structures
  //  for now can simply trace as:
  //    function call with inputs/outputs as that's how it appears in syntax
  //    and with new operator, as that's also accurate
  // dataStructures: {},

  operators: {
    computing: true, // +, -, *, ==, <, typeof, ++, --, in, instanceof (produce new values)
    selecting: true, // &&, ||, ??, ?: (choose between values)
    mutating: true, // =, +=, ++, -- (change variable state)
    modifiers: true, // new, await, .. is there another operator that modifies behavior like these do?
    comma: true, // separate because it's distinct, and not common

    filter: [] // string representation of operators
  },

  parenthesis: {
    enter: true,
    leave: true
  },

  // is there a more elegant solution than two top-levels?
  templates: true,
  symbols: {
    create: true, // Symbol(), Symbol.for()
    access: true // obj[symbolKey]
  },

  // // is this a contrived category to catch a bunch of things?  not really? they are all syntax that modify behavior beyond sugar
  // // CLAUDE HELP!  I now like the category grouping better, but still don't like the name much
  // syntax: {
  //   // ? LAURENT ?  how does Aran handle template literals?  how much
  //   templateLiterals: true, // somehow label them differently in the trace?
  //   // like a collapsed item with all the expressions in order, evaluating to the final string
  //   destructure: true, // [a, b] = array, {x, y} = object
  //   spread: true // ...spread operations in calls/literals
  // },

  scopes: {
    hoisting: true,
    tdz: true,
    bindings: true, // stores an array of event ids to each declaration in the scope

    global: true,

    // are these 3 sub-options appropriate for function, block and modeul?  or does each ahve different concerns like closures?
    function: {
      create: true,
      enter: true,
      exit: true
    },
    block: {
      create: true,
      enter: true,
      exit: true,
      label: true // because only blocks can be labeled
    },
    module: {
      create: true,
      enter: true,
      exit: true
    },

    closure: {
      creation: true,
      capture: true,
      access: true
    }
  },

  controlFlow: {
    conditionals: true, // if/else test expressions
    loops: {
      while: true, // includes do/while for simplicity
      for: true,
      forOf: true,
      forIn: true,

      iterations: true
    }, // while/for/for...of condition tests
    switch: true, // switch case evaluations
    jumps: true, // break/continue statements

    filter: [] // if non-empty, trace only these control structures
    // coding: same as config keys
  },

  errorHandling: {
    throw: true, // Throw statements

    try: true, // Try block entry
    catch: true, // Catch block entry
    finally: true, // Finally block entry

    callstack: true // Stack trace inclusion
  },

  functions: {
    arguments: true, // the values passed to the call, would be nested in the call entry?
    calls: true, // function invocations: fn(), obj.method()
    definitions: true, // indicate when a function is defined, and list it's attributes:
    // kind: arrow, `function`, method (for class syntax only, not direct .prototype properties)
    //    `function`: named/anonymous, statement/expression
    //    arrow: implicit, explicit (anonymous by default)
    //    method: static, instance
    // extras: async, generator
    // ? common use patterns that can be statically detected, like - iife, or callback

    return: true,
    yield: true, // yield expressions in generators

    this: false, // 'this' reference binding

    builtIn: true, // include built-in functions with the trace
    filter: [] // if non-empty, trace only these function names
  },

  // unsure how feasible these are?

  // do `class`es have enough unique behaviors that they should be configured separately?  (privates, static props, super, extends, static blocks...)  I thnk so?
  // separate question for later: what can actually be determined/traced?
  classes: {
    declaration: true,
    staticBlock: true,
    super: true,
    extends: true // just becomes a field in the declaration
  },

  modules: {
    // most of this would be logged
    imports: true, // import statements and their resolution
    exports: true // export statements
  },

  dynamic: {
    eval: true,
    function: true
  }

  // ?? Laurent, are regex expanded and traceable in more detail than just their result ??
  // regex: true,

  // ?? same, are these extra traceable? or can we see enough with the existing instrumentation?
  // meta: {
  //   proxy: true,
  //   reflect: true
  //   // other?
  // }
};

export default defaultConfig;
