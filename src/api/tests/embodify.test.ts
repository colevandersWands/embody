import EmbodyError from '../../errors/embody-error.js';
import embodify from '../embodify.js';

describe('embodify', () => {
  describe('state management', () => {
    it('creates chain with tracer set', () => {
      const chain = embodify({ tracer: 'chars' });

      expect(chain.tracer).toBe('chars');
    });

    it('.set() returns NEW chain with state added', () => {
      const chain1 = embodify({ tracer: 'chars' });
      const chain2 = chain1.set({ code: 'ab' });

      expect(chain2.code).toBe('ab');
      expect(chain2.tracer).toBe('chars');
    });

    it('original chain unchanged after .set() (immutability)', () => {
      const chain1 = embodify({ tracer: 'chars' });
      chain1.set({ code: 'ab' });

      expect(chain1.code).toBeUndefined();
    });

    it('getters return current state values', () => {
      const chain = embodify({
        tracer: 'chars',
        code: 'ab',
        config: { options: { remove: ['a'] } },
      });

      expect(chain.tracer).toBe('chars');
      expect(chain.code).toBe('ab');
      expect(chain.config).toEqual({ options: { remove: ['a'] } });
    });
  });

  describe('before trace', () => {
    it('.steps is undefined before .trace() called', () => {
      const chain = embodify({ tracer: 'chars', code: 'ab' });

      expect(chain.steps).toBeUndefined();
    });

    it('.ok is true before trace', () => {
      const chain = embodify({ tracer: 'chars', code: 'ab' });

      expect(chain.ok).toBe(true);
    });

    it('.error is undefined before trace', () => {
      const chain = embodify({ tracer: 'chars', code: 'ab' });

      expect(chain.error).toBeUndefined();
    });
  });

  describe('tracing (async)', () => {
    it('.trace() returns a Promise', () => {
      const result = embodify({ tracer: 'chars', code: 'ab' }).trace();

      expect(result).toBeInstanceOf(Promise);
    });

    it('.trace() uses default config if none set', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();

      expect(traced.ok).toBe(true);
      expect(traced.steps).toHaveLength(2);
    });

    it('.trace({ config }) uses provided config', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace({
        config: { options: { remove: ['a'], replace: {}, direction: 'lr' } },
      });

      expect(traced.ok).toBe(true);
      expect(traced.steps).toHaveLength(1);
    });

    it('.trace() returns NEW chain with result', async () => {
      const chain = embodify({ tracer: 'chars', code: 'ab' });
      const traced = await chain.trace();

      expect(traced.ok).toBe(true);
      expect(traced.steps).toBeDefined();
      expect(chain.steps).toBeUndefined(); // Original unchanged
    });

    it('after successful trace .ok is true', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();

      expect(traced.ok).toBe(true);
    });

    it('after successful trace .steps contains step array', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();

      expect(Array.isArray(traced.steps)).toBe(true);
      expect(traced.steps).toHaveLength(2);
    });

    it('after failed trace .error contains EmbodyError', async () => {
      const traced = await embodify({ tracer: 'unknown', code: 'ab' }).trace();

      expect(traced.ok).toBe(false);
      expect(traced.error).toBeInstanceOf(EmbodyError);
    });
  });

  describe('cache invalidation', () => {
    it('.set({}) preserves all cached state', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
      const newChain = traced.set({});

      expect(newChain.tracer).toBe(traced.tracer);
      expect(newChain.code).toBe(traced.code);
      expect(newChain.resolvedConfig).toEqual(traced.resolvedConfig);
      expect(newChain.steps).toEqual(traced.steps);
    });

    it('.set({ code }) preserves resolvedConfig, invalidates steps', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
      const newChain = traced.set({ code: 'xyz' });

      expect(newChain.resolvedConfig).toEqual(traced.resolvedConfig);
      expect(newChain.steps).toBeUndefined();
    });

    it('.set({ tracer }) with same value preserves cache', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
      const newChain = traced.set({ tracer: 'chars' }); // Same value = no change

      // No actual change = no invalidation
      expect(newChain.resolvedConfig).toEqual(traced.resolvedConfig);
      expect(newChain.steps).toEqual(traced.steps);
    });

    it('.set({ tracer }) with different value invalidates', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
      const newChain = traced.set({ tracer: 'js' }); // Different tracer

      // resolvedConfig is lazy-recomputed with new tracer
      // steps is invalidated
      expect(newChain.steps).toBeUndefined();
    });

    it('.set({ config }) with same value preserves cache', async () => {
      const config = { options: { direction: 'lr' } };
      const traced = await embodify({ tracer: 'chars', code: 'ab', config }).trace();
      const newChain = traced.set({ config }); // Same config object

      // No actual change = no invalidation
      expect(newChain.steps).toEqual(traced.steps);
    });

    it('.set({ config }) with different value invalidates', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
      const newChain = traced.set({ config: { options: { direction: 'rl' } } });

      // Different config = invalidate
      expect(newChain.steps).toBeUndefined();
    });

    it('can re-trace after modifying state', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();
      const modified = traced.set({ code: 'xyz' });
      const retraced = await modified.trace();

      expect(retraced.ok).toBe(true);
      expect(retraced.steps).toHaveLength(3);
    });
  });

  describe('lazy resolvedConfig', () => {
    it('computes on access if tracer is present', () => {
      const chain = embodify({ tracer: 'chars' });

      expect(chain.resolvedConfig).toBeDefined();
      expect(chain.resolvedConfig?.options).toHaveProperty('direction', 'lr');
    });

    it('returns undefined if tracer is missing', () => {
      const chain = embodify({});

      expect(chain.resolvedConfig).toBeUndefined();
    });

    it('returns undefined if tracer is unknown', () => {
      const chain = embodify({ tracer: 'nonexistent' });

      expect(chain.resolvedConfig).toBeUndefined();
    });

    it('caches computed value', () => {
      const chain = embodify({ tracer: 'chars' });

      const resolved1 = chain.resolvedConfig;
      const resolved2 = chain.resolvedConfig;

      expect(resolved1).toEqual(resolved2);
    });

    it('returns deep cloned copy', () => {
      const chain = embodify({ tracer: 'chars' });

      const resolved1 = chain.resolvedConfig;
      const resolved2 = chain.resolvedConfig;

      expect(resolved1).not.toBe(resolved2);
    });

    it('after trace returns resolved config with tracer defaults', async () => {
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();

      expect(traced.resolvedConfig).toHaveProperty('options');
      expect(traced.resolvedConfig?.options).toHaveProperty('direction', 'lr');
    });
  });

  describe('necessity validation (lazy, async)', () => {
    it('.trace() on chain missing tracer returns error', async () => {
      const traced = await embodify({ code: 'ab' }).trace();

      expect(traced.ok).toBe(false);
      expect(traced.error?.message).toMatch(/tracer is required/);
    });

    it('.trace() on chain missing code returns error', async () => {
      const traced = await embodify({ tracer: 'chars' }).trace();

      expect(traced.ok).toBe(false);
      expect(traced.error?.message).toMatch(/code is required/);
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
      const traced = await embodify({ tracer: 'chars', code: 'ab' }).trace();

      const steps1 = traced.steps as unknown as { char: string }[];
      const steps2 = traced.steps as unknown as { char: string }[];

      if (steps1?.[0]) {
        steps1[0].char = 'mutated';
      }
      expect(steps2?.[0]?.char).toBe('a');
    });
  });
});
