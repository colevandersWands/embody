import { EMPTY } from '../utils/EMPTY';
import { createConfig } from '../config';

import type { UserConfig, ExpandedConfig } from '../config/types';
import type { FillConfigInput, FillConfigOutput } from '../types/api';

/**
 * Normalizes user configuration into a fully expanded configuration object.
 *
 * This function is the first stage in the tracing pipeline, transforming
 * partial user configurations into complete, validated configuration objects.
 * It applies presets, expands boolean shorthands, and fills in defaults.
 *
 * @example
 * ```typescript
 * // With user config
 * const result = fillConfig({ config: { preset: 'overview' } });
 * // result.config is now a complete ExpandedConfig
 *
 * // With empty config (uses defaults)
 * const result = fillConfig({ config: undefined });
 * // result.config contains default configuration
 * ```
 *
 * @param input - Object containing optional user configuration
 * @returns Object with normalized, expanded configuration
 *
 * @remarks
 * The configuration pipeline:
 * 1. Apply preset if specified
 * 2. Merge with defaults
 * 3. Expand boolean shorthands
 * 4. Validate and sanitize with graceful degradation
 *
 * @since 1.0.0
 */
export default function fillConfig({ config = EMPTY as any }: FillConfigInput & { config?: UserConfig | typeof EMPTY }): FillConfigOutput {
  if (config === EMPTY) {
    return { config: createConfig({}) };
  }

  return { config: createConfig(config as UserConfig) };
}
