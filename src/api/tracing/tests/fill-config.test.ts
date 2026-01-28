import fillConfig from '../fill-config.js';
import createConfig from '../../../configuring/create.js';

describe('fillConfig', () => {
  it('expands empty object to default config', () => {
    const result = fillConfig({ config: {} });
    const defaultConfig = createConfig({});
    expect(result.config).toEqual(defaultConfig);
  });

  it('expands preset config', () => {
    const result = fillConfig({ config: { presets: 'overview' } });
    const overviewConfig = createConfig({ presets: 'overview' });
    expect(result.config).toEqual(overviewConfig);
  });

  it('returns ExpandedConfig shape (has .lang, .meta)', () => {
    const result = fillConfig({ config: {} });
    expect(result.config).toHaveProperty('lang');
    expect(result.config).toHaveProperty('meta');
  });

  it('called with no args returns default config', () => {
    const result = fillConfig();
    const defaultConfig = createConfig({});
    expect(result.config).toEqual(defaultConfig);
  });

  it('called with { config: undefined } returns default config', () => {
    const result = fillConfig({ config: undefined });
    const defaultConfig = createConfig({});
    expect(result.config).toEqual(defaultConfig);
  });

  it('throws if config is wrong type (number, array, etc.)', () => {
    expect(() => fillConfig({ config: 42 as any })).toThrow('fillConfig');
    expect(() => fillConfig({ config: [] as any })).toThrow('fillConfig');
    expect(() => fillConfig({ config: true as any })).toThrow('fillConfig');
  });
});
