/**
 * @file TypeScript type definitions for educational execution tracer configuration
 * 
 * This module defines the complete type system for the configuration system,
 * including interfaces for all configuration sections, utility types, and
 * the main configuration interfaces used throughout the system.
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
 * Variable declaration configuration - different behaviors for teaching scope/hoisting
 * 
 * Each declaration type has distinct behaviors crucial for educational scenarios:
 * - var: Function-scoped, hoisted as undefined
 * - let: Block-scoped, temporal dead zone behavior
 * - const: Block-scoped, immutable binding
 * - function: Hoisted completely (both declaration and definition)
 * - implicit: Creates global variables without declaration (x = 5)
 */
export type DeclareConfig = {
  readonly var: boolean;      // var x = 5 (function-scoped, hoisted as undefined)
  readonly let: boolean;      // let x = 5 (block-scoped, temporal dead zone)
  readonly const: boolean;    // const x = 5 (block-scoped, immutable binding)
  readonly function: boolean; // function f() {} (hoisted completely)
  readonly implicit: boolean; // x = 5 (without declaration, creates global)
}

/**
 * Variable operations configuration - the foundation of programming literacy
 * 
 * Tracks variable operations including declarations, assignments, and reads.
 * Supports boolean shorthand: `variables: true` enables all operations.
 */
export type VariablesConfig = {
  readonly declare: DeclareConfig | boolean; // Variable declarations (supports nested boolean shorthand)
  readonly assign: boolean;                  // Variable assignments (x = 10, x += 5)
  readonly read: boolean;                    // Variable reads (console.log(x), return x)
  readonly filter: readonly string[];                 // If non-empty, trace only these variable names
}

/**
 * Function operations configuration - control flow and abstraction
 * 
 * Monitors function-related operations including calls, declarations, and returns.
 * Supports boolean shorthand: `functions: true` enables all operations.
 */
export type FunctionsConfig = {
  readonly calls: boolean;        // Function invocations: fn(), obj.method()
  readonly declarations: boolean; // Function definitions: function() {}, () => {}
  readonly returns: boolean;      // Return values and completion values
  readonly this: boolean;         // 'this' binding (advanced concept)
  readonly yield: boolean;        // Yield expressions in generators
  readonly filter: readonly string[];      // If non-empty, trace only these function names
}

/**
 * Control flow operations configuration - branching and looping logic
 * 
 * Traces control flow constructs that alter program execution flow.
 * Supports boolean shorthand: `controlFlow: true` enables all constructs.
 */
export type ControlFlowConfig = {
  readonly conditionals: boolean; // if/else test expressions
  readonly loops: boolean;        // while/for condition tests
  readonly switches: boolean;     // switch case evaluations
  readonly breaks: boolean;       // break/continue statements
  readonly filter: readonly string[];      // If non-empty, trace only these control structures
}

/**
 * Operators configuration - grouped by interaction with values and memory
 * 
 * Educational grouping shows how operators interact with values:
 * - computing: Calculate new values (+, -, *, ==, <, typeof, ++, --)
 * - selecting: Choose between existing values (&&, ||, ??, ?., ?:)
 * - mutating: Change variable state (=, +=, ++, --)
 * 
 * Note: Increment operators (++/--) trigger both computing AND mutating,
 * demonstrating the difference between ++i and i++.
 * 
 * Supports boolean shorthand: `operators: true` enables all categories.
 */
export type OperatorsConfig = {
  readonly computing: boolean; // +, -, *, ==, <, typeof, ++, -- (calculate new values)
  readonly selecting: boolean; // &&, ||, ??, ?., ?: (choose between existing values)
  readonly mutating: boolean;  // =, +=, ++, -- (change variable state)
  readonly filter: readonly string[];   // If non-empty, trace only these operator types
}

// SyntaxConfig interface removed - inlined (was only 2 fields)

// DataStructuresConfig interface removed - inlined (was only 2 fields)

/**
 * Meta configuration - controls trace output format and limits
 *
 * These settings control how trace data is formatted and what metadata
 * is included, rather than what language features are traced.
 */
export type MetaConfig = {
  readonly default?: null | boolean;           // When set to boolean, all meta fields default to this value
  readonly maxIterations?: number | null;      // Limit loop iterations (prevents infinite loops)
  readonly maxCallstack?: number | null;       // Limit call stack depth (prevents infinite recursion)
  readonly index?: boolean;                    // Include numbered indexes for trace entries
  readonly range?: {                          // Code range to trace
    readonly start: number;                   // Starting line number
    readonly end: number;                     // Ending line number
  };
  readonly location?: 'line' | 'full' | false; // Source location format: line only, [line,col], or none
  readonly ast?: boolean;                      // Include AST and path to node for each entry
  readonly data?: {                           // Control what value data is included
    readonly type: boolean;                   // Include JavaScript type (string, number, etc.)
    readonly instance: boolean;               // Include constructor/class info
    readonly value: boolean;                  // Include actual value
    readonly lookup: boolean;                 // Include prototype chain lookup details
  };
  readonly references?: boolean;               // Include reference type information
  readonly debug?: {                          // Debugging information (not for learners)
    readonly configPath: boolean;             // Path to config option that caused this trace
    readonly AranNodeId: boolean;             // Internal Aran node identifier
    readonly adviceName: boolean;             // Name of advice function that generated trace
  };
  readonly timestamps?: boolean;               // Include timestamps (mainly for async tracing)
}

/**
 * Language configuration - all JavaScript language features that can be traced
 *
 * This is the main configuration section containing all language constructs
 * and operations that can appear in the execution trace.
 */
export type LangConfig = {
  readonly semantics?: boolean;                // Label trace entries as 'statement', 'expression', 'value', etc.

  readonly bindings?: {                       // Variable/binding operations
    readonly kind?: {
      readonly declarative?: {                // Keyword-based declarations
        readonly var?: boolean;
        readonly let?: boolean;
        readonly const?: boolean;
        readonly function?: boolean;
        readonly class?: boolean;
        readonly import?: boolean;
      };
      readonly explicit?: {                   // Named but no keyword
        readonly parameters?: boolean;        // Function parameters
        readonly catch?: boolean;            // Catch block parameter
      };
      readonly implicit?: {                   // Created without declaration
        readonly global?: boolean;            // x = 5 creates global
        readonly arguments?: boolean;         // arguments object
        readonly callee?: boolean;
        readonly this?: boolean;
        readonly newTarget?: boolean;         // new.target
        readonly super?: boolean;
        readonly importMeta?: boolean;        // import.meta
      };
      readonly with?: boolean;               // with statement bindings
    };
    readonly events?: {                       // Binding lifecycle events
      readonly declare?: boolean;            // When binding enters scope
      readonly available?: boolean;          // When binding becomes accessible
      readonly initialize?: boolean;         // Initial value assignment
      readonly implicit?: boolean;           // Implicit initialization
      readonly assign?: boolean;             // Value changes
      readonly read?: boolean;              // Value access
    };
    readonly filter?: {                      // Filter by variable name
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };

  readonly properties?: {                     // Property operations on objects
    readonly create?: {
      readonly literal?: boolean;              // { prop: value }
      readonly computed?: boolean;             // { [expr]: value }
      readonly method?: boolean;               // { method() {} }
      readonly accessors?: {
        readonly getters?: boolean;            // { get prop() {} }
        readonly setters?: boolean;            // { set prop(v) {} }
      };
      readonly class?: boolean;                // Class properties
      readonly static?: boolean;               // Static class properties
      readonly private?: boolean;              // Private class fields
      readonly fields?: boolean;               // Class fields with initial values
    };
    readonly access?: boolean;                 // obj.prop, obj['prop']
    readonly update?: boolean;                 // obj.prop = value
    readonly remove?: boolean;                 // delete obj.prop
    readonly optionalChaining?: boolean;       // obj?.prop
    readonly lookup?: boolean;                 // Prototype chain traversal
    readonly filter?: readonly string[];                // Filter by property name
  };

  readonly references?: {                      // Reference type operations
    readonly create?: boolean;                 // Creating objects/arrays
    readonly access?: boolean;                 // Accessing reference values
    readonly mutate?: boolean;                 // Modifying reference values
  };

  readonly operators?: {                       // JavaScript operators
    readonly pure?: boolean;                   // Non-mutating operators
    readonly mutating?: boolean;               // Assignment operators
    readonly shortCircuiting?: boolean;        // &&, ||, ??
    readonly comma?: boolean;                  // Comma operator
    readonly coercion?: boolean;               // Type coercion tracking
    readonly filter?: {
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };
  readonly parenthesis?: {                     // Parenthesis tracking
    readonly enter?: boolean;                  // Entering parenthesized expression
    readonly leave?: boolean;                  // Leaving parenthesized expression
  };

  readonly templates?: {                       // Template literals
    readonly literal?: boolean;                // `string ${expr}`
    readonly tagged?: boolean;                 // tag`string ${expr}`
  };

  readonly symbols?: {                         // Symbol operations
    readonly create?: boolean;                 // Symbol(), Symbol.for()
    readonly access?: boolean;                 // Accessing symbol properties
  };

  readonly matching?: {                        // Destructuring and spread operations
    readonly read?: {
      readonly spread?: boolean;               // ...rest in destructuring
    };
    readonly assign?: {
      readonly destructure?: boolean;          // {a, b} = obj, [x, y] = arr
      readonly rest?: boolean;                 // ...rest in patterns
      readonly defaultValues?: boolean;        // {a = 5} = obj
    };
  };

  readonly scopes?: {                          // Scope tracking
    readonly kind?: {
      readonly script?: boolean;               // Top-level script scope
      readonly function?: boolean;             // Function scope
      readonly block?: boolean;                // Block scope
      readonly module?: boolean;               // Module scope
      readonly closure?: boolean;              // Closure scope
    };
    readonly events?: {
      readonly create?: boolean;               // Scope creation
      readonly enter?: boolean;                // Entering scope
      readonly interrupt?: boolean;            // Scope interruption (exceptions)
      readonly completion?: boolean;           // Normal scope completion
      readonly leave?: boolean;                // Leaving scope
    };
  };

  readonly controlFlow?: {                     // Control flow constructs
    readonly kind?: {
      readonly conditionals?: boolean;         // if/else
      readonly loops?: {
        readonly while?: boolean;              // while loops
        readonly for?: {
          readonly initialize?: boolean;       // for loop init
          readonly test?: boolean;            // for loop condition
          readonly increment?: boolean;       // for loop update
        };
        readonly forOf?: boolean;              // for...of loops
        readonly forIn?: boolean;              // for...in loops
      };
      readonly switch?: boolean;               // switch statements
    };
    readonly events?: {
      readonly test?: boolean;                 // Condition evaluation
      readonly branch?: boolean;               // Branch taken
      readonly iteration?: boolean;            // Loop iteration
      readonly jump?: boolean;                 // break/continue
    };
    readonly filter?: {
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };

  readonly errorHandling?: {                   // Error handling
    readonly throw?: boolean;                  // throw statements
    readonly try?: boolean;                    // try blocks
    readonly catch?: boolean;                  // catch blocks
    readonly finally?: boolean;                // finally blocks
    readonly callstack?: boolean;              // Include call stack info
  };

  readonly functions?: {                       // Function operations
    readonly kind?: {
      readonly arrow?: boolean;                // Arrow functions
      readonly function?: boolean;             // Regular functions
      readonly method?: boolean;               // Object methods
      readonly generator?: boolean;            // Generator functions
      readonly builtIn?: boolean;              // Built-in functions
    };
    readonly events?: {
      readonly definition?: boolean;           // Function definition
      readonly call?: {
        readonly arguments?: boolean;          // Track arguments
      };
      readonly construct?: boolean;            // new Function()
      readonly return?: boolean;               // Return statements
      readonly coroutines?: {
        readonly await?: boolean;              // await expressions
        readonly yield?: boolean;              // yield expressions
        readonly yieldDelegate?: boolean;      // yield* delegation
      };
    };
    readonly filter?: {
      readonly include?: readonly string[];
      readonly exclude?: readonly string[];
    };
  };

  readonly classes?: {                         // Class-specific features
    readonly staticBlock?: boolean;            // static {} blocks
  };

  readonly modules?: {                         // Module operations
    readonly imports?: {
      readonly named?: boolean;                // import { x }
      readonly default?: boolean;              // import x
    };
    readonly exports?: {
      readonly named?: boolean;                // export { x }
      readonly default?: boolean;              // export default
    };
    readonly load?: boolean;                   // Module loading events
    readonly await?: boolean;                  // Top-level await
  };

  readonly dynamic?: {                         // Dynamic code evaluation
    readonly eval?: boolean;                   // eval() calls
    readonly function?: boolean;               // new Function()
  };

  readonly regex?: boolean;                    // Regular expressions

  readonly meta?: {                            // Meta-programming features
    readonly proxy?: boolean;                  // Proxy operations
    readonly reflect?: boolean;                // Reflect operations
  };
}

/**
 * Closure operations configuration - advanced function scoping
 * 
 * Tracks closure-related operations for understanding advanced scoping concepts.
 * All options require advice logic and may impact performance.
 */
export type ClosuresConfig = {
  readonly creation: boolean; // When closures are created
  readonly capture: boolean;  // Which variables are captured (requires advice logic)
  readonly access: boolean;   // When captured variables are accessed (requires advice logic)
}

/**
 * Scope operations configuration - which scopes to trace
 * 
 * Controls scope entry/exit tracing and variable inventory.
 * All enabled scopes will log entry/exit and include variable declarations.
 * Supports boolean shorthand: `scopes: true` enables all scope types.
 */
export type ScopesConfig = {
  readonly global: boolean;    // Global scope (var hoisting, global variables)
  readonly functions: boolean; // Function scopes (args + locals)
  readonly blocks: boolean;    // Block scopes (if/for/while/try)
  readonly modules: boolean;   // Module scopes (top-level)
  readonly closures: ClosuresConfig | boolean; // Closure operations (supports boolean shorthand)
  readonly filter: readonly string[];   // If non-empty, trace only these scope types
}

// AsyncConfig interface removed - inlined (was only 2 fields)

// ModulesConfig interface removed - inlined (was only 2 fields)

/**
 * Error operations configuration - debugging and exception handling
 * 
 * Tracks error-related operations for debugging and understanding exception flow.
 * Supports boolean shorthand: `errors: true` enables all error tracking.
 */
export type ErrorsConfig = {
  readonly try: boolean;       // Entering try blocks
  readonly throw: boolean;     // Throw statements
  readonly catch: boolean;     // Entering catch blocks
  readonly finally: boolean;   // Entering finally blocks
  readonly unhandled: boolean; // Uncaught errors that bubble up
  readonly stackTrace: boolean; // Include stack traces in error events
}

/**
 * Code range configuration - limit tracing to specific code sections
 * 
 * Useful for focusing on student code vs library/framework code in larger projects.
 * Supports both line numbers and [line, char] coordinate pairs.
 */
export type CodeRangeConfig = {
  readonly start: number | readonly [number, number]; // Line number or [line, char] coordinate
  readonly end: number | readonly [number, number];   // Line number or [line, char] coordinate
}

/**
 * Aran instrumentation framework configuration
 * 
 * Technical configuration for the underlying Aran framework.
 * Most educational users won't need to modify these settings.
 */
export type AranConfig = {
  readonly kind: 'script' | 'module' | 'eval';              // Code type affects scoping behavior
  readonly globalDeclarativeRecord: 'builtin' | 'emulate'; // Use 'emulate' to protect advice from student code
  readonly adviceGlobalVariable: string;                    // Name of global advice object
  readonly initialState: unknown;                           // Initial state passed to advice functions
  readonly mode: 'standalone' | 'normal';                  // Execution mode
  readonly warning: 'console' | 'throw' | false;           // Warning handling strategy
}

/**
 * Complete configuration interface with boolean shorthand support and graceful degradation
 * 
 * This is the main configuration interface used throughout the system.
 * The system uses **graceful degradation** - invalid values are handled gracefully:
 * 
 * **Boolean Shorthand Support**:
 * - `true`: Use default values for that section
 * - `false`: Disable all options in that section  
 * - `object`: Use specific configuration values
 * 
 * **Graceful Degradation Behavior**:
 * - **Invalid field types**: Ignored, defaults used instead
 * - **Extra fields**: Ignored completely
 * - **Missing fields**: Filled from default configuration
 * - **Malformed objects**: Valid fields kept, invalid fields ignored
 * 
 * @example
 * ```typescript
 * // All of these work gracefully:
 * const config1: Config = {
 *   preset: 'detailed',
 *   variables: true,           // Use defaults
 *   functions: false,          // Disable all
 *   operators: {               // Specific config
 *     computing: true,
 *     selecting: false,
 *     mutating: true
 *   }
 * };
 * 
 * // Invalid inputs handled gracefully:
 * const config2 = createConfig({
 *   invalidField: 'ignored',        // Extra field ignored
 *   variables: 'notBoolean',        // Invalid type → uses default
 *   functions: { calls: 'bad' }     // Invalid field ignored, rest from default
 * });
 * ```
 */
/**
 * Main configuration interface - matches structure in defaults/trace.ts
 *
 * This is the root configuration type that combines meta settings (output format)
 * with lang settings (what language features to trace).
 */
export type Config = {
  readonly presets?: string;                   // Preset name (e.g., 'variables', 'overview')
  readonly meta?: MetaConfig;                  // Trace output format and limits
  readonly lang?: LangConfig;                  // Language features to trace
}

/**
 * Fully expanded configuration (after processing)
 *
 * Same structure as Config but used after all processing is complete.
 * In the new structure, there's no boolean shorthand expansion at the
 * root level - that happens within the lang sections.
 */
export type ExpandedConfig = {
  // Inherits presets, meta, lang from Config
  // Used to distinguish processed configs from user inputs
} & Config

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
 *   preset: 'overview',
 *   variables: { filter: ['result'] }
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

// ValidationResult interface removed - validation system eliminated in favor of graceful degradation

/**
 * Default expansions for boolean shorthand
 * 
 * Defines the structure used when expanding boolean shorthand to object configurations.
 * This interface ensures type safety during the expansion process.
 * 
 * @internal Used by the expansion system
 */
export type DefaultExpansions = {
  readonly variables: VariablesConfig;           // Default variable configuration
  readonly functions: FunctionsConfig;           // Default function configuration
  readonly controlFlow: ControlFlowConfig;       // Default control flow configuration
  readonly operators: OperatorsConfig;           // Default operators configuration
  readonly syntax: { readonly destructuring: boolean; readonly spread: boolean };                 // Default syntax configuration
  readonly dataStructures: { readonly read: boolean; readonly write: boolean }; // Default data structures configuration
  readonly scopes: ScopesConfig;                 // Default scopes configuration
  readonly async: { readonly await: boolean; readonly timestamps: boolean };                   // Default async configuration
  readonly modules: { readonly imports: boolean; readonly exports: boolean };               // Default modules configuration
  readonly errors: ErrorsConfig;                 // Default errors configuration
}