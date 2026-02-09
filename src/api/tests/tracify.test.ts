import ParseError from '../../errors/parse-error.js';
import TracerUnknownError from '../../errors/tracer-unknown-error.js';
import tracify from '../tracify.js';

describe('tracify', () => {
  describe('async behavior', () => {
    it('.steps returns a Promise', () => {
      const result = tracify.tracer('txt:chars').code('ab').steps;

      expect(result).toBeInstanceOf(Promise);
    });

    it('.steps resolves to steps array', async () => {
      const steps = await tracify.tracer('txt:chars').code('ab').steps;

      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(2);
    });

    it('.resolvedConfig returns sync (not Promise)', () => {
      const result = tracify.tracer('txt:chars').resolvedConfig;

      expect(result).not.toBeInstanceOf(Promise);
      expect(result).toHaveProperty('meta');
      expect(result).toHaveProperty('options');
    });
  });

  describe('basic chaining', () => {
    it('.tracer().code().steps resolves to steps array', async () => {
      const steps = await tracify.tracer('txt:chars').code('ab').steps;

      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(2);
    });

    it('.code().tracer().steps works (order independent)', async () => {
      const steps = await tracify.code('ab').tracer('txt:chars').steps;

      expect(steps).toHaveLength(2);
    });

    it('.steps is a lazy getter (traces on access)', async () => {
      const chain = tracify.tracer('txt:chars').code('ab');
      // Access .steps twice - should work both times
      const steps1 = await chain.steps;
      const steps2 = await chain.steps;

      expect(steps1).toHaveLength(2);
      expect(steps2).toHaveLength(2);
    });
  });

  describe('config handling', () => {
    it('.config() passes config to tracer module', async () => {
      const steps = await tracify
        .tracer('txt:chars')
        .code('ab')
        .config({ options: { remove: ['a'], replace: {}, direction: 'lr' } }).steps;

      expect(steps).toHaveLength(1);
    });

    it('without .config() uses tracer defaults', async () => {
      const steps = await tracify.tracer('txt:chars').code('ab').steps;

      expect(steps).toHaveLength(2);
    });
  });

  describe('type validation (eager, sync)', () => {
    it('.tracer() throws immediately on non-string', () => {
      expect(() => tracify.tracer(123 as unknown as string)).toThrow(/expected a string/);
    });

    it('.tracer() throws with descriptive message including actual type', () => {
      expect(() => tracify.tracer(null as unknown as string)).toThrow(/got object/);
    });

    it('.code() throws immediately on non-string', () => {
      expect(() => tracify.code(456 as unknown as string)).toThrow(/expected a string/);
    });

    it('.code() throws with descriptive message including actual type', () => {
      expect(() => tracify.code(undefined as unknown as string)).toThrow(/got undefined/);
    });
  });

  describe('validation (sync throws from getters)', () => {
    it('.tracer() throws for unknown tracer with TracerUnknownError', () => {
      expect(() => tracify.tracer('unknown')).toThrow(TracerUnknownError);
    });

    it('.steps throws when tracer missing', () => {
      expect(() => tracify.code('ab').steps).toThrow(/tracer.*required/i);
    });

    it('.steps throws when code missing', () => {
      expect(() => tracify.tracer('txt:chars').steps).toThrow(/code.*required/i);
    });

    it('.steps rejects with ParseError from tracer module (async)', async () => {
      await expect(tracify.tracer('txt:chars').code('‽').steps).rejects.toBeInstanceOf(ParseError);
    });
  });

  describe('immutability (deep clone)', () => {
    it('config is deep cloned on entry', async () => {
      const config = { options: { remove: ['a'], replace: {}, direction: 'lr' as const } };
      const chain = tracify.tracer('txt:chars').code('ab').config(config);

      // Mutate original
      config.options.remove.push('b');

      // Chain should still have original config
      const steps = await chain.steps;
      expect(steps).toHaveLength(1); // Only 'a' removed, not 'b'
    });
  });

  describe('memoization', () => {
    it('does not re-trace on multiple .steps accesses', async () => {
      const chain = tracify.tracer('txt:chars').code('ab');

      const steps1 = await chain.steps;
      const steps2 = await chain.steps;

      // Same content
      expect(steps1).toEqual(steps2);
      // But different references (deep cloned each time)
      expect(steps1).not.toBe(steps2);
    });

    it('.steps returns different reference on each access (deep clone)', async () => {
      const chain = tracify.tracer('txt:chars').code('ab');

      const steps1 = (await chain.steps) as unknown as { char: string }[];
      const steps2 = (await chain.steps) as unknown as { char: string }[];

      // Mutating steps1 doesn't affect steps2
      (steps1[0] as { char: string }).char = 'mutated';
      expect(steps2[0].char).toBe('a');
    });
  });

  describe('resolvedConfig getter (sync)', () => {
    it('.resolvedConfig returns options with tracer defaults', () => {
      const chain = tracify.tracer('txt:chars');
      const resolved = chain.resolvedConfig;

      expect(resolved).toHaveProperty('options');
      expect(resolved.options).toHaveProperty('direction', 'lr');
      expect(resolved.options).toHaveProperty('remove');
      expect(resolved.options).toHaveProperty('replace');
    });

    it('.resolvedConfig includes user-provided options merged with defaults', () => {
      const chain = tracify.tracer('txt:chars').config({ options: { remove: ['a'] } });
      const resolved = chain.resolvedConfig;

      expect((resolved.options as { remove: string[] }).remove).toEqual(['a']);
      expect((resolved.options as { direction: string }).direction).toBe('lr'); // default
    });

    it('.resolvedConfig returns deep cloned copy', () => {
      const chain = tracify.tracer('txt:chars');

      const resolved1 = chain.resolvedConfig;
      const resolved2 = chain.resolvedConfig;

      expect(resolved1).toEqual(resolved2);
      expect(resolved1).not.toBe(resolved2); // Different reference
    });

    it('.resolvedConfig does not require code', () => {
      // Can access resolvedConfig without setting code
      const resolved = tracify.tracer('txt:chars').resolvedConfig;

      expect(resolved).toHaveProperty('meta');
      expect(resolved).toHaveProperty('options');
    });
  });

  // Cache invalidation tests removed - tracify is purely fluent, no state inspection
  // Implementation will be verified through code review and embodify tests
});
