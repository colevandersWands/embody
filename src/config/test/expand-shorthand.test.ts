/**
 * @file TDD tests for expand-shorthand.ts with new Config structure
 */

import expandShorthand from '../expand-shorthand.js';
import type { Config, ExpandedConfig } from '../types.js';

describe('expandShorthand with new Config structure', () => {
  describe('meta section expansion', () => {
    test('should expand meta: true to default meta config', () => {
      const config: Config = {
        meta: true as any  // Boolean shorthand
      };

      const expanded = expandShorthand(config);

      // Should expand to default meta structure
      expect(expanded.meta).toBeDefined();
      expect(typeof expanded.meta).toBe('object');
      expect(expanded.meta?.index).toBeDefined();
      expect(expanded.meta?.location).toBeDefined();
      expect(expanded.meta?.data).toBeDefined();
    });

    test('should expand meta: false to disabled meta config', () => {
      const config: Config = {
        meta: false as any  // Boolean shorthand
      };

      const expanded = expandShorthand(config);

      // Should expand to disabled meta structure
      expect(expanded.meta).toBeDefined();
      expect(typeof expanded.meta).toBe('object');
      expect(expanded.meta?.index).toBe(false);
      expect(expanded.meta?.location).toBe(false);
      expect(expanded.meta?.ast).toBe(false);
      expect(expanded.meta?.data?.type).toBe(false);
      expect(expanded.meta?.data?.value).toBe(false);
    });

    test('should pass through explicit meta config unchanged', () => {
      const config: Config = {
        meta: {
          index: true,
          location: 'line',
          ast: false
        }
      };

      const expanded = expandShorthand(config);

      expect(expanded.meta?.index).toBe(true);
      expect(expanded.meta?.location).toBe('line');
      expect(expanded.meta?.ast).toBe(false);
    });
  });

  describe('lang section expansion', () => {
    test('should expand lang: true to default lang config', () => {
      const config: Config = {
        lang: true as any  // Boolean shorthand
      };

      const expanded = expandShorthand(config);

      // Should expand to default lang structure
      expect(expanded.lang).toBeDefined();
      expect(typeof expanded.lang).toBe('object');
      expect(expanded.lang?.bindings).toBeDefined();
      expect(expanded.lang?.functions).toBeDefined();
      expect(expanded.lang?.controlFlow).toBeDefined();
      expect(expanded.lang?.operators).toBeDefined();
    });

    test('should expand lang: false to disabled lang config', () => {
      const config: Config = {
        lang: false as any  // Boolean shorthand
      };

      const expanded = expandShorthand(config);

      // Should expand to disabled lang structure
      expect(expanded.lang).toBeDefined();
      expect(typeof expanded.lang).toBe('object');
      expect(expanded.lang?.semantics).toBe(false);

      // Nested objects should be disabled
      expect(expanded.lang?.bindings?.kind?.declarative?.var).toBe(false);
      expect(expanded.lang?.bindings?.kind?.declarative?.let).toBe(false);
      expect(expanded.lang?.bindings?.events?.declare).toBe(false);

      // Arrays should be empty
      expect(expanded.lang?.bindings?.filter?.include).toEqual([]);
      expect(expanded.lang?.bindings?.filter?.exclude).toEqual([]);
    });

    test('should expand nested lang.bindings: true', () => {
      const config: Config = {
        lang: {
          bindings: true as any  // Boolean shorthand
        }
      };

      const expanded = expandShorthand(config);

      // Should expand bindings to default structure
      expect(expanded.lang?.bindings).toBeDefined();
      expect(expanded.lang?.bindings?.kind).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      expect(expanded.lang?.bindings?.events).toBeDefined();
      expect(expanded.lang?.bindings?.filter).toBeDefined();
    });

    test('should expand nested lang.bindings: false', () => {
      const config: Config = {
        lang: {
          bindings: false as any  // Boolean shorthand
        }
      };

      const expanded = expandShorthand(config);

      // Should expand to disabled bindings
      expect(expanded.lang?.bindings).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.var).toBe(false);
      expect(expanded.lang?.bindings?.kind?.declarative?.let).toBe(false);
      expect(expanded.lang?.bindings?.kind?.explicit?.parameters).toBe(false);
      expect(expanded.lang?.bindings?.events?.declare).toBe(false);
      expect(expanded.lang?.bindings?.filter?.include).toEqual([]);
    });

    test('should expand deeply nested boolean shorthand', () => {
      const config: Config = {
        lang: {
          bindings: {
            kind: {
              declarative: true as any  // Boolean shorthand
            }
          }
        }
      };

      const expanded = expandShorthand(config);

      // Should expand declarative to default structure
      expect(expanded.lang?.bindings?.kind?.declarative).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.const).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.function).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.class).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.import).toBeDefined();
    });

    test('should expand lang.operators: true', () => {
      const config: Config = {
        lang: {
          operators: true as any  // Boolean shorthand
        }
      };

      const expanded = expandShorthand(config);

      // Should expand operators to default structure
      expect(expanded.lang?.operators).toBeDefined();
      expect(expanded.lang?.operators?.pure).toBeDefined();
      expect(expanded.lang?.operators?.mutating).toBeDefined();
      expect(expanded.lang?.operators?.shortCircuiting).toBeDefined();
    });

    test('should handle mixed explicit and shorthand config', () => {
      const config: Config = {
        lang: {
          bindings: true as any,  // Shorthand
          functions: {            // Explicit
            kind: {
              arrow: true,
              function: false,
              method: true,
              generator: false,
              builtIn: false
            },
            events: {
              definition: true,
              call: { arguments: false },
              construct: false,
              return: true,
              coroutines: {
                await: true,
                yield: false,
                yieldDelegate: false
              }
            }
          },
          controlFlow: false as any  // Shorthand disabled
        }
      };

      const expanded = expandShorthand(config);

      // bindings should be expanded from true
      expect(expanded.lang?.bindings?.kind).toBeDefined();
      expect(expanded.lang?.bindings?.events).toBeDefined();

      // functions should remain as specified
      expect(expanded.lang?.functions?.kind?.arrow).toBe(true);
      expect(expanded.lang?.functions?.kind?.function).toBe(false);
      expect(expanded.lang?.functions?.events?.call?.arguments).toBe(false);

      // controlFlow should be disabled
      expect(expanded.lang?.controlFlow?.kind?.conditionals).toBe(false);
      expect(expanded.lang?.controlFlow?.kind?.loops?.while).toBe(false);
      expect(expanded.lang?.controlFlow?.events?.test).toBe(false);
    });
  });

  describe('presets field handling', () => {
    test('should pass through presets string unchanged', () => {
      const config: Config = {
        presets: 'variables'
      };

      const expanded = expandShorthand(config);

      expect(expanded.presets).toBe('variables');
    });

    test('should handle config with all sections', () => {
      const config: Config = {
        presets: 'custom',
        meta: {
          index: true,
          location: 'full'
        },
        lang: {
          bindings: true as any,
          operators: false as any
        }
      };

      const expanded = expandShorthand(config);

      expect(expanded.presets).toBe('custom');
      expect(expanded.meta?.index).toBe(true);
      expect(expanded.meta?.location).toBe('full');
      expect(expanded.lang?.bindings?.kind).toBeDefined();
      expect(expanded.lang?.operators?.pure).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle empty config', () => {
      const config: Config = {};
      const expanded = expandShorthand(config);

      expect(expanded).toBeDefined();
      expect(expanded).toEqual({});
    });

    test('should handle config with only presets', () => {
      const config: Config = {
        presets: 'overview'
      };
      const expanded = expandShorthand(config);

      expect(expanded.presets).toBe('overview');
      expect(expanded.meta).toBeUndefined();
      expect(expanded.lang).toBeUndefined();
    });

    test('should handle null values correctly', () => {
      const config: Config = {
        meta: {
          default: null,
          maxIterations: null,
          maxCallstack: null
        }
      };

      const expanded = expandShorthand(config);

      expect(expanded.meta?.default).toBeNull();
      expect(expanded.meta?.maxIterations).toBeNull();
      expect(expanded.meta?.maxCallstack).toBeNull();
    });
  });
});