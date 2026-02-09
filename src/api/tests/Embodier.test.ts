import ArgumentInvalidError from '../../errors/argument-invalid-error.js';
import TracerUnknownError from '../../errors/tracer-unknown-error.js';
import Embodier from '../Embodier.js';

describe('Embodier', () => {
  describe('constructor + id getter', () => {
    it('catches ArgumentInvalidError on non-string tracerId', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const embodier = new Embodier(123 as any);
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
    });

    it('catches ArgumentInvalidError on empty string tracerId', () => {
      const embodier = new Embodier('');
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
    });

    it('catches TracerUnknownError on unknown tracerId', () => {
      const embodier = new Embodier('unknown-tracer');
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(TracerUnknownError);
    });

    it('succeeds with valid tracerId', () => {
      const embodier = new Embodier('txt:chars');
      expect(embodier.ok).toBe(true);
      expect(embodier.error).toBeUndefined();
    });

    it('id getter returns tracerId', () => {
      const embodier = new Embodier('txt:chars');
      expect(embodier.id).toBe('txt:chars');
    });
  });

  describe('code setter/getter', () => {
    it('setter catches ArgumentInvalidError on non-string', () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 123 as any;
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
    });

    it('setter catches ArgumentInvalidError on empty string', () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = '';
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
    });

    it('setter clears error on success after previous error', () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 123 as any;
      expect(embodier.ok).toBe(false);

      embodier.code = 'hello';
      expect(embodier.ok).toBe(true);
      expect(embodier.error).toBeUndefined();
    });

    it('getter returns undefined initially', () => {
      const embodier = new Embodier('txt:chars');
      expect(embodier.code).toBeUndefined();
    });

    it('getter returns set value', () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'hello';
      expect(embodier.code).toBe('hello');
    });
  });

  describe('config setter/getter', () => {
    it('setter catches ArgumentInvalidError on non-object', () => {
      const embodier = new Embodier('txt:chars');
      embodier.config = 'not an object' as any;
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
    });

    it('setter accepts null and converts to empty object', () => {
      const embodier = new Embodier('txt:chars');
      embodier.config = null as any;
      expect(embodier.ok).toBe(true);
      expect(embodier.config).toEqual({});
    });

    it('getter returns deep cloned copy (mutation test)', () => {
      const embodier = new Embodier('txt:chars');
      const original = { meta: { max: { steps: 10 } } };
      embodier.config = original;

      const retrieved = embodier.config as any;
      retrieved.meta.max.steps = 999;

      expect((embodier.config as any).meta.max.steps).toBe(10);
    });

    it('getter returns undefined initially', () => {
      const embodier = new Embodier('txt:chars');
      expect(embodier.config).toBeUndefined();
    });

    it('getter returns set value', () => {
      const embodier = new Embodier('txt:chars');
      const config = { meta: { max: { steps: 50 } } };
      embodier.config = config;

      expect(embodier.config).toEqual(config);
    });
  });

  describe('resolvedConfig getter', () => {
    it('returns undefined if constructor failed (broken instance)', () => {
      const embodier = new Embodier('invalid');
      expect(embodier.ok).toBe(false);
      expect(embodier.resolvedConfig).toBeUndefined();
    });

    it('returns config with tracer defaults', () => {
      const embodier = new Embodier('txt:chars');
      const resolved = embodier.resolvedConfig;

      expect(resolved).toHaveProperty('meta');
      expect(resolved).toHaveProperty('options');
    });

    it('returns merged user config + defaults', () => {
      const embodier = new Embodier('txt:chars');
      embodier.config = { meta: { max: { steps: 50 } } };
      const resolved = embodier.resolvedConfig;

      expect((resolved as any).meta.max.steps).toBe(50);
    });

    it('returns deep cloned copy (mutation test)', () => {
      const embodier = new Embodier('txt:chars');
      const resolved1 = embodier.resolvedConfig;
      (resolved1 as any).meta.max.steps = 999;

      const resolved2 = embodier.resolvedConfig;
      expect((resolved2 as any).meta.max.steps).not.toBe(999);
    });

    it('returns config even when error state is set', () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = ''; // Invalid - sets error
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);

      // resolvedConfig should still work (checks #record, not #ok)
      const resolved = embodier.resolvedConfig;
      expect(resolved).toHaveProperty('meta');
      expect(resolved).toHaveProperty('options');
    });
  });

  describe('steps getter', () => {
    it('returns undefined before trace', () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'hello';
      expect(embodier.steps).toBeUndefined();
    });

    it('returns array after trace', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      await embodier.trace();

      expect(Array.isArray(embodier.steps)).toBe(true);
    });

    it('returns deep cloned array (mutation test)', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      await embodier.trace();

      const steps1 = embodier.steps;
      (steps1 as any).push({ type: 'fake' });

      const steps2 = embodier.steps;
      expect(steps2?.length).toBe(2);
    });

    it('returns undefined if ok is false', () => {
      const embodier = new Embodier('invalid');
      expect(embodier.ok).toBe(false);
      expect(embodier.steps).toBeUndefined();
    });
  });

  describe('trace method', () => {
    it('catches error if code not set', async () => {
      const embodier = new Embodier('txt:chars');
      await embodier.trace();

      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
    });

    it('populates steps on success', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      await embodier.trace();

      expect(embodier.ok).toBe(true);
      expect(embodier.steps).toHaveLength(2);
    });

    it('catches trace errors and sets ok=false', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      embodier.config = { meta: { max: { steps: 1 } } };
      await embodier.trace();

      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeDefined();
    });

    it('returns void undefined', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      const result = await embodier.trace();

      expect(result).toBe(undefined);
    });

    it('clears steps on error', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      await embodier.trace();
      expect(embodier.steps).toBeDefined();

      embodier.code = 'ab';
      embodier.config = { meta: { max: { steps: 1 } } };
      await embodier.trace();

      expect(embodier.ok).toBe(false);
      expect(embodier.steps).toBeUndefined();
    });

    it('mutates instance state', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'hello';

      expect(embodier.steps).toBeUndefined();
      await embodier.trace();
      expect(embodier.steps).toHaveLength(5);
    });
  });

  describe('cache invalidation + integration', () => {
    it('code change clears steps only', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      embodier.config = { meta: { max: { steps: 50 } } };
      await embodier.trace();

      const resolved1 = embodier.resolvedConfig;

      embodier.code = 'cd';
      const resolved2 = embodier.resolvedConfig;
      expect(resolved2).toEqual(resolved1);

      await embodier.trace();
      expect((embodier.steps?.[0] as any).char).toBe('c');
    });

    it('config change clears resolvedConfig + steps', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      embodier.config = { meta: { max: { steps: 50 } } };
      await embodier.trace();

      embodier.config = { meta: { max: { steps: 100 } } };
      const resolved = embodier.resolvedConfig;
      expect((resolved as any).meta.max.steps).toBe(100);

      expect(embodier.steps).toBeUndefined();
    });

    it('trace after code change works', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'a';
      await embodier.trace();
      expect(embodier.steps?.length).toBe(1);

      embodier.code = 'ab';
      await embodier.trace();
      expect(embodier.steps?.length).toBe(2);
    });

    it('trace after config change works', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'hello';
      embodier.config = { meta: { max: { steps: 3 } } };
      await embodier.trace();
      expect(embodier.ok).toBe(false);

      embodier.config = { meta: { max: { steps: 10 } } };
      await embodier.trace();
      expect(embodier.ok).toBe(true);
      expect(embodier.steps?.length).toBe(5);
    });

    it('full workflow: construct → set props → trace → check', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'hello';
      embodier.config = { meta: { max: { steps: 10 } } };
      await embodier.trace();

      expect(embodier.ok).toBe(true);
      expect(embodier.steps).toHaveLength(5);
      expect((embodier.steps?.[0] as any).char).toBe('h');
    });

    it('error recovery: failed trace → fix → retry', async () => {
      const embodier = new Embodier('txt:chars');
      embodier.code = 'ab';
      embodier.config = { meta: { max: { steps: 1 } } };
      await embodier.trace();
      expect(embodier.ok).toBe(false);

      embodier.config = { meta: { max: { steps: 10 } } };
      await embodier.trace();
      expect(embodier.ok).toBe(true);
      expect(embodier.steps).toHaveLength(2);
    });

    it('trace multiple codes with same instance', async () => {
      const embodier = new Embodier('txt:chars');

      embodier.code = 'foo';
      await embodier.trace();
      expect(embodier.steps).toHaveLength(3);
      expect((embodier.steps?.[0] as any).char).toBe('f');

      embodier.code = 'bar';
      await embodier.trace();
      expect(embodier.steps).toHaveLength(3);
      expect((embodier.steps?.[0] as any).char).toBe('b');

      embodier.code = 'baz';
      await embodier.trace();
      expect(embodier.steps).toHaveLength(3);
      expect((embodier.steps?.[0] as any).char).toBe('b');
    });

    it('constructor error persists until corrected', async () => {
      const embodier = new Embodier('invalid');
      expect(embodier.ok).toBe(false);

      embodier.code = 'hello';
      expect(embodier.ok).toBe(false);

      await embodier.trace();
      expect(embodier.ok).toBe(false);
      expect(embodier.steps).toBeUndefined();
    });

    it('setter clears error only when fixing root cause', () => {
      const embodier = new Embodier('txt:chars');

      // Set invalid code
      embodier.code = '';
      expect(embodier.ok).toBe(false);
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);
      expect((embodier.error as any).field).toBe('code');

      // Setting valid config doesn't clear error (error is about 'code', not 'config')
      embodier.config = {};
      expect(embodier.ok).toBe(false); // Error persists
      expect(embodier.error).toBeInstanceOf(ArgumentInvalidError);

      // Fix code - now error is cleared
      embodier.code = 'hello';
      expect(embodier.ok).toBe(true); // Cleared!
      expect(embodier.error).toBeUndefined();
    });
  });
});
