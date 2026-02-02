/**
 * @file TypeScript type definitions for educational execution tracer configuration
 *
 * This module defines the complete type system for the configuration system,
 * including the two-layer structure (meta + lang) and all nested sub-types.
 *
 * @see README.md for comprehensive documentation and usage examples
 */

/**
 * Available preset names for educational scenarios
 * - 'overview': Beginner-friendly, minimal noise
 * - 'detailed': Intermediate analysis, balanced detail (default)
 * - 'exhaustive': Advanced analysis, maximum information
 */
export type PresetName = 'overview' | 'detailed' | 'exhaustive';

/**
 * Meta configuration - controls trace output format and limits
 *
 * These settings control how trace data is formatted and what metadata
 * is included, rather than what language features are traced.
 */
export type MetaConfig = {
  readonly default?: null | boolean; // When set to boolean, all meta fields default to this value
  readonly maxIterations?: number | null; // Limit loop iterations (prevents infinite loops)
  readonly maxCallstack?: number | null; // Limit call stack depth (prevents infinite recursion)
  readonly index?: boolean; // Include numbered indexes for trace entries
  readonly range?: {
    // Code range to trace
    readonly start: number; // Starting line number
    readonly end: number; // Ending line number
  };
  readonly location?: 'line' | 'full' | false; // Source location format: line only, [line,col], or none
  readonly ast?: boolean; // Include AST and path to node for each entry
  readonly data?: {
    // Control what value data is included
    readonly type: boolean; // Include JavaScript type (string, number, etc.)
    readonly instance: boolean; // Include constructor/class info
    readonly value: boolean; // Include actual value
    readonly lookup: boolean; // Include prototype chain lookup details
  };
  readonly references?: boolean; // Include reference type information
  readonly debug?: {
    // Debugging information (not for learners)
    readonly configPath: boolean; // Path to config option that caused this trace
    readonly AranNodeId: boolean; // Internal Aran node identifier
    readonly adviceName: boolean; // Name of advice function that generated trace
  };
  readonly timestamps?: boolean; // Include timestamps (mainly for async tracing)
};

/**
 * Language configuration - all JavaScript language features that can be traced
 *
 * This is the main configuration section containing all language constructs
 * and operations that can appear in the execution trace.
 */
export type LangConfig = {
  readonly semantics?: boolean; // Label trace entries as 'statement', 'expression', 'value', etc.

  readonly bindings?: {
    // Variable/binding operations
    readonly kind?: {
      readonly declarative?: {
        // Keyword-based declarations
        readonly var?: boolean;
        readonly let?: boolean;
        readonly const?: boolean;
        readonly function?: boolean;
        readonly class?: boolean;
        readonly import?: boolean;
      };
      readonly explicit?: {
        // Named but no keyword
        readonly parameters?: boolean; // Function parameters
        readonly catch?: boolean; // Catch block parameter
      };
      readonly implicit?: {
        // Created without declaration
        readonly global?: boolean; // x = 5 creates global
        readonly arguments?: boolean; // arguments object
        readonly callee?: boolean;
        readonly this?: boolean;
        readonly newTarget?: boolean; // new.target
        readonly super?: boolean;
        readonly importMeta?: boolean; // import.meta
      };
      readonly with?: boolean; // with statement bindings
    };
    readonly events?: {
      // Binding lifecycle events
      readonly declare?: boolean; // When binding enters scope
      readonly available?: boolean; // When binding becomes accessible
      readonly initialize?: boolean; // Initial value assignment
      readonly implicit?: boolean; // Implicit initialization
      readonly assign?: boolean; // Value changes
      readonly read?: boolean; // Value access
    };
    readonly filter?: {
      // Filter by variable name
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };

  readonly properties?: {
    // Property operations on objects
    readonly create?: {
      readonly literal?: boolean; // { prop: value }
      readonly computed?: boolean; // { [expr]: value }
      readonly method?: boolean; // { method() {} }
      readonly accessors?: {
        readonly getters?: boolean; // { get prop() {} }
        readonly setters?: boolean; // { set prop(v) {} }
      };
      readonly class?: boolean; // Class properties
      readonly static?: boolean; // Static class properties
      readonly private?: boolean; // Private class fields
      readonly fields?: boolean; // Class fields with initial values
    };
    readonly access?: boolean; // obj.prop, obj['prop']
    readonly update?: boolean; // obj.prop = value
    readonly remove?: boolean; // delete obj.prop
    readonly optionalChaining?: boolean; // obj?.prop
    readonly lookup?: boolean; // Prototype chain traversal
    readonly filter?: readonly string[]; // Filter by property name
  };

  readonly references?: {
    // Reference type operations
    readonly create?: boolean; // Creating objects/arrays
    readonly access?: boolean; // Accessing reference values
    readonly mutate?: boolean; // Modifying reference values
  };

  readonly operators?: {
    // JavaScript operators
    readonly pure?: boolean; // Non-mutating operators
    readonly mutating?: boolean; // Assignment operators
    readonly shortCircuiting?: boolean; // &&, ||, ??
    readonly comma?: boolean; // Comma operator
    readonly coercion?: boolean; // Type coercion tracking
    readonly filter?: {
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };
  readonly parenthesis?: {
    // Parenthesis tracking
    readonly enter?: boolean; // Entering parenthesized expression
    readonly leave?: boolean; // Leaving parenthesized expression
  };

  readonly templates?: {
    // Template literals
    readonly literal?: boolean; // `string ${expr}`
    readonly tagged?: boolean; // tag`string ${expr}`
  };

  readonly symbols?: {
    // Symbol operations
    readonly create?: boolean; // Symbol(), Symbol.for()
    readonly access?: boolean; // Accessing symbol properties
  };

  readonly matching?: {
    // Destructuring and spread operations
    readonly read?: {
      readonly spread?: boolean; // ...rest in destructuring
    };
    readonly assign?: {
      readonly destructure?: boolean; // {a, b} = obj, [x, y] = arr
      readonly rest?: boolean; // ...rest in patterns
      readonly defaultValues?: boolean; // {a = 5} = obj
    };
  };

  readonly scopes?: {
    // Scope tracking
    readonly kind?: {
      readonly script?: boolean; // Top-level script scope
      readonly function?: boolean; // Function scope
      readonly block?: boolean; // Block scope
      readonly module?: boolean; // Module scope
      readonly closure?: boolean; // Closure scope
    };
    readonly events?: {
      readonly create?: boolean; // Scope creation
      readonly enter?: boolean; // Entering scope
      readonly interrupt?: boolean; // Scope interruption (exceptions)
      readonly completion?: boolean; // Normal scope completion
      readonly leave?: boolean; // Leaving scope
    };
  };

  readonly controlFlow?: {
    // Control flow constructs
    readonly kind?: {
      readonly conditionals?: boolean; // if/else
      readonly loops?: {
        readonly while?: boolean; // while loops
        readonly for?: {
          readonly initialize?: boolean; // for loop init
          readonly test?: boolean; // for loop condition
          readonly increment?: boolean; // for loop update
        };
        readonly forOf?: boolean; // for...of loops
        readonly forIn?: boolean; // for...in loops
      };
      readonly switch?: boolean; // switch statements
    };
    readonly events?: {
      readonly test?: boolean; // Condition evaluation
      readonly branch?: boolean; // Branch taken
      readonly iteration?: boolean; // Loop iteration
      readonly jump?: boolean; // break/continue
    };
    readonly filter?: {
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };

  readonly errorHandling?: {
    // Error handling
    readonly throw?: boolean; // throw statements
    readonly try?: boolean; // try blocks
    readonly catch?: boolean; // catch blocks
    readonly finally?: boolean; // finally blocks
    readonly callstack?: boolean; // Include call stack info
  };

  readonly functions?: {
    // Function operations
    readonly kind?: {
      readonly arrow?: boolean; // Arrow functions
      readonly function?: boolean; // Regular functions
      readonly method?: boolean; // Object methods
      readonly generator?: boolean; // Generator functions
      readonly builtIn?: boolean; // Built-in functions
    };
    readonly events?: {
      readonly definition?: boolean; // Function definition
      readonly call?: {
        readonly arguments?: boolean; // Track arguments
      };
      readonly construct?: boolean; // new Function()
      readonly return?: boolean; // Return statements
      readonly coroutines?: {
        readonly await?: boolean; // await expressions
        readonly yield?: boolean; // yield expressions
        readonly yieldDelegate?: boolean; // yield* delegation
      };
    };
    readonly filter?: {
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };

  readonly classes?: {
    // Class-specific features
    readonly staticBlock?: boolean; // static {} blocks
  };

  readonly modules?: {
    // Module operations
    readonly imports?: {
      readonly named?: boolean; // import { x }
      readonly default?: boolean; // import x
    };
    readonly exports?: {
      readonly named?: boolean; // export { x }
      readonly default?: boolean; // export default
    };
    readonly load?: boolean; // Module loading events
    readonly await?: boolean; // Top-level await
  };

  readonly dynamic?: {
    // Dynamic code evaluation
    readonly eval?: boolean; // eval() calls
    readonly function?: boolean; // new Function()
  };

  readonly regex?: boolean; // Regular expressions

  readonly meta?: {
    // Meta-programming features
    readonly proxy?: boolean; // Proxy operations
    readonly reflect?: boolean; // Reflect operations
  };
};

/**
 * Main configuration interface - combines meta settings (output format)
 * with lang settings (what language features to trace).
 *
 * The system uses graceful degradation: invalid values are handled gracefully,
 * boolean shorthand is expanded, and missing fields are filled from defaults.
 */
export type Config = {
  readonly presets?: PresetName | readonly PresetName[]; // Single preset or array of presets
  readonly meta?: MetaConfig; // Trace output format and limits
  readonly lang?: LangConfig; // Language features to trace
};

/**
 * Configuration after all defaults have been applied and shorthand expanded.
 *
 * Structurally identical to Config, but semantically indicates processing complete.
 * Use this type when you need to guarantee the config has been through fillConfig.
 */
export type ExpandedConfig = Config;

/**
 * User-provided configuration (partial)
 *
 * Represents the configuration as provided by users, where all fields are optional.
 * This allows users to specify only the parts they want to customize, with
 * defaults filling in the rest.
 *
 * @example
 * ```typescript
 * const userConfig: UserConfig = {
 *   presets: 'overview',
 *   lang: {
 *     bindings: { filter: { include: ['result'] } }
 *   }
 * };
 * ```
 */
export type UserConfig = Partial<Config>;

/**
 * Preset definitions mapping
 *
 * Maps preset names to their corresponding partial configurations.
 * Each preset provides a different balance of detail vs. noise for educational scenarios.
 */
export type Presets = Record<PresetName, Partial<Config>>;
