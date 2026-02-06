import EmbodyError from '../embody-error.js';
import OptionsSchemaInvalidError from '../options-schema-invalid-error.js';

describe('OptionsSchemaInvalidError', () => {
  describe('inheritance', () => {
    it('is an instance of Error', () => {
      const error = new OptionsSchemaInvalidError('direction must be string');
      expect(error).toBeInstanceOf(Error);
    });

    it('is an instance of EmbodyError', () => {
      const error = new OptionsSchemaInvalidError('direction must be string');
      expect(error).toBeInstanceOf(EmbodyError);
    });

    it('is an instance of OptionsSchemaInvalidError', () => {
      const error = new OptionsSchemaInvalidError('direction must be string');
      expect(error).toBeInstanceOf(OptionsSchemaInvalidError);
    });
  });

  describe('properties', () => {
    it('has name set to "(EmbodyError) OptionsSchemaInvalidError"', () => {
      const error = new OptionsSchemaInvalidError('direction must be string');
      expect(error.name).toBe('(EmbodyError) OptionsSchemaInvalidError');
    });

    it('stores the provided message', () => {
      const error = new OptionsSchemaInvalidError('direction must be one of: lr, rl');
      expect(error.message).toBe('direction must be one of: lr, rl');
    });

    it('stores path when provided', () => {
      const error = new OptionsSchemaInvalidError('must be string', 'options.direction');
      expect(error.path).toBe('options.direction');
    });

    it('has undefined path when not provided', () => {
      const error = new OptionsSchemaInvalidError('must be string');
      expect(error.path).toBeUndefined();
    });
  });

  describe('ES2022 cause support', () => {
    it('stores cause when provided without path', () => {
      const cause = { allowedValues: ['lr', 'rl'] };
      const error = new OptionsSchemaInvalidError('must be string', undefined, { cause });
      expect(error.cause).toEqual(cause);
    });

    it('stores cause when provided with path', () => {
      const cause = { schema: { type: 'string' } };
      const error = new OptionsSchemaInvalidError('must be string', 'options.x', { cause });
      expect(error.cause).toEqual(cause);
    });

    it('has undefined cause when not provided', () => {
      const error = new OptionsSchemaInvalidError('must be string');
      expect(error.cause).toBeUndefined();
    });
  });
});
