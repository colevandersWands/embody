import parseConfig from '../parse-config.js';

describe('parseConfig', () => {
  it('passes through a plain object', () => {
    const obj = { presets: 'overview' };
    expect(parseConfig(obj)).toBe(obj);
  });

  it('parses a valid JSON string', () => {
    expect(parseConfig('{"presets":"overview"}')).toEqual({
      presets: 'overview',
    });
  });

  it('throws on invalid JSON config', () => {
    expect(() => parseConfig('{bad json')).toThrow('deserialize');
  });

  it('returns empty object for null', () => {
    expect(parseConfig(null)).toEqual({});
  });

  it('returns empty object for undefined', () => {
    expect(parseConfig(undefined)).toEqual({});
  });

  it('parses empty JSON object string', () => {
    expect(parseConfig('{}')).toEqual({});
  });
});
