import squint from '../squint.js';
import createConfig from '../../configuring/create.js';

describe('squint', () => {
  it('both params → FilterResult', () => {
    const steps = [{}, {}, {}] as any[];
    const result = squint({ steps, config: {} });
    expect(result.steps).toEqual(steps);
    expect(result.config).toEqual(createConfig({}));
  });

  it('config-only → returns function expecting steps', () => {
    const curried = squint({ config: {} });
    expect(typeof curried).toBe('function');
  });

  it('steps-only → returns function expecting config', () => {
    const curried = squint({ steps: [{}, {}] as any[] });
    expect(typeof curried).toBe('function');
  });

  it('no args → throws', () => {
    expect(() => squint()).toThrow('squint');
    expect(() => squint({} as any)).toThrow('squint');
  });

  it('JSON string steps → deserialized', () => {
    const result = squint({ steps: '[{},{},{}]', config: {} });
    expect(result.steps).toEqual([{}, {}, {}]);
  });

  it('JSON string config → parsed', () => {
    const fromObject = squint({ steps: [{}, {}] as any[], config: { presets: 'overview' } });
    const fromString = squint({ steps: [{}, {}] as any[], config: '{"presets":"overview"}' });
    expect(fromString.config).toEqual(fromObject.config);
  });

  it('throws if steps is wrong type', () => {
    expect(() => squint({ steps: 42 as any, config: {} })).toThrow('squint');
    expect(() => squint({ steps: true as any, config: {} })).toThrow('squint');
  });

  it('throws if config is wrong type', () => {
    expect(() => squint({ steps: [] as any[], config: 42 as any })).toThrow('squint');
    expect(() => squint({ steps: [] as any[], config: true as any })).toThrow('squint');
  });

  it('throws if config is null or array', () => {
    expect(() => squint({ steps: [] as any[], config: null as any })).toThrow('squint');
    expect(() => squint({ steps: [] as any[], config: [] as any })).toThrow('squint');
  });

  it('curried config-first → works', () => {
    const filter = squint({ config: {} }) as (input: { steps: any[] }) => any;
    const result = filter({ steps: [{}, {}] });
    expect(result.steps).toEqual([{}, {}]);
    expect(result.config).toEqual(createConfig({}));
  });

  it('curried steps-first → works', () => {
    const filter = squint({ steps: [{}, {}] as any[] }) as (input: { config: any }) => any;
    const result = filter({ config: {} });
    expect(result.steps).toEqual([{}, {}]);
    expect(result.config).toEqual(createConfig({}));
  });

  it('curried config-first, no steps in inner → throws', () => {
    const filter = squint({ config: {} }) as (input?: any) => any;
    expect(() => filter()).toThrow('squint');
    expect(() => filter({})).toThrow('squint');
  });

  it('curried steps-first, no config in inner → throws', () => {
    const filter = squint({ steps: [{}, {}] as any[] }) as (input?: any) => any;
    expect(() => filter()).toThrow('squint');
    expect(() => filter({})).toThrow('squint');
  });
});
