import dispatch from '../dispatch.js';

describe('dispatch', () => {
  describe('registry structure', () => {
    it('contains chars language', () => {
      expect(dispatch.chars).toBeDefined();
    });

    it('returns undefined for unknown language', () => {
      expect((dispatch as Record<string, unknown>).unknown).toBeUndefined();
    });
  });

  describe('chars module', () => {
    it('has record function', () => {
      expect(typeof dispatch.chars.record).toBe('function');
    });

    it('has events object', () => {
      expect(typeof dispatch.chars.events).toBe('object');
    });
  });

  describe('frozen events', () => {
    it('chars events are frozen', () => {
      expect(Object.isFrozen(dispatch.chars.events)).toBe(true);
    });

    it('chars events.remove is frozen', () => {
      expect(Object.isFrozen(dispatch.chars.events.remove)).toBe(true);
    });

    it('chars events.replace is frozen', () => {
      expect(Object.isFrozen(dispatch.chars.events.replace)).toBe(true);
    });

    it('prevents modification of events', () => {
      expect(() => {
        (dispatch.chars.events as { direction: string }).direction = 'rl';
      }).toThrow();
    });
  });

  describe('integration with record', () => {
    it('chars.record produces steps with default events', () => {
      const steps = dispatch.chars.record('ab', dispatch.chars.events);
      expect(steps).toHaveLength(2);
    });

    it('chars.record respects events configuration', () => {
      const customEvents = { ...dispatch.chars.events, direction: 'rl' as const };
      const steps = dispatch.chars.record('ab', customEvents);
      expect(steps[0].char).toBe('b');
      expect(steps[1].char).toBe('a');
    });
  });
});
