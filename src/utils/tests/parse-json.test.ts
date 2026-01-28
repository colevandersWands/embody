import parseJSON from '../parse-json.js';

describe('parseJSON', () => {
  // --- Valid JSON ---

  it('parses valid JSON object string', () => {
    expect(parseJSON('{"a":1}', 'test')).toEqual({ a: 1 });
  });

  it('parses valid JSON array string', () => {
    expect(parseJSON('[1,2,3]', 'test')).toEqual([1, 2, 3]);
  });

  it('parses JSON string primitive', () => {
    expect(parseJSON('"hello"', 'test')).toBe('hello');
  });

  it('parses null JSON', () => {
    expect(parseJSON('null', 'test')).toBeNull();
  });

  it('parses true JSON', () => {
    expect(parseJSON('true', 'test')).toBe(true);
  });

  it('parses numeric JSON', () => {
    expect(parseJSON('42', 'test')).toBe(42);
  });

  it('parses empty array string', () => {
    expect(parseJSON('[]', 'test')).toEqual([]);
  });

  it('parses empty object string', () => {
    expect(parseJSON('{}', 'test')).toEqual({});
  });

  // --- Invalid JSON ---

  it('throws on invalid JSON with errorPrefix in message', () => {
    expect(() => parseJSON('{bad json', 'myFunction: invalid JSON for config')).toThrow(
      'myFunction: invalid JSON for config',
    );
  });

  it('throws on empty string with errorPrefix in message', () => {
    expect(() => parseJSON('', 'myFunction: invalid JSON for steps')).toThrow(
      'myFunction: invalid JSON for steps',
    );
  });

  it('error message includes original parse error detail', () => {
    try {
      parseJSON('{bad}', 'test prefix');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      const message = (error as Error).message;
      // Should start with the prefix
      expect(message).toMatch(/^test prefix/);
      // Should contain the em dash separator
      expect(message).toContain(' — ');
      // Should contain some parse error detail (varies by engine)
      expect(message.length).toBeGreaterThan('test prefix — '.length);
    }
  });
});
