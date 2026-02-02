/**
 * Partial config expansion for merging scenarios.
 *
 * Expands shorthands for ONLY the fields present in the
 * user's input. Does NOT fill in defaults for missing fields.
 * Returns a partial object suitable for deepMerge on top of
 * a fully-expanded chain config.
 *
 * Used by `embodify` for:
 * - `.mergeConfig()` — partial override of chain config
 * - Method-level config overrides (`{ config }` params)
 *
 * When a preset is specified, delegates to `createConfig`
 * for full expansion. When merged via deepMerge, this
 * silently overwrites the entire chain config — which is
 * correct: a preset change means "give me this whole
 * config profile."
 *
 * @param userConfig - Partial user config (only specified fields)
 * @returns Partially expanded config (only provided keys expanded)
 *
 * @example
 * ```js
 * // Only expands variables, doesn't fill missing fields
 * createNarrowConfig({ lang: { variables: true } })
 * // → { lang: { variables: { read: true, write: true, ... } } }
 *
 * // Preset → full config (delegates to createConfig)
 * createNarrowConfig({ presets: 'overview' })
 * // → full overview ExpandedConfig
 * ```
 */

import createConfig from './create.js';
import defaultConfig from './default-config.js';
import expandPartial from './utils/expand-partial.js';

function createNarrowConfig(userConfig: any = {}) {
  // Preset → delegate to createConfig for full
  // expansion (silently overwrites when merged)
  if (userConfig.presets) {
    return createConfig(userConfig);
  }

  // No preset → expand only provided fields
  return expandPartial(userConfig, defaultConfig);
}

export default createNarrowConfig;
