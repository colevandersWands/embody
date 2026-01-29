import pickles from '../pickles.js';

describe('pickles', () => {
  describe('steps (existing behavior)', () => {
    it('array steps → serialized string', () => {
      const result = pickles({ steps: [{}, {}, {}] as any[] });
      expect(result).toEqual({ steps: '[{},{},{}]' });
    });

    it('string steps → deserialized array', () => {
      const result = pickles({ steps: '[{},{},{}]' });
      expect(result).toEqual({ steps: [{}, {}, {}] });
    });

    it('empty array → "[]"', () => {
      const result = pickles({ steps: [] });
      expect(result).toEqual({ steps: '[]' });
    });

    it('empty string "[]" → []', () => {
      const result = pickles({ steps: '[]' });
      expect(result).toEqual({ steps: [] });
    });

    describe('wrong type steps → throws', () => {
      it('number → throws', () => {
        expect(() => pickles({ steps: 42 as any })).toThrow('pickles');
      });

      it('boolean → throws', () => {
        expect(() => pickles({ steps: true as any })).toThrow('pickles');
      });

      it('object → throws', () => {
        expect(() => pickles({ steps: {} as any })).toThrow('pickles');
      });
    });

    describe('invalid JSON string steps → throws', () => {
      it('malformed JSON → throws', () => {
        expect(() => pickles({ steps: '{bad json' })).toThrow('resolveSteps');
      });

      it('non-JSON string → throws', () => {
        expect(() => pickles({ steps: 'not json' })).toThrow('resolveSteps');
      });
    });
  });

  describe('config', () => {
    it('config object → serialized string', () => {
      const result = pickles({ config: { presets: 'overview' } as any });
      expect(result).toEqual({ config: '{"presets":"overview"}' });
    });

    it('empty config object → "{}"', () => {
      const result = pickles({ config: {} as any });
      expect(result).toEqual({ config: '{}' });
    });

    it('config string → deserialized object', () => {
      const result = pickles({ config: '{"presets":"overview"}' });
      expect(result).toEqual({ config: { presets: 'overview' } });
    });

    it('empty config string "{}" → {}', () => {
      const result = pickles({ config: '{}' });
      expect(result).toEqual({ config: {} });
    });

    it('config-only result has no steps key', () => {
      const result = pickles({ config: { presets: 'overview' } as any });
      expect(result).not.toHaveProperty('steps');
    });

    describe('wrong type config → throws', () => {
      it('number → throws', () => {
        expect(() => pickles({ config: 42 as any })).toThrow('pickles');
      });

      it('null → throws', () => {
        expect(() => pickles({ config: null as any })).toThrow('pickles');
      });

      it('array → throws', () => {
        expect(() => pickles({ config: [] as any })).toThrow('pickles');
      });

      it('boolean → throws', () => {
        expect(() => pickles({ config: true as any })).toThrow('pickles');
      });
    });

    it('invalid JSON string config → throws', () => {
      expect(() => pickles({ config: '{bad json' })).toThrow('deserialize');
    });
  });

  describe('combined (steps + config)', () => {
    it('both arrays/objects → both serialized', () => {
      const result = pickles({
        steps: [{}, {}] as any[],
        config: { presets: 'overview' } as any,
      });
      expect(result).toEqual({
        steps: '[{},{}]',
        config: '{"presets":"overview"}',
      });
    });

    it('both strings → both deserialized', () => {
      const result = pickles({
        steps: '[{},{}]',
        config: '{"presets":"overview"}',
      });
      expect(result).toEqual({
        steps: [{}, {}],
        config: { presets: 'overview' },
      });
    });

    it('steps array + config string → steps serialized, config deserialized', () => {
      const result = pickles({
        steps: [{}, {}] as any[],
        config: '{"presets":"overview"}',
      });
      expect(result).toEqual({
        steps: '[{},{}]',
        config: { presets: 'overview' },
      });
    });

    it('steps string + config object → steps deserialized, config serialized', () => {
      const result = pickles({
        steps: '[{},{}]',
        config: { presets: 'overview' } as any,
      });
      expect(result).toEqual({
        steps: [{}, {}],
        config: '{"presets":"overview"}',
      });
    });

    describe('combined result structure', () => {
      it('has steps key', () => {
        const result = pickles({
          steps: [{}, {}] as any[],
          config: { presets: 'overview' } as any,
        });
        expect(result).toHaveProperty('steps');
      });

      it('has config key', () => {
        const result = pickles({
          steps: [{}, {}] as any[],
          config: { presets: 'overview' } as any,
        });
        expect(result).toHaveProperty('config');
      });
    });
  });

  describe('validation', () => {
    it('no args → throws', () => {
      expect(() => pickles()).toThrow('pickles');
    });

    it('empty object → throws', () => {
      expect(() => pickles({} as any)).toThrow('pickles');
    });

    it('both undefined → throws', () => {
      expect(() => pickles({ steps: undefined, config: undefined })).toThrow('pickles');
    });
  });
});
