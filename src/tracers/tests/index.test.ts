import tracers from '../index.js';
import type { MetaConfig } from '../types.js';

/** Default meta config for tests (all limits disabled) */
const DEFAULT_META: MetaConfig = {
  max: { steps: null, iterations: null, callstack: null, time: null },
  range: null,
  timestamps: false,
  debug: { ast: false },
};

describe('tracers', () => {
  describe('registry structure', () => {
    it('contains chars tracer', () => {
      expect(tracers['txt:chars']).toBeDefined();
    });

    it('returns undefined for unknown tracer', () => {
      expect((tracers as Record<string, unknown>).unknown).toBeUndefined();
    });

    it('chars.record is a function', () => {
      expect(typeof tracers['txt:chars'].record).toBe('function');
    });

    it('chars.optionsSchema is an object', () => {
      expect(typeof tracers['txt:chars'].optionsSchema).toBe('object');
    });

    it('chars.verifyOptions is a function', () => {
      expect(typeof tracers['txt:chars'].verifyOptions).toBe('function');
    });
  });

  describe('integration with record (async)', () => {
    it('chars.record produces steps with fully-filled config', async () => {
      // Note: registry tests call record() directly, which expects FULLY-FILLED config
      // API layer handles default-filling; these tests pass complete config
      const steps = await tracers['txt:chars'].record('ab', {
        meta: DEFAULT_META,
        options: {
          remove: [],
          replace: {},
          direction: 'lr',
          allowedCharClasses: {
            lowercase: true,
            uppercase: true,
            number: true,
            punctuation: true,
            other: true,
          },
        },
      });
      expect(steps).toHaveLength(2);
    });

    it('chars.record respects options configuration', async () => {
      const steps = await tracers['txt:chars'].record('ab', {
        meta: DEFAULT_META,
        options: {
          remove: [],
          replace: {},
          direction: 'rl',
          allowedCharClasses: {
            lowercase: true,
            uppercase: true,
            number: true,
            punctuation: true,
            other: true,
          },
        },
      });
      expect(steps[0]).toHaveProperty('char', 'b');
      expect(steps[1]).toHaveProperty('char', 'a');
    });

    it('chars.record removes specified characters', async () => {
      const steps = await tracers['txt:chars'].record('abc', {
        meta: DEFAULT_META,
        options: {
          remove: ['b'],
          replace: {},
          direction: 'lr',
          allowedCharClasses: {
            lowercase: true,
            uppercase: true,
            number: true,
            punctuation: true,
            other: true,
          },
        },
      });
      expect(steps).toHaveLength(2);
      expect(steps.map((s) => (s as { char: string }).char)).toEqual(['a', 'c']);
    });
  });
});
