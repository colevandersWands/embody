import isWrapper from './is-wrapper.js';
import type { TrackedObject, WrapFunction } from './types.js';

/**
 * Creates a recursive wrapping function for tracking all JavaScript values
 *
 * Core function that instruments reference types with unique identifiers
 * for execution trace analysis. Creates TrackedObject wrappers containing
 * the original value plus metadata for trace correlation.
 *
 * Key behaviors:
 * - Wraps all values: reference types get unique IDs, primitives get id: null
 * - Assigns unique incremental IDs from shared counter
 * - Handles circular references via WeakMap caching
 * - Recursively wraps nested structures (objects, arrays, maps, sets)
 *
 * @param secret - Tracer instance verification symbol
 * @param startId - Starting ID counter for this execution context (default: 0)
 *
 * @returns Function that wraps reference types with tracking metadata
 *
 * @example
 * ```typescript
 * const wrapFn = wrap(Symbol('tracer-001'), 1000);
 * 
 * const trackedObject = wrapFn({ data: [1, { nested: true }] });
 * // trackedObject = {value: {data: {value: [...], id: 1002, type: 'Array'}}, id: 1001, secret, type: 'Object'}
 * 
 * const trackedPrimitive = wrapFn(42);
 * // trackedPrimitive = {value: 42, id: null, secret, type: 'number'}
 * ```
 */
const wrap: WrapFunction = (secret = Symbol('tracked'), startId = 0) => {
  let id = startId; // Mutable counter in closure
  
  /**
   * Recursively wraps reference types with tracking information
   *
   * @param referenced - The value to wrap for tracking (any JavaScript type)
   * @param tracked - WeakMap cache for circular reference handling (default: new WeakMap())
   *
   * @returns TrackedObject wrapper with unique ID for references, id: null for primitives
   */
  return function wrapRecursive<T>(
    referenced: T,
    tracked = new WeakMap()
  ): TrackedObject<T> {
    // Handle primitives with id: null, no WeakMap storage
    if (Object(referenced) !== referenced) {
      const wrapper: TrackedObject<T> = {
        value: referenced,
        id: null,
        secret,
        type: typeof referenced
      };
      return wrapper;
    }

    // If already tracked with our secret, return as-is
    if (isWrapper(referenced) && referenced.secret === secret) {
      return referenced as TrackedObject<T>;
    }

    // Handle circular references - return cached wrapper if already processing
    if (tracked.has(referenced as object)) {
      return tracked.get(referenced as object) as TrackedObject<T>;
    }

    // Create new wrapper with unique ID and type information
    id++;
    const wrapper: TrackedObject<T> = {
      value: null as any, // Placeholder, will be set after recursive wrapping
      id,
      secret,
      type: (referenced as any).constructor?.name || 'Object'
    };

    // Cache wrapper before recursive processing to handle circular references
    tracked.set(referenced as object, wrapper);

    // Implement recursive deep wrapping for each data structure type
    let wrappedValue: any;

    if (Array.isArray(referenced)) {
      // Keep the array structure but recursively wrap object elements
      wrappedValue = referenced.map(item => wrapRecursive(item, tracked));
    } else if (referenced instanceof Map) {
      // Recursively wrap Map values (TODO: keys when key tracking is implemented)
      wrappedValue = new Map();
      for (const [key, value] of referenced as ReadonlyMap<unknown, unknown>) {
        wrappedValue.set(key, wrapRecursive(value, tracked));
      }
    } else if (referenced instanceof Set) {
      // Recursively wrap Set values
      wrappedValue = new Set();
      for (const value of referenced as ReadonlySet<unknown>) {
        wrappedValue.add(wrapRecursive(value, tracked));
      }
    } else if (typeof referenced === 'function') {
      // Functions are wrapped directly (no deep wrapping needed)
      wrappedValue = referenced;
    } else if ((referenced as any).constructor === Object || !(referenced as any).constructor) {
      // Plain objects: recursively wrap property values
      wrappedValue = {};
      for (const [key, value] of Object.entries(referenced as Record<string, any>)) {
        wrappedValue[key] = wrapRecursive(value, tracked);
      }
    } else {
      // Other objects (Date, RegExp, Error, custom classes, etc.)
      // For now, wrap directly without deep processing
      wrappedValue = referenced;
    }

    (wrapper as any).value = wrappedValue;

    return wrapper;
  };
};

export default wrap;
