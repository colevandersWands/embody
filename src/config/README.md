# Configuration System

A type-safe, modular configuration system for educational JavaScript execution tracing. This system provides flexible control over what aspects of JavaScript execution are traced, with a focus on educational scenarios.

## Architecture Overview

The configuration system follows a functional pipeline architecture:

```
UserConfig → Preset Application → Shorthand Expansion → Sanitization → ExpandedConfig
```

### Core Components

1. **Types** (`types.ts`) - TypeScript interfaces defining the configuration schema
2. **Defaults** (`defaults/trace.ts`) - Complete default configuration values
3. **Presets** (`presets/`) - Educational preset configurations
4. **Expansion** (`expand-shorthand.ts`) - Boolean shorthand to object expansion
5. **Creation** (`create.ts`) - Main configuration factory function
6. **Exports** (`index.ts`) - Public API surface

## Design Principles

### Single Responsibility
Each file exports exactly one thing matching its filename:
- `defaults/trace.ts` exports `defaultConfig`
- `expand-shorthand.ts` exports `expandShorthand` function
- `presets/overview.ts` exports `overview` preset

### Type Safety
All configurations are fully typed with TypeScript, preventing runtime errors and providing excellent developer experience with autocomplete.

### Two-Layer Structure
The configuration is divided into two main sections:
- **`meta`** - Controls trace output format and limits
- **`lang`** - Controls which JavaScript language features to trace

### Flexible Expansion
Boolean shorthand allows simple configuration while object forms provide fine-grained control:
```typescript
// Simple
{ lang: true }

// Detailed
{
  lang: {
    bindings: true,
    functions: { events: { call: true, return: false } }
  }
}
```

## Configuration Structure

The configuration has three top-level fields:

```typescript
interface Config {
  presets?: string;      // Preset name to apply
  meta?: MetaConfig;     // Output format and trace limits
  lang?: LangConfig;     // JavaScript features to trace
}
```

### Meta Configuration (`meta`)

Controls how the trace is formatted and limited:

```typescript
meta: {
  // Output control
  index?: boolean;                    // Include sequence numbers
  location?: 'line' | 'full' | false; // Source location detail
  ast?: boolean;                       // Include AST nodes
  timestamps?: boolean;                // Include timing for async

  // Trace limits
  maxIterations?: number | null;      // Loop iteration limit
  maxCallstack?: number | null;       // Recursion depth limit
  range?: { start: number; end: number }; // Line range to trace

  // Data inclusion
  data?: {
    type: boolean;        // Include value types
    instance: boolean;    // Include instance info
    value: boolean;       // Include actual values
    lookup: boolean;      // Include prototype chain
  };

  // References
  references?: boolean;   // Track object references

  // Debug info
  debug?: {
    configPath: boolean;  // Show config resolution
    AranNodeId: boolean;  // Show instrumentation IDs
    adviceName: boolean;  // Show advice functions
  };
}
```

### Language Configuration (`lang`)

Controls which JavaScript language features are traced:

#### Bindings (`lang.bindings`)
Variable and binding operations - the foundation of programming:

```typescript
bindings: {
  kind?: {
    declarative?: {
      var: boolean;      // function-scoped
      let: boolean;      // block-scoped
      const: boolean;    // immutable binding
      function: boolean; // function declarations
      class: boolean;    // class declarations
      import: boolean;   // imports
    };
    explicit?: {
      parameters: boolean; // function parameters
      catch: boolean;      // catch binding
    };
    implicit?: {
      global: boolean;     // implicit globals
      arguments: boolean;  // arguments object
      callee: boolean;     // arguments.callee
      this: boolean;       // this binding
      newTarget: boolean;  // new.target
      super: boolean;      // super reference
      importMeta: boolean; // import.meta
    };
    with?: boolean;        // with statement
  };
  events?: {
    declare: boolean;      // hoisting phase
    available: boolean;    // when available
    initialize: boolean;   // initialization
    implicit: boolean;     // implicit creation
    assign: boolean;       // assignments
    read: boolean;         // variable reads
  };
  filter?: {
    include: string[];     // only these variables
    exclude: string[];     // except these
  };
}
```

#### Functions (`lang.functions`)
Function operations and control flow:

```typescript
functions: {
  kind?: {
    arrow: boolean;        // arrow functions
    function: boolean;     // regular functions
    method: boolean;       // object methods
    generator: boolean;    // generators
    builtIn: boolean;      // built-in functions
  };
  events?: {
    definition: boolean;   // function creation
    call?: {
      arguments: boolean;  // track arguments
    };
    construct: boolean;    // new invocations
    return: boolean;       // return values
    coroutines?: {
      await: boolean;      // await expressions
      yield: boolean;      // yield expressions
      yieldDelegate: boolean; // yield*
    };
  };
  filter?: {
    include: string[];
    exclude: string[];
  };
}
```

#### Control Flow (`lang.controlFlow`)
Branching and looping constructs:

```typescript
controlFlow: {
  kind?: {
    conditionals: boolean; // if/else
    loops?: {
      while: boolean;
      for?: {
        initialize: boolean;
        test: boolean;
        increment: boolean;
      };
      forOf: boolean;
      forIn: boolean;
    };
    switch: boolean;
  };
  events?: {
    test: boolean;        // condition evaluation
    branch: boolean;      // which branch taken
    iteration: boolean;   // loop iterations
    jump: boolean;        // break/continue
  };
}
```

#### Operators (`lang.operators`)
Expression operators:

```typescript
operators: {
  pure?: boolean;           // +, -, *, ==, typeof
  mutating?: boolean;       // =, +=, ++, --
  shortCircuiting?: boolean; // &&, ||, ??
  comma?: boolean;          // comma operator
  coercion?: boolean;       // type coercion (advanced)
  filter?: {
    include: string[];
    exclude: string[];
  };
}
```

#### Properties (`lang.properties`)
Object and property operations:

```typescript
properties: {
  create?: {
    literal: boolean;       // object literals
    computed: boolean;      // computed properties
    method: boolean;        // method definitions
    accessors?: {
      getters: boolean;
      setters: boolean;
    };
    class: boolean;         // class properties
    static: boolean;        // static members
    private: boolean;       // private fields
    fields: boolean;        // class fields
  };
  access?: boolean;         // property reads
  update?: boolean;         // property writes
  remove?: boolean;         // delete operations
  optionalChaining?: boolean; // ?.
  lookup?: boolean;         // prototype chain (advanced)
  filter?: string[];
}
```

#### Other Language Features

- **`scopes`** - Scope creation and lifecycle
- **`errorHandling`** - Exception handling and stack traces
- **`matching`** - Destructuring and pattern matching
- **`modules`** - Import/export operations
- **`references`** - Object reference tracking
- **`templates`** - Template literals
- **`symbols`** - Symbol operations
- **`classes`** - Class-specific features
- **`dynamic`** - eval() and new Function()
- **`meta`** - Proxy and Reflect operations
- **`semantics`** - Language semantics enforcement

## Type System

### Primary Types

- **`Config`** - Complete configuration with optional fields
- **`ExpandedConfig`** - Fully expanded configuration (extends Config)
- **`MetaConfig`** - Output format configuration
- **`LangConfig`** - Language features configuration

### Type Relationships

```typescript
Partial<Config> → [createConfig] → ExpandedConfig
Config → [expandShorthand] → ExpandedConfig
Config → [applyPreset] → Config
```

## Expansion Rules

The expansion system automatically converts boolean shorthand to full object configurations:

### Rule 1: `true` Expansion
When a section is set to `true`, it expands to the default configuration:

```typescript
// Input
{ lang: true }

// Expands to full lang structure from defaults/trace.ts
{
  lang: {
    semantics: true,
    bindings: { /* ... */ },
    functions: { /* ... */ },
    // ... all other sections
  }
}
```

### Rule 2: `false` Expansion
When a section is set to `false`, all booleans become `false` and arrays empty:

```typescript
// Input
{ lang: { operators: false } }

// Expands to
{
  lang: {
    operators: {
      pure: false,
      mutating: false,
      shortCircuiting: false,
      comma: false,
      coercion: false,
      filter: { include: [], exclude: [] }
    }
  }
}
```

### Rule 3: Recursive Expansion
Expansion applies recursively at any nesting level:

```typescript
// Input
{ lang: { bindings: { kind: { declarative: true } } } }

// Expands declarative to full structure
{
  lang: {
    bindings: {
      kind: {
        declarative: {
          var: true, let: true, const: true,
          function: true, class: true, import: true
        }
      }
    }
  }
}
```

## Graceful Degradation

The configuration system uses **graceful degradation** for robustness:

### Invalid Field Handling
- **Extra fields**: Ignored completely (no errors)
- **Wrong types**: Use defaults instead
- **Missing fields**: Filled from defaults
- **Invalid presets**: Ignored, defaults used

### Examples
```typescript
// All work gracefully:
createConfig({ unknownField: 'ignored' });           // Extra ignored
createConfig({ meta: 'notObject' });                 // Uses default
createConfig({ lang: { bindings: 'notObject' } });   // Uses default
createConfig({ presets: 'nonexistent' });            // Uses default
```

## Presets

Educational presets in the `presets/` directory:

```
config/presets/
  overview.ts      # Beginner-friendly
  detailed.ts      # Intermediate (default)
  exhaustive.ts    # Advanced analysis
  index.ts         # Aggregates all presets
```

### `overview` - Beginner-friendly
Minimal noise, focus on core concepts:
- Basic variables (no reads to reduce noise)
- Function calls only
- Simple control flow
- Line-level locations

### `detailed` - Intermediate (default)
Balanced detail for most scenarios:
- Full variable tracking including reads
- Complete function analysis
- All control flow with iterations
- Block scopes and closures
- Stack traces for errors

### `exhaustive` - Advanced
Everything enabled for deep analysis:
- All implicit bindings (this, arguments, etc.)
- Type coercion tracking
- Prototype chain lookups
- Debug information
- Full location info [line, column]
- AST nodes included

## Usage Patterns

### Basic Usage
```typescript
import { createConfig } from './config';

// Use defaults
const config = createConfig();

// With preset
const config = createConfig({ presets: 'overview' });
```

### Customization Examples

#### Variable Focus
```typescript
const config = createConfig({
  presets: 'overview',
  lang: {
    bindings: {
      events: { read: true }, // Enable reads
      filter: {
        include: ['result', 'count']
      }
    }
  }
});
```

#### Async Execution Study
```typescript
const config = createConfig({
  meta: {
    timestamps: true  // Track timing
  },
  lang: {
    functions: {
      events: {
        coroutines: {
          await: true,
          yield: true
        }
      }
    }
  }
});
```

#### Performance Optimization
```typescript
const config = createConfig({
  presets: 'overview',
  meta: {
    index: false,      // No sequence numbers
    ast: false,        // No AST nodes
    data: {
      value: false     // Don't capture values
    }
  },
  lang: {
    bindings: {
      events: { read: false }  // No read tracking
    }
  }
});
```

#### Debugging Configuration
```typescript
const config = createConfig({
  presets: 'exhaustive',
  meta: {
    debug: {
      configPath: true,
      AranNodeId: true,
      adviceName: true
    },
    location: 'full',  // [line, column]
    maxCallstack: 100  // Limit recursion
  }
});
```

## API Contracts

### `createConfig(userConfig?: Partial<Config>): ExpandedConfig`

**Guarantees**:
- Always returns complete, valid configuration
- Never throws for invalid input
- Boolean shorthand fully expanded
- Missing fields filled from defaults
- Presets applied before user overrides
- User overrides always win

**Examples**:
```typescript
createConfig();                              // Complete defaults
createConfig({ presets: 'overview' });      // Preset applied
createConfig({ lang: true });               // Expanded lang
createConfig({ lang: false });              // Disabled lang
createConfig({ unknownField: 'ignored' });  // Graceful handling
```

## Extension Guide

### Adding New Configuration Options

1. **Update Types** in `types.ts`:
```typescript
interface LangConfig {
  // ... existing
  newFeature?: {
    enabled: boolean;
    mode: 'basic' | 'advanced';
    filter: string[];
  } | boolean;  // Support shorthand
}
```

2. **Set Defaults** in `defaults/trace.ts`:
```typescript
lang: {
  // ... existing
  newFeature: {
    enabled: true,
    mode: 'basic',
    filter: []
  }
}
```

3. **Update Presets** as needed in `presets/`:
```typescript
// In overview.ts
lang: {
  // ... existing
  newFeature: false  // Disabled for beginners
}

// In exhaustive.ts
lang: {
  // ... existing
  newFeature: true  // Full expansion
}
```

The system automatically handles:
- Boolean expansion for new fields
- Graceful degradation for invalid values
- Recursive processing at any depth

## Design Philosophy

The configuration follows **KISS** principles:

### Core Principles
- **Graceful degradation** over strict validation
- **Data/function separation** - configs are pure data
- **Two-layer structure** - meta vs lang separation
- **TypeScript-first** - compile-time safety
- **Recursive algorithms** - future-proof expansion

### Simplification Decisions
- **No runtime validation** - TypeScript provides safety
- **Automatic expansion** - Works for any object field
- **Preset organization** - One file per preset
- **Generic processing** - No hardcoded field lists

## Performance Considerations

- **Expansion once** - During config creation only
- **No validation overhead** - Graceful degradation
- **Filter arrays optimized** - Fast runtime lookups
- **Pure functions** - Predictable, cacheable

## Field Migration Reference

For users migrating from old flat structure to new structure:

| Old Field | New Location |
|-----------|-------------|
| `variables.*` | `lang.bindings.*` |
| `functions.*` | `lang.functions.*` |
| `operators.*` | `lang.operators.*` |
| `controlFlow.*` | `lang.controlFlow.*` |
| `dataStructures.*` | `lang.properties.*` |
| `async.*` | `lang.functions.events.coroutines.*` |
| `async.timestamps` | `meta.timestamps` |
| `errors.*` | `lang.errorHandling.*` |
| `scopes.*` | `lang.scopes.*` |
| `modules.*` | `lang.modules.*` |
| `codeRange.*` | `meta.range.*` |

## Files Overview

```
config/
  README.md              # This documentation
  index.ts              # Public API exports
  types.ts              # TypeScript interfaces
  create.ts             # Main factory function
  apply-preset.ts       # Preset application
  expand-shorthand.ts   # Boolean expansion
  defaults/
    trace.ts            # Complete defaults
    environment.ts      # [Reserved for Aran integration]
  presets/
    overview.ts         # Beginner preset
    detailed.ts         # Intermediate preset
    exhaustive.ts       # Advanced preset
    index.ts           # Preset aggregation
  test/
    *.test.ts          # Comprehensive test suite