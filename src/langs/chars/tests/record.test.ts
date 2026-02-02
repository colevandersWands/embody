import record from '../record.js';
import type { CharsEvents } from '../types.js';

const defaultConfig: CharsEvents = {
  remove: [],
  replace: {},
  direction: 'lr',
};

// Error message patterns for validation tests
const ERROR_REMOVE_ARRAY = 'remove must be an array';
const ERROR_REPLACE_OBJECT = 'replace must be an object';
const ERROR_DIRECTION_INVALID = "direction must be 'lr' or 'rl'";
const DIRECTION_LR = 'lr' as const;

// Typed wrapper for expect.objectContaining to satisfy TypeScript
function errorWith(properties: Record<string, unknown>): Error {
  return expect.objectContaining(properties) as unknown as Error;
}

describe('record', () => {
  describe('basic traversal', () => {
    it('produces complete trace with all step properties', () => {
      const steps = record('ab', defaultConfig);
      expect(steps).toEqual([
        { step: 1, loc: { line: 1, column: 1 }, char: 'a' },
        { step: 2, loc: { line: 1, column: 2 }, char: 'b' },
      ]);
    });

    it('produces one step per character', () => {
      const steps = record('abc', defaultConfig);
      expect(steps).toHaveLength(3);
    });

    it('returns empty array for empty string', () => {
      const steps = record('', defaultConfig);
      expect(steps).toHaveLength(0);
    });

    it('assigns sequential step numbers starting at 1', () => {
      const steps = record('abc', defaultConfig);
      expect(steps.map((s) => s.step)).toEqual([1, 2, 3]);
    });

    it('assigns 1-indexed column positions', () => {
      const steps = record('abc', defaultConfig);
      expect(steps.map((s) => s.loc.column)).toEqual([1, 2, 3]);
    });

    it('sets line to 1 for all characters', () => {
      const steps = record('abc', defaultConfig);
      expect(steps.every((s) => s.loc.line === 1)).toBe(true);
    });

    it('captures the character at each position', () => {
      const steps = record('abc', defaultConfig);
      expect(steps.map((s) => s.char)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('direction', () => {
    it('traverses left-to-right with lr direction', () => {
      const steps = record('abc', { ...defaultConfig, direction: 'lr' });
      expect(steps.map((s) => s.char)).toEqual(['a', 'b', 'c']);
    });

    it('traverses right-to-left with rl direction', () => {
      const steps = record('abc', { ...defaultConfig, direction: 'rl' });
      expect(steps.map((s) => s.char)).toEqual(['c', 'b', 'a']);
    });

    it('assigns sequential column positions with rl direction', () => {
      const steps = record('abc', { ...defaultConfig, direction: 'rl' });
      expect(steps.map((s) => s.loc.column)).toEqual([1, 2, 3]);
    });

    it('assigns step numbers in traversal order with rl', () => {
      const steps = record('abc', { ...defaultConfig, direction: 'rl' });
      expect(steps[0].step).toBe(1);
      expect(steps[0].char).toBe('c');
    });
  });

  describe('remove filter', () => {
    it('excludes characters in remove array', () => {
      const steps = record('abc', { ...defaultConfig, remove: ['b'] });
      expect(steps.map((s) => s.char)).toEqual(['a', 'c']);
    });

    it('excludes multiple characters', () => {
      const steps = record('abcd', { ...defaultConfig, remove: ['a', 'c'] });
      expect(steps.map((s) => s.char)).toEqual(['b', 'd']);
    });

    it('renumbers steps after removal', () => {
      const steps = record('abc', { ...defaultConfig, remove: ['b'] });
      expect(steps.map((s) => s.step)).toEqual([1, 2]);
    });

    it('preserves original column positions after removal', () => {
      const steps = record('abc', { ...defaultConfig, remove: ['b'] });
      expect(steps.map((s) => s.loc.column)).toEqual([1, 3]);
    });
  });

  describe('replace filter', () => {
    it('substitutes characters according to replace map', () => {
      const steps = record('abc', { ...defaultConfig, replace: { a: 'x' } });
      expect(steps.map((s) => s.char)).toEqual(['x', 'b', 'c']);
    });

    it('applies multiple replacements', () => {
      const steps = record('abc', {
        ...defaultConfig,
        replace: { a: 'x', c: 'z' },
      });
      expect(steps.map((s) => s.char)).toEqual(['x', 'b', 'z']);
    });

    it('preserves column positions after replacement', () => {
      const steps = record('abc', { ...defaultConfig, replace: { a: 'x' } });
      expect(steps.map((s) => s.loc.column)).toEqual([1, 2, 3]);
    });
  });

  describe('combined filters', () => {
    it('applies remove before replace (removes original char)', () => {
      const steps = record('abc', {
        ...defaultConfig,
        remove: ['a'],
        replace: { a: 'x' },
      });
      expect(steps.map((s) => s.char)).toEqual(['b', 'c']);
    });

    it('combines direction with remove', () => {
      const steps = record('abc', {
        ...defaultConfig,
        direction: 'rl',
        remove: ['b'],
      });
      expect(steps.map((s) => s.char)).toEqual(['c', 'a']);
    });

    it('combines direction with replace', () => {
      const steps = record('abc', {
        ...defaultConfig,
        direction: 'rl',
        replace: { a: 'x' },
      });
      expect(steps.map((s) => s.char)).toEqual(['c', 'b', 'x']);
    });
  });

  describe('special characters', () => {
    it('handles newlines as characters', () => {
      const steps = record('a\nb', defaultConfig);
      expect(steps).toHaveLength(3);
      expect(steps[1].char).toBe('\n');
    });

    it('handles spaces', () => {
      const steps = record('a b', defaultConfig);
      expect(steps[1].char).toBe(' ');
    });

    it('handles unicode characters', () => {
      const steps = record('añb', defaultConfig);
      expect(steps).toHaveLength(3);
      expect(steps[1].char).toBe('ñ');
    });
  });

  describe('error handling', () => {
    describe('PARSE_ERROR (interrobang)', () => {
      it('throws PARSE_ERROR for interrobang character', () => {
        expect(() => record('ab‽cd', defaultConfig)).toThrow('Unexpected interrobang');
      });

      it('includes PARSE_ERROR code', () => {
        expect(() => record('ab‽cd', defaultConfig)).toThrow(errorWith({ code: 'PARSE_ERROR' }));
      });

      it('includes location at column 3 for ab‽cd', () => {
        expect(() => record('ab‽cd', defaultConfig)).toThrow(
          errorWith({ loc: { line: 1, column: 3 } }),
        );
      });

      it('includes location at column 1 when interrobang is first', () => {
        expect(() => record('‽abc', defaultConfig)).toThrow(
          errorWith({ loc: { line: 1, column: 1 } }),
        );
      });
    });

    describe('RUNTIME_ERROR (emoji)', () => {
      it('throws RUNTIME_ERROR for emoji character', () => {
        expect(() => record('ab🎉cd', defaultConfig)).toThrow(/emoji not allowed/i);
      });

      it('includes RUNTIME_ERROR code', () => {
        expect(() => record('ab🎉cd', defaultConfig)).toThrow(errorWith({ code: 'RUNTIME_ERROR' }));
      });

      it('includes location at column 3 for ab🎉cd', () => {
        expect(() => record('ab🎉cd', defaultConfig)).toThrow(
          errorWith({ loc: { line: 1, column: 3 } }),
        );
      });

      it('throws for grinning face emoji', () => {
        expect(() => record('a😀b', defaultConfig)).toThrow(/emoji not allowed/i);
      });

      it('throws for heart emoji', () => {
        expect(() => record('a❤️b', defaultConfig)).toThrow(/emoji not allowed/i);
      });

      it('throws for rocket emoji', () => {
        expect(() => record('a🚀b', defaultConfig)).toThrow(/emoji not allowed/i);
      });
    });

    describe('LIMIT_EXCEEDED (maxLength)', () => {
      it('throws LIMIT_EXCEEDED when code exceeds maxLength', () => {
        const config = { ...defaultConfig, maxLength: 3 };
        expect(() => record('abcd', config)).toThrow('exceeds maxLength');
      });

      it('allows code at exactly maxLength', () => {
        const config = { ...defaultConfig, maxLength: 3 };
        const steps = record('abc', config);
        expect(steps).toHaveLength(3);
      });

      it('includes LIMIT_EXCEEDED code', () => {
        const config = { ...defaultConfig, maxLength: 2 };
        expect(() => record('abcd', config)).toThrow(errorWith({ code: 'LIMIT_EXCEEDED' }));
      });

      it('includes actual length in error message', () => {
        const config = { ...defaultConfig, maxLength: 2 };
        expect(() => record('abcd', config)).toThrow(/4/);
      });

      it('includes maxLength limit in error message', () => {
        const config = { ...defaultConfig, maxLength: 2 };
        expect(() => record('abcd', config)).toThrow(/2/);
      });

      it('does not check maxLength when undefined', () => {
        const steps = record('a'.repeat(1000), defaultConfig);
        expect(steps).toHaveLength(1000);
      });
    });

    describe('EVENTS_INVALID (config validation)', () => {
      describe('config object', () => {
        it('throws for null config', () => {
          expect(() => record('abc', null as unknown as CharsEvents)).toThrow(
            'events must be an object',
          );
        });

        it('throws for non-object config', () => {
          expect(() => record('abc', 'string' as unknown as CharsEvents)).toThrow(
            'events must be an object',
          );
        });

        it('includes EVENTS_INVALID code for null config', () => {
          expect(() => record('abc', null as unknown as CharsEvents)).toThrow(
            errorWith({ code: 'EVENTS_INVALID' }),
          );
        });
      });

      describe('single field errors', () => {
        it('throws when only remove is invalid', () => {
          const config = {
            remove: 'not-array',
            replace: {},
            direction: DIRECTION_LR,
          } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_REMOVE_ARRAY);
        });

        it('throws when only replace is invalid', () => {
          const config = {
            remove: [],
            replace: null,
            direction: DIRECTION_LR,
          } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_REPLACE_OBJECT);
        });

        it('throws when only direction is invalid', () => {
          const config = {
            remove: [],
            replace: {},
            direction: 'up',
          } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_DIRECTION_INVALID);
        });
      });

      describe('multiple field errors', () => {
        it('includes all errors when all fields are invalid', () => {
          const config = {} as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_REMOVE_ARRAY);
          expect(() => record('abc', config)).toThrow(ERROR_REPLACE_OBJECT);
          expect(() => record('abc', config)).toThrow(ERROR_DIRECTION_INVALID);
        });

        it('includes errors for remove and replace when both invalid', () => {
          const config = {
            remove: 'bad',
            replace: 'bad',
            direction: DIRECTION_LR,
          } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_REMOVE_ARRAY);
          expect(() => record('abc', config)).toThrow(ERROR_REPLACE_OBJECT);
        });

        it('includes errors for remove and direction when both invalid', () => {
          const config = {
            remove: 'bad',
            replace: {},
            direction: 'bad',
          } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_REMOVE_ARRAY);
          expect(() => record('abc', config)).toThrow(ERROR_DIRECTION_INVALID);
        });

        it('includes errors for replace and direction when both invalid', () => {
          const config = {
            remove: [],
            replace: null,
            direction: 'bad',
          } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(ERROR_REPLACE_OBJECT);
          expect(() => record('abc', config)).toThrow(ERROR_DIRECTION_INVALID);
        });
      });

      describe('error code', () => {
        it('includes EVENTS_INVALID code for any field error', () => {
          const config = { remove: [], replace: {} } as unknown as CharsEvents;
          expect(() => record('abc', config)).toThrow(errorWith({ code: 'EVENTS_INVALID' }));
        });
      });
    });
  });
});
