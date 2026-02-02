import createConfig from '../create.js';
import type { Config, ExpandedConfig } from '../types.js';

describe('createConfig', () => {
  describe('default configuration', () => {
    describe('no argument provided', () => {
      it('config is defined', () => {
        const config = createConfig();
        expect(config).toBeDefined();
      });

      it('presets is undefined', () => {
        const config = createConfig();
        expect(config.presets).toBeUndefined();
      });

      it('meta is defined', () => {
        const config = createConfig();
        expect(config.meta).toBeDefined();
      });

      it('lang is defined', () => {
        const config = createConfig();
        expect(config.lang).toBeDefined();
      });

      it('meta.index = true', () => {
        const config = createConfig();
        expect(config.meta?.index).toBe(true);
      });

      it('meta.location = "line"', () => {
        const config = createConfig();
        expect(config.meta?.location).toBe('line');
      });

      it('lang.semantics = true', () => {
        const config = createConfig();
        expect(config.lang?.semantics).toBe(true);
      });
    });

    describe('empty object provided', () => {
      it('presets is undefined', () => {
        const config = createConfig({});
        expect(config.presets).toBeUndefined();
      });

      it('meta is defined', () => {
        const config = createConfig({});
        expect(config.meta).toBeDefined();
      });

      it('lang is defined', () => {
        const config = createConfig({});
        expect(config.lang).toBeDefined();
      });
    });
  });

  describe('preset application', () => {
    describe('overview preset', () => {
      it('bindings.kind.declarative.var = true', () => {
        const config = createConfig({ presets: 'overview' });
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });

      it('bindings.events.read = false', () => {
        const config = createConfig({ presets: 'overview' });
        expect(config.lang?.bindings?.events?.read).toBe(false);
      });

      it('meta.location = "line"', () => {
        const config = createConfig({ presets: 'overview' });
        expect(config.meta?.location).toBe('line');
      });
    });

    describe('detailed preset', () => {
      it('bindings.kind.explicit.parameters = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.bindings?.kind?.explicit?.parameters).toBe(true);
      });

      it('bindings.events.declare = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.bindings?.events?.declare).toBe(true);
      });

      it('controlFlow.kind.loops.while = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.controlFlow?.kind?.loops?.while).toBe(true);
      });

      it('scopes.kind.block = true', () => {
        const config = createConfig({ presets: 'detailed' });
        expect(config.lang?.scopes?.kind?.block).toBe(true);
      });
    });

    describe('exhaustive preset', () => {
      it('bindings.kind.implicit.global = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.bindings?.kind?.implicit?.global).toBe(true);
      });

      it('operators.coercion = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.operators?.coercion).toBe(true);
      });

      it('dynamic.eval = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.lang?.dynamic?.eval).toBe(true);
      });

      it('meta.debug.configPath = true', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.meta?.debug?.configPath).toBe(true);
      });

      it('meta.location = "full"', () => {
        const config = createConfig({ presets: 'exhaustive' });
        expect(config.meta?.location).toBe('full');
      });
    });
  });

  describe('boolean shorthand expansion', () => {
    describe('lang: true', () => {
      it('lang is defined', () => {
        const config = createConfig({ lang: true as any });
        expect(config.lang).toBeDefined();
      });

      it('typeof lang = "object"', () => {
        const config = createConfig({ lang: true as any });
        expect(typeof config.lang).toBe('object');
      });

      it('lang.bindings is defined', () => {
        const config = createConfig({ lang: true as any });
        expect(config.lang?.bindings).toBeDefined();
      });

      it('lang.functions is defined', () => {
        const config = createConfig({ lang: true as any });
        expect(config.lang?.functions).toBeDefined();
      });

      it('lang.operators is defined', () => {
        const config = createConfig({ lang: true as any });
        expect(config.lang?.operators).toBeDefined();
      });
    });

    describe('lang: false', () => {
      it('lang is defined', () => {
        const config = createConfig({ lang: false as any });
        expect(config.lang).toBeDefined();
      });

      it('lang.semantics = false', () => {
        const config = createConfig({ lang: false as any });
        expect(config.lang?.semantics).toBe(false);
      });

      it('bindings.kind.declarative.var = false', () => {
        const config = createConfig({ lang: false as any });
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(false);
      });

      it('bindings.events.declare = false', () => {
        const config = createConfig({ lang: false as any });
        expect(config.lang?.bindings?.events?.declare).toBe(false);
      });
    });

    describe('nested boolean shorthand', () => {
      it('bindings: true → bindings.kind is defined', () => {
        const config = createConfig({
          lang: { bindings: true as any, operators: false as any },
        });
        expect(config.lang?.bindings?.kind).toBeDefined();
      });

      it('bindings: true → bindings.events is defined', () => {
        const config = createConfig({
          lang: { bindings: true as any, operators: false as any },
        });
        expect(config.lang?.bindings?.events).toBeDefined();
      });

      it('operators: false → operators.pure = false', () => {
        const config = createConfig({
          lang: { bindings: true as any, operators: false as any },
        });
        expect(config.lang?.operators?.pure).toBe(false);
      });

      it('operators: false → operators.mutating = false', () => {
        const config = createConfig({
          lang: { bindings: true as any, operators: false as any },
        });
        expect(config.lang?.operators?.mutating).toBe(false);
      });
    });

    describe('meta: true', () => {
      it('meta is defined', () => {
        const config = createConfig({ meta: true as any });
        expect(config.meta).toBeDefined();
      });

      it('typeof meta = "object"', () => {
        const config = createConfig({ meta: true as any });
        expect(typeof config.meta).toBe('object');
      });

      it('meta.index is defined', () => {
        const config = createConfig({ meta: true as any });
        expect(config.meta?.index).toBeDefined();
      });

      it('meta.location is defined', () => {
        const config = createConfig({ meta: true as any });
        expect(config.meta?.location).toBeDefined();
      });

      it('meta.data is defined', () => {
        const config = createConfig({ meta: true as any });
        expect(config.meta?.data).toBeDefined();
      });
    });
  });

  describe('user overrides with presets', () => {
    describe('overview preset with overrides', () => {
      it('user override wins: bindings.events.read = true', () => {
        const config = createConfig({
          presets: 'overview',
          lang: { bindings: { events: { read: true } } },
          meta: { location: 'full' },
        });
        expect(config.lang?.bindings?.events?.read).toBe(true);
      });

      it('user override wins: meta.location = "full"', () => {
        const config = createConfig({
          presets: 'overview',
          lang: { bindings: { events: { read: true } } },
          meta: { location: 'full' },
        });
        expect(config.meta?.location).toBe('full');
      });

      it('preset values preserved for other fields', () => {
        const config = createConfig({
          presets: 'overview',
          lang: { bindings: { events: { read: true } } },
          meta: { location: 'full' },
        });
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });
    });

    describe('detailed preset with deep overrides', () => {
      it('deep override applied: implicit.this = true', () => {
        const config = createConfig({
          presets: 'detailed',
          lang: { bindings: { kind: { implicit: { this: true } } } },
        });
        expect(config.lang?.bindings?.kind?.implicit?.this).toBe(true);
      });

      it('other preset values preserved: implicit.global = true', () => {
        const config = createConfig({
          presets: 'detailed',
          lang: { bindings: { kind: { implicit: { this: true } } } },
        });
        expect(config.lang?.bindings?.kind?.implicit?.global).toBe(true);
      });
    });
  });

  describe('sanitization and validation', () => {
    describe('invalid preset name', () => {
      it('config is defined', () => {
        const config = createConfig({ presets: 'invalid-preset' as any });
        expect(config).toBeDefined();
      });

      it('meta is defined', () => {
        const config = createConfig({ presets: 'invalid-preset' as any });
        expect(config.meta).toBeDefined();
      });

      it('lang is defined', () => {
        const config = createConfig({ presets: 'invalid-preset' as any });
        expect(config.lang).toBeDefined();
      });
    });

    describe('wrong type for presets field', () => {
      it('config is defined', () => {
        const config = createConfig({ presets: 123 as any });
        expect(config).toBeDefined();
      });

      it('presets is undefined', () => {
        const config = createConfig({ presets: 123 as any });
        expect(config.presets).toBeUndefined();
      });
    });

    describe('unknown fields removed', () => {
      it('top-level unknown field removed', () => {
        const config = createConfig({
          presets: 'overview',
          unknownField: 'should be removed',
          lang: {
            bindings: {
              kind: { declarative: { var: true } },
              unknownNestedField: 'should also be removed',
            },
          },
        } as any);
        expect((config as any).unknownField).toBeUndefined();
      });

      it('nested unknown field removed', () => {
        const config = createConfig({
          presets: 'overview',
          unknownField: 'should be removed',
          lang: {
            bindings: {
              kind: { declarative: { var: true } },
              unknownNestedField: 'should also be removed',
            },
          },
        } as any);
        expect((config.lang?.bindings as any)?.unknownNestedField).toBeUndefined();
      });

      it('valid fields preserved', () => {
        const config = createConfig({
          presets: 'overview',
          unknownField: 'should be removed',
          lang: {
            bindings: {
              kind: { declarative: { var: true } },
              unknownNestedField: 'should also be removed',
            },
          },
        } as any);
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });
    });

    describe('null and undefined values', () => {
      it('null → uses default: meta.index = true', () => {
        const config = createConfig({
          meta: { index: null as any, location: undefined as any },
        });
        expect(config.meta?.index).toBe(true);
      });

      it('undefined → uses default: meta.location = "line"', () => {
        const config = createConfig({
          meta: { index: null as any, location: undefined as any },
        });
        expect(config.meta?.location).toBe('line');
      });
    });

    describe('location enum validation', () => {
      it('valid enum value preserved: "full"', () => {
        const config = createConfig({ meta: { location: 'full' } });
        expect(config.meta?.location).toBe('full');
      });

      it('invalid enum value → uses default: "line"', () => {
        const config = createConfig({ meta: { location: 'invalid' as any } });
        expect(config.meta?.location).toBe('line');
      });
    });
  });

  describe('complete pipeline', () => {
    describe('preset + override + shorthand + sanitization', () => {
      it('presets = "overview"', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.presets).toBe('overview');
      });

      it('boolean shorthand expanded: bindings.kind defined', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.lang?.bindings?.kind).toBeDefined();
      });

      it('boolean shorthand expanded: bindings.events defined', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.lang?.bindings?.events).toBeDefined();
      });

      it('user override: operators.pure = true', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.lang?.operators?.pure).toBe(true);
      });

      it('user override: operators.mutating = false', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.lang?.operators?.mutating).toBe(false);
      });

      it('user override: meta.ast = true', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.meta?.ast).toBe(true);
      });

      it('user override: meta.location = "full"', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect(config.meta?.location).toBe('full');
      });

      it('unknown field removed', () => {
        const config = createConfig({
          presets: 'overview',
          lang: {
            bindings: true as any,
            operators: { pure: true, mutating: false },
          },
          meta: { ast: true, location: 'full' },
          unknownField: 'remove me',
        } as any);
        expect((config as any).unknownField).toBeUndefined();
      });
    });

    describe('preserves valid fields from defaults', () => {
      it('user override applied: declarative.var = false', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: { var: false } } } },
        });
        expect(config.lang?.bindings?.kind?.declarative?.var).toBe(false);
      });

      it('default preserved: declarative.let defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: { var: false } } } },
        });
        expect(config.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      });

      it('default preserved: declarative.const defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: { var: false } } } },
        });
        expect(config.lang?.bindings?.kind?.declarative?.const).toBeDefined();
      });

      it('default preserved: lang.functions defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: { var: false } } } },
        });
        expect(config.lang?.functions).toBeDefined();
      });

      it('default preserved: lang.operators defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: { var: false } } } },
        });
        expect(config.lang?.operators).toBeDefined();
      });

      it('default preserved: meta defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: { var: false } } } },
        });
        expect(config.meta).toBeDefined();
      });
    });
  });

  describe('edge cases', () => {
    describe('deeply nested boolean shorthand', () => {
      it('declarative.var defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: true as any } } },
        });
        expect(config.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      });

      it('declarative.let defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: true as any } } },
        });
        expect(config.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      });

      it('declarative.const defined', () => {
        const config = createConfig({
          lang: { bindings: { kind: { declarative: true as any } } },
        });
        expect(config.lang?.bindings?.kind?.declarative?.const).toBeDefined();
      });
    });

    describe('arrays', () => {
      it('filter.include preserved', () => {
        const config = createConfig({
          lang: {
            bindings: { filter: { include: ['myVar'], exclude: ['tempVar'] } },
          },
        });
        expect(config.lang?.bindings?.filter?.include).toEqual(['myVar']);
      });

      it('filter.exclude preserved', () => {
        const config = createConfig({
          lang: {
            bindings: { filter: { include: ['myVar'], exclude: ['tempVar'] } },
          },
        });
        expect(config.lang?.bindings?.filter?.exclude).toEqual(['tempVar']);
      });
    });

    describe('complete section replacement with false', () => {
      it('meta defined', () => {
        const config = createConfig({ meta: false as any });
        expect(config.meta).toBeDefined();
      });

      it('meta.index = false', () => {
        const config = createConfig({ meta: false as any });
        expect(config.meta?.index).toBe(false);
      });

      it('meta.ast = false', () => {
        const config = createConfig({ meta: false as any });
        expect(config.meta?.ast).toBe(false);
      });

      it('meta.location = false', () => {
        const config = createConfig({ meta: false as any });
        expect(config.meta?.location).toBe(false);
      });
    });
  });
});
