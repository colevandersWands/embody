import dispatch from '../dispatch.js';
import type { MetaConfig } from '../types.js';

/** Default meta config for tests (all limits disabled) */
const DEFAULT_META: MetaConfig = {
  max: { steps: null, iterations: null, callstack: null, time: null },
  range: null,
  timestamps: false,
  debug: { ast: false },
};

describe('dispatch', () => {
  describe('registry structure', () => {
    it('contains chars language', () => {
      expect(dispatch.chars).toBeDefined();
    });

    it('returns undefined for unknown language', () => {
      expect((dispatch as Record<string, unknown>).unknown).toBeUndefined();
    });

    it('chars is a function', () => {
      expect(typeof dispatch.chars).toBe('function');
    });
  });

  describe('integration with record (async)', () => {
    it('chars produces steps with fully-filled config', async () => {
      // Note: dispatch tests call record() directly, which expects FULLY-FILLED config
      // API layer handles default-filling; these tests pass complete config
      const { steps } = await dispatch.chars('ab', {
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

    it('chars respects options configuration', async () => {
      const { steps } = await dispatch.chars('ab', {
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

    it('chars removes specified characters', async () => {
      const { steps } = await dispatch.chars('abc', {
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
