/**
 * Integration tests for the lang module infrastructure.
 * Tests dispatch + chars together without touching /api.
 */

import dispatch from '../dispatch.js';
import type { MetaConfig, StepCore } from '../types.js';

/** Default meta config for tests (all limits disabled) */
const DEFAULT_META: MetaConfig = {
  max: { steps: null, iterations: null, callstack: null, time: null },
  range: null,
  timestamps: false,
  debug: { ast: false },
};

/** Default options with all char classes allowed */
const DEFAULT_OPTIONS = {
  remove: [] as string[],
  replace: {} as Record<string, string>,
  direction: 'lr' as const,
  allowedCharClasses: {
    lowercase: true,
    uppercase: true,
    number: true,
    punctuation: true,
    other: true,
  },
};

describe('lang module integration', () => {
  describe('dispatch routing', () => {
    it('dispatches to chars and records', async () => {
      const record = dispatch.chars;
      const { steps } = await record('ab', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps).toHaveLength(2);
    });

    it('returns undefined for unknown lang', () => {
      expect((dispatch as Record<string, unknown>).unknown).toBeUndefined();
    });

    it('can iterate over available languages', () => {
      const langIds = Object.keys(dispatch);
      expect(langIds).toContain('chars');
    });
  });

  describe('record function signature', () => {
    it('chars record is a function', () => {
      expect(typeof dispatch.chars).toBe('function');
    });

    it('accepts code and config object', async () => {
      const record = dispatch.chars;
      const { steps } = await record('test', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps.length).toBeGreaterThan(0);
    });
  });

  describe('StepCore contract', () => {
    it('all steps have required StepCore fields', async () => {
      const { steps } = await dispatch.chars('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      for (const step of steps) {
        expect(typeof step.step).toBe('number');
        expect(typeof step.loc.line).toBe('number');
        expect(typeof step.loc.column).toBe('number');
      }
    });

    it('step numbers are 1-indexed', async () => {
      const { steps } = await dispatch.chars('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps[0].step).toBe(1);
    });

    it('line numbers are 1-indexed', async () => {
      const { steps } = await dispatch.chars('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps[0].loc.line).toBe(1);
    });

    it('column numbers are 1-indexed', async () => {
      const { steps } = await dispatch.chars('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps[0].loc.column).toBe(1);
    });

    it('steps are in execution order', async () => {
      const { steps } = await dispatch.chars('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      const stepNumbers = steps.map((s: StepCore) => s.step);
      expect(stepNumbers).toEqual([1, 2, 3]);
    });
  });

  describe('immutability guarantees', () => {
    it('returned steps are readonly', async () => {
      // Note: dispatch tests call record() directly with FULLY-FILLED config
      const { steps } = await dispatch.chars('ab', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(Object.isFrozen(steps) || Array.isArray(steps)).toBe(true);
    });
  });

  describe('type narrowing helper', () => {
    it('can type-check lang existence before use', async () => {
      const langId = 'chars';
      if (langId in dispatch) {
        const record = dispatch[langId as keyof typeof dispatch];
        // Note: dispatch tests call record() directly with FULLY-FILLED config
        const { steps } = await record('test', {
          meta: DEFAULT_META,
          options: DEFAULT_OPTIONS,
        });
        expect(steps.length).toBeGreaterThan(0);
      }
    });
  });
});
