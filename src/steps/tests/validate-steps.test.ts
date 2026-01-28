import validateSteps from '../validate-steps.js';

describe('validateSteps', () => {
  // --- Valid inputs ---

  it('validates array of objects and returns same reference', () => {
    const steps = [{}, { type: 'test' }, { a: 1 }];
    expect(validateSteps(steps)).toBe(steps);
  });

  it('validates empty array and returns same reference', () => {
    const steps: object[] = [];
    expect(validateSteps(steps)).toBe(steps);
  });

  // --- Not an array ---

  it('throws if not an array (string)', () => {
    expect(() => validateSteps('hello')).toThrow(
      'validateSteps: expected steps to be an array, got string',
    );
  });

  it('throws if not an array (object)', () => {
    expect(() => validateSteps({ a: 1 })).toThrow(
      'validateSteps: expected steps to be an array, got object',
    );
  });

  it('throws if not an array (number)', () => {
    expect(() => validateSteps(42)).toThrow(
      'validateSteps: expected steps to be an array, got number',
    );
  });

  it('throws if not an array (null)', () => {
    expect(() => validateSteps(null)).toThrow(
      'validateSteps: expected steps to be an array, got object',
    );
  });

  // --- Array with invalid elements ---

  it('throws if element is a number', () => {
    expect(() => validateSteps([42])).toThrow(
      'validateSteps: expected every step to be an object, got number at index 0',
    );
  });

  it('throws if element is null', () => {
    expect(() => validateSteps([null])).toThrow(
      'validateSteps: expected every step to be an object, got null at index 0',
    );
  });

  it('throws if element is a string', () => {
    expect(() => validateSteps(['hello'])).toThrow(
      'validateSteps: expected every step to be an object, got string at index 0',
    );
  });

  it('reports correct index for bad element in middle of array', () => {
    expect(() => validateSteps([{}, {}, 'bad', {}])).toThrow(
      'validateSteps: expected every step to be an object, got string at index 2',
    );
  });
});
