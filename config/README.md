# Configuration System

A type-safe, modular configuration system for educational JavaScript execution tracing. This system provides flexible control over what aspects of JavaScript execution are traced, with a focus on educational scenarios.

## Architecture Overview

The configuration system follows a functional pipeline architecture:

```
UserConfig → Preset Application → Shorthand Expansion → Validation → ExpandedConfig
```

### Core Components

1. **Types** (`types.ts`) - TypeScript interfaces defining the configuration schema
2. **Defaults** (`default.ts`) - Complete default configuration values
3. **Presets** (`presets.ts`) - Educational preset configurations
4. **Expansion** (`expand-shorthand.ts`) - Boolean shorthand to object expansion
5. **Validation** (`validate.ts`) - Configuration validation rules
6. **Creation** (`create.ts`) - Main configuration factory function
7. **Exports** (`index.ts`) - Public API surface

## Design Principles

### Single Responsibility
Each file exports exactly one thing matching its filename:
- `default.ts` exports `defaultConfig`
- `validate.ts` exports `validate` function
- `presets.ts` exports `presets` object

### Type Safety
All configurations are fully typed with TypeScript, preventing runtime errors and providing excellent developer experience with autocomplete.

### Educational Focus
Configuration categories align with concepts learners see in source code rather than abstract execution details:
- `variables` for variable operations
- `functions` for function calls and declarations
- `controlFlow` for branching and looping
- `operators` for expression evaluation

### Flexible Expansion
Boolean shorthand allows simple configuration while object forms provide fine-grained control:
```typescript
// Simple
{ functions: true }

// Detailed
{ functions: { calls: true, declarations: true, returns: false } }
```

## Configuration Structure

### Core Language Features

#### Variables (`VariablesConfig`)
Tracks variable operations - the foundation of programming literacy.

```typescript
variables: {
  declare: {
    var: boolean,      // function-scoped, hoisted as undefined
    let: boolean,      // block-scoped, temporal dead zone
    const: boolean,    // block-scoped, immutable binding
    function: boolean, // hoisted completely
    implicit: boolean  // creates global without declaration
  },
  assign: boolean,     // variable assignments
  read: boolean,       // variable reads
  filter: string[]     // trace only these variable names
}
```

**Expansion**: `variables: true` enables all declaration types and operations.

#### Functions (`FunctionsConfig`)
Monitors function operations - control flow and abstraction.

```typescript
functions: {
  calls: boolean,        // function invocations
  declarations: boolean, // function definitions
  returns: boolean,      // return values
  this: boolean,         // 'this' binding (advanced)
  yield: boolean,        // generator yield expressions
  filter: string[]       // trace only these function names
}
```

#### Control Flow (`ControlFlowConfig`)
Traces branching and looping logic.

```typescript
controlFlow: {
  conditionals: boolean, // if/else test expressions
  loops: boolean,        // while/for condition tests
  switches: boolean,     // switch case evaluations
  breaks: boolean,       // break/continue statements
  filter: string[]       // trace only these constructs
}
```

#### Operators (`OperatorsConfig`)
Grouped by interaction with values and memory.

```typescript
operators: {
  computing: boolean, // +, -, *, ==, <, typeof, ++, -- (calculate new values)
  selecting: boolean, // &&, ||, ??, ?., ?: (choose between values)
  mutating: boolean,  // =, +=, ++, -- (change variable state)
  filter: string[]    // trace only these operator types
}
```

**Educational Value**: Increment operators (`++`/`--`) trigger both computing AND mutating, demonstrating the difference between `++i` and `i++`.

#### Other Features

- **Instantiation** (`boolean`) - Object creation with `new`
- **Syntax** (`SyntaxConfig`) - Destructuring and spread operations
- **Data Structures** (`DataStructuresConfig`) - Property access and modification
- **Scopes** (`ScopesConfig`) - Scope entry/exit and variable inventory
- **Async** (`AsyncConfig`) - Await expressions and timing
- **Modules** (`ModulesConfig`) - Import/export statements
- **Errors** (`ErrorsConfig`) - Exception handling

### Technical Configuration

#### Code Targeting (`CodeRangeConfig`)
Limit tracing to specific code ranges:

```typescript
codeRange: {
  start: number | [number, number], // line or [line, char]
  end: number | [number, number]    // line or [line, char]
}
```

#### Aran Integration (`AranConfig`)
Technical configuration for the Aran instrumentation framework:

```typescript
aran: {
  kind: 'script' | 'module' | 'eval',
  globalDeclarativeRecord: 'builtin' | 'emulate',
  adviceGlobalVariable: string,
  initialState: unknown,
  mode: 'standalone' | 'normal',
  warning: 'console' | 'throw' | false
}
```

## Type System

### Primary Types

- **`UserConfig`** - Partial configuration provided by users
- **`Config`** - Complete configuration with shorthand support
- **`ExpandedConfig`** - Fully expanded configuration (no boolean shorthand)

### Utility Types

- **`PresetName`** - Union of valid preset names
- **`Presets`** - Record mapping preset names to configurations
- **`ValidationResult`** - Validation outcome with errors

### Type Relationships

```typescript
UserConfig ⊆ Config
Config --[expansion]--> ExpandedConfig
Config --[validation]--> ValidationResult
```

## Expansion Rules

The expansion system automatically converts boolean shorthand to full object configurations:

### Rule 1: `true` Expansion
When a configuration section is set to `true`, it expands to the corresponding section in `defaultConfig`:

```typescript
// Input
{ functions: true }

// Expands to
{ functions: { calls: true, declarations: true, returns: true, this: false, yield: true, filter: [] } }
```

### Rule 2: `false` Expansion
When a configuration section is set to `false`, it creates a disabled version where all boolean fields are `false` and arrays are empty:

```typescript
// Input
{ operators: false }

// Expands to
{ operators: { computing: false, selecting: false, mutating: false, filter: [] } }
```

### Rule 3: Object Passthrough
Object configurations are used as-is, allowing fine-grained control.

### Rule 4: Recursive Expansion
Expansion applies recursively to nested structures:

```typescript
// Input
{ scopes: { closures: true } }

// Expands closures boolean to its default object structure
```

## Graceful Degradation

The configuration system uses **graceful degradation** instead of strict validation:

### Invalid Field Handling
- **Extra fields**: Ignored completely (no errors thrown)
- **Wrong types**: Invalid fields are ignored, defaults are used instead
- **Missing fields**: Automatically filled from default configuration

### Examples
```typescript
// All of these work gracefully:
createConfig({ invalidField: 'ignored' });                    // Extra field ignored
createConfig({ variables: 'notBoolean' });                    // Invalid type, uses default
createConfig({ functions: { calls: 'notBoolean' } });         // Partial object, bad fields ignored
createConfig({ preset: 'nonexistent' });                      // Bad preset ignored, uses default
```

### Philosophy
- **Robust**: No runtime errors from invalid configurations
- **Predictable**: Always returns complete, valid configuration
- **Educational**: Focuses on functionality, not error handling
- **TypeScript-first**: Compile-time safety is the primary protection

## API Contracts

The configuration system makes these **guarantees**:

### `createConfig(userConfig?: UserConfig): ExpandedConfig`

**Input Handling**:
- `undefined` or `{}`: Returns complete default configuration
- Invalid fields: Ignored completely, no errors thrown
- Wrong types: Invalid values ignored, defaults used instead
- Partial objects: Valid fields kept, invalid fields ignored, missing fields filled from defaults

**Output Guarantees**:
- Always returns complete `ExpandedConfig` with all required fields
- All boolean shorthand fully expanded to object form
- All missing fields filled with sensible defaults
- Never throws runtime errors for invalid input

**Examples of Guaranteed Behavior**:
```typescript
// All of these return valid, complete configurations:
createConfig();                                       // → Complete default config
createConfig({});                                     // → Complete default config  
createConfig({ invalidField: 'ignored' });           // → Default + extra field ignored
createConfig({ variables: 'notBoolean' });           // → Default variables used
createConfig({ functions: { calls: 'bad' } });       // → calls ignored, other fields from default
createConfig({ preset: 'nonexistent' });             // → Preset ignored, default used
createConfig({ variables: true });                   // → Expanded to full variables object
createConfig({ preset: 'overview', variables: false }); // → Preset applied, then variables disabled
```

### Preset Application Contract

**Preset Processing**:
1. If `userConfig.preset` exists and is valid: Apply preset configuration
2. If `userConfig.preset` is invalid: Ignore preset, use defaults
3. User overrides always take precedence over preset values
4. Deep merge preserves nested user customizations

### Boolean Expansion Contract

**Expansion Rules**:
- `true` → Use corresponding default configuration object
- `false` → Create disabled version (all booleans false, arrays empty)
- Object → Use as-is, no expansion
- Invalid values → Ignore, use default

**Recursive Expansion**:
- Works for any object field in `defaultConfig`
- Automatically handles new configuration fields
- No hardcoded field lists to maintain

## Presets

Educational presets are organized in the `presets/` directory for better maintainability:

```
config/presets/
  overview.ts      # Beginner-friendly preset
  detailed.ts      # Intermediate analysis (default)
  exhaustive.ts    # Advanced analysis  
  index.ts         # Re-exports all presets
```

Each preset file exports a single default configuration object optimized for specific educational scenarios:

### Preset Organization
- **One file per preset**: Easy to find and modify individual presets
- **Clear naming**: File names match preset names exactly
- **Pure data**: Each file exports only a POJO, no functions
- **Self-documenting**: Comprehensive JSDoc for each preset's educational purpose

Three educational presets provide different levels of detail:

### `overview` - Beginner-friendly
Minimal noise, focus on core concepts:
- Basic variable operations (no reads to reduce noise)
- Function calls and declarations
- Essential control flow
- Basic error handling

### `detailed` - Intermediate analysis (default)
Balanced detail for most educational scenarios:
- Complete variable tracking
- Full function analysis
- All control flow constructs
- Comprehensive error handling

### `exhaustive` - Advanced analysis
Maximum information for debugging and research:
- All features enabled using boolean shorthand
- Suitable for deep analysis and research

## Usage Patterns

### Basic Usage
```typescript
import { createConfig } from './config';

// Use defaults
const config = createConfig();

// Simple customization
const config = createConfig({
  async: { timestamps: true }
});
```

### Preset-based Configuration
```typescript
// Start with preset, customize as needed
const config = createConfig({
  preset: 'overview',
  variables: {
    filter: ['result', 'count'] // Only trace specific variables
  }
});
```

### Educational Scenarios

#### Variable Focus (Beginners)
```typescript
const beginnerConfig = createConfig({
  preset: 'overview',
  variables: {
    read: true,
    filter: ['userInput', 'result']
  },
  functions: false,
  operators: false
});
```

#### Function Analysis (Intermediate)
```typescript
const functionConfig = createConfig({
  preset: 'detailed',
  functions: {
    calls: true,
    returns: true,
    this: true,
    filter: ['calculateTotal', 'processData']
  },
  variables: false
});
```

#### Async Study (Advanced)
```typescript
const asyncConfig = createConfig({
  preset: 'detailed',
  async: { await: true, timestamps: true },
  functions: { calls: true, returns: true },
  variables: { filter: ['promise', 'result', 'error'] }
});
```

## Extension Guide

### Adding New Configuration Options

1. **Define Types** in `types.ts`:
```typescript
export interface NewFeatureConfig {
  enable: boolean;
  mode: 'basic' | 'advanced';
  filter: string[];
}
```

2. **Add to Main Config**:
```typescript
export interface Config {
  // ... existing fields
  newFeature: NewFeatureConfig | boolean;
}
```

3. **Set Defaults** in `default.ts`:
```typescript
const defaultConfig: Config = {
  // ... existing fields
  newFeature: {
    enable: true,
    mode: 'basic',
    filter: []
  }
};
```

4. **Update Presets** in `presets/` directory as needed:
   - Add new field to relevant preset files
   - Each preset file exports a single default POJO
   - Use boolean shorthand where appropriate

5. **System automatically handles** the new structure:
   - Boolean expansion works for any object field in defaults
   - Missing fields filled from defaults
   - Invalid fields gracefully ignored

## Common Patterns

### Filter Usage
```typescript
// Trace only specific items
{
  variables: { filter: ['result', 'total'] },
  functions: { filter: ['calculate'] }
}
```

### Progressive Disclosure
```typescript
// Start simple
{ preset: 'overview' }

// Add detail gradually
{ preset: 'overview', variables: { read: true } }

// Full control
{ preset: 'overview', variables: { declare: { let: true, const: true } } }
```

### Performance Optimization
```typescript
// Minimal tracing for performance
{
  variables: { read: false },
  operators: false,
  async: { timestamps: false }
}
```

## Anti-Patterns

❌ **Don't hardcode configuration options**
```typescript
// Bad - hardcoded keys
const keys = ['variables', 'functions'];
```

✅ **Use type-driven approaches**
```typescript
// Good - derive from types/defaults
const expandableKeys = Object.keys(defaultConfig).filter(isExpandable);
```

❌ **Don't mix data and functions**
```typescript
// Bad - functions in preset objects
const preset = {
  variables: true,
  getVariables: () => { ... }  // Functions don't belong in data
};
```

✅ **Keep presets as pure data**
```typescript
// Good - pure configuration objects
const preset = {
  variables: { declare: true, assign: true, read: true, filter: [] },
  functions: { calls: true, returns: true, filter: [] }
};
```

❌ **Don't create complex nested validation**
```typescript
// Bad - complex validation logic
function validateComplexRules(config) {
  // 100+ lines of nested validation
}
```

✅ **Trust TypeScript and use graceful degradation**
```typescript
// Good - simple, robust approach
function createConfig(userConfig = {}) {
  return { ...defaultConfig, ...userConfig };  // Let defaults handle invalid values
}
```

## Design Philosophy

The configuration system follows **KISS (Keep It Simple, Stupid)** principles:

### Core Principles
- **Graceful degradation over strict validation**: Invalid inputs are handled gracefully, not rejected
- **Data/function separation**: Configuration objects are pure data, functions live in separate files
- **One export per file**: Each file exports exactly one thing matching its filename
- **TypeScript-first**: Compile-time safety over runtime validation
- **Recursive algorithms**: Generic, future-proof logic that adapts to configuration changes

### Simplification Decisions
- **Removed complex validation**: 159 lines of validation replaced with graceful degradation
- **Inlined small interfaces**: 2-3 field interfaces inlined for simplicity
- **Organized presets**: One file per preset in dedicated directory
- **Eliminated redundant utilities**: Removed single-purpose wrapper functions

### File Organization
```
config/
  README.md           # This documentation
  index.ts           # Public API exports
  types.ts           # TypeScript interfaces
  default.ts         # Default configuration (core data)
  create.ts          # Main factory function
  apply-preset.ts    # Preset application logic
  expand-shorthand.ts # Boolean expansion logic
  presets/           # Preset data directory
    overview.ts      # Beginner preset
    detailed.ts      # Intermediate preset  
    exhaustive.ts    # Advanced preset
    index.ts         # Preset exports
```

## Performance Considerations

- **Expansion performed once**: During configuration creation, not during tracing
- **No runtime validation**: Zero validation overhead during execution
- **Filter arrays optimized**: Fast lookup during tracing operations
- **Boolean shorthand**: Reduces configuration verbosity and complexity
- **Pure functions**: Predictable performance, easy to optimize

## Error Handling Philosophy

**Prefer robustness over correctness**: The system prioritizes continuing to work over catching configuration errors.

- **Invalid fields**: Silently ignored, defaults used instead
- **Malformed inputs**: Gracefully handled, no exceptions thrown
- **TypeScript protection**: Compile-time safety for most common errors
- **Educational focus**: Simple, predictable behavior for learners