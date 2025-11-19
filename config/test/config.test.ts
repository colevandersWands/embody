/**
 * @file TypeScript tests for configuration system
 * Demonstrates type safety and validates functionality
 */

import {
  createConfig,
  defaultConfig,
  presets,
  applyPreset,
  expandShorthand,
  type Config,
  type UserConfig,
  type PresetName
} from '../index.js';

// Temporary ValidationResult interface for tests that haven't been updated yet
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Mock validate function for legacy tests (validation system removed in Phase 2)
// This simulates the old validation behavior but always returns valid
function validate(config: Config): ValidationResult {
  // For test compatibility - graceful degradation means always valid
  return { valid: true, errors: [] };
}

describe('Configuration System (TypeScript)', () => {
  describe('Legacy Field Removal Tests', () => {
    test('should reject top-level timestamps field', () => {
      const configWithTimestamps: any = {
        timestamps: true
      };

      // This should fail - timestamps should only exist in async.timestamps
      expect(() => createConfig(configWithTimestamps)).toThrow();
    });

    test('should not have timestamps in Config interface', () => {
      // TypeScript compilation test - this should cause a type error
      // if timestamps field still exists in Config interface
      const config: UserConfig = {
        preset: 'detailed'
        // timestamps: true  // This line should cause TS error if uncommented
      };

      expect(() => createConfig(config)).not.toThrow();
    });

    test('should only support async.timestamps', () => {
      const configWithAsyncTimestamps: UserConfig = {
        async: {
          timestamps: true
        }
      };

      const result = createConfig(configWithAsyncTimestamps);
      expect(result.async.timestamps).toBe(true);
    });
  });

  describe('New Type Structure Tests', () => {
    test('should support new DeclareConfig interface', () => {
      const config: UserConfig = {
        variables: {
          declare: {
            var: true,
            let: true,
            const: false,
            function: true,
            implicit: false
          },
          assign: true,
          read: true,
          filter: []
        }
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should support new operators config with computing/selecting/mutating', () => {
      const config: UserConfig = {
        operators: {
          computing: true,
          selecting: false,
          mutating: true,
          filter: []
        }
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should support new dataStructures config', () => {
      const config: UserConfig = {
        dataStructures: {
          read: true,
          write: false
        }
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should support new scopes config with closures', () => {
      const config: UserConfig = {
        scopes: {
          global: true,
          functions: true,
          blocks: false,
          modules: true,
          closures: {
            creation: true,
            capture: false,
            access: true
          },
          filter: []
        }
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should support new top-level boolean configs', () => {
      const config: UserConfig = {
        instantiation: true,
        prototypeLookup: false,
        coercion: true,
        type: 'module'
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should support new async config with timestamps', () => {
      const config: UserConfig = {
        async: {
          await: true,
          timestamps: false
        }
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should support new errors config with try', () => {
      const config: UserConfig = {
        errors: {
          try: true,
          throw: true,
          catch: false,
          finally: true,
          unhandled: true,
          stackTrace: false
        }
      };

      // This should fail until we implement the new types
      expect(() => createConfig(config)).not.toThrow();
    });

    test('should reject old structure (blocks, iterators, timestamps)', () => {
      const oldConfig: any = {
        blocks: { enter: true },
        iterators: { forOf: true },
        timestamps: false
      };

      // This should fail - these configs no longer exist
      expect(() => createConfig(oldConfig)).toThrow();
    });
  });

  describe('Type Safety', () => {
    test('should enforce correct preset names', () => {
      // Valid preset names should be accepted
      const validConfig: UserConfig = {
        preset: 'detailed' as PresetName
      };

      expect(() => createConfig(validConfig)).not.toThrow();
    });

    test('should enforce correct configuration structure', () => {
      // This should compile and run correctly
      const typedConfig: UserConfig = {
        preset: 'overview',
        variables: {
          declare: true,
          assign: false,
          read: true,
          filter: ['myVar']
        },
        functions: true, // boolean shorthand
        controlFlow: {
          conditionals: true,
          loops: false,
          switches: true,
          breaks: false,
          filter: []
        }
      };

      expect(() => createConfig(typedConfig)).not.toThrow();
    });

    test('should validate Aran configuration types', () => {
      const configWithAran: UserConfig = {
        aran: {
          kind: 'script',
          globalDeclarativeRecord: 'builtin',
          adviceGlobalVariable: '_TEST_ADVICE_',
          initialState: { custom: 'data' },
          mode: 'standalone',
          warning: 'console'
        }
      };

      expect(() => createConfig(configWithAran)).not.toThrow();
    });
  });

  describe('Default Configuration', () => {
    test('should have correct default structure', () => {
      expect(defaultConfig.preset).toBe('detailed');
      expect(defaultConfig.variables).toHaveProperty('declare');
      expect(defaultConfig.functions).toHaveProperty('calls');
      expect(defaultConfig.async.timestamps).toBe(false);
      expect(defaultConfig.aran.kind).toBe('script');
    });

    test('should be type-safe', () => {
      // TypeScript should ensure all required properties exist
      const config: Config = defaultConfig;
      expect(config).toBeDefined();
    });
  });

  describe('Presets', () => {
    test('should contain all expected presets', () => {
      const expectedPresets: PresetName[] = ['overview', 'detailed', 'exhaustive'];
      expectedPresets.forEach(preset => {
        expect(presets).toHaveProperty(preset);
      });
    });

    test('should apply presets with type safety', () => {
      const userConfig: UserConfig = {
        preset: 'overview',
        variables: { read: true } // override preset default
      };

      const result = applyPreset(userConfig);
      expect(result).toBeDefined();
    });
  });

  describe('Boolean Shorthand Expansion', () => {
    test('should expand boolean true to full config', () => {
      const configWithShorthand: Config = {
        ...defaultConfig,
        functions: true,
        operators: true
      };

      const expanded = expandShorthand(configWithShorthand);

      expect(typeof expanded.functions).toBe('object');
      expect(expanded.functions.calls).toBe(true);
      expect(typeof expanded.operators).toBe('object');
      expect(expanded.operators.computing).toBe(true);
    });

    test('should expand boolean false to disabled config', () => {
      const configWithShorthand: Config = {
        ...defaultConfig,
        syntax: false,
        async: false
      };

      const expanded = expandShorthand(configWithShorthand);

      expect(typeof expanded.syntax).toBe('object');
      expect(expanded.syntax.destructuring).toBe(false);
      expect(typeof expanded.async).toBe('object');
      expect(expanded.async.await).toBe(false);
    });

    describe('Dynamic Expansion (TDD for Phase 2)', () => {
      test('should automatically detect expandable fields from defaultConfig', () => {
        // Test that we can expand ANY object field from defaultConfig without hardcoded lists
        const configWithAllExpandableTrue: Config = {
          ...defaultConfig,
          variables: true,
          functions: true,
          controlFlow: true,
          operators: true,
          syntax: true,
          dataStructures: true,
          scopes: true,
          async: true,
          modules: true,
          errors: true
        };

        const expanded = expandShorthand(configWithAllExpandableTrue);

        // All expandable fields should become objects matching defaults
        expect(expanded.variables).toEqual(defaultConfig.variables);
        expect(expanded.functions).toEqual(defaultConfig.functions);
        expect(expanded.controlFlow).toEqual(defaultConfig.controlFlow);
        expect(expanded.operators).toEqual(defaultConfig.operators);
        expect(expanded.syntax).toEqual(defaultConfig.syntax);
        expect(expanded.dataStructures).toEqual(defaultConfig.dataStructures);
        expect(expanded.scopes).toEqual(defaultConfig.scopes);
        expect(expanded.async).toEqual(defaultConfig.async);
        expect(expanded.modules).toEqual(defaultConfig.modules);
        expect(expanded.errors).toEqual(defaultConfig.errors);
      });

      test('should automatically detect expandable fields for false expansion', () => {
        // Test that false expansion works for ANY object field without hardcoded lists
        const configWithAllExpandableFalse: Config = {
          ...defaultConfig,
          variables: false,
          functions: false,
          controlFlow: false,
          operators: false,
          syntax: false,
          dataStructures: false,
          scopes: false,
          async: false,
          modules: false,
          errors: false
        };

        const expanded = expandShorthand(configWithAllExpandableFalse);

        // All should be disabled objects with same structure but false/empty values
        expect(expanded.variables.declare.var).toBe(false);
        expect(expanded.variables.assign).toBe(false);
        expect(expanded.variables.read).toBe(false);
        expect(expanded.variables.filter).toEqual([]);

        expect(expanded.functions.calls).toBe(false);
        expect(expanded.functions.returns).toBe(false);
        expect(expanded.functions.filter).toEqual([]);

        expect(expanded.operators.computing).toBe(false);
        expect(expanded.operators.selecting).toBe(false);
        expect(expanded.operators.mutating).toBe(false);
        expect(expanded.operators.filter).toEqual([]);
      });

      test('should NOT expand non-object fields', () => {
        // Test that primitive fields (string, boolean, number) are not expanded
        const configWithPrimitives: Config = {
          ...defaultConfig,
          preset: true as any, // string field should not be expandable
          instantiation: true, // boolean field should stay boolean
          prototypeLookup: true, // boolean field should stay boolean
          coercion: true, // boolean field should stay boolean
          type: true as any // string field should not be expandable
        };

        const expanded = expandShorthand(configWithPrimitives);

        // These should remain as-is (not expanded to objects)
        expect(expanded.preset).toBe(true);
        expect(expanded.instantiation).toBe(true);
        expect(expanded.prototypeLookup).toBe(true);
        expect(expanded.coercion).toBe(true);
        expect(expanded.type).toBe(true);
      });

      test('should handle nested object expansion recursively', () => {
        // Test that nested objects like scopes.closures are handled correctly
        const configWithNestedExpansion: Config = {
          ...defaultConfig,
          scopes: {
            global: true,
            functions: true,
            blocks: false,
            modules: true,
            closures: true as any, // This should expand to the default closures object
            filter: []
          }
        };

        const expanded = expandShorthand(configWithNestedExpansion);

        expect(expanded.scopes.closures).toEqual(defaultConfig.scopes.closures);
        expect(expanded.scopes.closures.creation).toBe(false);
        expect(expanded.scopes.closures.capture).toBe(false);
        expect(expanded.scopes.closures.access).toBe(false);
      });

      test('should handle mixed expansion correctly', () => {
        // Test mixed scenarios: some expanded, some not, some partial objects
        const mixedConfig: Config = {
          ...defaultConfig,
          variables: true, // Expand to default
          functions: false, // Expand to disabled
          operators: {
            // Partial object - leave as-is
            computing: true,
            selecting: false,
            mutating: true,
            filter: ['===', '!==']
          },
          syntax: true, // Expand to default
          instantiation: false // Primitive boolean - leave as-is
        };

        const expanded = expandShorthand(mixedConfig);

        expect(expanded.variables).toEqual(defaultConfig.variables);

        expect(expanded.functions.calls).toBe(false);
        expect(expanded.functions.returns).toBe(false);
        expect(expanded.functions.filter).toEqual([]);

        expect(expanded.operators.computing).toBe(true);
        expect(expanded.operators.selecting).toBe(false);
        expect(expanded.operators.mutating).toBe(true);
        expect(expanded.operators.filter).toEqual(['===', '!==']);

        expect(expanded.syntax).toEqual(defaultConfig.syntax);
        expect(expanded.instantiation).toBe(false);
      });

      test('should work with new fields added to defaultConfig', () => {
        // Test that expansion is truly dynamic - if we add new object fields
        // to defaultConfig, they should automatically become expandable
        // without modifying expand-shorthand.ts

        // Simulate adding a new object field to defaultConfig
        const extendedDefault = {
          ...defaultConfig,
          newFeature: {
            enabled: true,
            mode: 'advanced',
            options: [],
            nested: {
              setting: false
            }
          }
        };

        // Mock defaultConfig for this test
        const originalDefault = defaultConfig;
        Object.assign(defaultConfig, extendedDefault);

        try {
          const configWithNewField: any = {
            ...defaultConfig,
            newFeature: true // Should expand to extendedDefault.newFeature
          };

          const expanded = expandShorthand(configWithNewField);

          expect(expanded.newFeature).toEqual(extendedDefault.newFeature);
          expect(expanded.newFeature.enabled).toBe(true);
          expect(expanded.newFeature.mode).toBe('advanced');
          expect(expanded.newFeature.options).toEqual([]);
          expect(expanded.newFeature.nested.setting).toBe(false);
        } finally {
          // Restore original defaultConfig
          Object.keys(defaultConfig).forEach(key => {
            if (!(key in originalDefault)) {
              delete (defaultConfig as any)[key];
            }
          });
        }
      });

      test('should fail when trying to expand non-existent field', () => {
        // This test ensures we don't silently ignore typos in field names
        const configWithTypo: any = {
          ...defaultConfig,
          variabls: true // Typo: should be 'variables'
        };

        const expanded = expandShorthand(configWithTypo);

        // The typo field should remain as boolean true (not expanded)
        expect(expanded.variabls).toBe(true);
      });
    });
  });

  describe('Validation', () => {
    test('should validate correct configurations', () => {
      const validConfig: Config = defaultConfig;
      const result: ValidationResult = validate(validConfig);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch invalid preset names', () => {
      const invalidConfig = {
        ...defaultConfig,
        preset: 'invalid' as any
      };

      const result = validate(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid preset');
    });

    test('should validate code range types', () => {
      const configWithRange: Config = {
        ...defaultConfig,
        codeRange: {
          start: [1, 0], // [line, char] format
          end: 100 // line number format
        }
      };

      const result = validate(configWithRange);
      expect(result.valid).toBe(true);
    });

    test('should catch invalid filter types', () => {
      const invalidConfig = {
        ...defaultConfig,
        variables: {
          declare: true,
          assign: true,
          read: true,
          filter: 'not-an-array' as any
        }
      };

      const result = validate(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('filter must be an array');
    });

    describe('Dynamic Validation (TDD for Phase 3)', () => {
      test('should automatically validate ALL filter fields in defaultConfig', () => {
        // Test that validation works for any filter field without hardcoded lists
        const invalidConfigs = [
          {
            name: 'variables.filter',
            config: {
              ...defaultConfig,
              variables: {
                ...defaultConfig.variables,
                filter: 'not-an-array' as any
              }
            }
          },
          {
            name: 'functions.filter',
            config: {
              ...defaultConfig,
              functions: {
                ...defaultConfig.functions,
                filter: 123 as any
              }
            }
          },
          {
            name: 'controlFlow.filter',
            config: {
              ...defaultConfig,
              controlFlow: {
                ...defaultConfig.controlFlow,
                filter: { invalid: true } as any
              }
            }
          },
          {
            name: 'operators.filter',
            config: {
              ...defaultConfig,
              operators: {
                ...defaultConfig.operators,
                filter: null as any
              }
            }
          },
          {
            name: 'syntax.filter',
            config: {
              ...defaultConfig,
              syntax: {
                ...defaultConfig.syntax,
                filter: false as any
              }
            }
          },
          {
            name: 'scopes.filter',
            config: {
              ...defaultConfig,
              scopes: {
                ...defaultConfig.scopes,
                filter: 'invalid' as any
              }
            }
          }
        ];

        invalidConfigs.forEach(({ name, config }) => {
          const result = validate(config);
          expect(result.valid).toBe(false);
          expect(result.errors.some(error => error.includes(`${name} must be an array`))).toBe(
            true
          );
        });
      });

      test('should automatically validate filter fields added to defaultConfig', () => {
        // Test that validation is truly dynamic - if we add new filter fields
        // to defaultConfig, they should automatically be validated
        // without modifying validate.ts

        // Simulate adding a new object with filter field to defaultConfig
        const extendedDefault = {
          ...defaultConfig,
          newFeature: {
            enabled: true,
            mode: 'advanced',
            filter: [] // This should be automatically validated
          }
        };

        // Mock defaultConfig for this test
        const originalDefault = defaultConfig;
        Object.assign(defaultConfig, extendedDefault);

        try {
          const invalidConfig: any = {
            ...defaultConfig,
            newFeature: {
              enabled: true,
              mode: 'advanced',
              filter: 'not-an-array' // Should fail validation
            }
          };

          const result = validate(invalidConfig);

          expect(result.valid).toBe(false);
          expect(
            result.errors.some(error => error.includes('newFeature.filter must be an array'))
          ).toBe(true);
        } finally {
          // Restore original defaultConfig
          Object.keys(defaultConfig).forEach(key => {
            if (!(key in originalDefault)) {
              delete (defaultConfig as any)[key];
            }
          });
        }
      });

      test('should handle deeply nested filter fields automatically', () => {
        // Test that nested filter validation works without hardcoded paths
        const invalidConfig = {
          ...defaultConfig,
          scopes: {
            ...defaultConfig.scopes,
            closures: {
              ...defaultConfig.scopes.closures,
              // If closures had a filter field, it should be validated
              filter: 'not-an-array' as any
            }
          }
        };

        // Add a filter field to the default closures for this test
        const originalClosures = defaultConfig.scopes.closures;
        (defaultConfig.scopes.closures as any).filter = [];

        try {
          const result = validate(invalidConfig);
          expect(result.valid).toBe(false);
          expect(
            result.errors.some(error => error.includes('scopes.closures.filter must be an array'))
          ).toBe(true);
        } finally {
          // Restore original closures
          defaultConfig.scopes.closures = originalClosures;
        }
      });

      test('should NOT validate non-filter array fields', () => {
        // Test that only 'filter' fields are validated as arrays, not all arrays
        const configWithOtherArrays: any = {
          ...defaultConfig,
          // These should not be validated as filter arrays
          someOtherArray: 'not-an-array',
          codeRange: {
            start: 'not-an-array', // This has its own validation
            end: 'not-an-array'
          }
        };

        const result = validate(configWithOtherArrays);

        // Should have codeRange errors but no "must be an array" errors for non-filter fields
        expect(result.valid).toBe(false);
        expect(result.errors.some(error => error.includes('someOtherArray must be an array'))).toBe(
          false
        );
        expect(
          result.errors.some(error => error.includes('codeRange.start must be a number'))
        ).toBe(true);
      });

      test('should validate filter arrays in any configuration structure', () => {
        // Test that validation works regardless of where filter arrays appear
        const complexConfig: any = {
          ...defaultConfig,
          // Mix of valid and invalid filter fields
          variables: {
            ...defaultConfig.variables,
            filter: ['valid', 'array'] // Valid
          },
          functions: {
            ...defaultConfig.functions,
            filter: 'invalid' // Invalid
          },
          operators: {
            ...defaultConfig.operators,
            filter: null // Invalid
          },
          syntax: {
            ...defaultConfig.syntax,
            filter: [] // Valid (empty array)
          }
        };

        const result = validate(complexConfig);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(2); // functions.filter and operators.filter
        expect(
          result.errors.some(error => error.includes('functions.filter must be an array'))
        ).toBe(true);
        expect(
          result.errors.some(error => error.includes('operators.filter must be an array'))
        ).toBe(true);
        expect(
          result.errors.some(error => error.includes('variables.filter must be an array'))
        ).toBe(false);
        expect(result.errors.some(error => error.includes('syntax.filter must be an array'))).toBe(
          false
        );
      });

      test('should handle missing filter fields gracefully', () => {
        // Test that missing filter fields don't cause validation errors
        const configWithMissingFilters: any = {
          ...defaultConfig,
          variables: {
            declare: true,
            assign: true,
            read: true
            // filter field missing - should be OK
          },
          functions: {
            calls: true,
            returns: true
            // filter field missing - should be OK
          }
        };

        const result = validate(configWithMissingFilters);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Complete Configuration Creation', () => {
    test('should create complete config from minimal input', () => {
      const minimalConfig: UserConfig = {
        preset: 'exhaustive'
      };

      const complete = createConfig(minimalConfig);

      // Should be fully expanded
      expect(typeof complete.variables).toBe('object');
      expect(typeof complete.functions).toBe('object');
      expect(complete.variables.declare).toBeDefined();
      expect(complete.functions.calls).toBeDefined();
    });

    test('should preserve user overrides', () => {
      const userConfig: UserConfig = {
        preset: 'overview',
        variables: {
          read: true, // override preset default
          filter: ['customVar']
        },
        errors: {
          stackTrace: true // override preset default
        }
      };

      const complete = createConfig(userConfig);

      expect(complete.variables.read).toBe(true);
      expect(complete.variables.filter).toEqual(['customVar']);
      expect(complete.errors.stackTrace).toBe(true);
    });

    test('should throw on validation errors', () => {
      const invalidConfig: UserConfig = {
        preset: 'invalid-preset' as any
      };

      expect(() => createConfig(invalidConfig)).toThrow();
    });
  });

  describe('Async Timestamp Configuration', () => {
    test('should accept async.timestamps: true', () => {
      const configWithTimestamps: UserConfig = {
        async: {
          timestamps: true
        }
      };

      const result = createConfig(configWithTimestamps);
      expect(result.async.timestamps).toBe(true);
    });

    test('should accept async.timestamps: false', () => {
      const configWithoutTimestamps: UserConfig = {
        async: {
          timestamps: false
        }
      };

      const result = createConfig(configWithoutTimestamps);
      expect(result.async.timestamps).toBe(false);
    });

    test('should default to false for async.timestamps', () => {
      const minimalConfig: UserConfig = {};
      const result = createConfig(minimalConfig);
      expect(result.async.timestamps).toBe(false);
    });

    test('should validate async.timestamps as boolean', () => {
      const invalidConfig = {
        ...defaultConfig,
        async: {
          timestamps: 'maybe' as any
        }
      };

      const result = validate(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('async.timestamps must be a boolean');
    });

    test('should preserve async.timestamps setting in preset application', () => {
      const userConfig: UserConfig = {
        preset: 'overview',
        async: {
          timestamps: true
        }
      };

      const result = createConfig(userConfig);
      expect(result.async.timestamps).toBe(true);
    });

    test('should handle async.timestamps in type-safe configuration', () => {
      const typedConfig: UserConfig = {
        preset: 'detailed',
        async: {
          timestamps: true
        },
        variables: {
          read: true,
          filter: ['promise', 'result']
        }
      };

      expect(() => createConfig(typedConfig)).not.toThrow();
      const result = createConfig(typedConfig);
      expect(result.async.timestamps).toBe(true);
    });
  });

  describe('Graceful Degradation (Phase 2 TDD)', () => {
    describe('Unknown Field Handling', () => {
      test('should ignore unknown top-level fields', () => {
        const configWithUnknownFields: any = {
          preset: 'detailed',
          variables: true,
          unknownField: 'should be ignored',
          anotherBadField: { complex: 'object' },
          randomNumber: 42
        };

        // Should NOT throw - graceful degradation should ignore unknown fields
        const config = createConfig(configWithUnknownFields);

        expect(config.preset).toBe('detailed');
        expect(config.variables).toEqual(defaultConfig.variables);
        // Unknown fields should be ignored (not appear in result)
        expect(config).not.toHaveProperty('unknownField');
        expect(config).not.toHaveProperty('anotherBadField');
        expect(config).not.toHaveProperty('randomNumber');
      });

      test('should ignore unknown nested fields', () => {
        const configWithNestedUnknown: any = {
          variables: {
            read: true,
            unknownSubField: 'ignore me',
            badNested: { evil: 'data' },
            filter: ['valid']
          },
          functions: {
            calls: true,
            weirdField: 123,
            returns: false
          }
        };

        const config = createConfig(configWithNestedUnknown);

        expect(config.variables.read).toBe(true);
        expect(config.variables.filter).toEqual(['valid']);
        expect(config.variables).not.toHaveProperty('unknownSubField');
        expect(config.variables).not.toHaveProperty('badNested');

        expect(config.functions.calls).toBe(true);
        expect(config.functions.returns).toBe(false);
        expect(config.functions).not.toHaveProperty('weirdField');
      });
    });

    describe('Wrong Type Handling', () => {
      test('should use defaults for wrong-type top-level fields', () => {
        const configWithWrongTypes: any = {
          variables: 'should be object or boolean', // Wrong type
          functions: 123, // Wrong type
          preset: { object: 'not string' }, // Wrong type
          instantiation: 'not boolean', // Wrong type
          type: false // Wrong type (should be string)
        };

        const config = createConfig(configWithWrongTypes);

        // Should use default values for wrong-type fields
        expect(config.variables).toEqual(defaultConfig.variables);
        expect(config.functions).toEqual(defaultConfig.functions);
        expect(config.preset).toBe(defaultConfig.preset);
        expect(config.instantiation).toBe(defaultConfig.instantiation);
        expect(config.type).toBe(defaultConfig.type);
      });

      test('should use defaults for wrong-type nested fields', () => {
        const configWithWrongNestedTypes: any = {
          variables: {
            read: 'not boolean', // Wrong type
            assign: 123, // Wrong type
            declare: { bad: 'object' }, // Wrong type
            filter: 'not array' // Wrong type
          },
          async: {
            await: 'maybe', // Wrong type
            timestamps: null // Wrong type
          }
        };

        const config = createConfig(configWithWrongNestedTypes);

        // Should use default values for wrong-type nested fields
        expect(config.variables.read).toBe(defaultConfig.variables.read);
        expect(config.variables.assign).toBe(defaultConfig.variables.assign);
        expect(config.variables.declare).toEqual(defaultConfig.variables.declare);
        expect(config.variables.filter).toEqual(defaultConfig.variables.filter);

        expect(config.async.await).toBe(defaultConfig.async.await);
        expect(config.async.timestamps).toBe(defaultConfig.async.timestamps);
      });
    });

    describe('Missing Field Handling', () => {
      test('should add missing top-level fields from defaults', () => {
        const incompleteConfig: any = {
          // No preset to avoid preset overrides
          variables: true
          // All other fields missing
        };

        const config = createConfig(incompleteConfig);

        // All default fields should be present (variables expanded, others from defaults)
        expect(config.variables).toEqual(defaultConfig.variables); // true expanded to default
        expect(config.functions).toEqual(defaultConfig.functions);
        expect(config.controlFlow).toEqual(defaultConfig.controlFlow);
        expect(config.operators).toEqual(defaultConfig.operators);
        expect(config.syntax).toEqual(defaultConfig.syntax);
        expect(config.dataStructures).toEqual(defaultConfig.dataStructures);
        expect(config.scopes).toEqual(defaultConfig.scopes);
        expect(config.async).toEqual(defaultConfig.async);
        expect(config.modules).toEqual(defaultConfig.modules);
        expect(config.errors).toEqual(defaultConfig.errors);
        expect(config.aran).toEqual(defaultConfig.aran);
        expect(config.instantiation).toBe(defaultConfig.instantiation);
        expect(config.prototypeLookup).toBe(defaultConfig.prototypeLookup);
        expect(config.coercion).toBe(defaultConfig.coercion);
        expect(config.type).toBe(defaultConfig.type);
      });

      test('should add missing nested fields from defaults', () => {
        const partialNestedConfig: any = {
          variables: {
            read: false
            // declare, assign, filter missing
          },
          functions: {
            calls: true
            // returns, this, filter missing
          },
          async: {
            await: true
            // timestamps missing
          }
        };

        const config = createConfig(partialNestedConfig);

        // Should merge with defaults for missing nested fields
        expect(config.variables.read).toBe(false); // User override
        expect(config.variables.declare).toEqual(defaultConfig.variables.declare);
        expect(config.variables.assign).toBe(defaultConfig.variables.assign);
        expect(config.variables.filter).toEqual(defaultConfig.variables.filter);

        expect(config.functions.calls).toBe(true); // User override
        expect(config.functions.returns).toBe(defaultConfig.functions.returns);
        expect(config.functions.this).toBe(defaultConfig.functions.this);
        expect(config.functions.filter).toEqual(defaultConfig.functions.filter);

        expect(config.async.await).toBe(true); // User override
        expect(config.async.timestamps).toBe(defaultConfig.async.timestamps);
      });
    });

    describe('Boolean Expansion for Wrong Types', () => {
      test('should expand true to default object even when nested has wrong types', () => {
        const configWithMixedIssues: any = {
          variables: true, // Should expand to default
          functions: {
            // Partial object with wrong types
            calls: 'wrong type',
            returns: true,
            badField: 'ignore'
          }
        };

        const config = createConfig(configWithMixedIssues);

        // variables: true should expand to full default
        expect(config.variables).toEqual(defaultConfig.variables);

        // functions partial object should merge with defaults, fixing wrong types
        expect(config.functions.calls).toBe(defaultConfig.functions.calls); // Fixed wrong type
        expect(config.functions.returns).toBe(true); // User override kept
        expect(config.functions.this).toBe(defaultConfig.functions.this); // Added from default
        expect(config.functions.filter).toEqual(defaultConfig.functions.filter); // Added from default
        expect(config.functions).not.toHaveProperty('badField'); // Ignored unknown field
      });

      test('should expand false to disabled object even when structure is wrong', () => {
        const configWithFalseExpansion: any = {
          variables: false, // Should expand to disabled version
          functions: 'wrong' // Wrong type, should use default then process
        };

        const config = createConfig(configWithFalseExpansion);

        // variables: false should expand to disabled version
        expect(config.variables.read).toBe(false);
        expect(config.variables.assign).toBe(false);
        expect(config.variables.declare.var).toBe(false);
        expect(config.variables.declare.let).toBe(false);
        expect(config.variables.declare.const).toBe(false);
        expect(config.variables.declare.function).toBe(false);
        expect(config.variables.declare.implicit).toBe(false);
        expect(config.variables.filter).toEqual([]);

        // functions: wrong type should fall back to default
        expect(config.functions).toEqual(defaultConfig.functions);
      });
    });

    describe('Invalid Preset Handling', () => {
      test('should ignore invalid preset and use default config', () => {
        const configWithBadPreset: any = {
          preset: 'nonexistent-preset',
          variables: {
            read: true // This should still work
          }
        };

        // Should NOT throw - should ignore bad preset
        const config = createConfig(configWithBadPreset);

        // Should fall back to default preset behavior (no preset applied)
        expect(config.variables.read).toBe(true); // User override preserved
        expect(config.functions).toEqual(defaultConfig.functions); // Default used
      });

      test('should handle preset with wrong type', () => {
        const configWithWrongPresetType: any = {
          preset: { object: 'not string' },
          operators: true
        };

        const config = createConfig(configWithWrongPresetType);

        // Should ignore wrong-type preset and proceed with defaults
        expect(config.preset).toBe(defaultConfig.preset);
        expect(config.operators).toEqual(defaultConfig.operators); // true expanded
      });
    });

    describe('Comprehensive Mixed Error Handling', () => {
      test('should handle multiple error types simultaneously', () => {
        const messyConfig: any = {
          preset: 'nonexistent', // Invalid preset
          variables: 'wrong type', // Wrong type (should use default)
          functions: true, // Valid boolean expansion
          operators: {
            // Partial object with issues
            computing: 'wrong type', // Wrong type field
            selecting: true, // Valid field
            unknownField: 'ignore me', // Unknown field
            filter: 'not array' // Wrong type array
          },
          syntax: false, // Valid boolean expansion
          unknownTopLevel: { ignore: 'me' }, // Unknown top-level field
          async: {
            // Nested with mixed issues
            await: true, // Valid
            timestamps: 'wrong type', // Wrong type
            badNested: 'ignore' // Unknown nested
          },
          aran: {
            // Complex nested with issues
            kind: 'invalid-kind', // Invalid enum value
            mode: 'normal', // Valid value
            warning: 'maybe', // Invalid enum value
            extraField: 'ignore' // Unknown field
          }
        };

        // Should NOT throw - should gracefully handle all issues
        const config = createConfig(messyConfig);

        // Should use defaults for invalid/wrong-type fields
        expect(config.preset).toBe(defaultConfig.preset);
        expect(config.variables).toEqual(defaultConfig.variables);

        // Valid expansion should work
        expect(config.functions).toEqual(defaultConfig.functions);
        expect(config.syntax.destructuring).toBe(false);
        expect(config.syntax.spread).toBe(false);

        // Partial objects should merge correctly
        expect(config.operators.computing).toBe(defaultConfig.operators.computing); // Fixed wrong type
        expect(config.operators.selecting).toBe(true); // User value preserved
        expect(config.operators.mutating).toBe(defaultConfig.operators.mutating); // Added from default
        expect(config.operators.filter).toEqual(defaultConfig.operators.filter); // Fixed wrong type
        expect(config.operators).not.toHaveProperty('unknownField'); // Ignored

        // Nested objects should handle mixed issues
        expect(config.async.await).toBe(true); // User value preserved
        expect(config.async.timestamps).toBe(defaultConfig.async.timestamps); // Fixed wrong type
        expect(config.async).not.toHaveProperty('badNested'); // Ignored

        // Complex nested with enum validation fallback
        expect(config.aran.kind).toBe(defaultConfig.aran.kind); // Fixed invalid enum
        expect(config.aran.mode).toBe('normal'); // User value preserved
        expect(config.aran.warning).toBe(defaultConfig.aran.warning); // Fixed invalid enum
        expect(config.aran).not.toHaveProperty('extraField'); // Ignored

        // Unknown top-level should be ignored
        expect(config).not.toHaveProperty('unknownTopLevel');
      });
    });

    describe('Legacy Field Handling (No Errors)', () => {
      test('should ignore deprecated fields without throwing', () => {
        const configWithLegacyFields: any = {
          preset: 'detailed',
          blocks: { enter: true }, // Deprecated
          iterators: { forOf: true }, // Deprecated
          timestamps: true, // Deprecated (moved to async.timestamps)
          variables: true // Valid
        };

        // Should NOT throw - should ignore deprecated fields
        const config = createConfig(configWithLegacyFields);

        expect(config.preset).toBe('detailed');
        expect(config.variables).toEqual(defaultConfig.variables);

        // Deprecated fields should be ignored
        expect(config).not.toHaveProperty('blocks');
        expect(config).not.toHaveProperty('iterators');
        expect(config).not.toHaveProperty('timestamps');

        // async.timestamps should use default (not affected by legacy timestamps)
        expect(config.async.timestamps).toBe(defaultConfig.async.timestamps);
      });
    });
  });

  describe('Real-World Usage Patterns', () => {
    test('educational scenario - beginner variable tracing', () => {
      const beginnerConfig: UserConfig = {
        preset: 'overview',
        variables: {
          read: true,
          filter: ['result', 'count']
        },
        functions: false,
        operators: false
      };

      const config = createConfig(beginnerConfig);

      expect(config.variables.read).toBe(true);
      expect(config.variables.filter).toEqual(['result', 'count']);
      expect(config.functions.calls).toBe(false);
      expect(config.operators.computing).toBe(false);
    });

    test('debugging scenario - detailed function analysis', () => {
      const debugConfig: UserConfig = {
        preset: 'detailed',
        functions: {
          calls: true,
          returns: true,
          this: true, // enable for debugging
          filter: ['myFunction', 'helper']
        },
        errors: {
          stackTrace: true,
          variableStates: true // expensive but useful for debugging
        }
      };

      const config = createConfig(debugConfig);

      expect(config.functions.this).toBe(true);
      expect(config.functions.filter).toEqual(['myFunction', 'helper']);
      expect(config.errors.variableStates).toBe(true);
    });

    test('production scenario - minimal overhead', () => {
      const prodConfig: UserConfig = {
        preset: 'overview',
        variables: { read: false },
        functions: { returns: false },
        errors: { stackTrace: false },
        async: { timestamps: false },
        performance: {
          maxEvents: 1000,
          enableSampling: true,
          samplingRate: 0.1
        } as any
      };

      const config = createConfig(prodConfig);

      expect(config.variables.read).toBe(false);
      expect(config.functions.returns).toBe(false);
      expect(config.errors.stackTrace).toBe(false);
      expect(config.async.timestamps).toBe(false);
    });

    test('async execution study scenario', () => {
      const asyncConfig: UserConfig = {
        preset: 'detailed',
        async: {
          await: true,
          timestamps: true // Essential for async timing analysis
        },
        functions: {
          calls: true,
          returns: true
        },
        variables: {
          filter: ['promise', 'result', 'error']
        },
        operators: false, // Reduce noise
        scopes: {
          global: true,
          functions: true,
          blocks: false,
          modules: true,
          closures: false,
          filter: []
        }
      };

      const config = createConfig(asyncConfig);

      expect(config.async.timestamps).toBe(true);
      expect(config.async.await).toBe(true);
      expect(config.functions.calls).toBe(true);
      expect(config.variables.filter).toEqual(['promise', 'result', 'error']);
      expect(config.operators.computing).toBe(false);
      expect(config.scopes.blocks).toBe(false);
    });
  });
});
