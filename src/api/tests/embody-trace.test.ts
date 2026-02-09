import ArgumentInvalidError from '../../errors/argument-invalid-error.js';
import TracerUnknownError from '../../errors/tracer-unknown-error.js';
import embodyTrace from '../embody-trace.cjs';

describe('embodyTrace', () => {
  describe('argument overloading', () => {
    it('accepts 4 args (tracer, code, config, callback)', (done) => {
      embodyTrace('txt:chars', 'hello', {}, (error: unknown, result: unknown) => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
        done();
      });
    });

    it('accepts 3 args (tracer, code, callback - defaults config to {})', (done) => {
      // @ts-expect-error - TypeScript can't infer overloading from .cjs file
      embodyTrace('txt:chars', 'hello', (error: unknown, result: unknown) => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
        done();
      });
    });

    it('detects callback via typeof check (function config → callback)', (done) => {
      const callback = (error: unknown, result: unknown) => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
        done();
      };

      // Pass function as 3rd arg → should be detected as callback, config defaults to {}
      // @ts-expect-error - TypeScript can't infer overloading from .cjs file
      embodyTrace('txt:chars', 'hello', callback);
    });
  });

  describe('callback validation', () => {
    it('throws synchronously if callback is missing', () => {
      expect(() => {
        // @ts-expect-error - Testing invalid arguments
        embodyTrace('txt:chars', 'hello', {});
      }).toThrow('embodyTrace: expected callback to be a function');
    });

    it('throws synchronously if callback is not a function', () => {
      expect(() => {
        // @ts-expect-error - Testing invalid arguments
        embodyTrace('txt:chars', 'hello', {}, 'not-a-function');
      }).toThrow('embodyTrace: expected callback to be a function');
    });

    it('throws ArgumentInvalidError with field name', () => {
      expect(() => {
        // @ts-expect-error - Testing invalid arguments
        embodyTrace('txt:chars', 'hello', {}, null);
      }).toThrow(ArgumentInvalidError);
    });
  });

  describe('tracer validation', () => {
    it('delivers error asynchronously if tracer is not a string', (done) => {
      // @ts-expect-error - Testing invalid arguments
      embodyTrace(123, 'hello', {}, (error: unknown) => {
        expect(error).toBeInstanceOf(ArgumentInvalidError);
        expect((error as Error).message).toContain('tracer must be a non-empty string');
        done();
      });
    });

    it('delivers error asynchronously if tracer is empty string', (done) => {
      embodyTrace('', 'hello', {}, (error: unknown) => {
        expect(error).toBeInstanceOf(ArgumentInvalidError);
        expect((error as Error).message).toContain('tracer must be a non-empty string');
        done();
      });
    });

    it('delivers TracerUnknownError if tracer not in registry', (done) => {
      embodyTrace('unknown-tracer', 'hello', {}, (error: unknown) => {
        expect(error).toBeInstanceOf(TracerUnknownError);
        done();
      });
    });
  });

  describe('code validation', () => {
    it('delivers error asynchronously if code is not a string', (done) => {
      // @ts-expect-error - Testing invalid arguments
      embodyTrace('txt:chars', 123, {}, (error: unknown) => {
        expect(error).toBeInstanceOf(ArgumentInvalidError);
        expect((error as Error).message).toContain('expected code to be a string');
        done();
      });
    });

    it('allows empty string code', (done) => {
      embodyTrace('txt:chars', '', {}, (error: unknown, result: unknown) => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
        done();
      });
    });
  });

  describe('config validation', () => {
    it('delivers error asynchronously if config is not an object', (done) => {
      // @ts-expect-error - Testing invalid arguments
      embodyTrace('txt:chars', 'hello', 'not-an-object', (error: unknown) => {
        expect(error).toBeInstanceOf(ArgumentInvalidError);
        expect((error as Error).message).toContain('expected config to be an object');
        done();
      });
    });

    it('allows null config (coerces to empty object)', (done) => {
      // @ts-expect-error - Testing null config
      embodyTrace('txt:chars', 'hello', null, (error: unknown, result: unknown) => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
        done();
      });
    });
  });

  describe('error aggregation', () => {
    it('delivers single error when only one validation fails', (done) => {
      // @ts-expect-error - Testing invalid arguments
      embodyTrace(123, 'hello', {}, (error: unknown) => {
        expect(error).toBeInstanceOf(ArgumentInvalidError);
        expect((error as Error).message).toContain('tracer must be a non-empty string');
        done();
      });
    });

    it('delivers AggregateError when multiple validations fail', (done) => {
      // @ts-expect-error - Testing invalid arguments
      embodyTrace(123, 456, 'not-object', (error: unknown) => {
        expect(error).toBeInstanceOf(AggregateError);
        expect((error as AggregateError).errors).toHaveLength(3);
        done();
      });
    });

    it('AggregateError contains all individual errors', (done) => {
      // @ts-expect-error - Testing invalid arguments
      embodyTrace(123, 456, {}, (error: unknown) => {
        expect(error).toBeInstanceOf(AggregateError);
        const aggregate = error as AggregateError;
        expect(aggregate.errors[0]).toBeInstanceOf(ArgumentInvalidError);
        expect(aggregate.errors[1]).toBeInstanceOf(ArgumentInvalidError);
        done();
      });
    });
  });

  describe('success cases', () => {
    it('delivers result with steps array', (done) => {
      embodyTrace('txt:chars', 'hello', {}, (error: unknown, result: any) => {
        expect(error).toBeNull();
        expect(result.steps).toBeInstanceOf(Array);
        expect(result.steps.length).toBeGreaterThan(0);
        done();
      });
    });

    it('delivers result with resolved config', (done) => {
      embodyTrace('txt:chars', 'hello', {}, (error: unknown, result: any) => {
        expect(error).toBeNull();
        expect(result.config).toHaveProperty('meta');
        expect(result.config).toHaveProperty('options');
        done();
      });
    });

    it('delivers result with tracer and code', (done) => {
      embodyTrace('txt:chars', 'hello', {}, (error: unknown, result: any) => {
        expect(error).toBeNull();
        expect(result.tracer).toBe('txt:chars');
        expect(result.code).toBe('hello');
        done();
      });
    });

    it('merges user config with defaults', (done) => {
      embodyTrace(
        'txt:chars',
        'hi',
        { meta: { max: { steps: 50 } } },
        (error: unknown, result: any) => {
          expect(error).toBeNull();
          expect(result.config.meta.max.steps).toBe(50);
          done();
        },
      );
    });
  });
});
