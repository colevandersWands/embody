import embody from '../embody.js';
import createConfig from '../../configuring/create.js';

describe('embody', () => {
  it('both params → TraceResult', () => {
    const result = embody({ code: 'abc', config: {} });
    expect(result).toEqual({
      code: 'abc',
      config: createConfig({}),
      steps: [{}, {}, {}],
    });
  });

  it('config-only → returns function expecting code', () => {
    const curried = embody({ config: {} });
    expect(typeof curried).toBe('function');
  });

  it('code-only → returns function expecting config', () => {
    const curried = embody({ code: 'abc' });
    expect(typeof curried).toBe('function');
  });

  it('no args → throws', () => {
    expect(() => embody()).toThrow('embody');
    expect(() => embody({} as any)).toThrow('embody');
  });

  it('JSON string config → same as object config', () => {
    const fromObject = embody({ code: 'abc', config: { presets: 'overview' } });
    const fromString = embody({ code: 'abc', config: '{"presets":"overview"}' });
    expect(fromString).toEqual(fromObject);
  });

  it('invalid JSON config → throws', () => {
    expect(() => embody({ code: 'abc', config: '{bad json' })).toThrow('deserialize');
  });

  it('throws if code is not a string', () => {
    expect(() => embody({ code: 42 as any, config: {} })).toThrow('embody');
    expect(() => embody({ code: [] as any, config: {} })).toThrow('embody');
    expect(() => embody({ code: true as any, config: {} })).toThrow('embody');
  });

  it('throws if config is not object or string', () => {
    expect(() => embody({ code: 'abc', config: 42 as any })).toThrow('embody');
    expect(() => embody({ code: 'abc', config: true as any })).toThrow('embody');
  });

  it('throws if config is null or array', () => {
    expect(() => embody({ code: 'abc', config: null as any })).toThrow('embody');
    expect(() => embody({ code: 'abc', config: [] as any })).toThrow('embody');
  });

  it('curried: config-first, then code → TraceResult', () => {
    const tracer = embody({ config: {} }) as (input: { code: string }) => any;
    const result = tracer({ code: 'abc' });
    expect(result).toEqual({
      code: 'abc',
      config: createConfig({}),
      steps: [{}, {}, {}],
    });
  });

  it('curried: code-first, then config → TraceResult', () => {
    const tracer = embody({ code: 'abc' }) as (input: { config: any }) => any;
    const result = tracer({ config: {} });
    expect(result).toEqual({
      code: 'abc',
      config: createConfig({}),
      steps: [{}, {}, {}],
    });
  });

  it('curried: config-first, no code in inner → throws', () => {
    const tracer = embody({ config: {} }) as (input?: any) => any;
    expect(() => tracer()).toThrow('embody');
    expect(() => tracer({})).toThrow('embody');
  });

  it('curried: code-first, no config in inner → throws', () => {
    const tracer = embody({ code: 'abc' }) as (input?: any) => any;
    expect(() => tracer()).toThrow('embody');
    expect(() => tracer({})).toThrow('embody');
  });
});
