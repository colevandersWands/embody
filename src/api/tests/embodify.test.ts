import EmbodyError from '../../errors/embody-error.js';
import embodify from '../embodify.js';

describe('embodify', () => {
  describe('state management', () => {
    it('creates chain with lang set', () => {
      const chain = embodify({ lang: 'chars' });

      expect(chain.lang).toBe('chars');
    });

    it('.set() returns NEW chain with state added', () => {
      const chain1 = embodify({ lang: 'chars' });
      const chain2 = chain1.set({ code: 'ab' });

      expect(chain2.code).toBe('ab');
      expect(chain2.lang).toBe('chars');
    });

    it('original chain unchanged after .set() (immutability)', () => {
      const chain1 = embodify({ lang: 'chars' });
      chain1.set({ code: 'ab' });

      expect(chain1.code).toBeUndefined();
    });

    it('getters return current state values', () => {
      const chain = embodify({ lang: 'chars', code: 'ab', config: { options: { remove: ['a'] } } });

      expect(chain.lang).toBe('chars');
      expect(chain.code).toBe('ab');
      expect(chain.config).toEqual({ options: { remove: ['a'] } });
    });
  });

  describe('before trace', () => {
    it('.steps is null before .trace() called', () => {
      const chain = embodify({ lang: 'chars', code: 'ab' });

      expect(chain.steps).toBeNull();
    });

    it('.ok is true before trace if no type errors', () => {
      const chain = embodify({ lang: 'chars', code: 'ab' });

      expect(chain.ok).toBe(true);
    });

    it('.error is undefined before trace if no type errors', () => {
      const chain = embodify({ lang: 'chars', code: 'ab' });

      expect(chain.error).toBeUndefined();
    });
  });

  describe('tracing (async)', () => {
    it('.trace() returns a Promise', () => {
      const result = embodify({ lang: 'chars', code: 'ab' }).trace();

      expect(result).toBeInstanceOf(Promise);
    });

    it('.trace() uses default config if none set', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();

      expect(traced.ok).toBe(true);
      expect(traced.steps).toHaveLength(2);
    });

    it('.trace({ config }) uses provided config', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace({
        config: { options: { remove: ['a'], replace: {}, direction: 'lr' } },
      });

      expect(traced.ok).toBe(true);
      expect(traced.steps).toHaveLength(1);
    });

    it('.trace() returns NEW chain with result', async () => {
      const chain = embodify({ lang: 'chars', code: 'ab' });
      const traced = await chain.trace();

      expect(traced.ok).toBe(true);
      expect(traced.steps).not.toBeNull();
      expect(chain.steps).toBeNull(); // Original unchanged
    });

    it('after successful trace .ok is true', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();

      expect(traced.ok).toBe(true);
    });

    it('after successful trace .steps contains step array', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();

      expect(Array.isArray(traced.steps)).toBe(true);
      expect(traced.steps).toHaveLength(2);
    });

    it('after failed trace .error contains EmbodyError', async () => {
      const traced = await embodify({ lang: 'unknown', code: 'ab' }).trace();

      expect(traced.ok).toBe(false);
      expect(traced.error).toBeInstanceOf(EmbodyError);
    });
  });

  describe('result invalidation', () => {
    it('after .set() on traced chain, .steps becomes null', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();
      const modified = traced.set({ code: 'xyz' });

      expect(modified.steps).toBeNull();
    });

    it('can re-trace after modifying state', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();
      const modified = traced.set({ code: 'xyz' });
      const retraced = await modified.trace();

      expect(retraced.ok).toBe(true);
      expect(retraced.steps).toHaveLength(3);
    });
  });

  describe('eager type validation (recoverable)', () => {
    it('type error on lang sets ok=false', () => {
      const chain = embodify({ lang: 123 as unknown as string });

      expect(chain.ok).toBe(false);
    });

    it('type error sets .error with combined message', () => {
      const chain = embodify({ lang: 123 as unknown as string, code: 456 as unknown as string });

      expect(chain.error).toBeInstanceOf(EmbodyError);
      expect(chain.error?.message).toMatch(/lang must be string/);
      expect(chain.error?.message).toMatch(/code must be string/);
    });

    it('fixing error with .set() clears error', () => {
      const bad = embodify({ lang: 123 as unknown as string });
      const fixed = bad.set({ lang: 'chars' });

      expect(fixed.ok).toBe(true);
      expect(fixed.error).toBeUndefined();
    });

    it('partial fix updates error message', () => {
      const bad = embodify({ lang: 123 as unknown as string, code: 456 as unknown as string });
      const partial = bad.set({ lang: 'chars' });

      expect(partial.ok).toBe(false);
      expect(partial.error?.message).not.toMatch(/lang/);
      expect(partial.error?.message).toMatch(/code must be string/);
    });
  });

  describe('necessity validation (lazy, async)', () => {
    it('.trace() on chain missing lang returns error', async () => {
      const traced = await embodify({ code: 'ab' }).trace();

      expect(traced.ok).toBe(false);
      expect(traced.error?.message).toMatch(/lang is required/);
    });

    it('.trace() on chain missing code returns error', async () => {
      const traced = await embodify({ lang: 'chars' }).trace();

      expect(traced.ok).toBe(false);
      expect(traced.error?.message).toMatch(/code is required/);
    });

    it('.trace() with type error does not execute trace', async () => {
      const bad = embodify({ lang: 123 as unknown as string, code: 'ab' });
      const traced = await bad.trace();

      // Should still have the type error, not attempt trace
      expect(traced.ok).toBe(false);
      expect(traced.error?.message).toMatch(/lang must be string/);
    });
  });

  describe('immutability (deep clone)', () => {
    it('.config getter returns deep cloned copy', () => {
      const chain = embodify({ config: { options: { remove: ['a'] } } });

      const config1 = chain.config as { options: { remove: string[] } };
      const config2 = chain.config as { options: { remove: string[] } };

      config1.options.remove.push('mutated');
      expect(config2.options.remove).toEqual(['a']);
    });

    it('.steps getter returns deep cloned copy', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();

      const steps1 = traced.steps as unknown as { char: string }[];
      const steps2 = traced.steps as unknown as { char: string }[];

      if (steps1?.[0]) {
        steps1[0].char = 'mutated';
      }
      expect(steps2?.[0]?.char).toBe('a');
    });
  });

  describe('resolvedConfig', () => {
    it('.resolvedConfig returns resolved options with lang defaults', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();

      expect(traced.resolvedConfig).toHaveProperty('options');
      expect(traced.resolvedConfig?.options).toHaveProperty('direction', 'lr');
    });

    it('.resolvedConfig is undefined before trace', () => {
      const chain = embodify({ lang: 'chars', code: 'ab' });

      expect(chain.resolvedConfig).toBeUndefined();
    });

    it('.resolvedConfig returns deep cloned copy', async () => {
      const traced = await embodify({ lang: 'chars', code: 'ab' }).trace();

      const resolved1 = traced.resolvedConfig;
      const resolved2 = traced.resolvedConfig;

      expect(resolved1).toEqual(resolved2);
      expect(resolved1).not.toBe(resolved2);
    });
  });
});
