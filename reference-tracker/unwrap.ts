import type { TrackedObject, UnwrapFunction } from './types.js';
import { isWrapper } from './is-wrapper.js';

/**
 * Creates an unwrapping function for trace output generation
 * 
 * Restores original values from TrackedObjects for final trace output,
 * removing all tracking metadata while preserving object structure and
 * identity. Used when generating final execution traces.
 * 
 * Key behaviors:
 * - Verifies tracer instance secret before unwrapping
 * - Recursively processes nested tracked structures
 * - Preserves object identity when no tracking metadata present
 * - Handles circular references safely via WeakMap caching
 * 
 * @param secret - Tracer instance verification symbol
 * 
 * @returns Function that restores original values for trace output
 * 
 * @example
 * ```typescript
 * const unwrapFn = unwrap(Symbol('tracer-001'));
 * 
 * const trackedObject = { value: {data: 123}, id: 1050, secret, type: 'Object' };
 * const unwrappedObject = unwrapFn(trackedObject);
 * // unwrappedObject = {data: 123}
 * 
 * const trackedPrimitive = { value: 42, id: null, secret, type: 'number' };
 * const unwrappedPrimitive = unwrapFn(trackedPrimitive);
 * // unwrappedPrimitive = 42
 * ```
 */
export const unwrap: UnwrapFunction = (secret = Symbol('tracked')) => {

  /**
   * Recursively unwraps TrackedObjects back to original values
   * 
   * @param value - The value to unwrap
   * @param unwrapped - WeakMap cache for circular reference handling
   * 
   * @returns Original value for TrackedObjects, unchanged value for others
   */
  return function unwrapRecursive<T>(value: T, unwrapped = new WeakMap()): T extends TrackedObject<infer U> ? U : T {
    // Return primitives unchanged
    if (value === null || typeof value !== 'object') {
      return value as T extends TrackedObject<infer U> ? U : T;
    }


    // If this is our TrackedObject, unwrap it
    if (isWrapper(value) && value.secret === secret) {
      // Handle circular references
      if (unwrapped.has(value)) {
        return unwrapped.get(value) as T extends TrackedObject<infer U> ? U : T;
      }

      // Recursively unwrap the contained value
      const unwrappedValue = unwrapRecursive(value.value, unwrapped);
      unwrapped.set(value, unwrappedValue);
      return unwrappedValue as T extends TrackedObject<infer U> ? U : T;
    }

    // Handle arrays - check each element for tracking
    if (Array.isArray(value)) {
      // Handle circular references
      if (unwrapped.has(value)) {
        return unwrapped.get(value) as T extends TrackedObject<infer U> ? U : T;
      }

      // Check if any element needs unwrapping
      let needsUnwrapping = false;
      for (const item of value) {
        if (item && typeof item === 'object' && isWrapper(item) && item.secret === secret) {
          needsUnwrapping = true;
          break;
        }
      }

      // If no unwrapping needed, return original array (identity preservation)
      if (!needsUnwrapping) {
        return value as T extends TrackedObject<infer U> ? U : T;
      }

      const unwrappedArray: any[] = [];
      unwrapped.set(value, unwrappedArray);
      
      // Process elements after setting cache to prevent infinite recursion
      for (let i = 0; i < value.length; i++) {
        unwrappedArray[i] = unwrapRecursive(value[i], unwrapped);
      }
      
      return unwrappedArray as T extends TrackedObject<infer U> ? U : T;
    }

    // Handle Maps
    if (value instanceof Map) {
      // Handle circular references
      if (unwrapped.has(value)) {
        return unwrapped.get(value) as T extends TrackedObject<infer U> ? U : T;
      }

      // Check if any value needs unwrapping
      let needsUnwrapping = false;
      for (const val of value.values()) {
        if (val && typeof val === 'object' && isWrapper(val) && val.secret === secret) {
          needsUnwrapping = true;
          break;
        }
      }

      // If no unwrapping needed, return original map (identity preservation)
      if (!needsUnwrapping) {
        return value as T extends TrackedObject<infer U> ? U : T;
      }

      const unwrappedMap = new Map();
      unwrapped.set(value, unwrappedMap);
      
      // Process entries after setting cache to prevent infinite recursion
      for (const [key, val] of value as Map<unknown, unknown>) {
        // TODO: Unwrap keys when key tracking is implemented
        unwrappedMap.set(key, unwrapRecursive(val, unwrapped));
      }
      return unwrappedMap as T extends TrackedObject<infer U> ? U : T;
    }

    // Handle Sets
    if (value instanceof Set) {
      // Handle circular references
      if (unwrapped.has(value)) {
        return unwrapped.get(value) as T extends TrackedObject<infer U> ? U : T;
      }

      // Check if any item needs unwrapping
      let needsUnwrapping = false;
      for (const item of value) {
        if (item && typeof item === 'object' && isWrapper(item) && item.secret === secret) {
          needsUnwrapping = true;
          break;
        }
      }

      // If no unwrapping needed, return original set (identity preservation)
      if (!needsUnwrapping) {
        return value as T extends TrackedObject<infer U> ? U : T;
      }

      const unwrappedSet = new Set();
      unwrapped.set(value, unwrappedSet);
      
      // Process items after setting cache to prevent infinite recursion
      for (const item of value as Set<unknown>) {
        unwrappedSet.add(unwrapRecursive(item, unwrapped));
      }
      return unwrappedSet as T extends TrackedObject<infer U> ? U : T;
    }

    // Handle plain objects
    if ((value as any).constructor === Object || !(value as any).constructor) {
      // Handle circular references
      if (unwrapped.has(value)) {
        return unwrapped.get(value) as T extends TrackedObject<infer U> ? U : T;
      }

      // Check if any property needs unwrapping
      let needsUnwrapping = false;
      for (const val of Object.values(value as Record<string, any>)) {
        if (val && typeof val === 'object' && isWrapper(val) && val.secret === secret) {
          needsUnwrapping = true;
          break;
        }
      }

      // If no unwrapping needed, return original object (identity preservation)
      if (!needsUnwrapping) {
        return value as T extends TrackedObject<infer U> ? U : T;
      }

      const unwrappedObject: Record<string, any> = {};
      unwrapped.set(value, unwrappedObject);
      
      for (const [key, val] of Object.entries(value as Record<string, any>)) {
        unwrappedObject[key] = unwrapRecursive(val, unwrapped);
      }
      return unwrappedObject as T extends TrackedObject<infer U> ? U : T;
    }

    // For other objects (functions, built-ins, etc.), return as-is
    return value as T extends TrackedObject<infer U> ? U : T;
  };
};