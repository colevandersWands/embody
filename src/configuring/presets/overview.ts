/**
 * @file Overview preset for educational execution tracer
 *
 * High-level execution flow only - beginner-friendly configuration
 * Good for: Understanding program structure, following main logic
 *
 * Features enabled:
 * - Variable declarations (all types except implicit globals)
 * - Variable assignments (to see data flow)
 * - Function calls and declarations (core execution flow)
 * - Object instantiation (new expressions)
 * - Conditional branching (if/else decisions)
 * - Global, function, and module scopes
 * - Error handling basics (throw/catch)
 * - Basic async operations (await)
 * - Data structure reads (property access)
 *
 * Features disabled:
 * - Variable reads (reduces noise)
 * - Loop conditions and switch statements (too much detail)
 * - Operators (focus on higher-level flow)
 * - Block scopes and closures (advanced concepts)
 * - Modern syntax patterns (spread, destructuring)
 * - Prototype lookups and coercion (advanced concepts)
 *
 * @see README.md for complete preset documentation
 */

import { Config } from '../types.js';

const overview: Partial<Config> = {
  lang: {
    bindings: {
      kind: {
        declarative: {
          var: true,
          let: true,
          const: true,
          function: true,
          class: false,
          import: false,
        },
        explicit: {
          parameters: false,
          catch: false,
        },
        implicit: {
          global: false,
          arguments: false,
          callee: false,
          this: false,
          newTarget: false,
          super: false,
          importMeta: false,
        },
        with: false,
      },
      events: {
        declare: false, // Hide hoisting complexity
        available: true, // When variable becomes usable
        initialize: true, // Initial value
        implicit: false,
        assign: true, // Value changes
        read: false, // Reduce noise
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
        generator: false,
        builtIn: false,
      },
      events: {
        definition: true,
        call: {
          arguments: false, // Hide argument details
        },
        construct: true, // new Class()
        return: false, // Reduce detail
        coroutines: {
          await: true,
          yield: false,
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
        conditionals: true, // if/else
        loops: {
          while: false, // Too much detail
          for: {
            initialize: false,
            test: false,
            increment: false,
          },
          forOf: false,
          forIn: false,
        },
        switch: false,
      },
      events: {
        test: true, // Condition evaluation
        branch: true, // Which branch taken
        iteration: false, // Loop iterations
        jump: false, // break/continue
      },
      filter: {
        include: [],
        exclude: [],
      },
    },

    properties: {
      create: {
        literal: false,
        computed: false,
        method: false,
        accessors: {
          getters: false,
          setters: false,
        },
        class: false,
        static: false,
        private: false,
        fields: false,
      },
      access: true, // Reading properties
      update: false, // Writing properties
      remove: false,
      optionalChaining: false,
      lookup: false, // Prototype chain
      filter: [],
    },

    scopes: {
      kind: {
        script: true,
        function: true,
        block: false, // Too detailed
        module: true,
        closure: false, // Advanced concept
      },
      events: {
        create: true,
        enter: true,
        interrupt: false,
        completion: false,
        leave: true,
      },
    },

    errorHandling: {
      throw: true,
      try: false,
      catch: true,
      finally: false,
      callstack: false,
    },

    operators: {
      pure: false,
      mutating: false,
      shortCircuiting: false,
      comma: false,
      coercion: false,
      filter: {
        include: [],
        exclude: [],
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
      load: false,
      await: true,
    },

    // Disabled features for simplicity
    references: {
      create: false,
      access: false,
      mutate: false,
    },
    parenthesis: {
      enter: false,
      leave: false,
    },
    templates: {
      literal: false,
      tagged: false,
    },
    symbols: {
      create: false,
      access: false,
    },
    matching: {
      read: {
        spread: false,
      },
      assign: {
        destructure: false,
        rest: false,
        defaultValues: false,
      },
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
    semantics: false,
  },

  meta: {
    index: true,
    location: 'line',
    ast: false,
    data: {
      type: true,
      instance: false,
      value: true,
      lookup: false,
    },
    references: false,
    debug: {
      configPath: false,
      AranNodeId: false,
      adviceName: false,
    },
    timestamps: false,
  },
};

export default overview;
