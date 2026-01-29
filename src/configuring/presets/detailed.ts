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
 * - Global, function, block, and module scopes (closures enabled)
 * - Comprehensive error handling with stack traces
 * - Async operations without timestamps
 * - Module operations enabled
 *
 * Features disabled:
 * - `this` binding (advanced concept)
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
  lang: {
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
          global: true, // Track implicit globals
          arguments: true,
          callee: false,
          this: false, // Advanced concept
          newTarget: false,
          super: false,
          importMeta: false,
        },
        with: false,
      },
      events: {
        declare: true, // Show hoisting
        available: true,
        initialize: true,
        implicit: true,
        assign: true,
        read: true, // Track all variable reads
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
        builtIn: false,
      },
      events: {
        definition: true,
        call: {
          arguments: true, // Show function arguments
        },
        construct: true,
        return: true, // Track returns
        coroutines: {
          await: true,
          yield: true, // Track generator yields
          yieldDelegate: false,
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
          while: true, // Enable all loop types
          for: {
            initialize: true,
            test: true,
            increment: true,
          },
          forOf: true,
          forIn: true,
        },
        switch: true, // Enable switch statements
      },
      events: {
        test: true,
        branch: true,
        iteration: true, // Track loop iterations
        jump: true, // Track break/continue
      },
      filter: {
        include: [],
        exclude: [],
      },
    },

    operators: {
      pure: true, // Computing operators
      mutating: true, // Assignment operators
      shortCircuiting: true, // &&, ||, ??
      comma: false,
      coercion: false, // Advanced concept
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
        class: false,
        static: false,
        private: false,
        fields: false,
      },
      access: true,
      update: true, // Track property writes
      remove: true,
      optionalChaining: true,
      lookup: false, // Prototype chain (advanced)
      filter: [],
    },

    scopes: {
      kind: {
        script: true,
        function: true,
        block: true, // Track block scopes
        module: true,
        closure: true, // Track closures
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
      callstack: true, // Include stack traces
    },

    matching: {
      read: {
        spread: false, // Noise for intermediate
      },
      assign: {
        destructure: true, // Enable destructuring
        rest: false,
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
      tagged: false,
    },

    symbols: {
      create: false,
      access: false,
    },

    parenthesis: {
      enter: false,
      leave: false,
    },

    classes: {
      staticBlock: false,
    },

    dynamic: {
      eval: false,
      function: false,
    },

    regex: false,

    meta: {
      proxy: false,
      reflect: false,
    },

    semantics: true,
  },

  meta: {
    index: true,
    location: 'line',
    ast: false,
    data: {
      type: true,
      instance: true,
      value: true,
      lookup: false,
    },
    references: true,
    debug: {
      configPath: false,
      AranNodeId: false,
      adviceName: false,
    },
    timestamps: false, // Performance consideration
  },
};

export default detailed;
