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
function createDisabledVersion(obj: any): any {
  if (Array.isArray(obj)) {
    return [];
  }

  if (obj !== null && typeof obj === 'object') {
    const disabled: any = {};
    Object.keys(obj).forEach(key => {
      disabled[key] = createDisabledVersion(obj[key]);
    });
    return disabled;
  }

  // Primitive values become false
  return false;
}

export default createDisabledVersion;
