/**
 * @file TDD tests for apply-preset.ts with new Config structure
 */

import applyPreset from '../apply-preset.js';
import type { Config } from '../types.js';
import overview from '../presets/overview.js';
import detailed from '../presets/detailed.js';
import exhaustive from '../presets/exhaustive.js';

describe('applyPreset with new Config structure', () => {
  describe('preset application', () => {
    test('should apply overview preset', () => {
      const userConfig: Config = {
        presets: 'overview'  // Note: 'presets' not 'preset'
      };

      const result = applyPreset(userConfig);

      // Should merge overview preset values
      expect(result.lang?.bindings?.kind?.declarative?.var).toBe(true);
      expect(result.lang?.bindings?.kind?.declarative?.let).toBe(true);
      expect(result.lang?.bindings?.kind?.declarative?.const).toBe(true);
      expect(result.lang?.bindings?.events?.read).toBe(false); // Overview disables reads
      expect(result.meta?.location).toBe('line');
    });

    test('should apply detailed preset', () => {
      const userConfig: Config = {
        presets: 'detailed'
      };

      const result = applyPreset(userConfig);

      // Should merge detailed preset values
      expect(result.lang?.bindings?.kind?.declarative?.class).toBe(true);
      expect(result.lang?.bindings?.kind?.explicit?.parameters).toBe(true);
      expect(result.lang?.bindings?.events?.declare).toBe(true);
      expect(result.lang?.controlFlow?.kind?.loops?.while).toBe(true);
      expect(result.lang?.scopes?.kind?.block).toBe(true);
    });

    test('should apply exhaustive preset', () => {
      const userConfig: Config = {
        presets: 'exhaustive'
      };

      const result = applyPreset(userConfig);

      // Should merge exhaustive preset values
      expect(result.lang?.bindings?.kind?.implicit?.global).toBe(true);
      expect(result.lang?.operators?.coercion).toBe(true);
      expect(result.lang?.dynamic?.eval).toBe(true);
      expect(result.lang?.meta?.proxy).toBe(true);
      expect(result.meta?.debug?.configPath).toBe(true);
      expect(result.meta?.location).toBe('full');
    });
  });

  describe('user overrides', () => {
    test('should allow user to override preset values', () => {
      const userConfig: Config = {
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
      };

      const result = applyPreset(userConfig);

      // User overrides should take precedence
      expect(result.lang?.bindings?.events?.read).toBe(true);
      expect(result.meta?.location).toBe('full');

      // Preset values should still be applied for non-overridden fields
      expect(result.lang?.bindings?.kind?.declarative?.var).toBe(true);
      expect(result.lang?.bindings?.events?.assign).toBe(true);
    });

    test('should merge nested user overrides with preset', () => {
      const userConfig: Config = {
        presets: 'detailed',
        lang: {
          bindings: {
            kind: {
              implicit: {
                this: true  // Override detailed's false
              }
            }
          },
          operators: {
            coercion: true  // Override detailed's false
          }
        }
      };

      const result = applyPreset(userConfig);

      // User overrides should be applied
      expect(result.lang?.bindings?.kind?.implicit?.this).toBe(true);
      expect(result.lang?.operators?.coercion).toBe(true);

      // Preset values should remain for other fields
      expect(result.lang?.bindings?.kind?.implicit?.global).toBe(true); // From detailed
      expect(result.lang?.operators?.pure).toBe(true); // From detailed
      expect(result.lang?.operators?.mutating).toBe(true); // From detailed
    });

    test('should handle complete lang override with preset', () => {
      const userConfig: Config = {
        presets: 'overview',
        lang: {
          semantics: false,
          bindings: {
            kind: {
              declarative: {
                var: false,
                let: false,
                const: false,
                function: false,
                class: false,
                import: false
              }
            }
          }
        }
      };

      const result = applyPreset(userConfig);

      // User's complete override should win
      expect(result.lang?.semantics).toBe(false);
      expect(result.lang?.bindings?.kind?.declarative?.var).toBe(false);
      expect(result.lang?.bindings?.kind?.declarative?.let).toBe(false);

      // Other preset values should still be there
      expect(result.lang?.functions).toBeDefined();
      expect(result.lang?.controlFlow).toBeDefined();
    });
  });

  describe('edge cases', () => {
    test('should return config as-is when no preset specified', () => {
      const userConfig: Config = {
        lang: {
          bindings: {
            kind: {
              declarative: {
                var: true
              }
            }
          }
        }
      };

      const result = applyPreset(userConfig);

      expect(result).toEqual(userConfig);
    });

    test('should return config as-is when preset is undefined', () => {
      const userConfig: Config = {
        presets: undefined,
        lang: {
          semantics: true
        }
      };

      const result = applyPreset(userConfig);

      expect(result).toEqual(userConfig);
    });

    test('should handle invalid preset name gracefully', () => {
      const userConfig: Config = {
        presets: 'invalid-preset-name',
        lang: {
          semantics: true
        }
      };

      const result = applyPreset(userConfig);

      // Should return config without preset applied
      expect(result).toEqual(userConfig);
      expect(result.lang?.semantics).toBe(true);
    });

    test('should handle empty config with preset', () => {
      const userConfig: Config = {
        presets: 'overview'
      };

      const result = applyPreset(userConfig);

      // Should have all overview preset values
      expect(result.lang?.bindings).toBeDefined();
      expect(result.lang?.functions).toBeDefined();
      expect(result.meta?.index).toBe(true);
    });

    test('should preserve presets field in result', () => {
      const userConfig: Config = {
        presets: 'detailed',
        meta: {
          index: false
        }
      };

      const result = applyPreset(userConfig);

      // presets field should be preserved
      expect(result.presets).toBe('detailed');
      // User override should be applied
      expect(result.meta?.index).toBe(false);
      // Preset values should be applied
      expect(result.lang?.bindings).toBeDefined();
    });
  });

  describe('type compatibility', () => {
    test('should work with UserConfig (Partial<Config>)', () => {
      const userConfig: Partial<Config> = {
        presets: 'overview',
        meta: {
          ast: true
        }
      };

      const result = applyPreset(userConfig);

      expect(result.presets).toBe('overview');
      expect(result.meta?.ast).toBe(true);
      expect(result.lang?.bindings).toBeDefined();
    });

    test('should handle preset-only config', () => {
      const configs = [
        { presets: 'overview' },
        { presets: 'detailed' },
        { presets: 'exhaustive' }
      ] as Config[];

      configs.forEach(config => {
        const result = applyPreset(config);
        expect(result.lang).toBeDefined();
        expect(result.meta).toBeDefined();
      });
    });
  });
});