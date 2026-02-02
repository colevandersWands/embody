/**
 * Checks if a value is an expandable object (not null, not array, is object).
 *
 * Used by shorthand expansion and partial expansion to determine
 * which values can be recursively processed.
 *
 * @param value - Value to check
 * @returns True if value is a plain object suitable for expansion
 */
function isExpandableObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export default isExpandableObject;
