/**
 * @file TypeScript tests for configuration system
 * Updated to use new Config structure with meta and lang sections
 */

import createConfig from '../create.js';
import defaultConfig from '../default-config.js';
import applyPreset from '../apply-preset.js';
import expandShorthand from '../expand-shorthand.js';
import overview from '../presets/overview.js';
import detailed from '../presets/detailed.js';
import exhaustive from '../presets/exhaustive.js';

import type { Config, ExpandedConfig } from '../types.js';

const presets = { overview, detailed, exhaustive };

describe('Configuration System (TypeScript)', () => {
  describe('New Structure Tests', () => {
    test('should have meta and lang sections at top level', () => {
      const config = createConfig({});

      expect(config.meta).toBeDefined();
      expect(config.lang).toBeDefined();
      expect(config.presets).toBeUndefined(); // No default preset applied
    });

    test('should not have old top-level fields', () => {
      const config = createConfig({});

      // These old fields should not exist at top level
      expect((config as any).variables).toBeUndefined();
      expect((config as any).functions).toBeUndefined();
      expect((config as any).operators).toBeUndefined();
      expect((config as any).async).toBeUndefined();
      expect((config as any).errors).toBeUndefined();
    });

    test('should have variables configuration under lang.bindings', () => {
      const config = createConfig({
        lang: {
          bindings: {
            kind: {
              declarative: {
                var: true,
                let: true,
                const: false
              }
            },
            events: {
              declare: true,
              assign: true,
              read: false
            }
          }
        }
      });

      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      expect(config.lang?.bindings?.kind?.declarative?.let).toBe(true);
      expect(config.lang?.bindings?.kind?.declarative?.const).toBe(false);
      expect(config.lang?.bindings?.events?.declare).toBe(true);
      expect(config.lang?.bindings?.events?.assign).toBe(true);
      expect(config.lang?.bindings?.events?.read).toBe(false);
    });

    test('should have functions configuration under lang.functions', () => {
      const config = createConfig({
        lang: {
          functions: {
            kind: {
              arrow: true,
              function: false,
              method: true
            },
            events: {
              definition: true,
              call: { arguments: false },
              return: true
            }
          }
        }
      });

      expect(config.lang?.functions?.kind?.arrow).toBe(true);
      expect(config.lang?.functions?.kind?.function).toBe(false);
      expect(config.lang?.functions?.events?.definition).toBe(true);
      expect(config.lang?.functions?.events?.call?.arguments).toBe(false);
    });

    test('should have operators under lang.operators', () => {
      const config = createConfig({
        lang: {
          operators: {
            pure: true,
            mutating: false,
            shortCircuiting: true
          }
        }
      });

      expect(config.lang?.operators?.pure).toBe(true);
      expect(config.lang?.operators?.mutating).toBe(false);
      expect(config.lang?.operators?.shortCircuiting).toBe(true);
    });

    test('should have async features under lang.functions.events.coroutines', () => {
      const config = createConfig({
        lang: {
          functions: {
            events: {
              coroutines: {
                await: true,
                yield: false,
                yieldDelegate: false
              }
            }
          }
        },
        meta: {
          timestamps: true
        }
      });

      expect(config.lang?.functions?.events?.coroutines?.await).toBe(true);
      expect(config.meta?.timestamps).toBe(true);
    });
  });

  describe('Type Definitions', () => {
    test('Config type should have correct structure', () => {
      const config: Config = {
        presets: 'overview',
        meta: {
          index: true,
          location: 'line'
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
                import: false
              }
            }
          }
        }
      };

      expect(config.presets).toBe('overview');
      expect(config.meta?.index).toBe(true);
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
    });

    test('Partial<Config> should work for user input', () => {
      const userConfig: Partial<Config> = {
        presets: 'detailed',
        meta: {
          ast: true
        }
      };

      const config = createConfig(userConfig);
      expect(config.presets).toBe('detailed');
      expect(config.meta?.ast).toBe(true);
    });
  });

  describe('Default Configuration', () => {
    test('should provide sensible defaults', () => {
      const config = createConfig();

      // Meta defaults
      expect(config.meta?.index).toBe(true);
      expect(config.meta?.location).toBe('line');
      expect(config.meta?.ast).toBe(true);

      // Lang defaults
      expect(config.lang?.semantics).toBe(true);
      expect(config.lang?.bindings).toBeDefined();
      expect(config.lang?.functions).toBeDefined();
    });

    test('defaultConfig should have complete structure', () => {
      expect(defaultConfig.meta).toBeDefined();
      expect(defaultConfig.lang).toBeDefined();
      expect(defaultConfig.presets).toBeUndefined(); // No default preset
    });
  });

  describe('Preset System', () => {
    test('should have three presets available', () => {
      expect(presets.overview).toBeDefined();
      expect(presets.detailed).toBeDefined();
      expect(presets.exhaustive).toBeDefined();
    });

    test('overview preset should minimize detail', () => {
      const config = createConfig({ presets: 'overview' });

      // Overview characteristics
      expect(config.lang?.bindings?.events?.read).toBe(false);
      expect(config.lang?.operators?.pure).toBe(false);
      expect(config.meta?.location).toBe('line');
    });

    test('detailed preset should balance detail', () => {
      const config = createConfig({ presets: 'detailed' });

      // Detailed characteristics
      expect(config.lang?.bindings?.events?.read).toBe(true);
      expect(config.lang?.operators?.pure).toBe(true);
      expect(config.lang?.scopes?.kind?.block).toBe(true);
      expect(config.lang?.bindings?.kind?.implicit?.this).toBe(false);
    });

    test('exhaustive preset should enable everything', () => {
      const config = createConfig({ presets: 'exhaustive' });

      // Exhaustive characteristics
      expect(config.lang?.bindings?.kind?.implicit?.global).toBe(true);
      expect(config.lang?.bindings?.kind?.implicit?.this).toBe(true);
      expect(config.lang?.operators?.coercion).toBe(true);
      expect(config.lang?.dynamic?.eval).toBe(true);
      expect(config.meta?.debug?.configPath).toBe(true);
    });

    test('user overrides should take precedence over preset', () => {
      const config = createConfig({
        presets: 'overview',
        lang: {
          bindings: {
            events: {
              read: true  // Override overview's false
            }
          }
        }
      });

      expect(config.lang?.bindings?.events?.read).toBe(true);
    });
  });

  describe('Boolean Shorthand Expansion', () => {
    test('should expand lang: true', () => {
      const expanded = expandShorthand({ lang: true as any });

      expect(expanded.lang).toBeDefined();
      expect(typeof expanded.lang).toBe('object');
      expect(expanded.lang?.bindings).toBeDefined();
      expect(expanded.lang?.functions).toBeDefined();
    });

    test('should expand lang: false', () => {
      const expanded = expandShorthand({ lang: false as any });

      expect(expanded.lang).toBeDefined();
      expect(expanded.lang?.semantics).toBe(false);
      expect(expanded.lang?.bindings?.kind?.declarative?.var).toBe(false);
    });

    test('should expand nested boolean shorthand', () => {
      const expanded = expandShorthand({
        lang: {
          bindings: true as any,
          operators: false as any
        }
      });

      expect(expanded.lang?.bindings?.kind).toBeDefined();
      expect(expanded.lang?.operators?.pure).toBe(false);
    });

    test('should expand meta: true', () => {
      const expanded = expandShorthand({ meta: true as any });

      expect(expanded.meta).toBeDefined();
      expect(typeof expanded.meta).toBe('object');
      expect(expanded.meta?.index).toBeDefined();
    });

    test('should expand deeply nested shorthand', () => {
      const expanded = expandShorthand({
        lang: {
          bindings: {
            kind: {
              declarative: true as any
            }
          }
        }
      });

      expect(expanded.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      expect(expanded.lang?.bindings?.kind?.declarative?.let).toBeDefined();
    });
  });

  describe('Error Handling and Validation', () => {
    test('should handle invalid preset gracefully', () => {
      const config = createConfig({
        presets: 'invalid-preset' as any
      });

      // Should not throw, should use defaults
      expect(config).toBeDefined();
      expect(config.meta).toBeDefined();
      expect(config.lang).toBeDefined();
    });

    test('should handle wrong type for presets', () => {
      const config = createConfig({
        presets: 123 as any
      });

      // Should use default preset (which is undefined — no preset by default)
      expect(config).toBeDefined();
      expect(config.presets).toBeUndefined();
    });

    test('should remove unknown fields', () => {
      const config = createConfig({
        unknownField: 'should be removed',
        lang: {
          unknownSection: 'also removed',
          bindings: {
            kind: {
              declarative: {
                var: true
              }
            }
          }
        }
      } as any);

      expect((config as any).unknownField).toBeUndefined();
      expect((config.lang as any)?.unknownSection).toBeUndefined();
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
    });

    test('should handle null and undefined gracefully', () => {
      const config = createConfig({
        meta: {
          index: null as any,
          location: undefined as any
        }
      });

      // Should use defaults
      expect(config.meta?.index).toBe(true);
      expect(config.meta?.location).toBe('line');
    });

    test('should validate location enum', () => {
      const validConfig = createConfig({
        meta: { location: 'full' }
      });
      expect(validConfig.meta?.location).toBe('full');

      const falseConfig = createConfig({
        meta: { location: false as any }
      });
      expect(falseConfig.meta?.location).toBe(false);

      const invalidConfig = createConfig({
        meta: { location: 'invalid' as any }
      });
      expect(invalidConfig.meta?.location).toBe('line'); // Default
    });
  });

  describe('Real-World Usage Patterns', () => {
    test('debugging configuration', () => {
      const debugConfig: Partial<Config> = {
        presets: 'exhaustive',
        meta: {
          debug: {
            configPath: true,
            AranNodeId: true,
            adviceName: true
          },
          location: 'full',
          ast: true
        },
        lang: {
          bindings: {
            events: {
              declare: true,
              initialize: true,
              assign: true,
              read: true
            }
          },
          errorHandling: {
            throw: true,
            catch: true,
            callstack: true
          }
        }
      };

      const config = createConfig(debugConfig);

      expect(config.meta?.debug?.configPath).toBe(true);
      expect(config.meta?.location).toBe('full');
      expect(config.lang?.bindings?.events?.read).toBe(true);
      expect(config.lang?.errorHandling?.callstack).toBe(true);
    });

    test('production configuration', () => {
      const prodConfig: Partial<Config> = {
        presets: 'overview',
        meta: {
          index: false,
          ast: false,
          debug: {
            configPath: false,
            AranNodeId: false,
            adviceName: false
          }
        },
        lang: {
          bindings: {
            events: {
              read: false
            }
          },
          errorHandling: {
            callstack: false
          }
        }
      };

      const config = createConfig(prodConfig);

      expect(config.meta?.index).toBe(false);
      expect(config.meta?.ast).toBe(false);
      expect(config.lang?.bindings?.events?.read).toBe(false);
    });

    test('async execution study scenario', () => {
      const asyncConfig: Partial<Config> = {
        meta: {
          timestamps: true
        },
        lang: {
          functions: {
            events: {
              call: { arguments: true },
              coroutines: {
                await: true,
                yield: true
              }
            }
          },
          bindings: {
            filter: {
              include: ['promise', 'result', 'error']
            }
          }
        }
      };

      const config = createConfig(asyncConfig);

      expect(config.meta?.timestamps).toBe(true);
      expect(config.lang?.functions?.events?.coroutines?.await).toBe(true);
      expect(config.lang?.functions?.events?.call?.arguments).toBe(true);
      expect(config.lang?.bindings?.filter?.include).toEqual(['promise', 'result', 'error']);
    });
  });

  describe('Config Pipeline Integration', () => {
    test('preset + override + expansion + sanitization', () => {
      const userConfig: Partial<Config> = {
        presets: 'detailed',
        lang: {
          bindings: true as any, // Shorthand
          operators: {
            pure: false,  // Override detailed's true
            mutating: true
          }
        },
        meta: {
          location: 'full'  // Override detailed's 'line'
        }
      };

      const config = createConfig(userConfig);

      // Preset applied
      expect(config.presets).toBe('detailed');

      // Shorthand expanded
      expect(config.lang?.bindings?.kind).toBeDefined();

      // Overrides applied
      expect(config.lang?.operators?.pure).toBe(false);
      expect(config.meta?.location).toBe('full');

      // Detailed preset values preserved where not overridden
      expect(config.lang?.scopes?.kind?.block).toBe(true);
    });

    test('complete custom configuration', () => {
      const customConfig: Partial<Config> = {
        meta: {
          index: false,
          location: false,
          ast: true,
          data: {
            type: true,
            instance: false,
            value: true,
            lookup: false
          }
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
                import: false
              },
              explicit: {
                parameters: true,
                catch: false
              },
              implicit: {
                global: false,
                arguments: false,
                this: false,
                callee: false,
                newTarget: false,
                super: false,
                importMeta: false
              }
            },
            events: {
              declare: false,
              available: true,
              initialize: true,
              implicit: false,
              assign: true,
              read: false
            }
          }
        }
      };

      const config = createConfig(customConfig);

      // All custom values should be preserved
      expect(config.meta?.index).toBe(false);
      expect(config.meta?.location).toBe(false);
      expect(config.meta?.data?.instance).toBe(false);
      expect(config.lang?.semantics).toBe(false);
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(false);
      expect(config.lang?.bindings?.kind?.declarative?.let).toBe(true);
      expect(config.lang?.bindings?.kind?.explicit?.parameters).toBe(true);
      expect(config.lang?.bindings?.events?.read).toBe(false);
    });
  });

  describe('TypeScript Type Safety', () => {
    test('should enforce correct types at compile time', () => {
      // This is a compile-time test - TypeScript will catch these errors
      const config: Config = {
        presets: 'overview',
        meta: {
          index: true,
          location: 'line',  // Must be 'line' | 'full' | false
          ast: false
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
                import: false
              }
            }
          }
        }
      };

      expect(config).toBeDefined();
    });

    test('should allow partial configs', () => {
      const partial: Partial<Config> = {
        meta: {
          index: false
        }
      };

      const config = createConfig(partial);
      expect(config.meta?.index).toBe(false);
    });

    test('ExpandedConfig should extend Config', () => {
      const expanded: ExpandedConfig = createConfig({
        lang: true as any
      });

      // ExpandedConfig should have all Config properties
      expect(expanded.meta).toBeDefined();
      expect(expanded.lang).toBeDefined();
    });
  });
});