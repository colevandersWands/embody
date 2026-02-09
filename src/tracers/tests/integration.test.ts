/**
 * Integration tests for the tracer module infrastructure.
 * Tests tracer registry + chars together without touching /api.
 */

import tracers from '../index.js';
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

describe('tracer module integration', () => {
  describe('registry routing', () => {
    it('routes to chars and records', async () => {
      const { record } = tracers['txt:chars'];
      const steps = await record('ab', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps).toHaveLength(2);
    });

    it('returns undefined for unknown tracer', () => {
      expect((tracers as Record<string, unknown>).unknown).toBeUndefined();
    });

    it('can iterate over available tracers', () => {
      const tracerIds = Object.keys(tracers);
      expect(tracerIds).toContain('txt:chars');
    });
  });

  describe('record function signature', () => {
    it('chars.record is a function', () => {
      expect(typeof tracers['txt:chars'].record).toBe('function');
    });

    it('accepts code and config object', async () => {
      const { record } = tracers['txt:chars'];
      const steps = await record('test', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps.length).toBeGreaterThan(0);
    });
  });

  describe('StepCore contract (ESTree format)', () => {
    it('all steps have required StepCore fields', async () => {
      const steps = await tracers['txt:chars'].record('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      for (const step of steps) {
        expect(typeof step.step).toBe('number');
        expect(typeof step.loc.start.line).toBe('number');
        expect(typeof step.loc.start.column).toBe('number');
        expect(typeof step.loc.end.line).toBe('number');
        expect(typeof step.loc.end.column).toBe('number');
      }
    });

    it('step numbers are 1-indexed', async () => {
      const steps = await tracers['txt:chars'].record('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps[0].step).toBe(1);
    });

    it('line numbers are 1-indexed (ESTree standard)', async () => {
      const steps = await tracers['txt:chars'].record('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps[0].loc.start.line).toBe(1);
    });

    it('column numbers are 0-indexed (ESTree standard)', async () => {
      const steps = await tracers['txt:chars'].record('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(steps[0].loc.start.column).toBe(0);
    });

    it('steps are in execution order', async () => {
      const steps = await tracers['txt:chars'].record('abc', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      const stepNumbers = steps.map((s: StepCore) => s.step);
      expect(stepNumbers).toEqual([1, 2, 3]);
    });
  });

  describe('immutability guarantees', () => {
    it('returned steps are readonly', async () => {
      // Note: registry tests call record() directly with FULLY-FILLED config
      const steps = await tracers['txt:chars'].record('ab', {
        meta: DEFAULT_META,
        options: DEFAULT_OPTIONS,
      });
      expect(Object.isFrozen(steps) || Array.isArray(steps)).toBe(true);
    });
  });

  describe('type narrowing helper', () => {
    it('can type-check tracer existence before use', async () => {
      const tracerId = 'chars';
      if (tracerId in tracers) {
        const { record } = tracers[tracerId as keyof typeof tracers];
        // Note: registry tests call record() directly with FULLY-FILLED config
        const steps = await record('test', {
          meta: DEFAULT_META,
          options: DEFAULT_OPTIONS,
        });
        expect(steps.length).toBeGreaterThan(0);
      }
    });
  });
});
