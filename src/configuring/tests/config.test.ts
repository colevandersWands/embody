import createConfig from '../create.js';
import defaultConfig from '../default-config.js';
import expandShorthand from '../expand-shorthand.js';
import overview from '../presets/overview.js';
import detailed from '../presets/detailed.js';
import exhaustive from '../presets/exhaustive.js';

import type { Config, ExpandedConfig } from '../types.js';

describe('Configuration System', () => {
  describe('structure', () => {
    describe('top-level sections', () => {
      it('meta is defined', () => {
        const config = createConfig({});
        expect(config.meta).toBeDefined();
      });

      it('lang is defined', () => {
        const config = createConfig({});
        expect(config.lang).toBeDefined();
      });

      it('presets is undefined by default', () => {
        const config = createConfig({});
        expect(config.presets).toBeUndefined();
      });
    });

    describe('old top-level fields removed', () => {
      it('variables is undefined', () => {
        const config = createConfig({});
        expect((config as any).variables).toBeUndefined();
      });

      it('functions is undefined', () => {
        const config = createConfig({});
        expect((config as any).functions).toBeUndefined();
      });

      it('operators is undefined', () => {
        const config = createConfig({});
        expect((config as any).operators).toBeUndefined();
      });

      it('async is undefined', () => {
        const config = createConfig({});
        expect((config as any).async).toBeUndefined();
      });

      it('errors is undefined', () => {
        const config = createConfig({});
        expect((config as any).errors).toBeUndefined();
      });
    });

    describe('lang.bindings configuration', () => {
      const config = createConfig({
        lang: {
          bindings: {
            kind: {
              declarative: {
                var: true,
                let: true,
                const: false,
              },
            },
            events: {
              declare: true,
              assign: true,
              read: false,
            },
          },
        },
      });

      it('kind.declarative.var = true', () => {
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });

      it('kind.declarative.let = true', () => {
        expect(config.lang?.bindings?.kind?.declarative?.let).toBe(true);
      });

      it('kind.declarative.const = false', () => {
        expect(config.lang?.bindings?.kind?.declarative?.const).toBe(false);
      });

      it('events.declare = true', () => {
        expect(config.lang?.bindings?.events?.declare).toBe(true);
      });

      it('events.assign = true', () => {
        expect(config.lang?.bindings?.events?.assign).toBe(true);
      });

      it('events.read = false', () => {
        expect(config.lang?.bindings?.events?.read).toBe(false);
      });
    });

    describe('lang.functions configuration', () => {
      const config = createConfig({
        lang: {
          functions: {
            kind: {
              arrow: true,
              function: false,
              method: true,
            },
            events: {
              definition: true,
              call: { arguments: false },
              return: true,
            },
          },
        },
      });

      it('kind.arrow = true', () => {
        expect(config.lang?.functions?.kind?.arrow).toBe(true);
      });

      it('kind.function = false', () => {
        expect(config.lang?.functions?.kind?.function).toBe(false);
      });

      it('events.definition = true', () => {
        expect(config.lang?.functions?.events?.definition).toBe(true);
      });

      it('events.call.arguments = false', () => {
        expect(config.lang?.functions?.events?.call?.arguments).toBe(false);
      });
    });

    describe('lang.operators configuration', () => {
      const config = createConfig({
        lang: {
          operators: {
            pure: true,
            mutating: false,
            shortCircuiting: true,
          },
        },
      });

      it('pure = true', () => {
        expect(config.lang?.operators?.pure).toBe(true);
      });

      it('mutating = false', () => {
        expect(config.lang?.operators?.mutating).toBe(false);
      });

      it('shortCircuiting = true', () => {
        expect(config.lang?.operators?.shortCircuiting).toBe(true);
      });
    });

    describe('lang.functions.events.coroutines configuration', () => {
      const config = createConfig({
        lang: {
          functions: {
            events: {
              coroutines: {
                await: true,
                yield: false,
                yieldDelegate: false,
              },
            },
          },
        },
        meta: {
          timestamps: true,
        },
      });

      it('await = true', () => {
        expect(config.lang?.functions?.events?.coroutines?.await).toBe(true);
      });

      it('meta.timestamps = true', () => {
        expect(config.meta?.timestamps).toBe(true);
      });
    });
  });

  describe('type definitions', () => {
    describe('Config type structure', () => {
      const config: Config = {
        presets: 'overview',
        meta: {
          index: true,
          location: 'line',
        },
        lang: {
          semantics: true,
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
            },
          },
        },
      };

      it('presets = "overview"', () => {
        expect(config.presets).toBe('overview');
      });

      it('meta.index = true', () => {
        expect(config.meta?.index).toBe(true);
      });

      it('lang.bindings.kind.declarative.var = true', () => {
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });
    });

    describe('Partial<Config> for user input', () => {
      it('accepts partial config', () => {
        const userConfig: Partial<Config> = {
          presets: 'detailed',
          meta: {
            ast: true,
          },
        };
        const config = createConfig(userConfig);
        expect(config.presets).toBe('detailed');
      });

      it('preserves partial meta values', () => {
        const userConfig: Partial<Config> = {
          presets: 'detailed',
          meta: {
            ast: true,
          },
        };
        const config = createConfig(userConfig);
        expect(config.meta?.ast).toBe(true);
      });
    });
  });

  describe('default configuration', () => {
    describe('sensible defaults', () => {
      it('meta.index = true', () => {
        const config = createConfig();
        expect(config.meta?.index).toBe(true);
      });

      it('meta.location = "line"', () => {
        const config = createConfig();
        expect(config.meta?.location).toBe('line');
      });

      it('meta.ast = true', () => {
        const config = createConfig();
        expect(config.meta?.ast).toBe(true);
      });

      it('lang.semantics = true', () => {
        const config = createConfig();
        expect(config.lang?.semantics).toBe(true);
      });

      it('lang.bindings is defined', () => {
        const config = createConfig();
        expect(config.lang?.bindings).toBeDefined();
      });

      it('lang.functions is defined', () => {
        const config = createConfig();
        expect(config.lang?.functions).toBeDefined();
      });
    });

    describe('defaultConfig structure', () => {
      it('meta is defined', () => {
        expect(defaultConfig.meta).toBeDefined();
      });

      it('lang is defined', () => {
        expect(defaultConfig.lang).toBeDefined();
      });

      it('presets is undefined', () => {
        expect(defaultConfig.presets).toBeUndefined();
      });
    });
  });

  describe('preset system', () => {
    describe('preset availability', () => {
      it('overview is defined', () => {
        expect(overview).toBeDefined();
      });

      it('detailed is defined', () => {
        expect(detailed).toBeDefined();
      });

      it('exhaustive is defined', () => {
        expect(exhaustive).toBeDefined();
      });
    });

    describe('overview preset → minimal detail', () => {
      it('lang.bindings.events.read = false', () => {
        const config = createConfig({ presets: 'overview' });
        expect(config.lang?.bindings?.events?.read).toBe(false);
      });

      it('lang.operators.pure = false', () => {
        const config = createConfig({ presets: 'overview' });
        expect(config.lang?.operators?.pure).toBe(false);
      });

      it('meta.location = "line"', () => {
        const config = createConfig({ presets: 'overview' });
        expect(config.meta?.location).toBe('line');
      });
    });

    describe('detailed preset → balanced detail', () => {
      it('lang.bindings.events.read = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.bindings?.events?.read).toBe(true);
      });

      it('lang.operators.pure = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.operators?.pure).toBe(true);
      });

      it('lang.scopes.kind.block = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.scopes?.kind?.block).toBe(true);
      });

      it('lang.bindings.kind.implicit.this = false', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.bindings?.kind?.implicit?.this).toBe(false);
      });
    });

    describe('exhaustive preset → maximum detail', () => {
      it('lang.bindings.kind.implicit.global = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.bindings?.kind?.implicit?.global).toBe(true);
      });

      it('lang.bindings.kind.implicit.this = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.bindings?.kind?.implicit?.this).toBe(true);
      });

      it('lang.operators.coercion = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.operators?.coercion).toBe(true);
      });

      it('lang.dynamic.eval = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.dynamic?.eval).toBe(true);
      });

      it('meta.debug.configPath = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.meta?.debug?.configPath).toBe(true);
      });
    });

    describe('user overrides take precedence', () => {
      it('override overview read=false → read=true', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: {
              events: {
                read: true,
              },
            },
          },
        });
        expect(config.lang?.bindings?.events?.read).toBe(true);
      });
    });
  });

  describe('boolean shorthand expansion', () => {
    describe('lang: true', () => {
      it('lang is defined', () => {
        const expanded = expandShorthand({ lang: true as any });
        expect(expanded.lang).toBeDefined();
      });

      it('lang is object', () => {
        const expanded = expandShorthand({ lang: true as any });
        expect(typeof expanded.lang).toBe('object');
      });

      it('lang.bindings is defined', () => {
        const expanded = expandShorthand({ lang: true as any });
        expect(expanded.lang?.bindings).toBeDefined();
      });

      it('lang.functions is defined', () => {
        const expanded = expandShorthand({ lang: true as any });
        expect(expanded.lang?.functions).toBeDefined();
      });
    });

    describe('lang: false', () => {
      it('lang is defined', () => {
        const expanded = expandShorthand({ lang: false as any });
        expect(expanded.lang).toBeDefined();
      });

      it('lang.semantics = false', () => {
        const expanded = expandShorthand({ lang: false as any });
        expect(expanded.lang?.semantics).toBe(false);
      });

      it('lang.bindings.kind.declarative.var = false', () => {
        const expanded = expandShorthand({ lang: false as any });
        expect(expanded.lang?.bindings?.kind?.declarative?.var).toBe(false);
      });
    });

    describe('nested boolean shorthand', () => {
      it('bindings: true → kind is defined', () => {
        const expanded = expandShorthand({
          lang: {
            bindings: true as any,
            operators: false as any,
          },
        });
        expect(expanded.lang?.bindings?.kind).toBeDefined();
      });

      it('operators: false → pure = false', () => {
        const expanded = expandShorthand({
          lang: {
            bindings: true as any,
            operators: false as any,
          },
        });
        expect(expanded.lang?.operators?.pure).toBe(false);
      });
    });

    describe('meta: true', () => {
      it('meta is defined', () => {
        const expanded = expandShorthand({ meta: true as any });
        expect(expanded.meta).toBeDefined();
      });

      it('meta is object', () => {
        const expanded = expandShorthand({ meta: true as any });
        expect(typeof expanded.meta).toBe('object');
      });

      it('meta.index is defined', () => {
        const expanded = expandShorthand({ meta: true as any });
        expect(expanded.meta?.index).toBeDefined();
      });
    });

    describe('deeply nested shorthand', () => {
      it('declarative: true → var is defined', () => {
        const expanded = expandShorthand({
          lang: {
            bindings: {
              kind: {
                declarative: true as any,
              },
            },
          },
        });
        expect(expanded.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      });

      it('declarative: true → let is defined', () => {
        const expanded = expandShorthand({
          lang: {
            bindings: {
              kind: {
                declarative: true as any,
              },
            },
          },
        });
        expect(expanded.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      });
    });
  });

  describe('error handling and validation', () => {
    describe('invalid preset', () => {
      it('config is defined', () => {
        const config = createConfig({
          presets: 'invalid-preset' as any,
        });
        expect(config).toBeDefined();
      });

      it('meta is defined', () => {
        const config = createConfig({
          presets: 'invalid-preset' as any,
        });
        expect(config.meta).toBeDefined();
      });

      it('lang is defined', () => {
        const config = createConfig({
          presets: 'invalid-preset' as any,
        });
        expect(config.lang).toBeDefined();
      });
    });

    describe('wrong type for presets', () => {
      it('config is defined', () => {
        const config = createConfig({
          presets: 123 as any,
        });
        expect(config).toBeDefined();
      });

      it('presets is undefined', () => {
        const config = createConfig({
          presets: 123 as any,
        });
        expect(config.presets).toBeUndefined();
      });
    });

    describe('unknown fields removed', () => {
      it('unknownField is undefined', () => {
        const config = createConfig({
          unknownField: 'should be removed',
          lang: {
            bindings: {
              kind: {
                declarative: {
                  var: true,
                },
              },
            },
          },
        } as any);
        expect((config as any).unknownField).toBeUndefined();
      });

      it('lang.unknownSection is undefined', () => {
        const config = createConfig({
          lang: {
            unknownSection: 'also removed',
            bindings: {
              kind: {
                declarative: {
                  var: true,
                },
              },
            },
          },
        } as any);
        expect((config.lang as any)?.unknownSection).toBeUndefined();
      });

      it('valid nested value preserved', () => {
        const config = createConfig({
          lang: {
            unknownSection: 'also removed',
            bindings: {
              kind: {
                declarative: {
                  var: true,
                },
              },
            },
          },
        } as any);
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });
    });

    describe('null and undefined handling', () => {
      it('null index → default true', () => {
        const config = createConfig({
          meta: {
            index: null as any,
            location: undefined as any,
          },
        });
        expect(config.meta?.index).toBe(true);
      });

      it('undefined location → default "line"', () => {
        const config = createConfig({
          meta: {
            index: null as any,
            location: undefined as any,
          },
        });
        expect(config.meta?.location).toBe('line');
      });
    });

    describe('location enum validation', () => {
      it('valid "full" preserved', () => {
        const config = createConfig({
          meta: { location: 'full' },
        });
        expect(config.meta?.location).toBe('full');
      });

      it('valid false preserved', () => {
        const config = createConfig({
          meta: { location: false as any },
        });
        expect(config.meta?.location).toBe(false);
      });

      it('invalid "invalid" → default "line"', () => {
        const config = createConfig({
          meta: { location: 'invalid' as any },
        });
        expect(config.meta?.location).toBe('line');
      });
    });
  });

  describe('real-world usage patterns', () => {
    describe('debugging configuration', () => {
      const debugConfig: Partial<Config> = {
        presets: 'exhaustive',
        meta: {
          debug: {
            configPath: true,
            AranNodeId: true,
            adviceName: true,
          },
          location: 'full',
          ast: true,
        },
        lang: {
          bindings: {
            events: {
              declare: true,
              initialize: true,
              assign: true,
              read: true,
            },
          },
          errorHandling: {
            throw: true,
            catch: true,
            callstack: true,
          },
        },
      };
      const config = createConfig(debugConfig);

      it('meta.debug.configPath = true', () => {
        expect(config.meta?.debug?.configPath).toBe(true);
      });

      it('meta.location = "full"', () => {
        expect(config.meta?.location).toBe('full');
      });

      it('lang.bindings.events.read = true', () => {
        expect(config.lang?.bindings?.events?.read).toBe(true);
      });

      it('lang.errorHandling.callstack = true', () => {
        expect(config.lang?.errorHandling?.callstack).toBe(true);
      });
    });

    describe('production configuration', () => {
      const prodConfig: Partial<Config> = {
        presets: 'overview',
        meta: {
          index: false,
          ast: false,
          debug: {
            configPath: false,
            AranNodeId: false,
            adviceName: false,
          },
        },
        lang: {
          bindings: {
            events: {
              read: false,
            },
          },
          errorHandling: {
            callstack: false,
          },
        },
      };
      const config = createConfig(prodConfig);

      it('meta.index = false', () => {
        expect(config.meta?.index).toBe(false);
      });

      it('meta.ast = false', () => {
        expect(config.meta?.ast).toBe(false);
      });

      it('lang.bindings.events.read = false', () => {
        expect(config.lang?.bindings?.events?.read).toBe(false);
      });
    });

    describe('async execution study scenario', () => {
      const asyncConfig: Partial<Config> = {
        meta: {
          timestamps: true,
        },
        lang: {
          functions: {
            events: {
              call: { arguments: true },
              coroutines: {
                await: true,
                yield: true,
              },
            },
          },
          bindings: {
            filter: {
              include: ['promise', 'result', 'error'],
            },
          },
        },
      };
      const config = createConfig(asyncConfig);

      it('meta.timestamps = true', () => {
        expect(config.meta?.timestamps).toBe(true);
      });

      it('lang.functions.events.coroutines.await = true', () => {
        expect(config.lang?.functions?.events?.coroutines?.await).toBe(true);
      });

      it('lang.functions.events.call.arguments = true', () => {
        expect(config.lang?.functions?.events?.call?.arguments).toBe(true);
      });

      it('lang.bindings.filter.include = ["promise", "result", "error"]', () => {
        expect(config.lang?.bindings?.filter?.include).toEqual(['promise', 'result', 'error']);
      });
    });
  });

  describe('config pipeline integration', () => {
    describe('preset + override + expansion + sanitization', () => {
      const userConfig: Partial<Config> = {
        presets: 'detailed',
        lang: {
          bindings: true as any,
          operators: {
            pure: false,
            mutating: true,
          },
        },
        meta: {
          location: 'full',
        },
      };
      const config = createConfig(userConfig);

      it('presets = "detailed"', () => {
        expect(config.presets).toBe('detailed');
      });

      it('shorthand expanded → lang.bindings.kind is defined', () => {
        expect(config.lang?.bindings?.kind).toBeDefined();
      });

      it('override applied → lang.operators.pure = false', () => {
        expect(config.lang?.operators?.pure).toBe(false);
      });

      it('override applied → meta.location = "full"', () => {
        expect(config.meta?.location).toBe('full');
      });

      it('detailed preset preserved → lang.scopes.kind.block = true', () => {
        expect(config.lang?.scopes?.kind?.block).toBe(true);
      });
    });

    describe('complete custom configuration', () => {
      const customConfig: Partial<Config> = {
        meta: {
          index: false,
          location: false,
          ast: true,
          data: {
            type: true,
            instance: false,
            value: true,
            lookup: false,
          },
        },
        lang: {
          semantics: false,
          bindings: {
            kind: {
              declarative: {
                var: false,
                let: true,
                const: true,
                function: false,
                class: false,
                import: false,
              },
              explicit: {
                parameters: true,
                catch: false,
              },
              implicit: {
                global: false,
                arguments: false,
                this: false,
                callee: false,
                newTarget: false,
                super: false,
                importMeta: false,
              },
            },
            events: {
              declare: false,
              available: true,
              initialize: true,
              implicit: false,
              assign: true,
              read: false,
            },
          },
        },
      };
      const config = createConfig(customConfig);

      it('meta.index = false', () => {
        expect(config.meta?.index).toBe(false);
      });

      it('meta.location = false', () => {
        expect(config.meta?.location).toBe(false);
      });

      it('meta.data.instance = false', () => {
        expect(config.meta?.data?.instance).toBe(false);
      });

      it('lang.semantics = false', () => {
        expect(config.lang?.semantics).toBe(false);
      });

      it('lang.bindings.kind.declarative.var = false', () => {
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(false);
      });

      it('lang.bindings.kind.declarative.let = true', () => {
        expect(config.lang?.bindings?.kind?.declarative?.let).toBe(true);
      });

      it('lang.bindings.kind.explicit.parameters = true', () => {
        expect(config.lang?.bindings?.kind?.explicit?.parameters).toBe(true);
      });

      it('lang.bindings.events.read = false', () => {
        expect(config.lang?.bindings?.events?.read).toBe(false);
      });
    });
  });

  describe('TypeScript type safety', () => {
    describe('compile-time type enforcement', () => {
      it('Config type is valid', () => {
        const config: Config = {
          presets: 'overview',
          meta: {
            index: true,
            location: 'line',
            ast: false,
          },
          lang: {
            bindings: {
              kind: {
                declarative: {
                  var: true,
                  let: true,
                  const: false,
                  function: true,
                  class: false,
                  import: false,
                },
              },
            },
          },
        };
        expect(config).toBeDefined();
      });
    });

    describe('partial configs', () => {
      it('accepts partial config', () => {
        const partial: Partial<Config> = {
          meta: {
            index: false,
          },
        };
        const config = createConfig(partial);
        expect(config.meta?.index).toBe(false);
      });
    });

    describe('ExpandedConfig extends Config', () => {
      it('meta is defined', () => {
        const expanded: ExpandedConfig = createConfig({
          lang: true as any,
        });
        expect(expanded.meta).toBeDefined();
      });

      it('lang is defined', () => {
        const expanded: ExpandedConfig = createConfig({
          lang: true as any,
        });
        expect(expanded.lang).toBeDefined();
      });
    });
  });
});
