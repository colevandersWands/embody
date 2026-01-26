import shadow from './shadow.js';
import type { TrackerFactoryOptions, FactoryFunction } from './types.js';
import unwrap from './unwrap.js';
import wrap from './wrap.js';

/**
 * Creates a reference tracking toolkit for tracer advice function integration
 *
 * Factory function that configures wrap, unwrap, and shadow functions with
 * shared state for use in JavaScript execution tracing. Each tracer instance
 * should create its own tracker to maintain execution context isolation.
 *
 * @param options - Configuration for tracer integration
 * @param options.record - WeakMap for tracked object persistence (default: new WeakMap())
 * @param options.id - Starting ID for this trace execution (default: 0)
 * @param options.secret - Unique symbol for this tracer instance (default: Symbol('tracked'))
 *
 * @returns Configured functions for advice function integration
 *
 * @example
 * ```typescript
 * // In tracer initialization
 * const tracker = factory({
 *   secret: Symbol('execution-trace-001'),
 *   id: 1000
 * });
 *
 * // In advice function
 * const trackedObject = tracker.shadow({data: 123});
 * // trackedObject = {
 * //   value: {
 * //     data: {value: 123, id: null, secret, type: 'number'}
 * //   },
 * //   id: 1001,
 * //   secret,
 * //   type: 'Object'
 * // }
 *
 * const trackedPrimitive = tracker.shadow(42);
 * // trackedPrimitive = {value: 42, id: null, secret, type: 'number'}
 * ```
 */
function factory(options: TrackerFactoryOptions = {}) {
  // Set up shared state
  const { record = new WeakMap(), id = 0, secret = Symbol('tracked') } = options;

  // Create the wrap function with shared secret and ID counter
  const wrapFn = wrap(secret, id);

  // Create the unwrap function with shared secret
  const unwrapFn = unwrap(secret);

  // Create the shadow function with shared record and wrap function
  const shadowFn = shadow(record, wrapFn);

  return {
    wrap: wrapFn,
    unwrap: unwrapFn,
    shadow: shadowFn
  };
}

export default factory;
