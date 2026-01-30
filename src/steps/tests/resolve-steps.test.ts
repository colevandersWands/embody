import resolveSteps from '../resolve-steps.js';

describe('resolveSteps', () => {
  // --- Undefined ---

  it('returns undefined when steps is undefined', () => {
    expect(resolveSteps()).toBeUndefined();
  });

  // --- String inputs (JSON.parse + validate) ---

  it('parses JSON string into validated Step array', () => {
    const result = resolveSteps('[{},{},{}]');
    expect(result).toEqual([{}, {}, {}]);
  });

  it('parses empty array string', () => {
    expect(resolveSteps('[]')).toEqual([]);
  });

  // --- Passthrough (array inputs) ---

  it('passes through array unchanged (same reference)', () => {
    const steps = [{}, { type: 'test' }, {}] as const;
    expect(resolveSteps(steps)).toBe(steps);
  });

  it('passes through empty array unchanged (same reference)', () => {
    const steps: readonly object[] = [];
    expect(resolveSteps(steps)).toBe(steps);
  });

  // --- Errors (invalid JSON) ---

  it('throws on invalid JSON string', () => {
    expect(() => resolveSteps('{bad json')).toThrow('resolveSteps: invalid JSON for steps');
  });

  // --- Errors (parsed but wrong shape) ---

  it('throws if parsed JSON is not an array', () => {
    expect(() => resolveSteps('"hello"')).toThrow('validateSteps: expected steps to be an array');
  });

  it('throws if step elements are not objects', () => {
    expect(() => resolveSteps('[1, "two"]')).toThrow(
      'validateSteps: expected every step to be an object',
    );
  });

  // --- Errors (wrong type entirely) ---

  it('throws if steps is a number', () => {
    expect(() => resolveSteps(42 as any)).toThrow(
      'resolveSteps: expected steps to be a string or array, got number',
    );
  });

  it('throws if steps is a boolean', () => {
    expect(() => resolveSteps(true as any)).toThrow(
      'resolveSteps: expected steps to be a string or array, got boolean',
    );
  });
});
