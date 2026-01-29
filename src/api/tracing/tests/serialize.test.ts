import serialize from '../serialize.js';

describe('serialize', () => {
  describe('steps', () => {
    it('serializes empty array to "[]"', () => {
      expect(serialize({ steps: [] })).toBe('[]');
    });

    it('serializes step array to JSON string', () => {
      const steps = [{}, {}, {}] as any[];
      const result = serialize({ steps });
      expect(result).toBe('[{},{},{}]');
    });

    it('round-trips with JSON.parse', () => {
      const steps = [{ type: 'test' }, { type: 'other' }] as any[];
      const serialized = serialize({ steps });
      const parsed = JSON.parse(serialized);
      expect(parsed).toEqual(steps);
    });

    it('throws if steps is not an array', () => {
      expect(() => serialize({ steps: 42 as any })).toThrow('serialize');
      expect(() => serialize({ steps: 'not array' as any })).toThrow('serialize');
      expect(() => serialize({ steps: {} as any })).toThrow('serialize');
    });
  });

  describe('config', () => {
    it('serializes config object to JSON string', () => {
      const config = { presets: 'overview' } as any;
      const result = serialize({ config });
      expect(result).toBe('{"presets":"overview"}');
    });

    it('serializes empty config to "{}"', () => {
      expect(serialize({ config: {} as any })).toBe('{}');
    });

    it('round-trips with JSON.parse', () => {
      const config = { presets: 'detailed', lang: { bindings: true } } as any;
      const serialized = serialize({ config });
      const parsed = JSON.parse(serialized);
      expect(parsed).toEqual(config);
    });

    it('throws if config is not a plain object', () => {
      expect(() => serialize({ config: 42 as any })).toThrow('serialize');
      expect(() => serialize({ config: 'string' as any })).toThrow('serialize');
      expect(() => serialize({ config: null as any })).toThrow('serialize');
      expect(() => serialize({ config: [] as any })).toThrow('serialize');
      expect(() => serialize({ config: true as any })).toThrow('serialize');
    });
  });

  describe('no input', () => {
    it('throws if neither steps nor config is provided', () => {
      expect(() => serialize()).toThrow('serialize');
      expect(() => serialize({} as any)).toThrow('serialize');
    });
  });
});
