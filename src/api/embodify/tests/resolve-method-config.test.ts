import resolveMethodConfig from '../resolve-method-config.js';
import createConfig from '../../../configuring/create.js';

describe('resolveMethodConfig', () => {
  const chainConfig = createConfig({});

  it('returns chainConfig as-is when override is undefined', () => {
    const result = resolveMethodConfig(undefined, chainConfig);
    expect(result).toBe(chainConfig);
  });

  it('merges object override on top of chainConfig', () => {
    const override = { lang: { bindings: { events: { read: false } } } };
    const result = resolveMethodConfig(override, chainConfig);

    expect(result.lang.bindings.events.read).toBe(false);
    // other fields preserved from chainConfig
    expect(result.lang.bindings.events.assign).toBe(chainConfig.lang.bindings.events.assign);
  });

  it('parses JSON string override then merges', () => {
    const jsonOverride = '{"lang":{"bindings":{"events":{"read":false}}}}';
    const objOverride = { lang: { bindings: { events: { read: false } } } };

    const fromString = resolveMethodConfig(jsonOverride, chainConfig);
    const fromObject = resolveMethodConfig(objOverride, chainConfig);

    expect(fromString).toEqual(fromObject);
  });

  it('throws on invalid JSON config', () => {
    expect(() => resolveMethodConfig('{bad json', chainConfig)).toThrow(
      'deserialize',
    );
  });

  it('applies preset override (full expansion)', () => {
    const detailed = createConfig({ presets: 'detailed' });
    const result = resolveMethodConfig({ presets: 'overview' }, detailed);

    // preset in narrow config triggers createConfig delegation,
    // so the overview preset values should appear in the merge
    const overviewConfig = createConfig({ presets: 'overview' });
    expect(result).toEqual(
      expect.objectContaining({
        meta: overviewConfig.meta,
      }),
    );
  });

  it('returns chainConfig unchanged for empty object override', () => {
    const result = resolveMethodConfig({}, chainConfig);
    expect(result).toEqual(chainConfig);
  });
});
