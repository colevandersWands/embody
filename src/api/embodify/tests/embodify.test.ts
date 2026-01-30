import createConfig from '../../../configuring/create.js';
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

  it('.instrumented returns empty string', () => {
    expect(embodify().instrumented).toBe('');
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

  it('code-only cascades instrumented', () => {
    expect(embodify({ code: 'abc' }).instrumented).toBe('a b c');
  });

  it('code-only cascades steps', () => {
    expect(embodify({ code: 'abc' }).steps).toEqual([{}, {}, {}]);
  });

  it('stores instrumented', () => {
    expect(embodify({ instrumented: 'a b c' }).instrumented).toBe('a b c');
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

describe('Increment 3 — Exclusive pair errors', () => {
  it('throws when both code and instrumented are provided', () => {
    expect(() => {
      embodify({ code: 'abc', instrumented: 'a b c' });
    }).toThrow('provide code or instrumented, not both');
  });
});

describe('Increment 3b — Type validation in embodify()', () => {
  it('throws when code is not a string', () => {
    expect(() => {
      embodify({ code: 123 as any });
    }).toThrow('code must be a string');
  });

  it('throws when instrumented is not a string', () => {
    expect(() => {
      embodify({ instrumented: 123 as any });
    }).toThrow('instrumented must be a string');
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

  it('lazy recomputes instrumented', () => {
    const e = embodify({ code: 'abc' }).instrument();
    const e2 = e.set({ config: cfg2 });
    expect(e2.instrumented).toBe('a b c');
  });

  it('lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ config: cfg2 });
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('does not mutate original', () => {
    const e = embodify({ code: 'abc' }).instrument().trace();
    e.set({ config: cfg2 });
    expect(e.instrumented).not.toBeNull();
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

  it('lazy recomputes instrumented', () => {
    const e = embodify({ code: 'abc' }).instrument();
    const e2 = e.mergeConfig({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e2.instrumented).toBe('a b c');
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

  it('lazy recomputes instrumented and steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ code: 'xy' });
    expect(e2.instrumented).toBe('x y');
    expect(e2.steps).toEqual([{}, {}]);
  });
});

describe('Increment 10b — .set({ instrumented })', () => {
  it('sets instrumented, preserves config', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    const e2 = e.set({ instrumented: 'x y' });
    expect(e2.instrumented).toBe('x y');
    expect(e2.config).toEqual(e.config);
  });

  it('code defaults to empty string', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ instrumented: 'x y' });
    expect(e2.code).toBe('');
  });

  it('lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ instrumented: 'x y' });
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

  it('throws when code and instrumented both given', () => {
    expect(() => {
      embodify().set({ code: 'x', instrumented: 'y' } as any);
    }).toThrow();
  });

  it('throws when code is not a string', () => {
    expect(() => {
      embodify().set({ code: 123 } as any);
    }).toThrow();
  });

  it('throws when instrumented is not a string', () => {
    expect(() => {
      embodify().set({ instrumented: 123 } as any);
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
  it('sets steps array, code and instrumented default', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    const e2 = e.set({ steps: [{}, {}, {}, {}] });
    expect(e2.steps).toEqual([{}, {}, {}, {}]);
    expect(e2.code).toBe('');
    expect(e2.instrumented).toBe('');
    expect(e2.config).toEqual(e.config);
  });

  it('auto-unpickles string steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ steps: '[{},{}]' });
    expect(e2.steps).toEqual([{}, {}]);
    expect(e2.code).toBe('');
    expect(e2.instrumented).toBe('');
  });
});

describe('Increment 14 — instrument()', () => {
  it('produces instrumented code from code', () => {
    const e = embodify({ code: 'abc' }).instrument();
    expect(e.instrumented).toBe('a b c');
  });

  it('preserves code (generated instrumented)', () => {
    const e = embodify({ code: 'abc' }).instrument();
    expect(e.code).toBe('abc');
  });

  it('lazy recomputes steps from new instrumented', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.steps).toEqual([{}, {}, {}]);
    const e2 = e.instrument();
    expect(e2.steps).toEqual([{}, {}, {}]);
  });
});

describe('Increment 15 — instrument() with config', () => {
  it('merges config override on chain config', () => {
    const e = embodify({ code: 'abc', config: {} }).instrument({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e.config.lang.bindings.events.read).toBe(false);
    expect(e.config.lang.bindings.events.assign).toBe(true);
  });

  it('uses default config when no chain or override config', () => {
    const e = embodify({ code: 'abc' }).instrument();
    const defaults = createConfig({});
    expect(e.config).toEqual(defaults);
  });
});

describe('Increment 16 — instrument() with no code', () => {
  it('instruments empty string when no code is set', () => {
    const e = embodify({}).instrument();
    expect(e.instrumented).toBe('');
    expect(e.code).toBe('');
  });

  it('instruments empty string when only instrumented is set', () => {
    const e = embodify({ instrumented: 'a b c' }).instrument();
    expect(e.instrumented).toBe('');
    expect(e.code).toBe('');
  });
});

describe('Increment 17 — trace() from code', () => {
  it('produces steps from code', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('produces instrumented from code', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.instrumented).toBe('a b c');
  });

  it('preserves code (generated internally)', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.code).toBe('abc');
  });
});

describe('Increment 18 — trace() from instrumented', () => {
  it('produces steps from instrumented', () => {
    const e = embodify({ instrumented: 'a b c' }).trace();
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('preserves instrumented', () => {
    const e = embodify({ instrumented: 'a b c' }).trace();
    expect(e.instrumented).toBe('a b c');
  });

  it('code defaults to empty string (no code to preserve)', () => {
    const e = embodify({ instrumented: 'a b c' }).trace();
    expect(e.code).toBe('');
  });
});

describe('Increment 19 — trace() reuses instrumented', () => {
  it('reuses instrumented from prior .instrument()', () => {
    const e = embodify({ code: 'abc' }).instrument();
    const e2 = e.trace();
    expect(e2.steps).toEqual([{}, {}, {}]);
    expect(e2.instrumented).toBe('a b c');
    expect(e2.code).toBe('abc');
  });
});

describe('Increment 20 — trace() with overrides', () => {
  it('overrides code', () => {
    const e = embodify({ code: 'abc' });
    const e2 = e.trace({ code: 'xy' });
    expect(e2.steps).toEqual([{}, {}]);
    expect(e2.instrumented).toBe('x y');
  });

  it('overrides with instrumented (skips instrument)', () => {
    const e = embodify({ code: 'abc' });
    const e2 = e.trace({ instrumented: 'x y' });
    expect(e2.steps).toEqual([{}, {}]);
    expect(e2.instrumented).toBe('x y');
  });

  it('instrumented override defaults code to empty string', () => {
    const e = embodify({ code: 'abc' });
    const e2 = e.trace({ instrumented: 'x y' });
    expect(e2.code).toBe('');
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
  it('traces empty when no code or instrumented available', () => {
    const e = embodify({}).trace();
    expect(e.steps).toEqual([]);
    expect(e.instrumented).toBe('');
    expect(e.code).toBe('');
  });

  it('throws when both code and instrumented overrides given', () => {
    expect(() => {
      embodify({}).trace({ code: 'a', instrumented: 'a' });
    }).toThrow('provide code or instrumented, not both');
  });
});

describe('Increment 22 — filterSteps()', () => {
  it('passes through steps (stub behavior)', () => {
    const e = embodify({ steps: [{}, {}, {}] }).filterSteps();
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('preserves code and instrumented from chain', () => {
    const e = embodify({ code: 'abc' }).trace().filterSteps();
    expect(e.steps).toEqual([{}, {}, {}]);
    expect(e.code).toBe('abc');
    expect(e.instrumented).toBe('a b c');
  });
});

describe('Increment 23 — filterSteps() with overrides', () => {
  it('overrides steps with array', () => {
    const e = embodify({ steps: [{}, {}] });
    const e2 = e.filterSteps({ steps: [{}, {}, {}] });
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('overrides steps with string (auto-unpickled)', () => {
    const e = embodify({ steps: [{}, {}] });
    const e2 = e.filterSteps({ steps: '[{},{},{},{}]' });
    expect(e2.steps).toEqual([{}, {}, {}, {}]);
  });

  it('merges config override', () => {
    const e = embodify({ steps: [{}, {}], config: {} });
    const e2 = e.filterSteps({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    expect(e2.config.lang.bindings.events.read).toBe(false);
    expect(e2.config.lang.bindings.events.assign).toBe(true);
  });
});

describe('Increment 24 — filterSteps() with no steps', () => {
  it('filters empty when no steps available', () => {
    const e = embodify({}).filterSteps();
    expect(e.steps).toEqual([]);
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

  it('instrument throws on invalid JSON config', () => {
    expect(() => embodify({ code: 'abc' }).instrument({ config: '{bad json' })).toThrow(
      'deserialize',
    );
  });

  it('filterSteps accepts JSON string config for merge', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    const e2 = e.filterSteps({
      config: '{"lang":{"bindings":{"events":{"read":false}}}}',
    });
    expect(e2.config.lang.bindings.events.read).toBe(false);
  });
});

describe('Increment 27 — Lazy recomputation verification', () => {
  it('.set({ code }) → lazy recomputes instrumented and steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ code: 'xy' });
    expect(e2.instrumented).toBe('x y');
    expect(e2.steps).toEqual([{}, {}]);
  });

  it('.set({ config }) → code preserved, lazy recomputes', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ config: {} });
    expect(e2.instrumented).toBe('a b c');
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('mergeConfig → code preserved, lazy recomputes', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.mergeConfig({ config: {} });
    expect(e2.instrumented).toBe('a b c');
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('.set({ instrumented }) → typed defaults + lazy steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ instrumented: 'x y' });
    expect(e2.code).toBe('');
    expect(e2.steps).toEqual([{}, {}]);
  });

  it('instrument() → lazy recomputes steps', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.instrument();
    expect(e2.instrumented).toBe('a b c');
    expect(e2.code).toBe('abc');
    expect(e2.steps).toEqual([{}, {}, {}]);
  });

  it('trace() → preserves code', () => {
    const e = embodify({ code: 'abc' }).trace();
    expect(e.code).toBe('abc');
    expect(e.instrumented).toBe('a b c');
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('.set({ steps }) → typed defaults for code and instrumented', () => {
    const e = embodify({ code: 'abc' }).trace();
    const e2 = e.set({ steps: [{}, {}] });
    expect(e2.code).toBe('');
    expect(e2.instrumented).toBe('');
  });

  it('filterSteps() → preserves code and instrumented', () => {
    const e = embodify({ code: 'abc' }).trace().filterSteps();
    expect(e.code).toBe('abc');
    expect(e.instrumented).toBe('a b c');
    expect(e.steps).toEqual([{}, {}, {}]);
  });
});

describe('Increment 28 — Immutability', () => {
  it('.set({ config }) does not mutate original', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    e.set({ config: { presets: 'overview' } });
    expect(e.code).toBe('abc');
    expect(e.steps).toEqual([{}, {}, {}]);
    expect(e.instrumented).toBe('a b c');
  });

  it('.set({ code }) does not mutate original', () => {
    const e = embodify({ code: 'abc' }).trace();
    e.set({ code: 'xy' });
    expect(e.code).toBe('abc');
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('.set({ instrumented }) does not mutate original', () => {
    const e = embodify({ code: 'abc' }).trace();
    e.set({ instrumented: 'x y' });
    expect(e.code).toBe('abc');
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('filterSteps does not mutate original', () => {
    const e = embodify({ code: 'abc' }).trace();
    e.filterSteps({ config: { presets: 'overview' } });
    expect(e.steps).toEqual([{}, {}, {}]);
    expect(e.code).toBe('abc');
  });

  it('mergeConfig does not mutate original', () => {
    const e = embodify({ code: 'abc', config: {} }).trace();
    e.mergeConfig({ config: { lang: { bindings: { events: { read: false } } } } });
    expect(e.config.lang.bindings.events.read).toBe(true);
    expect(e.instrumented).toBe('a b c');
  });
});

describe('Increment 29 — Full use cases A-I', () => {
  it('A. Trace + filter', () => {
    const e = embodify({ code: 'abc', config: {} })
      .trace()
      .filterSteps({ config: { presets: 'overview' } });
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('B. Deferred config', () => {
    const e = embodify({ code: 'abc' })
      .trace({ config: {} })
      .filterSteps({ config: { presets: 'overview' } });
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('C. Filter existing trace', () => {
    const e = embodify({ steps: [{}, {}] }).filterSteps({ config: {} });
    expect(e.steps).toEqual([{}, {}]);
  });

  it('D. Serialization round-trip', () => {
    const pickled = embodify({ steps: '[{},{},{}]', config: {} }).filterSteps().pickledSteps;
    expect(pickled).toBe('[{},{},{}]');
  });

  it('E. Granular pipeline control', () => {
    const e = embodify({ code: 'abc', config: {} }).instrument();
    expect(e.instrumented).toBe('a b c');
    const traced = e.trace();
    expect(traced.steps).toEqual([{}, {}, {}]);
  });

  it('F. Branch and compare', () => {
    const base = embodify({ code: 'abc', config: {} }).trace();
    const v1 = base.filterSteps({
      config: { lang: { bindings: { events: { read: false } } } },
    });
    const v2 = base.filterSteps({
      config: { lang: { bindings: { events: { assign: false } } } },
    });
    expect(v1.steps).toEqual([{}, {}, {}]);
    expect(v2.steps).toEqual([{}, {}, {}]);
    expect(v1.config.lang.bindings.events.read).toBe(false);
    expect(v2.config.lang.bindings.events.assign).toBe(false);
    expect(base.config.lang.bindings.events.read).toBe(true);
  });

  it('G. Batch processing', () => {
    const tracer = embodify({ config: {} });
    const results = ['abc', 'xy'].map((c) => tracer.trace({ code: c }).steps);
    expect(results[0]).toEqual([{}, {}, {}]);
    expect(results[1]).toEqual([{}, {}]);
  });

  it('H. Pre-instrumented code', () => {
    const e = embodify({ instrumented: 'a b c', config: {} }).trace();
    expect(e.steps).toEqual([{}, {}, {}]);
  });

  it('I. Update config mid-chain (lazy cascade after merge)', () => {
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
    expect(e.instrumented).toBe('');
  });

  it('single character code', () => {
    const e = embodify({ code: 'a' }).trace();
    expect(e.steps).toEqual([{}]);
  });

  it('single character instrument', () => {
    const e = embodify({ code: 'a' }).instrument();
    expect(e.instrumented).toBe('a');
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
