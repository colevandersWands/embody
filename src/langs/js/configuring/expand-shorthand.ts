/**
 * @file Boolean shorthand expansion logic for educational execution tracer
 *
 * Expands boolean shorthand configurations to full object configurations.
 * - true: Use corresponding default configuration
 * - false: Create disabled version with all booleans false and arrays empty
 * - object: Use as-is (passthrough)
 *
 * @see README.md for expansion rules and examples
 */

import defaultConfig from './default-config.js';
import { Config, ExpandedConfig } from './types.js';
import createDisabledVersion from './utils/create-disabled-version.js';
import isExpandableObject from './utils/is-expandable-object.js';

/**
 * Recursively expands boolean shorthand in an object
 * @param current - Current object being processed
 * @param defaults - Default values to use for expansion
 * @returns Object with boolean shorthand expanded
 */
function expandObjectRecursively(current: unknown, defaults: unknown): unknown {
  if (current === null || defaults === null) {
    return current;
  }

  if (!isExpandableObject(current) || !isExpandableObject(defaults)) {
    return current;
  }

  const result: Record<string, unknown> = { ...current };

  // Process each key in the current object
  for (const key of Object.keys(current)) {
    const currentValue = current[key];
    const defaultValue = defaults[key];

    if (currentValue === true && defaultValue !== undefined && isExpandableObject(defaultValue)) {
      // Expand true to default object value, recursively
      result[key] = expandObjectRecursively(defaultValue, defaultValue);
    } else if (
      currentValue === false &&
      defaultValue !== undefined &&
      isExpandableObject(defaultValue)
    ) {
      // Expand false to disabled version of default object
      result[key] = createDisabledVersion(defaultValue);
    } else if (isExpandableObject(currentValue) && isExpandableObject(defaultValue)) {
      // Recursively process nested objects
      result[key] = expandObjectRecursively(currentValue, defaultValue);
    }
    // Otherwise, leave value as-is
  }

  return result;
}

/**
 * Expands boolean shorthand to full object configuration
 * Uses the actual default configuration values to ensure consistency
 * Dynamically detects expandable fields by examining defaultConfig structure
 * @param config - Configuration that may contain boolean shorthand
 * @returns Configuration with all boolean shorthand expanded
 */
function expandShorthand(config: Config): ExpandedConfig {
  const expanded: Record<string, unknown> = { ...config };
  const defaults = defaultConfig as Record<string, unknown>;

  // Dynamically process all keys based on defaultConfig structure
  // No hardcoded lists - automatically detects expandable object fields
  for (const key of Object.keys(expanded)) {
    const currentValue = expanded[key];
    const defaultValue = defaults[key];

    if (currentValue === true && defaultValue !== undefined && isExpandableObject(defaultValue)) {
      // Expand true to default object value
      expanded[key] = expandObjectRecursively(defaultValue, defaultValue);
    } else if (
      currentValue === false &&
      defaultValue !== undefined &&
      isExpandableObject(defaultValue)
    ) {
      // Expand false to disabled version of default object
      expanded[key] = createDisabledVersion(defaultValue);
    } else if (isExpandableObject(currentValue) && isExpandableObject(defaultValue)) {
      // Recursively process nested objects
      expanded[key] = expandObjectRecursively(currentValue, defaultValue);
    }
    // Primitive fields (string, boolean, number) and arrays are left as-is
  }

  return expanded as ExpandedConfig;
}

export default expandShorthand;
