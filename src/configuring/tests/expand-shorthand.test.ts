import expandShorthand from '../expand-shorthand.js';
import type { Config } from '../types.js';

describe('expandShorthand', () => {
  describe('meta section expansion', () => {
    describe('meta: true', () => {
      it('meta is defined', () => {
        const config: Config = { meta: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta).toBeDefined();
      });

      it('meta is object', () => {
        const config: Config = { meta: true as any };
        const expanded = expandShorthand(config);
        expect(typeof expanded.meta).toBe('object');
      });

      it('meta.index is defined', () => {
        const config: Config = { meta: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.index).toBeDefined();
      });

      it('meta.location is defined', () => {
        const config: Config = { meta: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.location).toBeDefined();
      });

      it('meta.data is defined', () => {
        const config: Config = { meta: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.data).toBeDefined();
      });
    });

    describe('meta: false', () => {
      it('meta is defined', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta).toBeDefined();
      });

      it('meta is object', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(typeof expanded.meta).toBe('object');
      });

      it('meta.index = false', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.index).toBe(false);
      });

      it('meta.location = false', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.location).toBe(false);
      });

      it('meta.ast = false', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.ast).toBe(false);
      });

      it('meta.data.type = false', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.data?.type).toBe(false);
      });

      it('meta.data.value = false', () => {
        const config: Config = { meta: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.meta?.data?.value).toBe(false);
      });
    });

    describe('explicit meta config', () => {
      const config: Config = {
        meta: {
          index: true,
          location: 'line',
          ast: false,
        },
      };

      it('meta.index = true', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.index).toBe(true);
      });

      it('meta.location = "line"', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.location).toBe('line');
      });

      it('meta.ast = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.ast).toBe(false);
      });
    });
  });

  describe('lang section expansion', () => {
    describe('lang: true', () => {
      it('lang is defined', () => {
        const config: Config = { lang: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang).toBeDefined();
      });

      it('lang is object', () => {
        const config: Config = { lang: true as any };
        const expanded = expandShorthand(config);
        expect(typeof expanded.lang).toBe('object');
      });

      it('lang.bindings is defined', () => {
        const config: Config = { lang: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings).toBeDefined();
      });

      it('lang.functions is defined', () => {
        const config: Config = { lang: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.functions).toBeDefined();
      });

      it('lang.controlFlow is defined', () => {
        const config: Config = { lang: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.controlFlow).toBeDefined();
      });

      it('lang.operators is defined', () => {
        const config: Config = { lang: true as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.operators).toBeDefined();
      });
    });

    describe('lang: false', () => {
      it('lang is defined', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang).toBeDefined();
      });

      it('lang is object', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(typeof expanded.lang).toBe('object');
      });

      it('lang.semantics = false', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.semantics).toBe(false);
      });

      it('lang.bindings.kind.declarative.var = false', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.var).toBe(false);
      });

      it('lang.bindings.kind.declarative.let = false', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.let).toBe(false);
      });

      it('lang.bindings.events.declare = false', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.events?.declare).toBe(false);
      });

      it('lang.bindings.filter.include = []', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.filter?.include).toEqual([]);
      });

      it('lang.bindings.filter.exclude = []', () => {
        const config: Config = { lang: false as any };
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.filter?.exclude).toEqual([]);
      });
    });

    describe('lang.bindings: true', () => {
      const config: Config = { lang: { bindings: true as any } };

      it('lang.bindings is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings).toBeDefined();
      });

      it('lang.bindings.kind is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind).toBeDefined();
      });

      it('lang.bindings.kind.declarative is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative).toBeDefined();
      });

      it('lang.bindings.kind.declarative.var is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      });

      it('lang.bindings.events is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.events).toBeDefined();
      });

      it('lang.bindings.filter is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.filter).toBeDefined();
      });
    });

    describe('lang.bindings: false', () => {
      const config: Config = { lang: { bindings: false as any } };

      it('lang.bindings is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings).toBeDefined();
      });

      it('lang.bindings.kind.declarative.var = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.var).toBe(false);
      });

      it('lang.bindings.kind.declarative.let = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.let).toBe(false);
      });

      it('lang.bindings.kind.explicit.parameters = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.explicit?.parameters).toBe(false);
      });

      it('lang.bindings.events.declare = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.events?.declare).toBe(false);
      });

      it('lang.bindings.filter.include = []', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.filter?.include).toEqual([]);
      });
    });

    describe('deeply nested: lang.bindings.kind.declarative: true', () => {
      const config: Config = {
        lang: {
          bindings: {
            kind: {
              declarative: true as any,
            },
          },
        },
      };

      it('lang.bindings.kind.declarative is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative).toBeDefined();
      });

      it('lang.bindings.kind.declarative.var is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      });

      it('lang.bindings.kind.declarative.let is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      });

      it('lang.bindings.kind.declarative.const is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.const).toBeDefined();
      });

      it('lang.bindings.kind.declarative.function is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.function).toBeDefined();
      });

      it('lang.bindings.kind.declarative.class is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.class).toBeDefined();
      });

      it('lang.bindings.kind.declarative.import is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind?.declarative?.import).toBeDefined();
      });
    });

    describe('lang.operators: true', () => {
      const config: Config = { lang: { operators: true as any } };

      it('lang.operators is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.operators).toBeDefined();
      });

      it('lang.operators.pure is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.operators?.pure).toBeDefined();
      });

      it('lang.operators.mutating is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.operators?.mutating).toBeDefined();
      });

      it('lang.operators.shortCircuiting is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.operators?.shortCircuiting).toBeDefined();
      });
    });

    describe('mixed explicit and shorthand', () => {
      const config: Config = {
        lang: {
          bindings: true as any,
          functions: {
            kind: {
              arrow: true,
              function: false,
              method: true,
              generator: false,
              builtIn: false,
            },
            events: {
              definition: true,
              call: { arguments: false },
              construct: false,
              return: true,
              coroutines: {
                await: true,
                yield: false,
                yieldDelegate: false,
              },
            },
          },
          controlFlow: false as any,
        },
      };

      it('bindings shorthand expanded → kind is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind).toBeDefined();
      });

      it('bindings shorthand expanded → events is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.events).toBeDefined();
      });

      it('explicit functions.kind.arrow = true', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.functions?.kind?.arrow).toBe(true);
      });

      it('explicit functions.kind.function = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.functions?.kind?.function).toBe(false);
      });

      it('explicit functions.events.call.arguments = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.functions?.events?.call?.arguments).toBe(false);
      });

      it('controlFlow shorthand false → kind.conditionals = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.controlFlow?.kind?.conditionals).toBe(false);
      });

      it('controlFlow shorthand false → kind.loops.while = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.controlFlow?.kind?.loops?.while).toBe(false);
      });

      it('controlFlow shorthand false → events.test = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.controlFlow?.events?.test).toBe(false);
      });
    });
  });

  describe('presets field handling', () => {
    describe('presets string passthrough', () => {
      it('presets = "variables"', () => {
        const config: Config = { presets: 'variables' };
        const expanded = expandShorthand(config);
        expect(expanded.presets).toBe('variables');
      });
    });

    describe('config with all sections', () => {
      const config: Config = {
        presets: 'custom',
        meta: {
          index: true,
          location: 'full',
        },
        lang: {
          bindings: true as any,
          operators: false as any,
        },
      };

      it('presets = "custom"', () => {
        const expanded = expandShorthand(config);
        expect(expanded.presets).toBe('custom');
      });

      it('meta.index = true', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.index).toBe(true);
      });

      it('meta.location = "full"', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.location).toBe('full');
      });

      it('lang.bindings.kind is defined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.bindings?.kind).toBeDefined();
      });

      it('lang.operators.pure = false', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang?.operators?.pure).toBe(false);
      });
    });
  });

  describe('edge cases', () => {
    describe('empty config', () => {
      it('expanded is defined', () => {
        const config: Config = {};
        const expanded = expandShorthand(config);
        expect(expanded).toBeDefined();
      });

      it('expanded equals {}', () => {
        const config: Config = {};
        const expanded = expandShorthand(config);
        expect(expanded).toEqual({});
      });
    });

    describe('config with only presets', () => {
      const config: Config = { presets: 'overview' };

      it('presets = "overview"', () => {
        const expanded = expandShorthand(config);
        expect(expanded.presets).toBe('overview');
      });

      it('meta is undefined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta).toBeUndefined();
      });

      it('lang is undefined', () => {
        const expanded = expandShorthand(config);
        expect(expanded.lang).toBeUndefined();
      });
    });

    describe('null values', () => {
      const config: Config = {
        meta: {
          default: null,
          maxIterations: null,
          maxCallstack: null,
        },
      };

      it('meta.default is null', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.default).toBeNull();
      });

      it('meta.maxIterations is null', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.maxIterations).toBeNull();
      });

      it('meta.maxCallstack is null', () => {
        const expanded = expandShorthand(config);
        expect(expanded.meta?.maxCallstack).toBeNull();
      });
    });
  });
});
