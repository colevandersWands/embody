import deserialize from '../tracing/deserialize.js';

import type { UserConfig } from '../../configuring/types.js';

/**
 * Parses config from JSON string or passes through objects.
 *
 * Delegates to deserialize for JSON parsing and validation,
 * coalescing undefined/null to an empty object (embodify always needs a config).
 *
 * @param config - Config value (object, JSON string, undefined, or null)
 * @returns Parsed config object (never undefined)
 */
function parseConfig(config: UserConfig | string | null | undefined): UserConfig {
  if (config === null || config === undefined) return {};
  return deserialize({ config }).config ?? {};
}

export default parseConfig;
