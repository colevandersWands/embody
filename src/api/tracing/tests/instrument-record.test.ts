import createConfig from '../../../configuring/create.js';
import instrumentRecord from '../instrument-record.js';

describe('instrumentRecord', () => {
  it('full pipeline: abc → steps [{},{},{}]', () => {
    const result = instrumentRecord({ code: 'abc', config: createConfig({}) });
    expect(result.steps).toEqual([{}, {}, {}]);
  });

  it('empty code produces empty steps', () => {
    const result = instrumentRecord({ code: '', config: createConfig({}) });
    expect(result.steps).toEqual([]);
  });

  it('preserves code in output', () => {
    const result = instrumentRecord({ code: 'abc', config: createConfig({}) });
    expect(result.code).toBe('abc');
  });

  it('preserves config in output', () => {
    const config = createConfig({});
    const result = instrumentRecord({ code: 'abc', config });
    expect(result.config).toBe(config);
  });

  it('single char code', () => {
    const result = instrumentRecord({ code: 'x', config: createConfig({}) });
    expect(result.steps).toEqual([{}]);
  });

  it('throws if code is not a string', () => {
    expect(() => instrumentRecord({ code: 42 as any })).toThrow('instrumentRecord');
    expect(() => instrumentRecord({ code: [] as any })).toThrow('instrumentRecord');
    expect(() => instrumentRecord({ code: true as any })).toThrow('instrumentRecord');
  });

  it('throws if config is not an object', () => {
    expect(() => instrumentRecord({ code: 'abc', config: 42 as any })).toThrow('instrumentRecord');
    expect(() => instrumentRecord({ code: 'abc', config: 'bad' as any })).toThrow(
      'instrumentRecord',
    );
    expect(() => instrumentRecord({ code: 'abc', config: [] as any })).toThrow('instrumentRecord');
  });
});
