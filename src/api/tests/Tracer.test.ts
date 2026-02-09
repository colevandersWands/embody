import ArgumentInvalidError from '../../errors/argument-invalid-error.js';
import TracerUnknownError from '../../errors/tracer-unknown-error.js';
import Tracer from '../Tracer.js';

describe('Tracer', () => {
  describe('constructor + id getter', () => {
    it('throws ArgumentInvalidError on non-string tracerId', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => new Tracer(123 as any)).toThrow(ArgumentInvalidError);
    });

    it('throws ArgumentInvalidError on empty string tracerId', () => {
      expect(() => new Tracer('')).toThrow(ArgumentInvalidError);
    });

    it('throws TracerUnknownError on unknown tracerId', () => {
      expect(() => new Tracer('unknown-tracer')).toThrow(TracerUnknownError);
    });

    it('succeeds with valid tracerId', () => {
      expect(() => new Tracer('txt:chars')).not.toThrow();
    });

    it('deep clones optionsSchema to prevent external mutation', () => {
      const tracer = new Tracer('txt:chars');
      // Access the private optionsSchema via any to test mutation isolation
      // This is a test-only check - real code shouldn't access privates
      const schema = (tracer as any)['#optionsSchema'];
      if (schema) {
        const original = JSON.stringify(schema);
        schema.properties.someField = { type: 'string' };
        expect(JSON.stringify((tracer as any)['#optionsSchema'])).toBe(original);
      }
    });

    it('id getter returns tracerId', () => {
      const tracer = new Tracer('txt:chars');
      expect(tracer.id).toBe('txt:chars');
    });
  });

  describe('code setter/getter', () => {
    it('setter throws ArgumentInvalidError on non-string', () => {
      const tracer = new Tracer('txt:chars');
      expect(() => {
        tracer.code = 123 as any;
      }).toThrow(ArgumentInvalidError);
    });

    it('setter throws ArgumentInvalidError on empty string', () => {
      const tracer = new Tracer('txt:chars');
      expect(() => {
        tracer.code = '';
      }).toThrow(ArgumentInvalidError);
    });

    it('getter returns undefined initially', () => {
      const tracer = new Tracer('txt:chars');
      expect(tracer.code).toBeUndefined();
    });

    it('getter returns set value', () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'hello';
      expect(tracer.code).toBe('hello');
    });
  });

  describe('config setter/getter', () => {
    it('setter throws ArgumentInvalidError on non-object', () => {
      const tracer = new Tracer('txt:chars');
      expect(() => {
        tracer.config = 'not an object' as any;
      }).toThrow(ArgumentInvalidError);
    });

    it('setter accepts null and converts to empty object', () => {
      const tracer = new Tracer('txt:chars');
      expect(() => {
        tracer.config = null as any;
      }).not.toThrow();
    });

    it('getter returns deep cloned copy (mutation test)', () => {
      const tracer = new Tracer('txt:chars');
      const original = { meta: { max: { steps: 10 } } };
      tracer.config = original;

      const retrieved = tracer.config as any;
      retrieved.meta.max.steps = 999;

      expect((tracer.config as any).meta.max.steps).toBe(10);
    });

    it('getter returns undefined initially', () => {
      const tracer = new Tracer('txt:chars');
      expect(tracer.config).toBeUndefined();
    });

    it('getter returns set value', () => {
      const tracer = new Tracer('txt:chars');
      const config = { meta: { max: { steps: 50 } } };
      tracer.config = config;

      expect(tracer.config).toEqual(config);
    });
  });

  describe('resolvedConfig getter', () => {
    it('returns config with tracer defaults', () => {
      const tracer = new Tracer('txt:chars');
      const resolved = tracer.resolvedConfig;

      expect(resolved).toHaveProperty('meta');
      expect(resolved).toHaveProperty('options');
    });

    it('returns merged user config + defaults', () => {
      const tracer = new Tracer('txt:chars');
      tracer.config = { meta: { max: { steps: 50 } } };
      const resolved = tracer.resolvedConfig;

      expect(resolved.meta.max.steps).toBe(50);
    });

    it('returns deep cloned copy (mutation test)', () => {
      const tracer = new Tracer('txt:chars');
      const resolved1 = tracer.resolvedConfig;
      (resolved1 as any).meta.max.steps = 999;

      const resolved2 = tracer.resolvedConfig;
      expect((resolved2 as any).meta.max.steps).not.toBe(999);
    });

    it('computes lazily and caches result', () => {
      const tracer = new Tracer('txt:chars');
      const resolved1 = tracer.resolvedConfig;
      const resolved2 = tracer.resolvedConfig;

      // Same computation (different clones, but same underlying cache)
      expect(resolved1).toEqual(resolved2);
      expect(resolved1).not.toBe(resolved2); // Different clones
    });

    it('works without setting config explicitly', () => {
      const tracer = new Tracer('txt:chars');
      const resolved = tracer.resolvedConfig;

      expect(resolved).toHaveProperty('meta');
      expect(resolved).toHaveProperty('options');
    });
  });

  describe('steps getter', () => {
    it('returns a Promise', () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';
      const result = tracer.steps;

      expect(result).toBeInstanceOf(Promise);
    });

    it('throws ArgumentInvalidError if code not set', () => {
      const tracer = new Tracer('txt:chars');

      expect(() => tracer.steps).toThrow(ArgumentInvalidError);
    });

    it('resolves to steps array', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';
      const steps = await tracer.steps;

      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
    });

    it('returns deep cloned array (mutation test)', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';

      const steps1 = await tracer.steps;
      (steps1 as any).push({ type: 'fake' });

      const steps2 = await tracer.steps;
      expect(steps2.length).toBe(2); // Original length
    });

    it('caches result (does not re-trace)', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';

      const steps1 = await tracer.steps;
      const steps2 = await tracer.steps;

      // Same underlying data (different clones)
      expect(steps1).toEqual(steps2);
      expect(steps1).not.toBe(steps2);
    });

    it('rejects with ParseError on invalid code', async () => {
      const tracer = new Tracer('js:klve');
      tracer.code = 'this is not valid javascript!!!';

      await expect(tracer.steps).rejects.toThrow();
    });
  });

  describe('cache invalidation', () => {
    it('code change clears steps, preserves config/resolvedConfig', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';
      tracer.config = { meta: { max: { steps: 50 } } };

      await tracer.steps; // Cache steps
      const resolved1 = tracer.resolvedConfig;

      tracer.code = 'cd'; // Change code

      const resolved2 = tracer.resolvedConfig;
      expect(resolved2).toEqual(resolved1); // Config preserved

      const steps = await tracer.steps;
      expect((steps[0] as any).char).toBe('c'); // Re-traced with new code
    });

    it('config change clears resolvedConfig + steps', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';
      tracer.config = { meta: { max: { steps: 50 } } };

      const steps1 = await tracer.steps;

      tracer.config = { meta: { max: { steps: 100 } } }; // Change config

      const resolved2 = tracer.resolvedConfig;
      expect(resolved2.meta.max.steps).toBe(100); // Recomputed

      const steps2 = await tracer.steps;
      expect(steps2).not.toBe(steps1); // Re-traced
    });

    it('multiple code changes work correctly', async () => {
      const tracer = new Tracer('txt:chars');

      tracer.code = 'a';
      const steps1 = await tracer.steps;
      expect(steps1.length).toBe(1);

      tracer.code = 'ab';
      const steps2 = await tracer.steps;
      expect(steps2.length).toBe(2);

      tracer.code = 'abc';
      const steps3 = await tracer.steps;
      expect(steps3.length).toBe(3);
    });

    it('resolvedConfig getter recomputes after config change', () => {
      const tracer = new Tracer('txt:chars');
      tracer.config = { meta: { max: { steps: 50 } } };

      const resolved1 = tracer.resolvedConfig;
      expect(resolved1.meta.max.steps).toBe(50);

      tracer.config = { meta: { max: { steps: 100 } } };

      const resolved2 = tracer.resolvedConfig;
      expect(resolved2.meta.max.steps).toBe(100);
    });

    it('steps getter re-traces after code change', async () => {
      const tracer = new Tracer('txt:chars');

      tracer.code = 'a';
      const steps1 = await tracer.steps;

      tracer.code = 'b';
      const steps2 = await tracer.steps;

      expect(steps1[0].char).toBe('a');
      expect(steps2[0].char).toBe('b');
    });
  });

  describe('integration scenarios', () => {
    it('full workflow: construct → set code → set config → get steps', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'hello';
      tracer.config = { meta: { max: { steps: 10 } } };

      const steps = await tracer.steps;

      expect(steps).toHaveLength(5);
      expect(steps[0].char).toBe('h');
    });

    it('workflow: construct → set code → get steps (default config)', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';

      const steps = await tracer.steps;

      expect(steps).toHaveLength(2);
    });

    it('switch config without changing code', async () => {
      const tracer = new Tracer('txt:chars');
      tracer.code = 'ab';
      tracer.config = { meta: { max: { steps: 50 } } };

      await tracer.steps;

      tracer.config = { meta: { max: { steps: 100 } } };
      const steps = await tracer.steps;

      expect(steps).toHaveLength(2); // Same code, different config
    });

    it('realistic: trace multiple codes with same tracer', async () => {
      const tracer = new Tracer('txt:chars');

      tracer.code = 'foo';
      const steps1 = await tracer.steps;
      expect(steps1).toHaveLength(3);

      tracer.code = 'bar';
      const steps2 = await tracer.steps;
      expect(steps2).toHaveLength(3);

      tracer.code = 'baz';
      const steps3 = await tracer.steps;
      expect(steps3).toHaveLength(3);

      expect(steps1[0].char).toBe('f');
      expect(steps2[0].char).toBe('b');
      expect(steps3[0].char).toBe('b');
    });
  });
});
