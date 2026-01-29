/**
 * @file Deep merge utility for configuration objects
 * Provides recursive object merging with user configuration taking precedence
 */

/**
 * Recursively deep merges two objects with user config taking precedence
 *
 * Handles arbitrary nesting depth with the following rules:
 * - User values always win for primitives, null, undefined
 * - Arrays are replaced completely (no element merging)
 * - Objects are merged recursively
 * - Type mismatches favor user values
 *
 * @param preset - Preset configuration (defaults/base)
 * @param user - User configuration (overrides)
 * @returns Deeply merged configuration where user values take precedence
 *
 * @example
 * // Simple override
 * deepMerge(
 *   { vars: { read: false, write: true } },
 *   { vars: { read: true } }
 * )
 * // Result: { vars: { read: true, write: true } }
 *
 * @example
 * // Array replacement
 * deepMerge(
 *   { filter: ['a', 'b'] },
 *   { filter: ['c'] }
 * )
 * // Result: { filter: ['c'] }
 *
 * @example
 * // Deep nesting
 * deepMerge(
 *   { a: { b: { c: 1, d: 2 } } },
 *   { a: { b: { c: 3 } } }
 * )
 * // Result: { a: { b: { c: 3, d: 2 } } }
 */
function deepMerge<T>(preset: T, user: unknown): T {
  // User value always wins for primitives, null, undefined
  if (user === null || user === undefined || typeof user !== 'object') {
    return user as T;
  }

  // If preset is not an object, user value wins
  if (preset === null || preset === undefined || typeof preset !== 'object') {
    return user as T;
  }

  // Arrays: user array completely replaces preset array (no element merging)
  if (Array.isArray(user)) {
    return [...user] as T;
  }

  // If preset is array but user is object, user wins
  if (Array.isArray(preset)) {
    return user as T;
  }

  // Both are objects: deep merge recursively
  const presetObject = preset as Record<string, unknown>;
  const userObject = user as Record<string, unknown>;
  const result: Record<string, unknown> = { ...presetObject };

  for (const key in userObject) {
    if (Object.prototype.hasOwnProperty.call(userObject, key)) {
      if (
        isObjectTypeAndNotNull(userObject[key]) &&
        isObjectTypeAndNotNull(presetObject[key]) &&
        isNotAnArray(userObject[key]) &&
        isNotAnArray(presetObject[key])
      ) {
        // Both are non-null objects (not arrays): recurse
        result[key] = deepMerge(presetObject[key], userObject[key]);
      } else {
        // User value wins: primitive, array, null, or type mismatch
        result[key] = userObject[key];
      }
    }
  }

  return result as T;
}

function isObjectTypeAndNotNull(thing) {
  return typeof thing === 'object' && thing !== null;
}

function isNotAnArray(thing) {
  return !Array.isArray(thing);
}

export default deepMerge;

/* note from Claude:
  One small observation: the tests are thorough, maar I notice line 188-194 tests circular references. The current implementation doesn't protect against infinite loops when both preset and user have circular refs pointing into each other's structure. Eigenlijk, for config objects this probably never happens in practice, so it's fine.
*/
