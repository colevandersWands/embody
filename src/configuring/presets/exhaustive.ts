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
  lang: {
    // Enable EVERYTHING in language features
    bindings: {
      kind: {
        declarative: {
          var: true,
          let: true,
          const: true,
          function: true,
          class: true,
          import: true,
        },
        explicit: {
          parameters: true,
          catch: true,
        },
        implicit: {
          global: true,
          arguments: true,
          callee: true,
          this: true,
          newTarget: true,
          super: true,
          importMeta: true,
        },
        with: true,
      },
      events: {
        declare: true,
        available: true,
        initialize: true,
        implicit: true,
        assign: true,
        read: true,
      },
      filter: {
        include: [],
        exclude: [],
      },
    },

    functions: {
      kind: {
        arrow: true,
        function: true,
        method: true,
        generator: true,
        builtIn: true,
      },
      events: {
        definition: true,
        call: {
          arguments: true,
        },
        construct: true,
        return: true,
        coroutines: {
          await: true,
          yield: true,
          yieldDelegate: true,
        },
      },
      filter: {
        include: [],
        exclude: [],
      },
    },

    controlFlow: {
      kind: {
        conditionals: true,
        loops: {
          while: true,
          for: {
            initialize: true,
            test: true,
            increment: true,
          },
          forOf: true,
          forIn: true,
        },
        switch: true,
      },
      events: {
        test: true,
        branch: true,
        iteration: true,
        jump: true,
      },
      filter: {
        include: [],
        exclude: [],
      },
    },

    operators: {
      pure: true,
      mutating: true,
      shortCircuiting: true,
      comma: true,
      coercion: true, // Advanced: type coercion
      filter: {
        include: [],
        exclude: [],
      },
    },

    properties: {
      create: {
        literal: true,
        computed: true,
        method: true,
        accessors: {
          getters: true,
          setters: true,
        },
        class: true,
        static: true,
        private: true,
        fields: true,
      },
      access: true,
      update: true,
      remove: true,
      optionalChaining: true,
      lookup: true, // Advanced: prototype chain
      filter: [],
    },

    scopes: {
      kind: {
        script: true,
        function: true,
        block: true,
        module: true,
        closure: true,
      },
      events: {
        create: true,
        enter: true,
        interrupt: true,
        completion: true,
        leave: true,
      },
    },

    errorHandling: {
      throw: true,
      try: true,
      catch: true,
      finally: true,
      callstack: true,
    },

    matching: {
      read: {
        spread: true, // Advanced: spread in destructuring
      },
      assign: {
        destructure: true,
        rest: true, // Advanced: rest parameters
        defaultValues: true,
      },
    },

    modules: {
      imports: {
        named: true,
        default: true,
      },
      exports: {
        named: true,
        default: true,
      },
      load: true,
      await: true,
    },

    references: {
      create: true,
      access: true,
      mutate: true,
    },

    templates: {
      literal: true,
      tagged: true,
    },

    symbols: {
      create: true,
      access: true,
    },

    parenthesis: {
      enter: true,
      leave: true,
    },

    classes: {
      staticBlock: true,
    },

    dynamic: {
      eval: true, // Advanced: eval()
      function: true, // Advanced: new Function()
    },

    regex: true,

    meta: {
      proxy: true, // Advanced: Proxy operations
      reflect: true, // Advanced: Reflect operations
    },

    semantics: true,
  },

  meta: {
    index: true,
    location: 'full', // Full [line, column] location
    ast: true, // Include AST
    data: {
      type: true,
      instance: true,
      value: true,
      lookup: true,
    },
    references: true,
    debug: {
      configPath: true, // Debug: show config path
      AranNodeId: true, // Debug: show Aran node ID
      adviceName: true, // Debug: show advice function name
    },
    timestamps: true, // Include timestamps for async analysis
    maxIterations: 10_000, // Reasonable limit for loops
    maxCallstack: 1000, // Reasonable recursion limit
  },
};

export default exhaustive;
