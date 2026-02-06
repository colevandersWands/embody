import EmbodyError from '../embody-error.js';
import LangUnknownError from '../lang-unknown-error.js';

describe('LangUnknownError', () => {
  describe('inheritance', () => {
    it('is an instance of Error', () => {
      const error = new LangUnknownError('unknown-lang');
      expect(error).toBeInstanceOf(Error);
    });

    it('is an instance of EmbodyError', () => {
      const error = new LangUnknownError('unknown-lang');
      expect(error).toBeInstanceOf(EmbodyError);
    });

    it('is an instance of LangUnknownError', () => {
      const error = new LangUnknownError('unknown-lang');
      expect(error).toBeInstanceOf(LangUnknownError);
    });
  });

  describe('properties', () => {
    it('has name set to "(EmbodyError) LangUnknownError"', () => {
      const error = new LangUnknownError('unknown-lang');
      expect(error.name).toBe('(EmbodyError) LangUnknownError');
    });

    it('auto-generates message from lang', () => {
      const error = new LangUnknownError('foo');
      expect(error.message).toBe("Unknown language 'foo'");
    });

    it('stores the lang that was requested', () => {
      const error = new LangUnknownError('python');
      expect(error.lang).toBe('python');
    });
  });

  describe('ES2022 cause support', () => {
    it('stores cause when provided', () => {
      const cause = { available: ['chars', 'js'] };
      const error = new LangUnknownError('foo', { cause });
      expect(error.cause).toEqual(cause);
    });

    it('has undefined cause when not provided', () => {
      const error = new LangUnknownError('foo');
      expect(error.cause).toBeUndefined();
    });
  });
});
