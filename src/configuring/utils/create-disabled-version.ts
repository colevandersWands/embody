/**
 * Recursively creates a disabled version of a configuration object.
 *
 * Used when a boolean `false` shorthand is provided for a config section.
 * Preserves the structure but disables all values:
 * - Arrays become empty `[]`
 * - Objects are recursively disabled
 * - Primitive values become `false`
 *
 * @param obj - Object to create disabled version of
 * @returns Disabled version with same structure
 */
function createDisabledVersion(object: unknown): unknown {
  if (Array.isArray(object)) {
    return [];
  }

  if (object !== null && typeof object === 'object') {
    const disabled: Record<string, unknown> = {};
    for (const key of Object.keys(object)) {
      disabled[key] = createDisabledVersion((object as Record<string, unknown>)[key]);
    }
    return disabled;
  }

  // Primitive values become false
  return false;
}

export default createDisabledVersion;
