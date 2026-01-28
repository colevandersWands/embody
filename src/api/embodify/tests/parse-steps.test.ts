import parseSteps from '../parse-steps.js';

describe('parseSteps', () => {
  it('passes through an array', () => {
    const arr = [{}, {}, {}];
    expect(parseSteps(arr)).toBe(arr);
  });

  it('deserializes a JSON string', () => {
    expect(parseSteps('[{},{}]')).toEqual([{}, {}]);
  });

  it('deserializes an empty array string', () => {
    expect(parseSteps('[]')).toEqual([]);
  });
});
