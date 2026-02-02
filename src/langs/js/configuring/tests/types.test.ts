import type { MetaConfig, LangConfig, Config } from '../types.js';

describe('configuration type definitions', () => {
  describe('MetaConfig', () => {
    describe('full structure', () => {
      const metaConfig: MetaConfig = {
        default: null,
        maxIterations: null,
        maxCallstack: null,
        index: true,
        range: {
          start: 1,
          end: 1000,
        },
        location: 'line',
        ast: true,
        data: {
          type: true,
          instance: true,
          value: true,
          lookup: false,
        },
        references: true,
        debug: {
          configPath: true,
          AranNodeId: true,
          adviceName: true,
        },
        timestamps: false,
      };

      it('is defined', () => {
        expect(metaConfig).toBeDefined();
      });

      it('index = true', () => {
        expect(metaConfig.index).toBe(true);
      });

      it('range.start = 1', () => {
        expect(metaConfig.range?.start).toBe(1);
      });

      it('location = "line"', () => {
        expect(metaConfig.location).toBe('line');
      });
    });

    describe('location values', () => {
      it('accepts false', () => {
        const metaConfig: MetaConfig = { location: false };
        expect(metaConfig.location).toBe(false);
      });

      it('accepts "full"', () => {
        const metaConfig: MetaConfig = { location: 'full' };
        expect(metaConfig.location).toBe('full');
      });
    });

    describe('partial structure', () => {
      it('accepts maxIterations only', () => {
        const metaConfig: MetaConfig = {
          maxIterations: 1000,
          timestamps: true,
        };
        expect(metaConfig.maxIterations).toBe(1000);
      });

      it('accepts timestamps only', () => {
        const metaConfig: MetaConfig = {
          maxIterations: 1000,
          timestamps: true,
        };
        expect(metaConfig.timestamps).toBe(true);
      });
    });

    describe('nested data configuration', () => {
      const metaConfig: MetaConfig = {
        data: {
          type: false,
          instance: false,
          value: true,
          lookup: true,
        },
      };

      it('data.value = true', () => {
        expect(metaConfig.data?.value).toBe(true);
      });

      it('data.lookup = true', () => {
        expect(metaConfig.data?.lookup).toBe(true);
      });
    });

    describe('nested debug configuration', () => {
      it('debug.adviceName = true', () => {
        const metaConfig: MetaConfig = {
          debug: {
            configPath: false,
            AranNodeId: false,
            adviceName: true,
          },
        };
        expect(metaConfig.debug?.adviceName).toBe(true);
      });
    });

    describe('null values for limits', () => {
      const metaConfig: MetaConfig = {
        maxIterations: null,
        maxCallstack: null,
        default: null,
      };

      it('maxIterations is null', () => {
        expect(metaConfig.maxIterations).toBeNull();
      });

      it('maxCallstack is null', () => {
        expect(metaConfig.maxCallstack).toBeNull();
      });
    });
  });

  describe('LangConfig', () => {
    describe('full structure', () => {
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
              import: true,
            },
            explicit: {
              parameters: true,
              catch: true,
            },
            implicit: {
              global: true,
              arguments: true,
              callee: true,
              this: true,
              newTarget: true,
              super: true,
              importMeta: true,
            },
            with: true,
          },
          events: {
            declare: true,
            available: true,
            initialize: true,
            implicit: true,
            assign: true,
            read: true,
          },
          filter: {
            include: [],
            exclude: [],
          },
        },
      };

      it('is defined', () => {
        expect(langConfig).toBeDefined();
      });

      it('semantics = true', () => {
        expect(langConfig.semantics).toBe(true);
      });

      it('bindings.kind.declarative.var = true', () => {
        expect(langConfig.bindings.kind.declarative.var).toBe(true);
      });
    });

    describe('partial bindings configuration', () => {
      const langConfig: LangConfig = {
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
          },
        },
      };

      it('bindings.kind.declarative.let = true', () => {
        expect(langConfig.bindings?.kind?.declarative?.let).toBe(true);
      });

      it('bindings.kind.declarative.var = false', () => {
        expect(langConfig.bindings?.kind?.declarative?.var).toBe(false);
      });
    });

    describe('properties configuration', () => {
      const langConfig: LangConfig = {
        properties: {
          create: {
            literal: true,
            computed: true,
            method: true,
            accessors: {
              getters: true,
              setters: true,
            },
            class: true,
            static: true,
            private: true,
            fields: true,
          },
          access: true,
          update: true,
          remove: true,
          optionalChaining: true,
          lookup: true,
          filter: ['prop1', 'prop2'],
        },
      };

      it('properties is defined', () => {
        expect(langConfig.properties).toBeDefined();
      });

      it('properties.create.literal = true', () => {
        expect(langConfig.properties.create.literal).toBe(true);
      });

      it('properties.access = true', () => {
        expect(langConfig.properties.access).toBe(true);
      });
    });
  });

  describe('Config (root)', () => {
    describe('full structure with meta and lang', () => {
      const config: Config = {
        presets: 'detailed',
        meta: {
          index: true,
          location: 'line',
          timestamps: false,
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
                import: true,
              },
            },
          },
        },
      };

      it('is defined', () => {
        expect(config).toBeDefined();
      });

      it('presets = "detailed"', () => {
        expect(config.presets).toBe('detailed');
      });

      it('meta.index = true', () => {
        expect(config.meta?.index).toBe(true);
      });

      it('lang.semantics = true', () => {
        expect(config.lang?.semantics).toBe(true);
      });
    });

    describe('empty Config', () => {
      it('empty object is valid', () => {
        const config: Config = {};
        expect(config).toBeDefined();
      });
    });

    describe('Config with only presets', () => {
      it('presets = "overview"', () => {
        const config: Config = { presets: 'overview' };
        expect(config.presets).toBe('overview');
      });
    });
  });
});
