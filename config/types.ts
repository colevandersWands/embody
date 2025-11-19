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
export interface DeclareConfig {
  var: boolean;      // var x = 5 (function-scoped, hoisted as undefined)
  let: boolean;      // let x = 5 (block-scoped, temporal dead zone)
  const: boolean;    // const x = 5 (block-scoped, immutable binding)
  function: boolean; // function f() {} (hoisted completely)
  implicit: boolean; // x = 5 (without declaration, creates global)
}

/**
 * Variable operations configuration - the foundation of programming literacy
 * 
 * Tracks variable operations including declarations, assignments, and reads.
 * Supports boolean shorthand: `variables: true` enables all operations.
 */
export interface VariablesConfig {
  declare: DeclareConfig | boolean; // Variable declarations (supports nested boolean shorthand)
  assign: boolean;                  // Variable assignments (x = 10, x += 5)
  read: boolean;                    // Variable reads (console.log(x), return x)
  filter: string[];                 // If non-empty, trace only these variable names
}

/**
 * Function operations configuration - control flow and abstraction
 * 
 * Monitors function-related operations including calls, declarations, and returns.
 * Supports boolean shorthand: `functions: true` enables all operations.
 */
export interface FunctionsConfig {
  calls: boolean;        // Function invocations: fn(), obj.method()
  declarations: boolean; // Function definitions: function() {}, () => {}
  returns: boolean;      // Return values and completion values
  this: boolean;         // 'this' binding (advanced concept)
  yield: boolean;        // Yield expressions in generators
  filter: string[];      // If non-empty, trace only these function names
}

/**
 * Control flow operations configuration - branching and looping logic
 * 
 * Traces control flow constructs that alter program execution flow.
 * Supports boolean shorthand: `controlFlow: true` enables all constructs.
 */
export interface ControlFlowConfig {
  conditionals: boolean; // if/else test expressions
  loops: boolean;        // while/for condition tests
  switches: boolean;     // switch case evaluations
  breaks: boolean;       // break/continue statements
  filter: string[];      // If non-empty, trace only these control structures
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
export interface OperatorsConfig {
  computing: boolean; // +, -, *, ==, <, typeof, ++, -- (calculate new values)
  selecting: boolean; // &&, ||, ??, ?., ?: (choose between existing values)
  mutating: boolean;  // =, +=, ++, -- (change variable state)
  filter: string[];   // If non-empty, trace only these operator types
}

// SyntaxConfig interface removed - inlined (was only 2 fields)

// DataStructuresConfig interface removed - inlined (was only 2 fields)

/**
 * Closure operations configuration - advanced function scoping
 * 
 * Tracks closure-related operations for understanding advanced scoping concepts.
 * All options require advice logic and may impact performance.
 */
export interface ClosuresConfig {
  creation: boolean; // When closures are created
  capture: boolean;  // Which variables are captured (requires advice logic)
  access: boolean;   // When captured variables are accessed (requires advice logic)
}

/**
 * Scope operations configuration - which scopes to trace
 * 
 * Controls scope entry/exit tracing and variable inventory.
 * All enabled scopes will log entry/exit and include variable declarations.
 * Supports boolean shorthand: `scopes: true` enables all scope types.
 */
export interface ScopesConfig {
  global: boolean;    // Global scope (var hoisting, global variables)
  functions: boolean; // Function scopes (args + locals)
  blocks: boolean;    // Block scopes (if/for/while/try)
  modules: boolean;   // Module scopes (top-level)
  closures: ClosuresConfig | boolean; // Closure operations (supports boolean shorthand)
  filter: string[];   // If non-empty, trace only these scope types
}

// AsyncConfig interface removed - inlined (was only 2 fields)

// ModulesConfig interface removed - inlined (was only 2 fields)

/**
 * Error operations configuration - debugging and exception handling
 * 
 * Tracks error-related operations for debugging and understanding exception flow.
 * Supports boolean shorthand: `errors: true` enables all error tracking.
 */
export interface ErrorsConfig {
  try: boolean;       // Entering try blocks
  throw: boolean;     // Throw statements
  catch: boolean;     // Entering catch blocks
  finally: boolean;   // Entering finally blocks
  unhandled: boolean; // Uncaught errors that bubble up
  stackTrace: boolean; // Include stack traces in error events
}

/**
 * Code range configuration - limit tracing to specific code sections
 * 
 * Useful for focusing on student code vs library/framework code in larger projects.
 * Supports both line numbers and [line, char] coordinate pairs.
 */
export interface CodeRangeConfig {
  start: number | [number, number]; // Line number or [line, char] coordinate
  end: number | [number, number];   // Line number or [line, char] coordinate
}

/**
 * Aran instrumentation framework configuration
 * 
 * Technical configuration for the underlying Aran framework.
 * Most educational users won't need to modify these settings.
 */
export interface AranConfig {
  kind: 'script' | 'module' | 'eval';              // Code type affects scoping behavior
  globalDeclarativeRecord: 'builtin' | 'emulate'; // Use 'emulate' to protect advice from student code
  adviceGlobalVariable: string;                    // Name of global advice object
  initialState: unknown;                           // Initial state passed to advice functions
  mode: 'standalone' | 'normal';                  // Execution mode
  warning: 'console' | 'throw' | false;           // Warning handling strategy
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
export interface Config {
  preset?: PresetName | null;                      // Educational preset to start from
  variables: VariablesConfig | boolean;            // Variable operations
  functions: FunctionsConfig | boolean;            // Function operations
  instantiation: boolean;                          // Object instantiation (new Class(), new Array())
  controlFlow: ControlFlowConfig | boolean;        // Control flow constructs
  operators: OperatorsConfig | boolean;            // Operator interactions
  syntax: { destructuring: boolean; spread: boolean } | boolean;                  // Modern syntax patterns
  dataStructures: { read: boolean; write: boolean } | boolean;  // Data structure access
  scopes: ScopesConfig | boolean;                  // Scope tracking
  prototypeLookup: boolean;                        // Prototype chain resolution
  async: { await: boolean; timestamps: boolean } | boolean;                    // Async operations and timing
  modules: { imports: boolean; exports: boolean } | boolean;                // Module operations
  coercion: boolean;                               // Implicit type conversions
  type: 'script' | 'module' | 'eval';             // Code type affects scoping behavior
  errors: ErrorsConfig | boolean;                  // Error handling and exceptions
  codeRange?: CodeRangeConfig;                     // Optional code range limiting
  aran: AranConfig;                                // Aran framework configuration
}

/**
 * Fully expanded configuration (after boolean shorthand expansion)
 * 
 * This interface represents the configuration after all boolean shorthand
 * has been expanded to full object configurations. Used internally after
 * the expansion phase of the configuration pipeline.
 * 
 * All previously boolean-expandable fields are now concrete object types.
 */
export interface ExpandedConfig {
  preset?: PresetName | null;           // Educational preset reference
  variables: VariablesConfig;           // Fully expanded variable configuration
  functions: FunctionsConfig;           // Fully expanded function configuration
  instantiation: boolean;               // Object instantiation (simple boolean)
  controlFlow: ControlFlowConfig;       // Fully expanded control flow configuration
  operators: OperatorsConfig;           // Fully expanded operators configuration
  syntax: { destructuring: boolean; spread: boolean };                 // Fully expanded syntax configuration
  dataStructures: { read: boolean; write: boolean }; // Fully expanded data structures configuration
  scopes: ScopesConfig;                 // Fully expanded scopes configuration
  prototypeLookup: boolean;             // Prototype lookup (simple boolean)
  async: { await: boolean; timestamps: boolean };                   // Fully expanded async configuration
  modules: { imports: boolean; exports: boolean };               // Fully expanded modules configuration
  coercion: boolean;                    // Type coercion (simple boolean)
  type: 'script' | 'module' | 'eval';  // Code type
  errors: ErrorsConfig;                 // Fully expanded errors configuration
  codeRange?: CodeRangeConfig;          // Optional code range limiting
  aran: AranConfig;                     // Aran framework configuration
}

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
export interface DefaultExpansions {
  variables: VariablesConfig;           // Default variable configuration
  functions: FunctionsConfig;           // Default function configuration
  controlFlow: ControlFlowConfig;       // Default control flow configuration
  operators: OperatorsConfig;           // Default operators configuration
  syntax: { destructuring: boolean; spread: boolean };                 // Default syntax configuration
  dataStructures: { read: boolean; write: boolean }; // Default data structures configuration
  scopes: ScopesConfig;                 // Default scopes configuration
  async: { await: boolean; timestamps: boolean };                   // Default async configuration
  modules: { imports: boolean; exports: boolean };               // Default modules configuration
  errors: ErrorsConfig;                 // Default errors configuration
}