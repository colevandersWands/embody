/**
 * @file Preset application logic for educational execution tracer
 *
 * Applies educational presets by deep merging preset configurations with user overrides.
 * Uses deep merge with correct precedence: preset as base, user config as override.
 *
 * @see README.md for preset descriptions and usage patterns
 */

import deepMerge from '../../../utils/deep-merge.js';

import detailed from './presets/detailed.js';
import exhaustive from './presets/exhaustive.js';
import overview from './presets/overview.js';
import { Config } from './types.js';

const PRESETS: Record<string, Partial<Config>> = { overview, detailed, exhaustive };

/**
 * Applies a preset configuration, merging with existing config
 * Supports single preset string or array of presets (merged in order)
 * Uses deep merge with user config taking precedence over preset defaults
 * Uses graceful degradation - invalid presets are ignored
 *
 * @param userConfig - User-provided configuration (Partial<Config>)
 * @returns Merged configuration with preset applied, or original config if preset invalid
 * @see {@link deepMerge} for merge behavior details
 */
function applyPreset(userConfig: Partial<Config>): Partial<Config> {
  // If no preset specified, return config as-is
  if (!userConfig.presets) {
    return userConfig;
  }

  // Normalize to array for uniform handling
  const presetNames = Array.isArray(userConfig.presets) ? userConfig.presets : [userConfig.presets];

  // Collect valid preset configs (gracefully skip invalid ones)
  const presetConfigs = presetNames
    .map((name) => PRESETS[name])
    .filter((config): config is Partial<Config> => config !== undefined);

  // If no valid presets found, return config as-is
  if (presetConfigs.length === 0) {
    return userConfig;
  }

  // Merge presets in order, then apply user config as final override
  const mergedPresets = presetConfigs.reduce(
    (accumulator, preset) => deepMerge(accumulator, preset),
    {} as Partial<Config>,
  );

  // Deep merge with correct precedence: merged presets as base, user as override
  return deepMerge(mergedPresets, userConfig);
}

export default applyPreset;
