/**
 * @file Complete configuration creation logic for educational execution tracer
 *
 * Main configuration factory function that orchestrates the configuration pipeline:
 * UserConfig → Preset Application → Graceful Sanitization → Shorthand Expansion → ExpandedConfig
 *
 * Uses graceful degradation: ignore unknown fields, use defaults for wrong types,
 * add missing fields from defaults, expand boolean values to appropriate objects.
 *
 * @see README.md for architecture overview and usage examples
 */

import defaultConfig from './defaults/trace.js';
import presets from './presets/index.js';
import applyPreset from './apply-preset.js';
import expandShorthand from './expand-shorthand.js';
import { deepMerge } from '../utils/deep-merge.js';
import { UserConfig, ExpandedConfig } from './types.js';

/**
 * Checks if a value matches the expected type based on the default value
 * @param value - Value to check
 * @param defaultValue - Default value to compare type against
 * @returns True if types match or are compatible
 */
function isCompatibleType(value: any, defaultValue: any): boolean {
  if (value === null || value === undefined) {
    return false; // Always use defaults for null/undefined
  }

  const valueType = typeof value;
  const defaultType = typeof defaultValue;

  // Exact type match
  if (valueType === defaultType) {
    return true;
  }

  // Special case: boolean expansion (true/false can become objects)
  if (
    valueType === 'boolean' &&
    defaultType === 'object' &&
    defaultValue !== null &&
    !Array.isArray(defaultValue)
  ) {
    return true;
  }

  // Arrays must match exactly
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value);
  }

  return false;
}

/**
 * Validates enum values for specific fields
 * @param key - Field name
 * @param value - Value to validate
 * @param defaultValue - Default value to fall back to
 * @returns Valid enum value or default
 */
function validateEnumField(key: string, value: any, defaultValue: any): any {
  // Special enum validations for aran config
  if (key === 'kind' && typeof value === 'string') {
    if (['script', 'module', 'eval'].includes(value)) {
      return value;
    }
    return defaultValue;
  }

  if (key === 'globalDeclarativeRecord' && typeof value === 'string') {
    if (['builtin', 'emulate'].includes(value)) {
      return value;
    }
    return defaultValue;
  }

  if (key === 'mode' && typeof value === 'string') {
    if (['standalone', 'normal'].includes(value)) {
      return value;
    }
    return defaultValue;
  }

  if (key === 'warning') {
    if (value === false || (typeof value === 'string' && ['console', 'throw'].includes(value))) {
      return value;
    }
    return defaultValue;
  }

  if (key === 'type' && typeof value === 'string') {
    if (['script', 'module', 'eval'].includes(value)) {
      return value;
    }
    return defaultValue;
  }

  // No enum validation needed - return original value
  return value;
}

/**
 * Recursively sanitizes a configuration object against defaults
 * - Removes unknown fields
 * - Uses default values for wrong-type fields
 * - Validates enum values for specific fields
 * - Adds missing fields from defaults
 * @param config - Configuration to sanitize
 * @param defaults - Default configuration to compare against
 * @returns Sanitized configuration with only valid fields
 */
function sanitizeConfig(config: any, defaults: any): any {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return defaults;
  }

  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
    return defaults;
  }

  const sanitized: any = {};

  // Add all fields from defaults first
  Object.keys(defaults).forEach(key => {
    const defaultValue = defaults[key];
    const userValue = config[key];

    if (!isCompatibleType(userValue, defaultValue)) {
      // Wrong type or missing - use default
      sanitized[key] = defaultValue;
    } else if (
      typeof defaultValue === 'object' &&
      defaultValue !== null &&
      !Array.isArray(defaultValue)
    ) {
      // Nested object - recursively sanitize
      sanitized[key] = sanitizeConfig(userValue, defaultValue);
    } else {
      // Compatible type - validate enum and use value
      sanitized[key] = validateEnumField(key, userValue, defaultValue);
    }
  });

  return sanitized;
}

/**
 * Creates a complete configuration by applying presets and expanding shorthand
 * Uses graceful degradation - never throws, always returns valid configuration
 * @param userConfig - User-provided configuration (may contain errors)
 * @returns Complete, sanitized configuration
 */
function createConfig(userConfig: UserConfig = {}): ExpandedConfig {
  // Clean up the user config first (remove unknown fields, fix invalid preset)
  let cleanUserConfig = { ...userConfig };

  // Sanitize preset field specifically
  if (cleanUserConfig.preset) {
    if (typeof cleanUserConfig.preset !== 'string') {
      cleanUserConfig.preset = defaultConfig.preset; // Fix wrong type preset
    } else if (!presets[cleanUserConfig.preset]) {
      cleanUserConfig.preset = defaultConfig.preset; // Fix invalid preset name
    }
  }

  // Apply preset first to the user config (graceful)
  let configWithPreset = cleanUserConfig;
  if (cleanUserConfig.preset && typeof cleanUserConfig.preset === 'string') {
    try {
      configWithPreset = applyPreset(cleanUserConfig);
    } catch {
      // Gracefully ignore invalid presets - use default preset value and continue
      configWithPreset = { ...cleanUserConfig, preset: defaultConfig.preset };
    }
  }

  // Merge with defaults first to ensure all fields exist
  const configWithDefaults = deepMerge(defaultConfig, configWithPreset);

  // Expand boolean shorthand (preserves true/false for expansion)
  const expandedConfig = expandShorthand(configWithDefaults);

  // Sanitize the final expanded configuration (removes unknown fields, fixes wrong types)
  const sanitizedConfig = sanitizeConfig(expandedConfig, defaultConfig);

  return sanitizedConfig as ExpandedConfig;
}

export default createConfig;
