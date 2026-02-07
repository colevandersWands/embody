/**
 * Tests for js-klve record function.
 *
 * Note: record() receives FULLY-FILLED config from /configuring.
 * These tests verify tracing, filtering, and error handling.
 */

import LimitExceededError from '../../../errors/limit-exceeded-error.js';
import ParseError from '../../../errors/parse-error.js';
import RuntimeError from '../../../errors/runtime-error.js';
import type { MetaConfig } from '../../types.js';
import record from '../record.js';
import type { JsKlveOptions, JsKlveStep } from '../types.js';

/** Default meta config for tests (all limits disabled) */
const DEFAULT_META: MetaConfig = {
  max: { steps: null, iterations: null, callstack: null, time: null },
  range: null,
  timestamps: false,
  debug: { ast: false },
};

/** Default fully-filled options (no filtering) */
const DEFAULT_OPTIONS: JsKlveOptions = {
  filter: {},
};

/** Config with default meta and options */
const defaultConfig = { meta: DEFAULT_META, options: DEFAULT_OPTIONS };

/** Creates config with custom options merged over defaults */
function config(overrides: Partial<JsKlveOptions>): { meta: MetaConfig; options: JsKlveOptions } {
  return { meta: DEFAULT_META, options: { ...DEFAULT_OPTIONS, ...overrides } };
}

/** Creates config with custom meta */
function metaConfig(metaOverrides: Partial<MetaConfig>): {
  meta: MetaConfig;
  options: JsKlveOptions;
} {
  return { meta: { ...DEFAULT_META, ...metaOverrides }, options: DEFAULT_OPTIONS };
}

describe('record (async)', () => {
  describe('basic tracing', () => {
    it('produces steps for simple variable declaration', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      expect(steps.length).toBeGreaterThan(0);
    });

    it('produces init step first', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      expect(steps[0].category).toBe('init');
    });

    it('assigns sequential step numbers starting at 1', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      expect(steps[0].step).toBe(1);
    });

    it('includes location data in steps', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      const stepsWithLoc = steps.filter((s) => s.loc);
      expect(stepsWithLoc.length).toBeGreaterThan(0);
    });

    it('throws RuntimeError for empty code', async () => {
      // Empty code causes Babel transform to fail
      await expect(record('', defaultConfig)).rejects.toBeInstanceOf(RuntimeError);
    });
  });

  describe('expression tracing', () => {
    it('traces binary expressions', async () => {
      const steps = await record('1 + 2;', defaultConfig);
      const binarySteps = steps.filter((s) => s.type === 'BinaryExpression');
      expect(binarySteps.length).toBeGreaterThan(0);
    });

    it('traces function calls', async () => {
      const steps = await record('console.log("test");', defaultConfig);
      const callSteps = steps.filter((s) => s.type === 'CallExpression');
      expect(callSteps.length).toBeGreaterThan(0);
    });

    it('traces member expressions', async () => {
      const steps = await record('console.log;', defaultConfig);
      const memberSteps = steps.filter((s) => s.type === 'MemberExpression');
      expect(memberSteps.length).toBeGreaterThan(0);
    });

    it('traces numeric literals', async () => {
      const steps = await record('42;', defaultConfig);
      const literalSteps = steps.filter((s) => s.type === 'NumericLiteral');
      expect(literalSteps.length).toBeGreaterThan(0);
    });
  });

  describe('statement tracing', () => {
    it('traces variable declarations', async () => {
      const steps = await record('let x = 1;', defaultConfig);
      const declSteps = steps.filter((s) => s.type === 'VariableDeclaration');
      expect(declSteps.length).toBeGreaterThan(0);
    });

    it('traces for loops', async () => {
      const steps = await record('for (let i = 0; i < 2; i++) {}', defaultConfig);
      const forSteps = steps.filter((s) => s.type === 'ForStatement');
      expect(forSteps.length).toBeGreaterThan(0);
    });

    it('traces while loops', async () => {
      const steps = await record('let x = 0; while (x < 1) { x++; }', defaultConfig);
      const whileSteps = steps.filter((s) => s.type === 'WhileStatement');
      expect(whileSteps.length).toBeGreaterThan(0);
    });

    it('traces if statements', async () => {
      const steps = await record('if (true) {}', defaultConfig);
      const ifSteps = steps.filter((s) => s.type === 'IfStatement');
      expect(ifSteps.length).toBeGreaterThan(0);
    });
  });

  describe('timing filter', () => {
    it('includes before steps by default', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      const beforeSteps = steps.filter((s) => s.time === 'before');
      expect(beforeSteps.length).toBeGreaterThan(0);
    });

    it('includes after steps by default', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      const afterSteps = steps.filter((s) => s.time === 'after');
      expect(afterSteps.length).toBeGreaterThan(0);
    });

    it('excludes before steps when timing.before is false', async () => {
      const steps = await record(
        'const x = 1;',
        config({
          filter: { timing: { before: false, after: true } },
        }),
      );
      const beforeSteps = steps.filter((s) => s.time === 'before');
      expect(beforeSteps.length).toBe(0);
    });

    it('excludes after steps when timing.after is false', async () => {
      const steps = await record(
        'const x = 1;',
        config({
          filter: { timing: { before: true, after: false } },
        }),
      );
      const afterSteps = steps.filter((s) => s.time === 'after');
      expect(afterSteps.length).toBe(0);
    });
  });

  describe('node type filter', () => {
    it('excludes NumericLiteral when literals.numeric is false', async () => {
      const steps = await record(
        '42;',
        config({
          filter: { nodes: { literals: { numeric: false } } },
        }),
      );
      const literalSteps = steps.filter((s) => s.type === 'NumericLiteral');
      expect(literalSteps.length).toBe(0);
    });

    it('excludes BinaryExpression when operators.binary is false', async () => {
      const steps = await record(
        '1 + 2;',
        config({
          filter: { nodes: { operators: { binary: false } } },
        }),
      );
      const binarySteps = steps.filter((s) => s.type === 'BinaryExpression');
      expect(binarySteps.length).toBe(0);
    });

    it('excludes Identifier when access.identifier is false', async () => {
      const steps = await record(
        'const x = 1; x;',
        config({
          filter: { nodes: { access: { identifier: false } } },
        }),
      );
      const identifierSteps = steps.filter((s) => s.type === 'Identifier');
      expect(identifierSteps.length).toBe(0);
    });

    it('excludes ForStatement when loops.for is false', async () => {
      const steps = await record(
        'for (let i = 0; i < 1; i++) {}',
        config({
          filter: { nodes: { loops: { for: false } } },
        }),
      );
      const forSteps = steps.filter((s) => s.type === 'ForStatement');
      expect(forSteps.length).toBe(0);
    });
  });

  describe('data field filter', () => {
    it('includes scopes by default', async () => {
      const steps = await record('const x = 1;', defaultConfig);
      const stepsWithScopes = steps.filter((s) => 'scopes' in s);
      expect(stepsWithScopes.length).toBeGreaterThan(0);
    });

    it('excludes scopes when data.scopes is false', async () => {
      const steps = await record(
        'const x = 1;',
        config({
          filter: { data: { scopes: false } },
        }),
      );
      const stepsWithScopes = steps.filter((s) => 'scopes' in s);
      expect(stepsWithScopes.length).toBe(0);
    });

    it('includes value by default', async () => {
      const steps = await record('1 + 2;', defaultConfig);
      const stepsWithValue = steps.filter((s) => 'value' in s);
      expect(stepsWithValue.length).toBeGreaterThan(0);
    });

    it('excludes value when data.value is false', async () => {
      const steps = await record(
        '1 + 2;',
        config({
          filter: { data: { value: false } },
        }),
      );
      const stepsWithValue = steps.filter((s) => 'value' in s);
      expect(stepsWithValue.length).toBe(0);
    });

    it('excludes dt when data.dt is false', async () => {
      const steps = await record(
        'const x = 1;',
        config({
          filter: { data: { dt: false } },
        }),
      );
      const stepsWithDt = steps.filter((s) => 'dt' in s);
      expect(stepsWithDt.length).toBe(0);
    });

    it('excludes loc when data.loc is false', async () => {
      const steps = await record(
        'const x = 1;',
        config({
          filter: { data: { loc: false } },
        }),
      );
      const stepsWithLoc = steps.filter((s) => 'loc' in s);
      expect(stepsWithLoc.length).toBe(0);
    });
  });

  describe('console.log capture', () => {
    it('captures console.log output', async () => {
      const steps = await record('console.log("hello");', defaultConfig);
      const stepsWithLogs = steps.filter((s) => 'logs' in s && (s.logs as unknown[]).length > 0);
      expect(stepsWithLogs.length).toBeGreaterThan(0);
    });

    it('captures multiple log arguments', async () => {
      const steps = await record('console.log("a", "b");', defaultConfig);
      const stepsWithLogs = steps.filter((s) => 'logs' in s && (s.logs as unknown[]).length > 0);
      expect(stepsWithLogs.length).toBeGreaterThan(0);
    });

    it('excludes logs when data.logs is false', async () => {
      const steps = await record(
        'console.log("hello");',
        config({
          filter: { data: { logs: false } },
        }),
      );
      const stepsWithLogs = steps.filter((s) => 'logs' in s);
      expect(stepsWithLogs.length).toBe(0);
    });
  });

  describe('error handling', () => {
    describe('ParseError', () => {
      it('rejects with ParseError for syntax errors', async () => {
        await expect(record('const = 1;', defaultConfig)).rejects.toBeInstanceOf(ParseError);
      });

      it('includes error message', async () => {
        await expect(record('const = 1;', defaultConfig)).rejects.toThrow(/unexpected/i);
      });

      it('includes location info', async () => {
        try {
          await record('const = 1;', defaultConfig);
        } catch (error) {
          expect(error).toBeInstanceOf(ParseError);
          expect((error as ParseError).loc).toBeDefined();
        }
      });
    });

    describe('RuntimeError', () => {
      it('rejects with RuntimeError for runtime errors', async () => {
        await expect(record('throw new Error("test");', defaultConfig)).rejects.toBeInstanceOf(
          RuntimeError,
        );
      });

      it('includes error message', async () => {
        await expect(record('throw new Error("test error");', defaultConfig)).rejects.toThrow(
          /test error/i,
        );
      });
    });

    describe('LimitExceededError', () => {
      it('rejects when steps exceed meta.max.steps', async () => {
        await expect(
          record(
            'for (let i = 0; i < 100; i++) {}',
            metaConfig({
              max: { ...DEFAULT_META.max, steps: 5 },
            }),
          ),
        ).rejects.toBeInstanceOf(LimitExceededError);
      });

      it('includes step count in error message', async () => {
        await expect(
          record(
            'for (let i = 0; i < 100; i++) {}',
            metaConfig({
              max: { ...DEFAULT_META.max, steps: 5 },
            }),
          ),
        ).rejects.toThrow(/steps/i);
      });

      it('does not reject when meta.max.steps is null', async () => {
        const steps = await record('for (let i = 0; i < 10; i++) {}', defaultConfig);
        expect(steps.length).toBeGreaterThan(5);
      });
    });
  });

  describe('complex code', () => {
    it('traces function expressions', async () => {
      const steps = await record('const f = function() { return 1; };', defaultConfig);
      const functionSteps = steps.filter((s) => s.type === 'FunctionExpression');
      expect(functionSteps.length).toBeGreaterThan(0);
    });

    it('traces arrow functions', async () => {
      const steps = await record('const f = () => 1;', defaultConfig);
      const arrowSteps = steps.filter((s) => s.type === 'ArrowFunctionExpression');
      expect(arrowSteps.length).toBeGreaterThan(0);
    });

    it('traces conditional expressions', async () => {
      const steps = await record('true ? 1 : 2;', defaultConfig);
      const ternarySteps = steps.filter((s) => s.type === 'ConditionalExpression');
      expect(ternarySteps.length).toBeGreaterThan(0);
    });

    it('traces assignment expressions', async () => {
      const steps = await record('let x; x = 1;', defaultConfig);
      const assignSteps = steps.filter((s) => s.type === 'AssignmentExpression');
      expect(assignSteps.length).toBeGreaterThan(0);
    });

    it('traces update expressions', async () => {
      const steps = await record('let x = 0; x++;', defaultConfig);
      const updateSteps = steps.filter((s) => s.type === 'UpdateExpression');
      expect(updateSteps.length).toBeGreaterThan(0);
    });
  });
});
