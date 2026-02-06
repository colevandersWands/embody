import LangUnknownError from '../../errors/lang-unknown-error.js';
import OptionsSemanticInvalidError from '../../errors/options-semantic-invalid-error.js';
import trace from '../trace.js';

describe('trace', () => {
  describe('async behavior', () => {
    it('returns a Promise', () => {
      const result = trace('chars', 'ab');

      expect(result).toBeInstanceOf(Promise);
    });

    it('resolves to steps array', async () => {
      const steps = await trace('chars', 'ab');

      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(2);
    });
  });

  describe('type validation (eager, sync)', () => {
    it('throws immediately for non-string lang', () => {
      expect(() => trace(123 as unknown as string, 'ab')).toThrow(/string/);
    });

    it('throws immediately for non-string code', () => {
      expect(() => trace('chars', 456 as unknown as string)).toThrow(/string/);
    });
  });

  describe('semantic validation (lazy, async)', () => {
    it('rejects for unknown language with LangUnknownError', async () => {
      await expect(trace('unknown', 'ab')).rejects.toBeInstanceOf(LangUnknownError);
    });
  });

  describe('config handling', () => {
    it('passes config to lang module', async () => {
      const steps = await trace('chars', 'ab', {
        options: { remove: ['a'], replace: {}, direction: 'lr' },
      });

      expect(steps).toHaveLength(1);
    });

    it('uses lang defaults when no config', async () => {
      const steps = await trace('chars', 'ab');

      expect(steps).toHaveLength(2);
    });

    it('fills defaults for partial options', async () => {
      // User provides only direction, API fills remove and replace from schema
      const steps = await trace('chars', 'abc', {
        options: { direction: 'rl' },
      });

      // rl direction reverses: c, b, a
      expect(steps.map((s) => (s as { char: string }).char)).toEqual(['c', 'b', 'a']);
    });
  });

  describe('semantic validation (verifyOptions)', () => {
    it('calls verifyOptions and throws OptionsSemanticInvalidError', async () => {
      // chars verifyOptions: maxLength must be >= remove.length
      await expect(
        trace('chars', 'abc', {
          options: { maxLength: 1, remove: ['a', 'b'] },
        }),
      ).rejects.toBeInstanceOf(OptionsSemanticInvalidError);
    });

    it('includes descriptive message about the constraint violation', async () => {
      await expect(
        trace('chars', 'abc', {
          options: { maxLength: 1, remove: ['a', 'b', 'c'] },
        }),
      ).rejects.toThrow(/maxLength/);
    });
  });
});
