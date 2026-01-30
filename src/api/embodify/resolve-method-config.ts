import createNarrowConfig from '../../configuring/create-narrow-config.js';
import type { ExpandedConfig } from '../../configuring/types.js';
import deepMerge from '../../utils/deep-merge.js';

import parseConfig from './parse-config.js';

/**
 * Resolves the effective config for a pipeline method call.
 *
 * When a method (instrument, trace, filterSteps) receives a
 * config override, this merges it on top of the chain's config.
 * When no override is provided, the chain config passes through.
 *
 * chainConfig is always an ExpandedConfig (never null/undefined),
 * so only two branches:
 * - Override provided → parse, narrow-expand, deepMerge on chain
 * - No override → chain as-is
 *
 * @param override - config from method call (object, string, or undefined)
 * @param chainConfig - current chain config (ExpandedConfig)
 * @returns resolved ExpandedConfig
 */
function resolveMethodConfig(override: unknown, chainConfig: ExpandedConfig): ExpandedConfig {
  if (override !== undefined) {
    const parsed = parseConfig(override);
    const narrow = createNarrowConfig(parsed);
    return deepMerge(chainConfig, narrow);
  }
  return chainConfig;
}

export default resolveMethodConfig;
