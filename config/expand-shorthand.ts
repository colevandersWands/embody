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

import { Config, ExpandedConfig } from './types.js';
import defaultConfig from './defaults/trace.js';

/**
 * Recursively creates a disabled version of an object
 * Arrays become empty [], objects are recursively disabled, other values become false
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

/**
 * Checks if a value is an expandable object (not null, not array, is object)
 * @param value - Value to check
 * @returns True if value is an expandable object
 */
function isExpandableObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Recursively expands boolean shorthand in an object
 * @param current - Current object being processed
 * @param defaults - Default values to use for expansion
 * @returns Object with boolean shorthand expanded
 */
function expandObjectRecursively(current: any, defaults: any): any {
  if (current === null || defaults === null) {
    return current;
  }

  if (!isExpandableObject(current) || !isExpandableObject(defaults)) {
    return current;
  }

  const result = { ...current };

  // Process each key in the current object
  Object.keys(current).forEach(key => {
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
  });

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
  const expanded = { ...config } as any;

  // Dynamically process all keys based on defaultConfig structure
  // No hardcoded lists - automatically detects expandable object fields
  Object.keys(expanded).forEach(key => {
    const currentValue = expanded[key];
    const defaultValue = (defaultConfig as any)[key];

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
  });

  return expanded as ExpandedConfig;
}

export default expandShorthand;
