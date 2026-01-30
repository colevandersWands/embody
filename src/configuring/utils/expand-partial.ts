/**
 * Partial shorthand expansion for config merging.
 *
 * Walks only the keys present in `current`, using `defaults`
 * as the reference for what `true`/`false` should expand to.
 * Unlike full expansion (expand-shorthand), this does NOT
 * fill in defaults for missing fields.
 *
 * Used by `createNarrowConfig` for method-level config
 * overrides and `mergeConfig`, where only user-specified
 * fields should override chain values.
 *
 * @param current - User-provided partial config
 * @param defaults - Default config used as expansion reference
 * @returns Partially expanded config (only provided keys)
 */

import createDisabledVersion from './create-disabled-version.js';
import isExpandableObject from './is-expandable-object.js';

function expandPartial(current: unknown, defaults: unknown): unknown {
  if (current === null || defaults === null) {
    return current;
  }
  if (!isExpandableObject(current) || !isExpandableObject(defaults)) {
    return current;
  }

  const result: Record<string, unknown> = { ...current };

  for (const key of Object.keys(current)) {
    const value = current[key];
    const def = defaults[key];

    if (value === true && def !== undefined && isExpandableObject(def)) {
      result[key] = expandPartial(def, def);
    } else if (value === false && def !== undefined && isExpandableObject(def)) {
      result[key] = createDisabledVersion(def);
    } else if (isExpandableObject(value) && isExpandableObject(def)) {
      result[key] = expandPartial(value, def);
    }
  }

  return result;
}

export default expandPartial;
