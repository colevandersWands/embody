import deepFreeze from '../deep-freeze.js';

describe('deepFreeze', () => {
  describe('primitives', () => {
    it('returns null as-is', () => {
      expect(deepFreeze(null)).toBe(null);
    });

    it('returns undefined as-is', () => {
      expect(deepFreeze(undefined)).toBe(undefined);
    });

    it('returns numbers as-is', () => {
      expect(deepFreeze(42)).toBe(42);
    });

    it('returns strings as-is', () => {
      expect(deepFreeze('hello')).toBe('hello');
    });

    it('returns booleans as-is', () => {
      expect(deepFreeze(true)).toBe(true);
    });
  });

  describe('shallow objects', () => {
    it('freezes a simple object', () => {
      const obj = { a: 1, b: 2 };
      const frozen = deepFreeze(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
    });

    it('returns the same object reference', () => {
      const obj = { a: 1 };
      const frozen = deepFreeze(obj);
      expect(frozen).toBe(obj);
    });

    it('prevents property modification', () => {
      const obj = deepFreeze({ value: 1 });
      expect(() => {
        (obj as { value: number }).value = 2;
      }).toThrow();
    });

    it('prevents property addition', () => {
      const obj = deepFreeze({ a: 1 });
      expect(() => {
        (obj as Record<string, number>).b = 2;
      }).toThrow();
    });

    it('prevents property deletion', () => {
      const obj = deepFreeze({ a: 1 });
      expect(() => {
        delete (obj as { a?: number }).a;
      }).toThrow();
    });
  });

  describe('nested objects', () => {
    it('freezes nested objects', () => {
      const obj = { outer: { inner: 1 } };
      deepFreeze(obj);
      expect(Object.isFrozen(obj.outer)).toBe(true);
    });

    it('freezes deeply nested objects', () => {
      const obj = { a: { b: { c: { d: 1 } } } };
      deepFreeze(obj);
      expect(Object.isFrozen(obj.a.b.c)).toBe(true);
    });

    it('prevents nested property modification', () => {
      const obj = deepFreeze({ outer: { inner: 1 } });
      expect(() => {
        (obj.outer as { inner: number }).inner = 2;
      }).toThrow();
    });
  });

  describe('arrays', () => {
    it('freezes arrays', () => {
      const arr = [1, 2, 3];
      deepFreeze(arr);
      expect(Object.isFrozen(arr)).toBe(true);
    });

    it('freezes nested arrays', () => {
      const obj = { items: [1, 2, 3] };
      deepFreeze(obj);
      expect(Object.isFrozen(obj.items)).toBe(true);
    });

    it('freezes objects inside arrays', () => {
      const arr = [{ a: 1 }, { b: 2 }];
      deepFreeze(arr);
      expect(Object.isFrozen(arr[0])).toBe(true);
      expect(Object.isFrozen(arr[1])).toBe(true);
    });

    it('prevents array push', () => {
      const arr = deepFreeze([1, 2, 3]);
      expect(() => {
        (arr as number[]).push(4);
      }).toThrow();
    });

    it('prevents array element modification', () => {
      const arr = deepFreeze([1, 2, 3]);
      expect(() => {
        (arr as number[])[0] = 99;
      }).toThrow();
    });
  });

  describe('mixed structures', () => {
    it('freezes complex nested structure', () => {
      const config = {
        remove: ['a', 'b'],
        replace: { x: 'y' },
        nested: { deep: { value: 1 } },
      };
      deepFreeze(config);

      expect(Object.isFrozen(config)).toBe(true);
      expect(Object.isFrozen(config.remove)).toBe(true);
      expect(Object.isFrozen(config.replace)).toBe(true);
      expect(Object.isFrozen(config.nested)).toBe(true);
      expect(Object.isFrozen(config.nested.deep)).toBe(true);
    });
  });
});
