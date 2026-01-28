import pickles from '../pickles.js';

describe('pickles', () => {
  it('array steps → serialized string', () => {
    const result = pickles({ steps: [{}, {}, {}] as any[] });
    expect(result.steps).toBe('[{},{},{}]');
  });

  it('string steps → deserialized array', () => {
    const result = pickles({ steps: '[{},{},{}]' });
    expect(result.steps).toEqual([{}, {}, {}]);
  });

  it('empty array → "[]"', () => {
    const result = pickles({ steps: [] });
    expect(result.steps).toBe('[]');
  });

  it('empty string "[]" → []', () => {
    const result = pickles({ steps: '[]' });
    expect(result.steps).toEqual([]);
  });

  it('no args → throws', () => {
    expect(() => pickles()).toThrow('pickles');
  });

  it('undefined steps → throws', () => {
    expect(() => pickles({} as any)).toThrow('pickles');
    expect(() => pickles({ steps: undefined })).toThrow('pickles');
  });

  it('wrong type (number) → throws', () => {
    expect(() => pickles({ steps: 42 as any })).toThrow('pickles');
    expect(() => pickles({ steps: true as any })).toThrow('pickles');
    expect(() => pickles({ steps: {} as any })).toThrow('pickles');
  });

  it('invalid JSON string → throws', () => {
    expect(() => pickles({ steps: '{bad json' })).toThrow('resolveSteps');
    expect(() => pickles({ steps: 'not json' })).toThrow('resolveSteps');
  });
});
