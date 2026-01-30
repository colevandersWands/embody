import createConfig from '../../../configuring/create.js';
import instrument from '../instrument.js';

describe('instrument', () => {
  it('instruments code (stub: spaces between chars)', () => {
    const result = instrument({ code: 'abc', config: createConfig({}) });
    expect(result.instrumented).toBe('a b c');
  });

  it('empty code produces empty instrumented', () => {
    const result = instrument({ code: '', config: createConfig({}) });
    expect(result.instrumented).toBe('');
  });

  it('preserves code in output', () => {
    const result = instrument({ code: 'abc', config: createConfig({}) });
    expect(result.code).toBe('abc');
  });

  it('preserves config in output', () => {
    const config = createConfig({});
    const result = instrument({ code: 'abc', config });
    expect(result.config).toBe(config);
  });

  it('single char code', () => {
    const result = instrument({ code: 'x', config: createConfig({}) });
    expect(result.instrumented).toBe('x');
  });

  it('throws if code is not a string', () => {
    expect(() => instrument({ code: 42 as any })).toThrow('instrument');
    expect(() => instrument({ code: [] as any })).toThrow('instrument');
    expect(() => instrument({ code: true as any })).toThrow('instrument');
  });

  it('throws if config is not an object', () => {
    expect(() => instrument({ code: 'abc', config: 42 as any })).toThrow('instrument');
    expect(() => instrument({ code: 'abc', config: 'bad' as any })).toThrow('instrument');
    expect(() => instrument({ code: 'abc', config: [] as any })).toThrow('instrument');
  });
});
