import createConfig from '../../../langs/js/configuring/create.js';
import embodify from '../embodify.js';

describe('Increment 1 — Empty construction', () => {
  it('returns an object', () => {
    const e = embodify();
    expect(typeof e).toBe('object');
    expect(e).not.toBeNull();
  });

  it('.code returns empty string', () => {
    expect(embodify().code).toBe('');
  });

  it('.config returns default config', () => {
    expect(embodify().config).toEqual(createConfig({}));
  });

  it('.steps returns empty array', () => {
    expect(embodify().steps).toEqual([]);
  });

  it('.pickledSteps returns serialized empty array', () => {
    expect(embodify().pickledSteps).toBe('[]');
  });

  it('.pickledConfig returns serialized default config', () => {
    const pickled = embodify().pickledConfig;
    expect(typeof pickled).toBe('string');
    expect(JSON.parse(pickled)).toEqual(createConfig({}));
  });
});

describe('Increment 2 — Construction with values', () => {
  it('stores code', () => {
    expect(embodify({ code: 'abc' }).code).toBe('abc');
  });

  it('code-only cascades steps', () => {
    expect(embodify({ code: 'abc' }).steps).toEqual([{}, {}, {}]);
  });

  it('stores steps array', () => {
    const steps = [{}, {}];
    expect(embodify({ steps }).steps).toEqual([{}, {}]);
  });

  it('expands config object to full ExpandedConfig', () => {
    const e = embodify({ config: {} });
    expect(e.config).not.toBeNull();
    expect(e.config).toHaveProperty('lang');
    expect(e.config).toHaveProperty('meta');
  });

  it('applies preset in config', () => {
    const overview = embodify({ config: { presets: 'overview' } });
    const detailed = embodify({ config: { presets: 'detailed' } });
    expect(overview.config).not.toEqual(detailed.config);
  });
});

describe('Increment 3b — Type validation in embodify()', () => {
  it('throws when code is not a string', () => {
    expect(() => {
      embodify({ code: 123 as any });
    }).toThrow('code must be a string');
  });

  it('throws when config is not an object or string', () => {
    expect(() => {
      embodify({ config: 123 as any });
    }).toThrow();
  });

  it('throws when steps is not an array or string', () => {
    expect(() => {
      embodify({ steps: 123 as any });
    }).toThrow();
  });
});

describe('Increment 4 — String auto-detection (steps)', () => {
  it('auto-unpickles string steps', () => {
    const e = embodify({ steps: '[{},{}]' });
    expect(e.steps).toEqual([{}, {}]);
  });

  it('pickledSteps round-trips from string input', () => {
    const e = embodify({ steps: '[{},{}]' });
    expect(e.pickledSteps).toBe('[{},{}]');
  });

  it('pickledSteps serializes array steps', () => {
    const e = embodify({ steps: [{}, {}] });
    expect(e.pickledSteps).toBe('[{},{}]');
  });

  it('pickledSteps returns serialized empty array when no steps', () => {
    expect(embodify({}).pickledSteps).toBe('[]');
  });

  it('pickledConfig returns serialized default config when no config', () => {
    const pickled = embodify({}).pickledConfig;
    expect(typeof pickled).toBe('string');
  });

  it('pickledConfig returns JSON string when config exists', () => {
    const e = embodify({ config: {} });
    const pickled = e.pickledConfig;
    expect(typeof pickled).toBe('string');
    const parsed = JSON.parse(pickled);
    expect(parsed).toHaveProperty('lang');
    expect(parsed).toHaveProperty('meta');
  });
});

describe('Increment 5 — Config from JSON string', () => {
  it('parses JSON string config with preset', () => {
    const fromString = embodify({
      config: '{"presets":"overview"}',
    });
    const fromObject = embodify({
      config: { presets: 'overview' },
    });
    expect(fromString.config).toEqual(fromObject.config);
  });

  it('throws on invalid JSON config', () => {
    expect(() => embodify({ config: '{invalid json' })).toThrow('deserialize');
  });

  it('parses empty JSON object to default config', () => {
    const fromString = embodify({ config: '{}' });
    const fromObject = embodify({ config: {} });
    expect(fromString.config).toEqual(fromObject.config);
  });
});

describe('Increment 6 — .set({ config })', () => {
  const cfg1 = { presets: 'overview' as const };
  const cfg2 = { presets: 'detailed' as const };

  it('replaces config fully', () => {
    const e = embodify({ code: 'abc', config: cfg1 });
    const e2 = e.set({ config: cfg2 });
    const expectedCfg = createConfig(cfg2);
    expect(e2.config).toEqual(expectedCfg);
  });

  it('preserves code', () => {
    const e = embodify({ code: 'abc', config: cfg1 });
    const e2 = e.set({ config: cfg2 });
    expect(e2.code).toBe('abc');
  });

  it('lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ config: cfg2 });
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('does not mutate original', () => {
    const e = embodify({ code: 'abc' }).trace();
    e.set({ config: cfg2 });
    expect(e.steps).not.toBeNull();
  });
});

describe('Increment 7 — .set() edge cases', () => {
  it('no-op when called with no args (getter cascades to default)', () => {
    const e = embodify().set();
    const defaults = createConfig({});
    expect(e.config).toEqual(defaults);
  });

  it('accepts JSON string config', () => {
    const e = embodify().set({ config: '{}' });
    const defaults = createConfig({});
    expect(e.config).toEqual(defaults);
  });
});

describe('Increment 8 — mergeConfig', () => {
  it('overrides only specified fields', () => {
    const e = embodify({ config: {} });
    const e2 = e.mergeConfig({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e2.config.lang.bindings.events.read).toBe(false);
    expect(e2.config.lang.bindings.events.assign).toBe(e.config.lang.bindings.events.assign);
  });

  it('lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.mergeConfig({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e2.steps).toEqual([{}, {}, {}]);
  });
});

describe('Increment 9 — mergeConfig with preset', () => {
  it('preset silently overwrites entire config', () => {
    const e = embodify({ config: { presets: 'detailed' } });
    const e2 = e.mergeConfig({
      config: { presets: 'overview' },
    });
    const overviewConfig = createConfig({ presets: 'overview' });
    expect(e2.config).toEqual(overviewConfig);
  });
});

describe('Increment 10 — .set({ code })', () => {
  it('sets new code, preserves config', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    const e2 = e.set({ code: 'xy' });
    expect(e2.code).toBe('xy');
    expect(e2.config).toEqual(e.config);
  });

  it('lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ code: 'xy' });
    expect(e2.steps).toEqual([{}, {}]);
  });
});

describe('Increment 11 — .set() validation', () => {
  it('no-op when called with empty object', () => {
    expect(embodify().set({}).code).toBe('');
  });

  it('no-op when called with no args', () => {
    expect(embodify().set().code).toBe('');
  });

  it('no-op preserves existing state', () => {
    expect(embodify({ code: 'abc' }).set({}).code).toBe('abc');
  });

  it('throws when multiple properties given', () => {
    expect(() => {
      embodify().set({ code: 'x', config: {} } as any);
    }).toThrow();
  });

  it('throws when code is not a string', () => {
    expect(() => {
      embodify().set({ code: 123 } as any);
    }).toThrow();
  });

  it('throws when steps is not an array or string', () => {
    expect(() => {
      embodify().set({ steps: 123 } as any);
    }).toThrow();
  });

  it('throws when config is not an object or string', () => {
    expect(() => {
      embodify().set({ config: 123 } as any);
    }).toThrow();
  });
});

describe('Increment 12 — .set({ steps })', () => {
  it('sets steps array, code defaults to empty', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    const e2 = e.set({ steps: [{}, {}, {}, {}] });
    expect(e2.steps).toEqual([{}, {}, {}, {}]);
    expect(e2.code).toBe('');
    expect(e2.config).toEqual(e.config);
  });

  it('auto-unpickles string steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ steps: '[{},{}]' });
    expect(e2.steps).toEqual([{}, {}]);
    expect(e2.code).toBe('');
  });
});

describe('Increment 17 — trace() from code', () => {
  it('produces steps from code', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('preserves code', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.code).toBe('abc');
  });
});

describe('Increment 20 — trace() with overrides', () => {
  it('overrides code', () => {
    const e = embodify({ code: 'abc' });
    const e2 = e.trace({ code: 'xy' });
    expect(e2.steps).toEqual([{}, {}]);
  });

  it('merges config override', () => {
    const e = embodify({ code: 'abc', config: {} });
    const e2 = e.trace({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e2.config.lang.bindings.events.read).toBe(false);
    expect(e2.config.lang.bindings.events.assign).toBe(true);
  });
});

describe('Increment 21 — trace() edge cases', () => {
  it('traces empty when no code available', () => {
    const e = embodify({}).trace();
    expect(e.steps).toEqual([]);
    expect(e.code).toBe('');
  });
});


describe('Increment 25 — methodConfig helper behavior', () => {
  it('chain config + method override → merged', () => {
    const e = embodify({ code: 'abc', config: {} }).trace({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e.config.lang.bindings.events.read).toBe(false);
    expect(e.config.lang.bindings.events.assign).toBe(true);
  });

  it('no chain config + method override → full expansion', () => {
    const e = embodify({ code: 'abc' }).trace({ config: { presets: 'overview' } });
    const overviewCfg = createConfig({ presets: 'overview' });
    expect(e.config).toEqual(overviewCfg);
  });

  it('chain config + no override → chain as-is', () => {
    const cfg = createConfig({ presets: 'overview' });
    const e = embodify({ code: 'abc', config: { presets: 'overview' } }).trace();
    expect(e.config).toEqual(cfg);
  });

  it('no chain config + no override → defaults', () => {
    const e = embodify({ code: 'abc' }).trace();
    const defaults = createConfig({});
    expect(e.config).toEqual(defaults);
  });
});

describe('Increment 26 — JSON.parse in methods', () => {
  it('trace accepts JSON string config', () => {
    const e = embodify({ code: 'abc' }).trace({ config: '{"presets":"overview"}' });
    const overviewCfg = createConfig({ presets: 'overview' });
    expect(e.config).toEqual(overviewCfg);
  });
});

describe('Increment 27 — Lazy recomputation verification', () => {
  it('.set({ code }) → lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ code: 'xy' });
    expect(e2.steps).toEqual([{}, {}]);
  });

  it('.set({ config }) → code preserved, lazy recomputes', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ config: {} });
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('mergeConfig → code preserved, lazy recomputes', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.mergeConfig({ config: {} });
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('trace() → preserves code', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.code).toBe('abc');
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('.set({ steps }) → typed defaults for code', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ steps: [{}, {}] });
    expect(e2.code).toBe('');
  });
});

describe('Increment 28 — Immutability', () => {
  it('.set({ config }) does not mutate original', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    e.set({ config: { presets: 'overview' } });
    expect(e.code).toBe('abc');
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('.set({ code }) does not mutate original', () => {
    const e = embodify({ code: 'abc' }).trace();
    e.set({ code: 'xy' });
    expect(e.code).toBe('abc');
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('mergeConfig does not mutate original', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    e.mergeConfig({ config: { lang: { bindings: { events: { read: false } } } } });
    expect(e.config.lang.bindings.events.read).toBe(true);
  });
});

describe('Increment 29 — Full use cases', () => {
  it('E. Granular pipeline control', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('G. Batch processing', () => {
    const tracer = embodify({ config: {} });
    const results = ['abc', 'xy'].map((c) => tracer.trace({ code: c }).steps);
    expect(results[0]).toEqual([{}, {}, {}]);
    expect(results[1]).toEqual([{}, {}]);
  });

  it('H. Update config mid-chain (lazy cascade after merge)', () => {
    const traced = embodify({ code: 'abc', config: {} }).trace();
    const e = traced.mergeConfig({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e.steps).toEqual([{}, {}, {}]);
    expect(e.config.lang.bindings.events.read).toBe(false);
  });
});

describe('Increment 30 — Edge cases', () => {
  it('empty code traces to empty arrays', () => {
    const e = embodify({ code: '' }).trace();
    expect(e.steps).toEqual([]);
  });

  it('single character code', () => {
    const e = embodify({ code: 'a' }).trace();
    expect(e.steps).toEqual([{}]);
  });

  it('pickledSteps with empty array', () => {
    expect(embodify({ steps: [] }).pickledSteps).toBe('[]');
  });

  it('steps from empty string unpickle', () => {
    expect(embodify({ steps: '[]' }).steps).toEqual([]);
  });

  it('pickledSteps round-trips empty array', () => {
    expect(embodify({ steps: '[]' }).pickledSteps).toBe('[]');
  });
});
