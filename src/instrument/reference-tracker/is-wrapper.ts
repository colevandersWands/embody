import type { TrackedObject } from './types.js';

/**
 * Pure function to validate wrapper object structural properties
 * 
 * Performs structural validation of an object to determine if it has the
 * correct shape of a TrackedObject wrapper, without validating the secret value.
 * This allows consumers to handle secret validation separately.
 * 
 * Validates:
 * - Object is truthy and typeof 'object'
 * - Has 'id' property that is number or null
 * - Has 'type' property that is string
 * - Has 'value' property (any type)
 * - Has 'secret' property that is a symbol (type validated, value not validated)
 * 
 * @param obj - The object to validate
 * @returns True if object has correct wrapper structure
 * 
 * @example
 * ```typescript
 * // Valid wrapper structure
 * const valid = { value: 42, id: 123, secret: Symbol(), type: 'number' };
 * console.log(isWrapper(valid)); // true
 * 
 * // Invalid structure - missing properties
 * const invalid = { value: 42 };
 * console.log(isWrapper(invalid)); // false
 * 
 * // Invalid structure - secret is not symbol
 * const invalidSecret = { value: 42, id: 123, secret: 'not-symbol', type: 'number' };
 * console.log(isWrapper(invalidSecret)); // false
 * 
 * // Usage with secret validation
 * if (isWrapper(obj) && obj.secret === mySecret) {
 *   // Object is valid wrapper with correct secret
 * }
 * ```
 */
export function isWrapper(obj: any): obj is TrackedObject {
  return (
    obj != null &&
    typeof obj === 'object' &&
    (typeof obj.id === 'number' || obj.id === null) &&
    typeof obj.type === 'string' &&
    'value' in obj &&
    typeof obj.secret === 'symbol'
  );
}