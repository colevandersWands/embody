import trace from '../trace.js';
import createConfig from '../configuring/create.js';

describe('trace', () => {
  it('traces code → returns Step[]', () => {
    const steps = trace('abc');
    expect(Array.isArray(steps)).toBe(true);
    expect(steps).toEqual([{}, {}, {}]);
  });

  it('empty code → empty steps', () => {
    const steps = trace('');
    expect(steps).toEqual([]);
  });

  it('single char → [{}]', () => {
    const steps = trace('x');
    expect(steps).toEqual([{}]);
  });

  it('"abc" → [{},{},{}]', () => {
    const steps = trace('abc');
    expect(steps).toEqual([{}, {}, {}]);
  });

  it('with config object → uses config', () => {
    const steps = trace('abc', { presets: 'overview' });
    expect(steps).toEqual([{}, {}, {}]);
  });

  it('with JSON string config → parses and uses', () => {
    const fromObject = trace('abc', { presets: 'overview' });
    const fromString = trace('abc', '{"presets":"overview"}' as any);
    expect(fromString).toEqual(fromObject);
  });

  it('invalid JSON config → throws', () => {
    expect(() => trace('abc', '{bad json' as any)).toThrow(
      'deserialize',
    );
  });

  it('no args → empty steps (code defaults to empty string)', () => {
    const steps = trace();
    expect(steps).toEqual([]);
  });

  it('throws if code is not a string', () => {
    expect(() => trace(42 as any)).toThrow('trace');
    expect(() => trace([] as any)).toThrow('trace');
    expect(() => trace(true as any)).toThrow('trace');
  });

  it('throws if config is not an object or string', () => {
    expect(() => trace('abc', 42 as any)).toThrow('trace');
    expect(() => trace('abc', true as any)).toThrow('trace');
  });
});
