import serialize from '../serialize.js';

describe('serialize', () => {
  it('serializes empty array to "[]"', () => {
    expect(serialize({ steps: [] })).toBe('[]');
  });

  it('serializes step array to JSON string', () => {
    const steps = [{}, {}, {}] as any[];
    const result = serialize({ steps });
    expect(result).toBe('[{},{},{}]');
  });

  it('round-trips with JSON.parse', () => {
    const steps = [{ type: 'test' }, { type: 'other' }] as any[];
    const serialized = serialize({ steps });
    const parsed = JSON.parse(serialized);
    expect(parsed).toEqual(steps);
  });

  it('throws if steps is not an array', () => {
    expect(() => serialize({ steps: 42 as any })).toThrow('serialize');
    expect(() => serialize({ steps: 'not array' as any })).toThrow('serialize');
    expect(() => serialize({ steps: {} as any })).toThrow('serialize');
  });

  it('throws if steps is undefined (no arg)', () => {
    expect(() => serialize()).toThrow('serialize');
    expect(() => serialize({} as any)).toThrow('serialize');
  });
});
