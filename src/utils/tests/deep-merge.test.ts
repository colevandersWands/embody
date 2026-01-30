/**
 * @file Unit tests for deep merge utility
 * Comprehensive test suite covering all merge scenarios and edge cases
 */

import deepMerge from '../deep-merge.js';

describe('deepMerge', () => {
  describe('Basic Functionality', () => {
    test('should return user value for primitives', () => {
      expect(deepMerge(1, 2)).toBe(2);
      expect(deepMerge('a', 'b')).toBe('b');
      expect(deepMerge(true, false)).toBe(false);
    });

    test('should return user value for null/undefined', () => {
      expect(deepMerge({ a: 1 }, null)).toBe(null);
      expect(deepMerge({ a: 1 })).toBe(undefined);
      expect(deepMerge(null, { a: 1 })).toEqual({ a: 1 });
      expect(deepMerge(undefined, { a: 1 })).toEqual({ a: 1 });
    });

    test('should merge simple objects', () => {
      const preset = { a: 1, b: 2 };
      const user = { b: 3, c: 4 };
      const result = deepMerge(preset, user);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('should replace arrays completely', () => {
      const preset = { arr: [1, 2, 3] };
      const user = { arr: [4, 5] };
      const result = deepMerge(preset, user);

      expect(result.arr).toEqual([4, 5]);
    });

    test('should handle empty arrays', () => {
      const preset = { arr: [1, 2, 3] };
      const user = { arr: [] };
      const result = deepMerge(preset, user);

      expect(result.arr).toEqual([]);
    });
  });

  describe('Deep Nesting', () => {
    test('should merge deeply nested objects', () => {
      const preset = {
        level1: {
          level2: {
            level3: {
              a: 1,
              b: 2,
            },
            other: 'keep',
          },
        },
      };

      const user = {
        level1: {
          level2: {
            level3: {
              a: 10, // override
            },
          },
        },
      };

      const result = deepMerge(preset, user);

      expect(result.level1.level2.level3.a).toBe(10);
      expect(result.level1.level2.level3.b).toBe(2);
      expect(result.level1.level2.other).toBe('keep');
    });

    test('should handle arbitrary depth nesting', () => {
      const preset = { a: { b: { c: { d: { e: { f: 1 } } } } } };
      const user = { a: { b: { c: { d: { e: { f: 2, g: 3 } } } } } };
      const result = deepMerge(preset, user);

      expect(result.a.b.c.d.e.f).toBe(2);
      expect(result.a.b.c.d.e.g).toBe(3);
    });
  });

  describe('Type Mismatches', () => {
    test('should handle object to primitive conversion', () => {
      const preset = { config: { enabled: true, level: 2 } };
      const user = { config: 'disabled' };
      const result = deepMerge(preset, user);

      expect(result.config).toBe('disabled');
    });

    test('should handle primitive to object conversion', () => {
      const preset = { config: 'basic' };
      const user = { config: { enabled: true, level: 2 } };
      const result = deepMerge(preset, user);

      expect(result.config).toEqual({ enabled: true, level: 2 });
    });

    test('should handle array to object conversion', () => {
      const preset = { config: [1, 2, 3] };
      const user = { config: { a: 1, b: 2 } };
      const result = deepMerge(preset, user);

      expect(result.config).toEqual({ a: 1, b: 2 });
    });

    test('should handle object to array conversion', () => {
      const preset = { config: { a: 1, b: 2 } };
      const user = { config: [1, 2, 3] };
      const result = deepMerge(preset, user);

      expect(result.config).toEqual([1, 2, 3]);
    });
  });

  describe('Null/Undefined Edge Cases', () => {
    test('should preserve null values in user config', () => {
      const preset = { a: { b: 1, c: 2 } };
      const user = { a: null };
      const result = deepMerge(preset, user);

      expect(result.a).toBe(null);
    });

    test('should handle null in nested objects', () => {
      const preset = { a: { b: { c: 1 } } };
      const user = { a: { b: null } };
      const result = deepMerge(preset, user);

      expect(result.a.b).toBe(null);
    });

    test('should merge when preset has null', () => {
      const preset = { a: null };
      const user = { a: { b: 1 } };
      const result = deepMerge(preset, user);

      expect(result.a.b).toBe(1);
    });
  });

  describe('Real-World Scenarios', () => {
    test('should handle realistic config merge', () => {
      const preset = {
        variables: { read: false, write: true, filter: [] },
        functions: { calls: true, returns: false },
        errors: { throw: true, catch: false },
      };

      const user = {
        variables: { read: true, filter: ['x', 'y'] },
        functions: true, // boolean shorthand
        errors: { catch: true },
      };

      const result = deepMerge(preset, user);

      expect(result.variables.read).toBe(true);
      expect(result.variables.write).toBe(true);
      expect(result.variables.filter).toEqual(['x', 'y']);
      expect(result.functions).toBe(true);
      expect(result.errors.throw).toBe(true);
      expect(result.errors.catch).toBe(true);
    });

    test('should preserve references where no changes occur', () => {
      const preset = { unchanged: { deep: { value: 1 } }, changed: 2 };
      const user = { changed: 3 };
      const result = deepMerge(preset, user);

      // unchanged object should be preserved (same reference)
      expect(result.unchanged).toBe(preset.unchanged);
      expect(result.changed).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('should handle circular references in input without infinite loop', () => {
      const preset = { a: 1 };
      const user = { b: 2 };
      user.self = user; // circular reference

      // Should not hang or crash
      const result = deepMerge(preset, user);
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      expect(result.self).toBe(user);
    });

    test('should handle functions in objects', () => {
      const function1 = () => 'preset';
      const function2 = () => 'user';

      const preset = { func: function1 };
      const user = { func: function2 };
      const result = deepMerge(preset, user);

      expect(result.func).toBe(function2);
    });

    test('should handle Date objects', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2024-01-01');

      const preset = { date: date1 };
      const user = { date: date2 };
      const result = deepMerge(preset, user);

      expect(result.date).toBe(date2);
    });

    test('should handle RegExp objects', () => {
      const regex1 = /preset/;
      const regex2 = /user/;

      const preset = { pattern: regex1 };
      const user = { pattern: regex2 };
      const result = deepMerge(preset, user);

      expect(result.pattern).toBe(regex2);
    });
  });
});
