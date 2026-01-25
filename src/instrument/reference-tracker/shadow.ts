import type { TrackedObject, ShadowFunction } from './types.js';

/**
 * Creates the primary interface for advice function integration
 *
 * Public-facing function used by tracer advice functions to track runtime
 * values. Manages object persistence across execution and delegates wrapping
 * to the configured wrap function. Returns TrackedObject with id: null
 * for primitives, id: number for references.
 *
 * Note: Does not use isWrapper for performance - direct WeakMap lookup
 * and mutation optimization take precedence over structural validation.
 *
 * Key behaviors:
 * - Primary entry point for advice function value tracking
 * - Returns TrackedObject with id: null for primitives
 * - Manages object persistence in execution context via WeakMap
 * - Re-wraps objects to capture mutations between advice calls
 * - Reuses existing TrackedObjects when available
 *
 * @param record - WeakMap for execution context persistence
 * @param wrapFn - Configured wrap function for this tracer instance
 *
 * @returns Function for advice function integration
 *
 * @example
 * ```typescript
 * // In advice function implementation
 * const shadowFn = shadow(executionRecord, wrapFn);
 *
 * // Track runtime values during execution
 * const trackedObject = shadowFn({data: 123});
 * // trackedObject = {
 * //   value: {
 * //     data: {value: 123, id: null, secret, type: 'number'}
 * //   },
 * //   id: 1001,
 * //   secret,
 * //   type: 'Object'
 * // }
 *
 * const trackedPrimitive = shadowFn(42);
 * // trackedPrimitive = {value: 42, id: null, secret, type: 'number'}
 *
 * // Use tracked values in trace events
 * traceEvent.objectId = trackedObject.id;
 * ```
 */
export function shadow(record: WeakMap<object, TrackedObject>, wrapFn: (value: any) => any) {
  /**
   * Shadows values by wrapping all types, storing reference types in record
   *
   * @param value - The value to shadow
   *
   * @returns TrackedObject with unique ID for references, id: null for primitives
   */
  return function shadowValues<T>(value: T): TrackedObject<T> {
    // For primitives, use wrap function directly (no WeakMap storage)
    if (Object(value) !== value) {
      return wrapFn(value) as TrackedObject<T>;
    }

    // Check if we already have this object in our record
    if (record.has(value as object)) {
      const existing = record.get(value as object) as TrackedObject<T>;
      // Re-wrap to capture potential mutations
      const rewrapped = wrapFn(value) as TrackedObject<T>;
      // Update the existing wrapper's value but keep the same wrapper
      // INTENTIONAL MUTATION: Performance optimization to avoid object churn
      // in high-frequency advice function calls. The TrackedObject retains
      // its identity while capturing fresh state mutations.
      (existing as any).value = rewrapped.value;
      return existing as TrackedObject<T>;
    }

    // First time seeing this object - wrap and store
    const wrapped = wrapFn(value) as TrackedObject<T>;
    record.set(value as object, wrapped);
    return wrapped as TrackedObject<T>;
  };
}
