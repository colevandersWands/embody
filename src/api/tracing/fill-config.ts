import createConfig from '../../configuring/create.js';
import type { FillConfigInput, FillConfigOutput } from '../../types/api.js';

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
 * const result = fillConfig({ config: { presets: 'overview' } });
 * // result.config is now a complete ExpandedConfig
 *
 * // With empty config (uses defaults)
 * const result = fillConfig({ config: undefined });
 * // result.config contains default configuration
 * ```
 *
 * @param input - Object containing optional user configuration
 * @returns Object with normalized, expanded configuration
 * @throws {Error} If config is provided but not a plain object
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
function fillConfig({ config }: FillConfigInput = {}): FillConfigOutput {
  if (config === undefined) {
    return { config: createConfig({}) };
  }

  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    throw new Error(
      'fillConfig: expected config to be a plain object, got ' +
        (Array.isArray(config) ? 'array' : typeof config),
    );
  }

  return { config: createConfig(config) };
}

export default fillConfig;
