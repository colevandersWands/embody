/**
 * @file Preset application logic for educational execution tracer
 *
 * Applies educational presets by deep merging preset configurations with user overrides.
 * Uses deep merge with correct precedence: preset as base, user config as override.
 *
 * @see README.md for preset descriptions and usage patterns
 */

import deepMerge from '../utils/deep-merge.js';

import detailed from './presets/detailed.js';
import exhaustive from './presets/exhaustive.js';
import overview from './presets/overview.js';
import { Config } from './types.js';

const PRESETS: Record<string, Partial<Config>> = { overview, detailed, exhaustive };

/**
 * Applies a preset configuration, merging with existing config
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

  // Get preset definition - gracefully handle invalid presets
  const presetConfig = PRESETS[userConfig.presets];
  if (!presetConfig) {
    // Graceful degradation: ignore invalid preset, return config without preset applied
    return userConfig;
  }

  // Deep merge with correct precedence: preset as base, user as override
  return deepMerge(presetConfig, userConfig) as Partial<Config>;
}

export default applyPreset;
