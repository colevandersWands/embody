import ConfigInvalidError from '../config-invalid-error.js';
import EmbodyError from '../embody-error.js';

describe('ConfigInvalidError', () => {
  describe('inheritance', () => {
    it('is an instance of Error', () => {
      const error = new ConfigInvalidError('lang', 'Expected string');
      expect(error).toBeInstanceOf(Error);
    });

    it('is an instance of EmbodyError', () => {
      const error = new ConfigInvalidError('lang', 'Expected string');
      expect(error).toBeInstanceOf(EmbodyError);
    });

    it('is an instance of ConfigInvalidError', () => {
      const error = new ConfigInvalidError('lang', 'Expected string');
      expect(error).toBeInstanceOf(ConfigInvalidError);
    });
  });

  describe('properties', () => {
    it('has name set to "(EmbodyError) ConfigInvalidError"', () => {
      const error = new ConfigInvalidError('lang', 'Expected string');
      expect(error.name).toBe('(EmbodyError) ConfigInvalidError');
    });

    it('stores the provided message', () => {
      const error = new ConfigInvalidError('lang', 'Expected lang to be string, got number');
      expect(error.message).toBe('Expected lang to be string, got number');
    });

    it('stores the field that was invalid', () => {
      const error = new ConfigInvalidError('code', 'Expected code to be string');
      expect(error.field).toBe('code');
    });
  });

  describe('ES2022 cause support', () => {
    it('stores cause when provided', () => {
      const cause = { provided: 123, expected: 'string' };
      const error = new ConfigInvalidError('lang', 'Expected string', { cause });
      expect(error.cause).toEqual(cause);
    });

    it('has undefined cause when not provided', () => {
      const error = new ConfigInvalidError('lang', 'Expected string');
      expect(error.cause).toBeUndefined();
    });
  });
});
