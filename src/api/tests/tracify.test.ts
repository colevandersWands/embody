import LangUnknownError from '../../errors/lang-unknown-error.js';
import ParseError from '../../errors/parse-error.js';
import tracify from '../tracify.js';

describe('tracify', () => {
  describe('async behavior', () => {
    it('.steps returns a Promise', () => {
      const result = tracify.lang('chars').code('ab').steps;

      expect(result).toBeInstanceOf(Promise);
    });

    it('.steps resolves to steps array', async () => {
      const steps = await tracify.lang('chars').code('ab').steps;

      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(2);
    });

    it('.resolvedConfig returns a Promise', () => {
      const result = tracify.lang('chars').code('ab').resolvedConfig;

      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('basic chaining', () => {
    it('.lang().code().steps resolves to steps array', async () => {
      const steps = await tracify.lang('chars').code('ab').steps;

      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(2);
    });

    it('.code().lang().steps works (order independent)', async () => {
      const steps = await tracify.code('ab').lang('chars').steps;

      expect(steps).toHaveLength(2);
    });

    it('.steps is a lazy getter (traces on access)', async () => {
      const chain = tracify.lang('chars').code('ab');
      // Access .steps twice - should work both times
      const steps1 = await chain.steps;
      const steps2 = await chain.steps;

      expect(steps1).toHaveLength(2);
      expect(steps2).toHaveLength(2);
    });
  });

  describe('config handling', () => {
    it('.config() passes config to lang module', async () => {
      const steps = await tracify
        .lang('chars')
        .code('ab')
        .config({ options: { remove: ['a'], replace: {}, direction: 'lr' } }).steps;

      expect(steps).toHaveLength(1);
    });

    it('without .config() uses lang defaults', async () => {
      const steps = await tracify.lang('chars').code('ab').steps;

      expect(steps).toHaveLength(2);
    });
  });

  describe('type validation (eager, sync)', () => {
    it('.lang() throws immediately on non-string', () => {
      expect(() => tracify.lang(123 as unknown as string)).toThrow(/expected string/);
    });

    it('.lang() throws with descriptive message including actual type', () => {
      expect(() => tracify.lang(null as unknown as string)).toThrow(/got object/);
    });

    it('.code() throws immediately on non-string', () => {
      expect(() => tracify.code(456 as unknown as string)).toThrow(/expected string/);
    });

    it('.code() throws with descriptive message including actual type', () => {
      expect(() => tracify.code(undefined as unknown as string)).toThrow(/got undefined/);
    });
  });

  describe('semantic/necessity validation (lazy, async)', () => {
    it('rejects for unknown lang with LangUnknownError', async () => {
      await expect(tracify.lang('unknown').code('x').steps).rejects.toBeInstanceOf(
        LangUnknownError,
      );
    });

    it('rejects when lang missing', async () => {
      await expect(tracify.code('ab').steps).rejects.toThrow(/lang.*required/i);
    });

    it('rejects when code missing', async () => {
      await expect(tracify.lang('chars').steps).rejects.toThrow(/code.*required/i);
    });

    it('rejects with ParseError from lang module', async () => {
      await expect(tracify.lang('chars').code('‽').steps).rejects.toBeInstanceOf(ParseError);
    });
  });

  describe('result getters', () => {
    it('.ok getter returns true (always - throws on error)', () => {
      const chain = tracify.lang('chars').code('ab');

      expect(chain.ok).toBe(true);
    });
  });

  describe('immutability (deep clone)', () => {
    it('config is deep cloned on entry', async () => {
      const config = { options: { remove: ['a'], replace: {}, direction: 'lr' as const } };
      const chain = tracify.lang('chars').code('ab').config(config);

      // Mutate original
      config.options.remove.push('b');

      // Chain should still have original config
      const steps = await chain.steps;
      expect(steps).toHaveLength(1); // Only 'a' removed, not 'b'
    });
  });

  describe('memoization', () => {
    it('does not re-trace on multiple .steps accesses', async () => {
      const chain = tracify.lang('chars').code('ab');

      const steps1 = await chain.steps;
      const steps2 = await chain.steps;

      // Same content
      expect(steps1).toEqual(steps2);
      // But different references (deep cloned each time)
      expect(steps1).not.toBe(steps2);
    });

    it('.steps returns different reference on each access (deep clone)', async () => {
      const chain = tracify.lang('chars').code('ab');

      const steps1 = (await chain.steps) as { char: string }[];
      const steps2 = (await chain.steps) as { char: string }[];

      // Mutating steps1 doesn't affect steps2
      (steps1[0] as { char: string }).char = 'mutated';
      expect(steps2[0].char).toBe('a');
    });
  });

  describe('resolvedConfig getter', () => {
    it('.resolvedConfig resolves to options with lang defaults', async () => {
      const chain = tracify.lang('chars').code('ab');
      const resolved = await chain.resolvedConfig;

      expect(resolved).toHaveProperty('options');
      expect(resolved.options).toHaveProperty('direction', 'lr');
      expect(resolved.options).toHaveProperty('remove');
      expect(resolved.options).toHaveProperty('replace');
    });

    it('.resolvedConfig includes user-provided options merged with defaults', async () => {
      const chain = tracify
        .lang('chars')
        .code('ab')
        .config({ options: { remove: ['a'] } });
      const resolved = await chain.resolvedConfig;

      expect((resolved.options as { remove: string[] }).remove).toEqual(['a']);
      expect((resolved.options as { direction: string }).direction).toBe('lr'); // default
    });

    it('.resolvedConfig returns deep cloned copy', async () => {
      const chain = tracify.lang('chars').code('ab');

      const resolved1 = await chain.resolvedConfig;
      const resolved2 = await chain.resolvedConfig;

      expect(resolved1).toEqual(resolved2);
      expect(resolved1).not.toBe(resolved2); // Different reference
    });
  });
});
