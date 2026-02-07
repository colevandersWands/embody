import EmbodyError from '../embody-error.js';
import TracerUnknownError from '../tracer-unknown-error.js';

describe('TracerUnknownError', () => {
  describe('inheritance', () => {
    it('is an instance of Error', () => {
      const error = new TracerUnknownError('unknown-tracer');
      expect(error).toBeInstanceOf(Error);
    });

    it('is an instance of EmbodyError', () => {
      const error = new TracerUnknownError('unknown-tracer');
      expect(error).toBeInstanceOf(EmbodyError);
    });

    it('is an instance of TracerUnknownError', () => {
      const error = new TracerUnknownError('unknown-tracer');
      expect(error).toBeInstanceOf(TracerUnknownError);
    });
  });

  describe('properties', () => {
    it('has name set to "(EmbodyError) TracerUnknownError"', () => {
      const error = new TracerUnknownError('unknown-tracer');
      expect(error.name).toBe('(EmbodyError) TracerUnknownError');
    });

    it('auto-generates message from tracer', () => {
      const error = new TracerUnknownError('foo');
      expect(error.message).toBe("Unknown tracer 'foo'");
    });

    it('stores the tracer that was requested', () => {
      const error = new TracerUnknownError('js:custom');
      expect(error.tracer).toBe('js:custom');
    });
  });

  describe('ES2022 cause support', () => {
    it('stores cause when provided', () => {
      const cause = { available: ['chars', 'js:klve'] };
      const error = new TracerUnknownError('foo', { cause });
      expect(error.cause).toEqual(cause);
    });

    it('has undefined cause when not provided', () => {
      const error = new TracerUnknownError('foo');
      expect(error.cause).toBeUndefined();
    });
  });
});
