/**
 * @file Preset application logic for educational execution tracer
 * 
 * Applies educational presets by deep merging preset configurations with user overrides.
 * Uses deep merge with correct precedence: preset as base, user config as override.
 * 
 * @see README.md for preset descriptions and usage patterns
 */

import { deepMerge } from '../utils/deep-merge.js';
import presets from './presets/index.js';
import { UserConfig } from './types.js';

/**
 * Applies a preset configuration, merging with existing config
 * Uses deep merge with user config taking precedence over preset defaults
 * Uses graceful degradation - invalid presets are ignored
 *
 * @param userConfig - User-provided configuration
 * @returns Merged configuration with preset applied, or original config if preset invalid
 * @see {@link deepMerge} for merge behavior details
 */
function applyPreset(userConfig: UserConfig): UserConfig {
  // If no preset specified, return config as-is
  if (!userConfig.preset) {
    return userConfig;
  }

  // Get preset definition - gracefully handle invalid presets
  const presetConfig = presets[userConfig.preset];
  if (!presetConfig) {
    // Graceful degradation: ignore invalid preset, return config without preset applied
    return userConfig;
  }

  // Deep merge with correct precedence: preset as base, user as override
  return deepMerge(presetConfig, userConfig) as UserConfig;
}

export default applyPreset;
