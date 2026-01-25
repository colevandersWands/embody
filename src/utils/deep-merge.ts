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
export function deepMerge(preset: any, user: any) {
  // User value always wins for primitives, null, undefined
  if (user === null || user === undefined || typeof user !== 'object') {
    return user;
  }

  // If preset is not an object, user value wins
  if (preset === null || preset === undefined || typeof preset !== 'object') {
    return user;
  }

  // Arrays: user array completely replaces preset array (no element merging)
  if (Array.isArray(user)) {
    return [...user];
  }

  // If preset is array but user is object, user wins
  if (Array.isArray(preset)) {
    return user;
  }

  // Both are objects: deep merge recursively
  const result = { ...preset };

  for (const key in user) {
    if (user.hasOwnProperty(key)) {
      if (
        typeof user[key] === 'object' &&
        user[key] !== null &&
        typeof preset[key] === 'object' &&
        preset[key] !== null &&
        !Array.isArray(user[key]) &&
        !Array.isArray(preset[key])
      ) {
        // Both are non-null objects (not arrays): recurse
        result[key] = deepMerge(preset[key], user[key]);
      } else {
        // User value wins: primitive, array, null, or type mismatch
        result[key] = user[key];
      }
    }
  }

  return result;
}
