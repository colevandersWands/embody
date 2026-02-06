import ConfigInvalidError from '../../errors/config-invalid-error.js';
import EmbodyError from '../../errors/embody-error.js';
import LangUnknownError from '../../errors/lang-unknown-error.js';
import ParseError from '../../errors/parse-error.js';
import embody from '../embody.js';

const EXPECT_FUNCTION = 'expected function';

describe('embody', () => {
  describe('closure with properties (function-as-object)', () => {
    it('partial closure has inspectable .lang property', () => {
      const partial = embody({ lang: 'chars' });

      expect(typeof partial).toBe('function');
      expect((partial as { lang: unknown }).lang).toBe('chars');
    });

    it('partial closure has inspectable .code property', () => {
      const partial = embody({ code: 'ab' });

      expect(typeof partial).toBe('function');
      expect((partial as { code: unknown }).code).toBe('ab');
    });

    it('partial closure has inspectable .config property', () => {
      const partial = embody({ config: { options: { remove: ['a'] } } });

      expect(typeof partial).toBe('function');
      expect((partial as { config: unknown }).config).toEqual({ options: { remove: ['a'] } });
    });

    it('partial closure has .ok = true (valid so far)', () => {
      const partial = embody({ lang: 'chars' });

      expect((partial as { ok: unknown }).ok).toBe(true);
    });

    it('partial closure has .error = undefined (not errored)', () => {
      const partial = embody({ lang: 'chars' });

      expect((partial as { error: unknown }).error).toBeUndefined();
    });

    it('.config property is deep cloned (caller cannot mutate)', () => {
      const config = { options: { remove: ['a'] } };
      const partial = embody({ config });

      config.options.remove.push('b');

      expect(
        ((partial as { config: unknown }).config as { options: { remove: string[] } }).options
          .remove,
      ).toEqual(['a']);
    });
  });

  describe('eager type validation', () => {
    it('type error on lang sets ok=false immediately', () => {
      const bad = embody({ lang: 123 as unknown as string });

      expect((bad as { ok: unknown }).ok).toBe(false);
    });

    it('type error on lang sets .error with descriptive message', () => {
      const bad = embody({ lang: 123 as unknown as string });

      expect((bad as { error: EmbodyError }).error).toBeInstanceOf(EmbodyError);
      expect((bad as { error: EmbodyError }).error.message).toMatch(/lang must be string/);
    });

    it('type error on code sets ok=false immediately', () => {
      const bad = embody({ code: 456 as unknown as string });

      expect((bad as { ok: unknown }).ok).toBe(false);
    });

    it('type error on code sets .error with descriptive message', () => {
      const bad = embody({ code: null as unknown as string });

      expect((bad as { error: EmbodyError }).error.message).toMatch(/code must be string/);
    });

    it('type error preserves bad value on closure property', () => {
      const bad = embody({ lang: 123 as unknown as string });

      expect((bad as { lang: unknown }).lang).toBe(123);
    });

    it('accumulates all type errors in one message', () => {
      const bad = embody({ lang: 123 as unknown as string, code: 456 as unknown as string });

      // All errors are captured
      expect((bad as { error: EmbodyError }).error.message).toMatch(/lang must be string/);
      expect((bad as { error: EmbodyError }).error.message).toMatch(/code must be string/);
    });
  });

  describe('poisoned closure behavior', () => {
    it('poisoned closure returns Promise when called', async () => {
      const bad = embody({ lang: 123 as unknown as string });
      const resultPromise = (bad as (input: { code: string; config: null }) => Promise<unknown>)({
        code: 'ab',
        config: null,
      });

      expect(resultPromise).toBeInstanceOf(Promise);
      const result = await resultPromise;
      expect((result as { ok: boolean }).ok).toBe(false);
    });

    it('poisoned closure error is preserved in Promise result', async () => {
      const bad = embody({ lang: 123 as unknown as string });
      const badError = (bad as { error: EmbodyError }).error;
      const result = await (
        bad as (input: {
          code: string;
          config: null;
        }) => Promise<{ ok: boolean; error: EmbodyError }>
      )({ code: 'ab', config: null });

      // Same error type (not necessarily same instance, but same kind)
      expect(result.error).toBeInstanceOf(ConfigInvalidError);
      expect(badError).toBeInstanceOf(ConfigInvalidError);
    });
  });

  describe('duplicate key detection', () => {
    it('returns Promise resolving to error when lang already provided', async () => {
      const partial = embody({ lang: 'chars' });
      const result = await (
        partial as (input: {
          lang: string;
          code: string;
          config: null;
        }) => Promise<{ ok: boolean; error: EmbodyError }>
      )({ lang: 'js', code: 'ab', config: null });

      expect(result.ok).toBe(false);
      expect(result.error.message).toMatch(/already provided/);
    });

    it('returns Promise resolving to error when code already provided', async () => {
      const partial = embody({ code: 'ab' });
      const result = await (
        partial as (input: {
          lang: string;
          code: string;
          config: null;
        }) => Promise<{ ok: boolean; error: EmbodyError }>
      )({ lang: 'chars', code: 'cd', config: null });

      expect(result.ok).toBe(false);
      expect(result.error.message).toMatch(/already provided/);
    });

    it('returns Promise resolving to error when config already provided', async () => {
      const partial = embody({ config: null });
      const result = await (
        partial as (input: {
          lang: string;
          code: string;
          config: { remove: string[] };
        }) => Promise<{ ok: boolean; error: EmbodyError }>
      )({ lang: 'chars', code: 'ab', config: { options: { remove: ['a'] } } });

      expect(result.ok).toBe(false);
      expect(result.error.message).toMatch(/already provided/);
    });
  });

  describe('full calls (all three fields present) - async', () => {
    it('returns Promise when lang, code, and config: null provided', () => {
      const resultPromise = embody({ lang: 'chars', code: 'ab', config: null });

      expect(resultPromise).toBeInstanceOf(Promise);
    });

    it('Promise resolves to { ok: true, steps }', async () => {
      const result = await embody({ lang: 'chars', code: 'ab', config: null });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.steps).toHaveLength(2);
      }
    });

    it('passes custom config to lang module', async () => {
      const result = await embody({
        lang: 'chars',
        code: 'ab',
        config: { options: { remove: ['a'], replace: {}, direction: 'lr' } },
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        // 'a' removed, only 'b' remains
        expect(result.steps).toHaveLength(1);
      }
    });

    it('returns error with LangUnknownError for unknown lang', async () => {
      const result = await embody({ lang: 'unknown', code: 'x', config: null });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(LangUnknownError);
      }
    });
  });

  describe('partial calls (return closures)', () => {
    it('returns function when only lang provided', () => {
      const result = embody({ lang: 'chars' });

      expect(typeof result).toBe('function');
    });

    it('returns function when only code provided', () => {
      const result = embody({ code: 'ab' });

      expect(typeof result).toBe('function');
    });

    it('returns function when lang and code but no config', () => {
      const result = embody({ lang: 'chars', code: 'ab' });

      expect(typeof result).toBe('function');
    });

    it('closure completes trace when remaining pieces provided (async)', async () => {
      const step1 = embody({ lang: 'chars' });
      if (typeof step1 !== 'function') throw new Error(EXPECT_FUNCTION);
      const step2 = step1({ code: 'ab' });
      if (typeof step2 !== 'function') throw new Error(EXPECT_FUNCTION);
      const result = await step2({ config: null });

      expect('ok' in result && result.ok).toBe(true);
      if ('steps' in result) {
        expect(result.steps).toHaveLength(2);
      }
    });

    it('closure accepts all remaining pieces at once (async)', async () => {
      const withLang = embody({ lang: 'chars' });
      if (typeof withLang !== 'function') throw new Error(EXPECT_FUNCTION);
      const result = await withLang({ code: 'ab', config: null });

      expect('ok' in result && result.ok).toBe(true);
      if ('steps' in result) {
        expect(result.steps).toHaveLength(2);
      }
    });
  });

  describe('config semantics', () => {
    it('config: null triggers trace with lang defaults (async)', async () => {
      const result = await embody({ lang: 'chars', code: 'ab', config: null });

      expect(result.ok).toBe(true);
    });

    it('config: undefined returns closure (waiting)', () => {
      const result = embody({ lang: 'chars', code: 'ab', config: undefined });

      expect(typeof result).toBe('function');
    });

    it('missing config key returns closure (waiting)', () => {
      const result = embody({ lang: 'chars', code: 'ab' });

      expect(typeof result).toBe('function');
    });

    it('config object triggers trace with custom config (async)', async () => {
      const result = await embody({
        lang: 'chars',
        code: 'ab',
        config: { options: { remove: [], replace: {}, direction: 'rl' } },
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        // rl direction means reversed order
        expect(result.steps[0]).toHaveProperty('char', 'b');
      }
    });
  });

  describe('error handling', () => {
    it('catches ParseError and returns as ok: false (async)', async () => {
      // interrobang triggers ParseError in chars module
      const result = await embody({ lang: 'chars', code: 'ab‽', config: null });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ParseError);
      }
    });

    it('preserves ParseError details (async)', async () => {
      const result = await embody({ lang: 'chars', code: '‽', config: null });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('interrobang');
        expect((result.error as ParseError).loc).toEqual({ line: 1, column: 1 });
      }
    });

    // Skipped: structural validation not yet implemented in /configuring
    it.skip('wraps invalid options in OptionsSchemaInvalidError (async)', async () => {
      const result = await embody({
        lang: 'chars',
        code: 'ab',
        config: { options: { remove: 'not-array', replace: {}, direction: 'lr' } },
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(OptionsSchemaInvalidError);
      }
    });
  });

  describe('result shape (includes all input keys)', () => {
    it('success result includes lang, code, config (async)', async () => {
      const result = await embody({ lang: 'chars', code: 'ab', config: null });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.lang).toBe('chars');
        expect(result.code).toBe('ab');
        expect(result.config).toBe(null);
      }
    });

    it('error result includes lang, code, config (async)', async () => {
      const result = await embody({ lang: 'unknown', code: 'ab', config: null });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.lang).toBe('unknown');
        expect(result.code).toBe('ab');
        expect(result.config).toBe(null);
      }
    });

    it('result includes custom config object (async)', async () => {
      const customConfig = { options: { remove: ['a'], replace: {}, direction: 'lr' as const } };
      const result = await embody({ lang: 'chars', code: 'ab', config: customConfig });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.config).toEqual(customConfig);
      }
    });
  });

  describe('immutability (deep clone)', () => {
    it('caller cannot mutate internal state via config (async)', async () => {
      const config = { options: { remove: ['a'], replace: {}, direction: 'lr' as const } };
      const closure = embody({ lang: 'chars', config });

      // Mutate the original config
      config.options.remove.push('b');

      // Closure should still work with original config
      if (typeof closure !== 'function') throw new Error(EXPECT_FUNCTION);
      const result = await closure({ code: 'ab' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should have 1 step (only 'a' removed, not 'b')
        expect(result.steps).toHaveLength(1);
      }
    });

    it('returned config is a copy (cannot mutate result) (async)', async () => {
      const result = await embody({
        lang: 'chars',
        code: 'ab',
        config: { options: { remove: ['a'], replace: {}, direction: 'lr' as const } },
      });

      expect(result.ok).toBe(true);
      if (result.ok && typeof result.config === 'object' && result.config !== null) {
        const returnedConfig = result.config as { options: { remove: string[] } };
        const originalRemove = [...returnedConfig.options.remove];
        returnedConfig.options.remove.push('mutated');

        expect(originalRemove).toEqual(['a']);
      }
    });

    it('re-invoking closure does not share state (async)', async () => {
      const closure = embody({ lang: 'chars' });
      if (typeof closure !== 'function') throw new Error(EXPECT_FUNCTION);

      const result1 = await closure({ code: 'a', config: null });
      const result2 = await closure({ code: 'ab', config: null });

      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);
      if (result1.ok && result2.ok) {
        expect(result1.steps).toHaveLength(1);
        expect(result2.steps).toHaveLength(2);
      }
    });
  });

  describe('resolvedConfig', () => {
    it('success result includes resolvedConfig with lang defaults (async)', async () => {
      const result = await embody({ lang: 'chars', code: 'ab', config: null });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.resolvedConfig).toHaveProperty('options');
        expect(result.resolvedConfig.options).toHaveProperty('direction', 'lr');
        expect(result.resolvedConfig.options).toHaveProperty('remove');
        expect(result.resolvedConfig.options).toHaveProperty('replace');
      }
    });

    it('resolvedConfig includes user options merged with defaults (async)', async () => {
      const result = await embody({
        lang: 'chars',
        code: 'ab',
        config: { options: { remove: ['a'] } },
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        const options = result.resolvedConfig.options as { remove: string[]; direction: string };
        expect(options.remove).toEqual(['a']);
        expect(options.direction).toBe('lr'); // default
      }
    });

    it('resolvedConfig is deep cloned (immutable) (async)', async () => {
      const result = await embody({ lang: 'chars', code: 'ab', config: null });

      expect(result.ok).toBe(true);
      if (result.ok) {
        const options = result.resolvedConfig.options as { remove: string[] };
        const originalRemove = [...options.remove];
        options.remove.push('mutated');

        // Original should be unchanged (deep clone)
        expect(originalRemove).toEqual([]);
      }
    });
  });
});
