import deserialize from '../deserialize.js';

describe('deserialize', () => {
  // --- No args ---

  it('returns both undefined when called with no args', () => {
    const result = deserialize();
    expect(result).toEqual({ steps: undefined, config: undefined });
  });

  // --- String inputs (JSON.parse) ---

  it('parses steps JSON string into Step array', () => {
    const result = deserialize({ steps: '[{},{},{}]' });
    expect(result.steps).toEqual([{}, {}, {}]);
    expect(result.config).toBeUndefined();
  });

  it('parses config JSON string into config object', () => {
    const result = deserialize({ config: '{"presets":"overview"}' });
    expect(result.config).toEqual({ presets: 'overview' });
    expect(result.steps).toBeUndefined();
  });

  it('parses both steps and config strings', () => {
    const result = deserialize({
      steps: '[{},{}]',
      config: '{"presets":"detailed"}',
    });
    expect(result.steps).toEqual([{}, {}]);
    expect(result.config).toEqual({ presets: 'detailed' });
  });

  it('parses empty array string to empty array', () => {
    const result = deserialize({ steps: '[]' });
    expect(result.steps).toEqual([]);
  });

  it('parses empty object string to empty object', () => {
    const result = deserialize({ config: '{}' });
    expect(result.config).toEqual({});
  });

  // --- Passthrough (already-parsed values) ---

  it('passes through steps array unchanged (same reference)', () => {
    const steps = [{}, {}, {}] as const;
    const result = deserialize({ steps });
    expect(result.steps).toBe(steps);
    expect(result.config).toBeUndefined();
  });

  it('passes through config object unchanged (same reference)', () => {
    const config = { presets: 'overview' as const };
    const result = deserialize({ config });
    expect(result.config).toBe(config);
    expect(result.steps).toBeUndefined();
  });

  it('passes through both already-parsed values', () => {
    const steps = [{}, {}] as const;
    const config = { presets: 'detailed' as const };
    const result = deserialize({ steps, config });
    expect(result.steps).toBe(steps);
    expect(result.config).toBe(config);
  });

  it('passes through empty array unchanged', () => {
    const steps: readonly object[] = [];
    const result = deserialize({ steps });
    expect(result.steps).toBe(steps);
  });

  it('passes through empty object unchanged', () => {
    const config = {};
    const result = deserialize({ config });
    expect(result.config).toBe(config);
  });

  // --- Errors (bad JSON) ---

  it('throws on invalid JSON for steps', () => {
    expect(() => deserialize({ steps: '{bad json' })).toThrow(
      'resolveSteps: invalid JSON for steps',
    );
  });

  it('throws on invalid JSON for config', () => {
    expect(() => deserialize({ config: '{bad json' })).toThrow(
      'deserialize: invalid JSON for config',
    );
  });

  // --- Errors (parsed but wrong shape) ---

  it('throws if parsed steps is not an array (string → object)', () => {
    expect(() => deserialize({ steps: '"hello"' })).toThrow(
      'validateSteps: expected steps to be an array',
    );
  });

  it('throws if parsed config is not a plain object (string → array)', () => {
    expect(() => deserialize({ config: '[1,2]' })).toThrow(
      'deserialize: expected config to be a plain object',
    );
  });

  it('throws if parsed config is null (string → null)', () => {
    expect(() => deserialize({ config: 'null' })).toThrow(
      'deserialize: expected config to be a plain object',
    );
  });

  it('throws if steps items are not objects (string → array of primitives)', () => {
    expect(() => deserialize({ steps: '[1, "two"]' })).toThrow(
      'validateSteps: expected every step to be an object',
    );
  });

  // --- Errors (wrong type entirely) ---

  it('throws if steps is a number', () => {
    expect(() => deserialize({ steps: 42 as any })).toThrow(
      'resolveSteps: expected steps to be a string or array',
    );
  });

  it('throws if config is a number', () => {
    expect(() => deserialize({ config: 42 as any })).toThrow(
      'deserialize: expected config to be a string or object',
    );
  });

  it('throws if config is null (direct)', () => {
    expect(() => deserialize({ config: null as any })).toThrow(
      'deserialize: expected config to be a plain object',
    );
  });

  it('throws if config is an array (direct)', () => {
    expect(() => deserialize({ config: [1, 2] as any })).toThrow(
      'deserialize: expected config to be a plain object',
    );
  });
});
