/**
 * @file TDD tests for configuration type definitions
 * Tests the structure of Config, MetaConfig, LangConfig and all nested types
 */

import type { MetaConfig, LangConfig, Config } from '../types.js';

describe('Configuration Type Definitions', () => {
  describe('MetaConfig Type', () => {
    test('should have MetaConfig type exported', () => {
      // This test verifies MetaConfig type exists and can be used
      const metaConfig: MetaConfig = {
        default: null,
        maxIterations: null,
        maxCallstack: null,
        index: true,
        range: {
          start: 1,
          end: 1000
        },
        location: 'line',
        ast: true,
        data: {
          type: true,
          instance: true,
          value: true,
          lookup: false
        },
        references: true,
        debug: {
          configPath: true,
          AranNodeId: true,
          adviceName: true
        },
        timestamps: false
      };

      // TypeScript will fail at compile time if types don't match
      expect(metaConfig).toBeDefined();
      expect(metaConfig.index).toBe(true);
      expect(metaConfig.range?.start).toBe(1);
      expect(metaConfig.location).toBe('line');
    });

    test('should accept location as false', () => {
      const metaConfig: MetaConfig = {
        location: false
      };
      expect(metaConfig.location).toBe(false);
    });

    test('should accept location as "full"', () => {
      const metaConfig: MetaConfig = {
        location: 'full'
      };
      expect(metaConfig.location).toBe('full');
    });

    test('should accept partial MetaConfig with only some fields', () => {
      const metaConfig: MetaConfig = {
        maxIterations: 1000,
        timestamps: true
      };
      expect(metaConfig.maxIterations).toBe(1000);
      expect(metaConfig.timestamps).toBe(true);
    });

    test('should accept nested data configuration', () => {
      const metaConfig: MetaConfig = {
        data: {
          type: false,
          instance: false,
          value: true,
          lookup: true
        }
      };
      expect(metaConfig.data?.value).toBe(true);
      expect(metaConfig.data?.lookup).toBe(true);
    });

    test('should accept nested debug configuration', () => {
      const metaConfig: MetaConfig = {
        debug: {
          configPath: false,
          AranNodeId: false,
          adviceName: true
        }
      };
      expect(metaConfig.debug?.adviceName).toBe(true);
    });

    test('should accept null values for limits', () => {
      const metaConfig: MetaConfig = {
        maxIterations: null,
        maxCallstack: null,
        default: null
      };
      expect(metaConfig.maxIterations).toBeNull();
      expect(metaConfig.maxCallstack).toBeNull();
    });
  });

  describe('LangConfig Type', () => {
    test('should have LangConfig type exported', () => {
      // Test that LangConfig type can be imported and used
      const langConfig: LangConfig = {
        semantics: true,
        bindings: {
          kind: {
            declarative: {
              var: true,
              let: true,
              const: true,
              function: true,
              class: true,
              import: true
            },
            explicit: {
              parameters: true,
              catch: true
            },
            implicit: {
              global: true,
              arguments: true,
              callee: true,
              this: true,
              newTarget: true,
              super: true,
              importMeta: true
            },
            with: true
          },
          events: {
            declare: true,
            available: true,
            initialize: true,
            implicit: true,
            assign: true,
            read: true
          },
          filter: {
            include: [],
            exclude: []
          }
        }
      };

      expect(langConfig).toBeDefined();
      expect(langConfig.semantics).toBe(true);
      expect(langConfig.bindings.kind.declarative.var).toBe(true);
    });

    test('should accept partial bindings configuration', () => {
      const langConfig: LangConfig = {
        bindings: {
          kind: {
            declarative: {
              var: false,
              let: true,
              const: true,
              function: false,
              class: false,
              import: false
            }
          }
        }
      };

      expect(langConfig.bindings?.kind?.declarative?.let).toBe(true);
      expect(langConfig.bindings?.kind?.declarative?.var).toBe(false);
    });

    test('should accept properties configuration', () => {
      const langConfig: LangConfig = {
        properties: {
          create: {
            literal: true,
            computed: true,
            method: true,
            accessors: {
              getters: true,
              setters: true
            },
            class: true,
            static: true,
            private: true,
            fields: true
          },
          access: true,
          update: true,
          remove: true,
          optionalChaining: true,
          lookup: true,
          filter: ['prop1', 'prop2']
        }
      };

      expect(langConfig.properties).toBeDefined();
      expect(langConfig.properties.create.literal).toBe(true);
      expect(langConfig.properties.access).toBe(true);
    });
  });

  describe('Root Config Type', () => {
    test('should accept Config with meta and lang sections', () => {
      const config: Config = {
        presets: 'detailed',
        meta: {
          index: true,
          location: 'line',
          timestamps: false
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
                class: true,
                import: true
              }
            }
          }
        }
      };

      expect(config).toBeDefined();
      expect(config.presets).toBe('detailed');
      expect(config.meta?.index).toBe(true);
      expect(config.lang?.semantics).toBe(true);
    });

    test('should accept empty Config object', () => {
      const config: Config = {};
      expect(config).toBeDefined();
    });

    test('should accept Config with only presets', () => {
      const config: Config = {
        presets: 'overview'
      };
      expect(config.presets).toBe('overview');
    });
  });
});