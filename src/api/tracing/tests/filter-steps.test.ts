import createConfig from '../../../configuring/create.js';
import filterSteps from '../filter-steps.js';

describe('filterSteps', () => {
  it('passes through steps unchanged (stub)', () => {
    const steps = [{}, {}, {}] as any[];
    const result = filterSteps({ steps, config: createConfig({}) });
    expect(result.steps).toEqual(steps);
  });

  it('empty steps produces empty steps', () => {
    const result = filterSteps({ steps: [], config: createConfig({}) });
    expect(result.steps).toEqual([]);
  });

  it('preserves config in output', () => {
    const config = createConfig({});
    const result = filterSteps({ steps: [], config });
    expect(result.config).toBe(config);
  });

  it('throws if steps is not an array', () => {
    expect(() => filterSteps({ steps: 42 as any })).toThrow('filterSteps');
    expect(() => filterSteps({ steps: 'bad' as any })).toThrow('filterSteps');
    expect(() => filterSteps({ steps: {} as any })).toThrow('filterSteps');
  });

  it('throws if config is not an object', () => {
    expect(() => filterSteps({ steps: [], config: 42 as any })).toThrow('filterSteps');
    expect(() => filterSteps({ steps: [], config: 'bad' as any })).toThrow('filterSteps');
    expect(() => filterSteps({ steps: [], config: [] as any })).toThrow('filterSteps');
  });
});
