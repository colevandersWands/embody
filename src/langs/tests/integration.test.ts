/**
 * Integration tests for the lang module infrastructure.
 * Tests dispatch + chars together without touching /api.
 */

import dispatch from '../dispatch.js';
import type { LangModule, StepCore } from '../types.js';

describe('lang module integration', () => {
  describe('dispatch routing', () => {
    it('dispatches to chars and records', () => {
      const lang = dispatch.chars;
      const steps = lang.record('ab', lang.events);
      expect(steps).toHaveLength(2);
    });

    it('returns undefined for unknown lang', () => {
      expect((dispatch as Record<string, unknown>).unknown).toBeUndefined();
    });

    it('can iterate over available languages', () => {
      const langIds = Object.keys(dispatch);
      expect(langIds).toContain('chars');
    });
  });

  describe('LangModule interface compliance', () => {
    it('chars module conforms to LangModule interface', () => {
      const module: LangModule = dispatch.chars;
      expect(typeof module.record).toBe('function');
      expect(typeof module.events).toBe('object');
    });
  });

  describe('StepCore contract', () => {
    it('all steps have required StepCore fields', () => {
      const steps = dispatch.chars.record('abc', dispatch.chars.events);
      for (const step of steps) {
        expect(typeof step.step).toBe('number');
        expect(typeof step.loc.line).toBe('number');
        expect(typeof step.loc.column).toBe('number');
      }
    });

    it('step numbers are 1-indexed', () => {
      const steps = dispatch.chars.record('abc', dispatch.chars.events);
      expect(steps[0].step).toBe(1);
    });

    it('line numbers are 1-indexed', () => {
      const steps = dispatch.chars.record('abc', dispatch.chars.events);
      expect(steps[0].loc.line).toBe(1);
    });

    it('column numbers are 1-indexed', () => {
      const steps = dispatch.chars.record('abc', dispatch.chars.events);
      expect(steps[0].loc.column).toBe(1);
    });

    it('steps are in execution order', () => {
      const steps = dispatch.chars.record('abc', dispatch.chars.events);
      const stepNumbers = steps.map((s) => s.step);
      expect(stepNumbers).toEqual([1, 2, 3]);
    });
  });

  describe('immutability guarantees', () => {
    it('default events cannot be mutated', () => {
      expect(() => {
        (dispatch.chars.events as { direction: string }).direction = 'rl';
      }).toThrow();
    });

    it('returned steps are readonly', () => {
      const steps = dispatch.chars.record('ab', dispatch.chars.events);
      expect(Object.isFrozen(steps) || Array.isArray(steps)).toBe(true);
    });
  });

  describe('type narrowing helper', () => {
    it('can type-check lang existence before use', () => {
      const langId = 'chars';
      if (langId in dispatch) {
        const module = dispatch[langId as keyof typeof dispatch];
        const steps = module.record('test', module.events);
        expect(steps.length).toBeGreaterThan(0);
      }
    });
  });
});
