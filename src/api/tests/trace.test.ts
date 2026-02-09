import OptionsSemanticInvalidError from '../../errors/options-semantic-invalid-error.js';
import TracerUnknownError from '../../errors/tracer-unknown-error.js';
import trace from '../trace.js';

describe('trace', () => {
  describe('async behavior', () => {
    it('returns a Promise', () => {
      const result = trace('txt:chars', 'ab');

      expect(result).toBeInstanceOf(Promise);
    });

    it('resolves to steps array', async () => {
      const steps = await trace('txt:chars', 'ab');

      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(2);
    });
  });

  describe('type validation (eager, sync)', () => {
    it('throws immediately for non-string tracer', () => {
      expect(() => trace(123 as unknown as string, 'ab')).toThrow(/string/);
    });

    it('throws immediately for non-string code', () => {
      expect(() => trace('txt:chars', 456 as unknown as string)).toThrow(/string/);
    });
  });

  describe('tracer validation (eager, sync)', () => {
    it('throws sync for unknown tracer with TracerUnknownError', () => {
      expect(() => trace('unknown', 'ab')).toThrow(TracerUnknownError);
    });
  });

  describe('config handling', () => {
    it('passes config to tracer module', async () => {
      const steps = await trace('txt:chars', 'ab', {
        options: { remove: ['a'], replace: {}, direction: 'lr' },
      });

      expect(steps).toHaveLength(1);
    });

    it('uses tracer defaults when no config', async () => {
      const steps = await trace('txt:chars', 'ab');

      expect(steps).toHaveLength(2);
    });

    it('fills defaults for partial options', async () => {
      // User provides only direction, API fills remove and replace from schema
      const steps = await trace('txt:chars', 'abc', {
        options: { direction: 'rl' },
      });

      // rl direction reverses: c, b, a
      expect(steps.map((s) => (s as { char: string }).char)).toEqual(['c', 'b', 'a']);
    });
  });

  describe('semantic validation (verifyOptions, sync)', () => {
    it('throws sync OptionsSemanticInvalidError for constraint violation', () => {
      // chars verifyOptions: maxLength must be >= remove.length
      expect(() =>
        trace('txt:chars', 'abc', {
          options: { maxLength: 1, remove: ['a', 'b'] },
        }),
      ).toThrow(OptionsSemanticInvalidError);
    });

    it('includes descriptive message about the constraint violation', () => {
      expect(() =>
        trace('txt:chars', 'abc', {
          options: { maxLength: 1, remove: ['a', 'b', 'c'] },
        }),
      ).toThrow(/maxLength/);
    });
  });
});
