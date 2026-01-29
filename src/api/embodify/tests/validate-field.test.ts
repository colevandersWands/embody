import validateField from '../validate-field.js';

describe('validateField', () => {
  describe('code', () => {
    it('accepts a string', () => {
      expect(() => validateField('code', 'hello')).not.toThrow();
    });

    it('throws for a number', () => {
      expect(() => validateField('code', 123)).toThrow('code must be a string');
    });

    it('throws for null', () => {
      expect(() => validateField('code', null)).toThrow('code must be a string');
    });
  });

  describe('instrumented', () => {
    it('accepts a string', () => {
      expect(() => validateField('instrumented', 'a b c')).not.toThrow();
    });

    it('throws for a number', () => {
      expect(() => validateField('instrumented', 42)).toThrow('instrumented must be a string');
    });
  });

  describe('config', () => {
    it('accepts a plain object', () => {
      expect(() => validateField('config', {})).not.toThrow();
    });

    it('accepts a JSON string', () => {
      expect(() => validateField('config', '{}')).not.toThrow();
    });

    it('throws for a number', () => {
      expect(() => validateField('config', 123)).toThrow(
        'config must be a plain object or JSON string',
      );
    });

    it('throws for null', () => {
      expect(() => validateField('config', null)).toThrow(
        'config must be a plain object or JSON string',
      );
    });

    it('throws for an array', () => {
      expect(() => validateField('config', [])).toThrow(
        'config must be a plain object or JSON string',
      );
    });
  });

  describe('steps', () => {
    it('accepts an array', () => {
      expect(() => validateField('steps', [{}, {}])).not.toThrow();
    });

    it('accepts a JSON string', () => {
      expect(() => validateField('steps', '[{},{}]')).not.toThrow();
    });

    it('throws for a number', () => {
      expect(() => validateField('steps', 123)).toThrow('steps must be an array or JSON string');
    });
  });

  describe('unknown key', () => {
    it('does not throw for unrecognized key', () => {
      expect(() => validateField('unknown', 42)).not.toThrow();
    });
  });
});
