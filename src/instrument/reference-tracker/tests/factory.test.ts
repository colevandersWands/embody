import factory from '../factory.js';

describe('Factory Function', () => {
  it('should return an object with wrap, unwrap, and shadow functions', () => {
    const tracker = factory();
    expect(tracker).toHaveProperty('wrap');
    expect(tracker).toHaveProperty('unwrap');
    expect(tracker).toHaveProperty('shadow');
    expect(typeof tracker.wrap).toBe('function');
    expect(typeof tracker.unwrap).toBe('function');
    expect(typeof tracker.shadow).toBe('function');
  });

  it('should accept custom configuration options', () => {
    const customSecret = Symbol('custom');
    const customRecord = new WeakMap();
    const tracker = factory({
      secret: customSecret,
      record: customRecord,
      id: 100,
    });

    expect(tracker).toHaveProperty('wrap');
    expect(tracker).toHaveProperty('unwrap');
    expect(tracker).toHaveProperty('shadow');
  });

  it('should work with default options', () => {
    const tracker = factory();
    expect(tracker).toBeTruthy();
  });
});

describe('Shadow Function (Public Interface)', () => {
  let tracker: ReturnType<typeof factory>;

  beforeEach(() => {
    tracker = factory();
  });

  it('should wrap primitives with id: null', () => {
    const trackedNumber = tracker.shadow(42);
    expect(trackedNumber.value).toBe(42);
    expect(trackedNumber.id).toBeNull();
    expect(trackedNumber.type).toBe('number');
    expect(typeof trackedNumber.secret).toBe('symbol');

    const trackedString = tracker.shadow('test');
    expect(trackedString.value).toBe('test');
    expect(trackedString.id).toBeNull();
    expect(trackedString.type).toBe('string');

    const trackedBoolean = tracker.shadow(true);
    expect(trackedBoolean.value).toBe(true);
    expect(trackedBoolean.id).toBeNull();
    expect(trackedBoolean.type).toBe('boolean');

    const trackedNull = tracker.shadow(null);
    expect(trackedNull.value).toBe(null);
    expect(trackedNull.id).toBeNull();
    expect(trackedNull.type).toBe('object'); // typeof null === 'object'

    const trackedUndefined = tracker.shadow(undefined);
    expect(trackedUndefined.value).toBe(undefined);
    expect(trackedUndefined.id).toBeNull();
    expect(trackedUndefined.type).toBe('undefined');

    const trackedSymbol = tracker.shadow(Symbol('test'));
    expect(trackedSymbol.value.toString()).toBe('Symbol(test)');
    expect(trackedSymbol.id).toBeNull();
    expect(trackedSymbol.type).toBe('symbol');

    const trackedBigInt = tracker.shadow(BigInt(123));
    expect(trackedBigInt.value).toBe(BigInt(123));
    expect(trackedBigInt.id).toBeNull();
    expect(trackedBigInt.type).toBe('bigint');
  });

  it('should wrap objects with tracking information', () => {
    const obj = { name: 'test', count: 42 };
    const tracked = tracker.shadow(obj);

    expect(tracked).toBeTruthy();
    expect(typeof tracked!.id).toBe('number');
    expect(typeof tracked!.secret).toBe('symbol');
    expect(tracked!.type).toBe('Object');

    expect(tracked!.value.name.value).toBe('test');
    expect(tracked!.value.name.id).toBeNull();
    expect(tracked!.value.name.type).toBe('string');
    expect(tracked!.value.count.value).toBe(42);
    expect(tracked!.value.count.id).toBeNull();
    expect(tracked!.value.count.type).toBe('number');
  });

  it('should wrap different object types correctly', () => {
    expect(tracker.shadow({})!.type).toBe('Object');
    expect(tracker.shadow([])!.type).toBe('Array');
    expect(tracker.shadow(new Map())!.type).toBe('Map');
    expect(tracker.shadow(new Set())!.type).toBe('Set');
    expect(tracker.shadow(() => {})!.type).toBe('Function');
    expect(tracker.shadow(new Date())!.type).toBe('Date');
    expect(tracker.shadow(/test/)!.type).toBe('RegExp');
  });

  it('should reuse wrappers for the same object', () => {
    const obj = { reuse: true };
    const tracked1 = tracker.shadow(obj);
    const tracked2 = tracker.shadow(obj);

    expect(tracked2).toBe(tracked1);
  });

  it('should assign unique incremental IDs to objects only', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };

    const tracked1 = tracker.shadow(obj1);
    const tracked2 = tracker.shadow(obj2);

    expect(tracked2!.id).toBe(tracked1!.id + 1);
  });

  it('should not reuse wrappers for primitive values', () => {
    const tracked1 = tracker.shadow(42);
    const tracked2 = tracker.shadow(42);

    expect(tracked1).not.toBe(tracked2);
    expect(tracked1.value).toBe(tracked2.value);
    expect(tracked1.id).toBeNull();
    expect(tracked2.id).toBeNull();
  });
});

describe('Deep Nested Structures', () => {
  let tracker: ReturnType<typeof factory>;

  beforeEach(() => {
    tracker = factory();
  });

  it('should recursively wrap nested objects', () => {
    const complex = {
      data: 'test',
      nested: { count: 42 },
      array: [1, { item: 'nested' }],
    };

    const tracked = tracker.shadow(complex);
    expect(tracked).toBeTruthy();
    const nestedTracked = tracked!.value.nested;
    expect(nestedTracked).toBeTruthy();
    expect(typeof nestedTracked.id).toBe('number');
    expect(nestedTracked.type).toBe('Object');
    const arrayItemTracked = tracked!.value.array.value[1];
    expect(arrayItemTracked).toBeTruthy();
    expect(typeof arrayItemTracked.id).toBe('number');
    expect(arrayItemTracked.type).toBe('Object');
  });

  it('should handle Map values recursively', () => {
    const map = new Map([['key', { value: 'test' }]]);
    const tracked = tracker.shadow(map);

    expect(tracked!.type).toBe('Map');
    const mapValue = tracked!.value.get('key');
    expect(mapValue).toBeTruthy();
    expect(typeof mapValue.id).toBe('number');
    expect(mapValue.type).toBe('Object');
  });

  it('should handle Set values recursively', () => {
    const set = new Set([{ item: 'test' }]);
    const tracked = tracker.shadow(set);

    expect(tracked!.type).toBe('Set');
    const setValue = Array.from(tracked!.value)[0];
    expect(setValue).toBeTruthy();
    expect(typeof setValue.id).toBe('number');
    expect(setValue.type).toBe('Object');
  });
});

describe('Unwrap Function', () => {
  let tracker: ReturnType<typeof factory>;

  beforeEach(() => {
    tracker = factory();
  });

  it('should restore simple objects', () => {
    const obj = { name: 'test', count: 42 };
    const tracked = tracker.shadow(obj);
    const unwrapped = tracker.unwrap(tracked!);

    expect(unwrapped).toEqual(obj);
  });

  it('should restore complex nested structures', () => {
    const complex = {
      data: 'test',
      nested: { count: 42 },
      array: [1, { item: 'nested' }],
    };

    const tracked = tracker.shadow(complex);
    const unwrapped = tracker.unwrap(tracked!);

    expect(unwrapped).toEqual(complex);
  });

  it('should restore Map and Set structures', () => {
    const map = new Map([['key', { value: 'test' }]]);
    const trackedMap = tracker.shadow(map);
    const unwrappedMap = tracker.unwrap(trackedMap!);

    expect(unwrappedMap).toBeInstanceOf(Map);
    expect((unwrappedMap as Map<string, any>).get('key')).toEqual({ value: 'test' });

    const set = new Set([{ item: 'test' }]);
    const trackedSet = tracker.shadow(set);
    const unwrappedSet = tracker.unwrap(trackedSet!);

    expect(unwrappedSet).toBeInstanceOf(Set);
    expect(Array.from(unwrappedSet as Set<any>)[0]).toEqual({ item: 'test' });
  });

  it('should unwrap tracked primitives back to original values', () => {
    const trackedNumber = tracker.shadow(42);
    expect(tracker.unwrap(trackedNumber)).toBe(42);

    const trackedString = tracker.shadow('test');
    expect(tracker.unwrap(trackedString)).toBe('test');

    const trackedBoolean = tracker.shadow(true);
    expect(tracker.unwrap(trackedBoolean)).toBe(true);

    const trackedNull = tracker.shadow(null);
    expect(tracker.unwrap(trackedNull)).toBe(null);

    const trackedUndefined = tracker.shadow(undefined);
    expect(tracker.unwrap(trackedUndefined)).toBe(undefined);
  });

  it('should return untracked primitives unchanged', () => {
    expect(tracker.unwrap(42)).toBe(42);
    expect(tracker.unwrap('test')).toBe('test');
    expect(tracker.unwrap(true)).toBe(true);
    expect(tracker.unwrap(null)).toBe(null);
    expect(tracker.unwrap(undefined)).toBe(undefined);
  });

  it('should return non-tracked objects unchanged', () => {
    const obj = { regular: 'object' };
    expect(tracker.unwrap(obj)).toBe(obj);
  });
});

describe('Circular References', () => {
  let tracker: ReturnType<typeof factory>;

  beforeEach(() => {
    tracker = factory();
  });

  it('should handle circular references in objects', () => {
    const obj: any = { name: 'circular' };
    obj.self = obj;

    const tracked = tracker.shadow(obj);
    expect(tracked).toBeTruthy();

    const unwrapped = tracker.unwrap(tracked!) as any;
    expect(unwrapped.self).toBe(unwrapped);
  });

  it('should handle circular references in arrays', () => {
    const arr: any[] = [1, 2];
    arr.push(arr);

    const tracked = tracker.shadow(arr);
    expect(tracked).toBeTruthy();

    const unwrapped = tracker.unwrap(tracked!) as any[];
    expect(unwrapped[2]).toBe(unwrapped);
  });
});

describe('Multiple Tracker Instances', () => {
  it('should create independent tracker instances', () => {
    const tracker1 = factory({ secret: Symbol('tracker1') });
    const tracker2 = factory({ secret: Symbol('tracker2') });

    const obj = { shared: true };
    const tracked1 = tracker1.shadow(obj);
    const tracked2 = tracker2.shadow(obj);

    expect(tracked1!.secret).not.toBe(tracked2!.secret);
  });

  it('should not unwrap objects from different trackers', () => {
    const tracker1 = factory({ secret: Symbol('tracker1') });
    const tracker2 = factory({ secret: Symbol('tracker2') });

    const obj = { test: true };
    const tracked1 = tracker1.shadow(obj);

    const result = tracker2.unwrap(tracked1!);
    expect(result).toBe(tracked1);
  });

  it('should use custom starting IDs', () => {
    const tracker = factory({ id: 500 });
    const obj = { test: true };
    const tracked = tracker.shadow(obj);

    expect(tracked!.id).toBe(501); // 500 + 1
  });
});

describe('Integration Tests', () => {
  it('should handle real-world complex scenarios', () => {
    const tracker = factory();

    const complex = {
      user: { name: 'John', age: 30 },
      posts: [
        { title: 'Post 1', tags: ['js', 'web'] },
        { title: 'Post 2', tags: ['node', 'api'] },
      ],
      metadata: new Map([
        ['created', new Date('2024-01-01')],
        ['config', { theme: 'dark', lang: 'en' }],
      ]),
      permissions: new Set(['read', 'write']),
    };

    const tracked = tracker.shadow(complex);
    expect(tracked).toBeTruthy();

    const unwrapped = tracker.unwrap(tracked!) as any;
    expect(unwrapped.user.name).toBe('John');
    expect(unwrapped.posts[0].title).toBe('Post 1');
    expect(unwrapped.metadata.get('config').theme).toBe('dark');
    expect(Array.from(unwrapped.permissions)).toContain('read');
  });
});
