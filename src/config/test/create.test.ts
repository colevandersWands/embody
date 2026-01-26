/**
 * @file TDD tests for create.ts with new Config structure
 */

import createConfig from '../create.js';
import type { Config, ExpandedConfig } from '../types.js';

describe('createConfig with new Config structure', () => {
  describe('default configuration', () => {
    test('should return default config when no user config provided', () => {
      const config = createConfig();

      // Should have default structure
      expect(config).toBeDefined();
      expect(config.presets).toBeDefined();
      expect(config.meta).toBeDefined();
      expect(config.lang).toBeDefined();

      // Check some default values
      expect(config.meta?.index).toBe(true);
      expect(config.meta?.location).toBe('line');
      expect(config.lang?.semantics).toBe(true);
    });

    test('should return default config for empty object', () => {
      const config = createConfig({});

      expect(config.presets).toBeDefined();
      expect(config.meta).toBeDefined();
      expect(config.lang).toBeDefined();
    });
  });

  describe('preset application', () => {
    test('should apply overview preset', () => {
      const config = createConfig({
        presets: 'overview'
      });

      // Overview preset characteristics
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
      expect(config.lang?.bindings?.events?.read).toBe(false); // Overview disables reads
      expect(config.meta?.location).toBe('line');
    });

    test('should apply detailed preset', () => {
      const config = createConfig({
        presets: 'detailed'
      });

      // Detailed preset characteristics
      expect(config.lang?.bindings?.kind?.explicit?.parameters).toBe(true);
      expect(config.lang?.bindings?.events?.declare).toBe(true);
      expect(config.lang?.controlFlow?.kind?.loops?.while).toBe(true);
      expect(config.lang?.scopes?.kind?.block).toBe(true);
    });

    test('should apply exhaustive preset', () => {
      const config = createConfig({
        presets: 'exhaustive'
      });

      // Exhaustive preset characteristics
      expect(config.lang?.bindings?.kind?.implicit?.global).toBe(true);
      expect(config.lang?.operators?.coercion).toBe(true);
      expect(config.lang?.dynamic?.eval).toBe(true);
      expect(config.meta?.debug?.configPath).toBe(true);
      expect(config.meta?.location).toBe('full');
    });
  });

  describe('boolean shorthand expansion', () => {
    test('should expand lang: true to full structure', () => {
      const config = createConfig({
        lang: true as any
      });

      expect(config.lang).toBeDefined();
      expect(typeof config.lang).toBe('object');
      expect(config.lang?.bindings).toBeDefined();
      expect(config.lang?.functions).toBeDefined();
      expect(config.lang?.operators).toBeDefined();
    });

    test('should expand lang: false to disabled structure', () => {
      const config = createConfig({
        lang: false as any
      });

      expect(config.lang).toBeDefined();
      expect(config.lang?.semantics).toBe(false);
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(false);
      expect(config.lang?.bindings?.events?.declare).toBe(false);
    });

    test('should expand nested boolean shorthand', () => {
      const config = createConfig({
        lang: {
          bindings: true as any,
          operators: false as any
        }
      });

      // bindings should be expanded from true
      expect(config.lang?.bindings?.kind).toBeDefined();
      expect(config.lang?.bindings?.events).toBeDefined();

      // operators should be disabled
      expect(config.lang?.operators?.pure).toBe(false);
      expect(config.lang?.operators?.mutating).toBe(false);
    });

    test('should expand meta: true', () => {
      const config = createConfig({
        meta: true as any
      });

      expect(config.meta).toBeDefined();
      expect(typeof config.meta).toBe('object');
      expect(config.meta?.index).toBeDefined();
      expect(config.meta?.location).toBeDefined();
      expect(config.meta?.data).toBeDefined();
    });
  });

  describe('user overrides with presets', () => {
    test('should allow user overrides with preset', () => {
      const config = createConfig({
        presets: 'overview',
        lang: {
          bindings: {
            events: {
              read: true  // Override overview's false
            }
          }
        },
        meta: {
          location: 'full'  // Override overview's 'line'
        }
      });

      // User overrides should win
      expect(config.lang?.bindings?.events?.read).toBe(true);
      expect(config.meta?.location).toBe('full');

      // Preset values should still be there for other fields
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
    });

    test('should handle deep user overrides', () => {
      const config = createConfig({
        presets: 'detailed',
        lang: {
          bindings: {
            kind: {
              implicit: {
                this: true  // Override detailed's false
              }
            }
          }
        }
      });

      expect(config.lang?.bindings?.kind?.implicit?.this).toBe(true);
      // Other detailed preset values should remain
      expect(config.lang?.bindings?.kind?.implicit?.global).toBe(true);
    });
  });

  describe('sanitization and validation', () => {
    test('should handle invalid preset name gracefully', () => {
      const config = createConfig({
        presets: 'invalid-preset' as any
      });

      // Should fall back to default configuration
      expect(config).toBeDefined();
      expect(config.meta).toBeDefined();
      expect(config.lang).toBeDefined();
    });

    test('should handle wrong type for presets field', () => {
      const config = createConfig({
        presets: 123 as any  // Wrong type
      });

      // Should use default preset
      expect(config).toBeDefined();
      expect(typeof config.presets).toBe('string');
    });

    test('should remove unknown fields', () => {
      const config = createConfig({
        presets: 'overview',
        unknownField: 'should be removed',
        lang: {
          bindings: {
            kind: {
              declarative: {
                var: true
              }
            },
            unknownNestedField: 'should also be removed'
          }
        }
      } as any);

      // Unknown fields should not appear in result
      expect((config as any).unknownField).toBeUndefined();
      expect((config.lang?.bindings as any)?.unknownNestedField).toBeUndefined();

      // Valid fields should remain
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(true);
    });

    test('should handle null and undefined values', () => {
      const config = createConfig({
        meta: {
          index: null as any,  // Should use default
          location: undefined as any  // Should use default
        }
      });

      // Should use defaults for null/undefined
      expect(config.meta?.index).toBe(true);  // Default value
      expect(config.meta?.location).toBe('line');  // Default value
    });

    test('should validate location enum values', () => {
      const validConfig = createConfig({
        meta: {
          location: 'full'  // Valid enum value
        }
      });
      expect(validConfig.meta?.location).toBe('full');

      const invalidConfig = createConfig({
        meta: {
          location: 'invalid' as any  // Invalid enum value
        }
      });
      // Should use default for invalid enum
      expect(invalidConfig.meta?.location).toBe('line');
    });
  });

  describe('complete pipeline', () => {
    test('should handle preset + override + shorthand + sanitization', () => {
      const config = createConfig({
        presets: 'overview',
        lang: {
          bindings: true as any,  // Boolean shorthand
          operators: {
            pure: true,
            mutating: false
          }
        },
        meta: {
          ast: true,
          location: 'full'
        },
        unknownField: 'remove me'  // Should be sanitized out
      } as any);

      // Preset should be applied
      expect(config.presets).toBe('overview');

      // Boolean shorthand should be expanded
      expect(config.lang?.bindings?.kind).toBeDefined();
      expect(config.lang?.bindings?.events).toBeDefined();

      // User overrides should be applied
      expect(config.lang?.operators?.pure).toBe(true);
      expect(config.lang?.operators?.mutating).toBe(false);
      expect(config.meta?.ast).toBe(true);
      expect(config.meta?.location).toBe('full');

      // Unknown field should be removed
      expect((config as any).unknownField).toBeUndefined();
    });

    test('should preserve all valid fields from defaults', () => {
      const config = createConfig({
        lang: {
          bindings: {
            kind: {
              declarative: {
                var: false
              }
            }
          }
        }
      });

      // User override should be applied
      expect(config.lang?.bindings?.kind?.declarative?.var).toBe(false);

      // All other default fields should still exist
      expect(config.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      expect(config.lang?.bindings?.kind?.declarative?.const).toBeDefined();
      expect(config.lang?.functions).toBeDefined();
      expect(config.lang?.operators).toBeDefined();
      expect(config.meta).toBeDefined();
    });
  });

  describe('edge cases', () => {
    test('should handle deeply nested boolean shorthand', () => {
      const config = createConfig({
        lang: {
          bindings: {
            kind: {
              declarative: true as any
            }
          }
        }
      });

      expect(config.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      expect(config.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      expect(config.lang?.bindings?.kind?.declarative?.const).toBeDefined();
    });

    test('should handle arrays correctly', () => {
      const config = createConfig({
        lang: {
          bindings: {
            filter: {
              include: ['myVar'],
              exclude: ['tempVar']
            }
          }
        }
      });

      expect(config.lang?.bindings?.filter?.include).toEqual(['myVar']);
      expect(config.lang?.bindings?.filter?.exclude).toEqual(['tempVar']);
    });

    test('should handle complete replacement of sections', () => {
      const config = createConfig({
        meta: false as any  // Replace entire meta section with disabled
      });

      expect(config.meta).toBeDefined();
      expect(config.meta?.index).toBe(false);
      expect(config.meta?.ast).toBe(false);
      expect(config.meta?.location).toBe(false);
    });
  });
});