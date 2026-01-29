/**
 * @file Tests for createNarrowConfig — partial config expansion
 *
 * createNarrowConfig expands shorthands for ONLY the fields
 * the user provides. Unlike createConfig, it does NOT fill
 * in defaults for missing fields. This makes it suitable
 * for deepMerge scenarios where only user-specified fields
 * should override chain values.
 *
 * Exception: when a preset is specified, delegates to
 * createConfig for full expansion (correct behavior —
 * a preset change means "give me this whole profile").
 */

import createNarrowConfig from '../create-narrow-config.js';
import createConfig from '../create.js';

describe('createNarrowConfig', () => {
  describe('partial expansion — no defaults filled', () => {
    test('returns only the keys the user provided', () => {
      const result = createNarrowConfig({
        lang: { bindings: { events: { read: false } } },
      });

      // Should have the user-provided path
      expect(result.lang.bindings.events.read).toBe(false);

      // Should NOT have filled in sibling defaults
      expect(result.presets).toBeUndefined();
      expect(result.meta).toBeUndefined();
      expect(result.lang.operators).toBeUndefined();
      expect(result.lang.functions).toBeUndefined();
    });

    test('empty object returns empty object', () => {
      const result = createNarrowConfig({});
      expect(result).toEqual({});
    });

    test('no arguments returns empty object', () => {
      const result = createNarrowConfig();
      expect(result).toEqual({});
    });

    test('preserves primitive values as-is', () => {
      const result = createNarrowConfig({
        lang: { semantics: false },
      });

      expect(result.lang.semantics).toBe(false);
      // Other lang fields not filled
      expect(result.lang.bindings).toBeUndefined();
    });
  });

  describe('shorthand expansion — true becomes object', () => {
    test('true expands to default object for that key', () => {
      const result = createNarrowConfig({
        lang: { bindings: true },
      });

      // Should expand to the full bindings structure
      expect(typeof result.lang.bindings).toBe('object');
      expect(result.lang.bindings.kind).toBeDefined();
      expect(result.lang.bindings.events).toBeDefined();
      expect(result.lang.bindings.kind.declarative.var).toBe(true);
    });

    test('nested true expands correctly', () => {
      const result = createNarrowConfig({
        lang: { bindings: { kind: { declarative: true } } },
      });

      expect(typeof result.lang.bindings.kind.declarative).toBe('object');
      expect(result.lang.bindings.kind.declarative.var).toBe(true);
      expect(result.lang.bindings.kind.declarative.let).toBe(true);
      expect(result.lang.bindings.kind.declarative.const).toBe(true);

      // Sibling not filled
      expect(result.lang.bindings.kind.explicit).toBeUndefined();
    });

    test('meta: true expands meta section', () => {
      const result = createNarrowConfig({
        meta: true,
      });

      expect(typeof result.meta).toBe('object');
      expect(result.meta.index).toBe(true);
      expect(result.meta.location).toBe('line');

      // No lang section filled
      expect(result.lang).toBeUndefined();
    });
  });

  describe('disabled expansion — false becomes zeroed', () => {
    test('false creates disabled version of default', () => {
      const result = createNarrowConfig({
        lang: { bindings: false },
      });

      expect(typeof result.lang.bindings).toBe('object');
      expect(result.lang.bindings.kind.declarative.var).toBe(false);
      expect(result.lang.bindings.events.declare).toBe(false);
      expect(result.lang.bindings.events.read).toBe(false);
      expect(result.lang.bindings.filter.include).toEqual([]);
    });

    test('nested false disables subtree', () => {
      const result = createNarrowConfig({
        lang: { operators: false },
      });

      expect(result.lang.operators.pure).toBe(false);
      expect(result.lang.operators.mutating).toBe(false);
      expect(result.lang.operators.coercion).toBe(false);
    });

    test('meta: false disables meta section', () => {
      const result = createNarrowConfig({
        meta: false,
      });

      expect(result.meta.index).toBe(false);
      expect(result.meta.ast).toBe(false);
      expect(result.meta.timestamps).toBe(false);
    });
  });

  describe('preset — delegates to createConfig', () => {
    test('preset produces full config via createConfig', () => {
      const narrow = createNarrowConfig({
        presets: 'overview',
      });
      const full = createConfig({ presets: 'overview' });

      // Should be identical — full delegation
      expect(narrow).toEqual(full);
    });

    test('preset with overrides delegates correctly', () => {
      const narrow = createNarrowConfig({
        presets: 'detailed',
        meta: { location: 'full' },
      });

      // Should have detailed preset values
      expect(narrow.lang.bindings.kind.explicit.parameters).toBe(true);
      // Should have user override
      expect(narrow.meta.location).toBe('full');
    });
  });

  describe('nested partial — only provided keys', () => {
    test('mixed true/false/object at same level', () => {
      const result = createNarrowConfig({
        lang: {
          bindings: true,
          operators: false,
          functions: {
            kind: { arrow: false },
          },
        },
      });

      // true → expanded
      expect(result.lang.bindings.kind.declarative.var).toBe(true);

      // false → disabled
      expect(result.lang.operators.pure).toBe(false);

      // object → partial (only provided keys)
      expect(result.lang.functions.kind.arrow).toBe(false);
      // Siblings not filled by narrow expansion
      expect(result.lang.functions.events).toBeUndefined();

      // Other lang keys not present
      expect(result.lang.controlFlow).toBeUndefined();
      expect(result.lang.scopes).toBeUndefined();
    });

    test('deeply nested partial preserves structure', () => {
      const result = createNarrowConfig({
        meta: {
          data: { value: false },
        },
      });

      expect(result.meta.data.value).toBe(false);
      // Siblings within data not filled
      expect(result.meta.data.type).toBeUndefined();
      // Siblings within meta not filled
      expect(result.meta.index).toBeUndefined();
    });
  });
});
