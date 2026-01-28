import record from '../record.js';
import createConfig from '../../../configuring/create.js';

describe('record', () => {
  it('records instrumented (stub: one {} per non-space char)', () => {
    const result = record({ instrumented: 'a b c', config: createConfig({}) });
    expect(result.steps).toEqual([{}, {}, {}]);
  });

  it('empty instrumented produces empty steps', () => {
    const result = record({ instrumented: '', config: createConfig({}) });
    expect(result.steps).toEqual([]);
  });

  it('preserves instrumented in output', () => {
    const result = record({ instrumented: 'a b c', config: createConfig({}) });
    expect(result.instrumented).toBe('a b c');
  });

  it('preserves config in output', () => {
    const config = createConfig({});
    const result = record({ instrumented: 'a b c', config });
    expect(result.config).toBe(config);
  });

  it('throws if instrumented is not a string', () => {
    expect(() => record({ instrumented: 42 as any })).toThrow('record');
    expect(() => record({ instrumented: [] as any })).toThrow('record');
    expect(() => record({ instrumented: true as any })).toThrow('record');
  });

  it('throws if config is not an object', () => {
    expect(() => record({ instrumented: 'abc', config: 42 as any })).toThrow('record');
    expect(() => record({ instrumented: 'abc', config: 'bad' as any })).toThrow('record');
    expect(() => record({ instrumented: 'abc', config: [] as any })).toThrow('record');
  });
});
