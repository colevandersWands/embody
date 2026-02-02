/**
 * @file Deep freeze utility for making objects and their nested properties immutable.
 *
 * Used at the dispatch layer to freeze default event configurations,
 * preventing accidental mutation of shared defaults.
 */

/**
 * Recursively freezes an object and all nested objects/arrays.
 *
 * Unlike Object.freeze which is shallow, this freezes the entire object tree.
 * Primitives and null are returned as-is (nothing to freeze).
 *
 * @param value - The value to deep freeze
 * @returns The same object, now deeply frozen
 *
 * @example
 * const config = deepFreeze({ nested: { value: 1 } });
 * config.nested.value = 2; // TypeError in strict mode, silently fails otherwise
 */
function deepFreeze<T>(value: T): T {
  // Primitives and null: nothing to freeze
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Freeze this level
  Object.freeze(value);

  // Recursively freeze all properties
  for (const propertyValue of Object.values(value)) {
    if (propertyValue !== null && typeof propertyValue === 'object') {
      deepFreeze(propertyValue);
    }
  }

  return value;
}

export default deepFreeze;
