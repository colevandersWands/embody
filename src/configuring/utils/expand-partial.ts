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

function expandPartial(current: any, defaults: any): any {
  if (current === null || defaults === null) {
    return current;
  }
  if (!isExpandableObject(current)
      || !isExpandableObject(defaults)) {
    return current;
  }

  const result = { ...current };

  Object.keys(current).forEach(key => {
    const val = current[key];
    const def = defaults[key];

    if (val === true
        && def !== undefined
        && isExpandableObject(def)) {
      result[key] = expandPartial(def, def);
    } else if (
      val === false
      && def !== undefined
      && isExpandableObject(def)
    ) {
      result[key] = createDisabledVersion(def);
    } else if (
      isExpandableObject(val)
      && isExpandableObject(def)
    ) {
      result[key] = expandPartial(val, def);
    }
  });

  return result;
}

export default expandPartial;
