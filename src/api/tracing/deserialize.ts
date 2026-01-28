import resolveSteps from '../../steps/resolve-steps.js';
import parseJSON from '../../utils/parse-json.js';
import isExpandableObject from '../../configuring/utils/is-expandable-object.js';

import type { DeserializeInput, DeserializeOutput } from '../../types/api.js';
import type { UserConfig } from '../../configuring/types.js';

/**
 * Deserializes steps and/or config from JSON strings, or validates
 * and passes through already-parsed values.
 *
 * This is the general-purpose parsing/validation layer for the tracing
 * pipeline. It handles both directions: string → parsed value (JSON.parse)
 * and already-parsed value → validated passthrough.
 *
 * Steps resolution is delegated to `resolveSteps` (from `src/steps/`).
 * Config resolution uses `isExpandableObject` (from `configuring/utils/`)
 * for plain-object validation.
 *
 * @param input - Object containing steps and/or config (strings or parsed values)
 * @param input.steps - JSON string to parse into Step[], or an existing Step array to passthrough
 * @param input.config - JSON string to parse into UserConfig, or an existing config object to passthrough
 * @returns Object with parsed/validated steps and config (undefined for fields not provided)
 * @throws {Error} If a JSON string is invalid
 * @throws {Error} If steps is not a string or array, or items are not objects
 * @throws {Error} If config is not a string or plain object
 *
 * @example
 * ```typescript
 * // Parse JSON strings
 * deserialize({ steps: '[{},{}]' })        // → { steps: [{},{}], config: undefined }
 * deserialize({ config: '{"p":"o"}' })     // → { steps: undefined, config: {p:'o'} }
 *
 * // Passthrough already-parsed values
 * deserialize({ steps: [{},{}] })          // → { steps: [{},{}], config: undefined }
 * deserialize({ config: { p: 'o' } })      // → { steps: undefined, config: {p:'o'} }
 *
 * // No args
 * deserialize()                             // → { steps: undefined, config: undefined }
 * ```
 */
function deserialize(
  { steps, config }: DeserializeInput = {},
): DeserializeOutput {
  return {
    steps: resolveSteps(steps),
    config: resolveConfig(config),
  };
}

// --- Config resolution (local — mixes pickle + config concerns) ---

function resolveConfig(
  config: string | UserConfig | undefined,
): UserConfig | undefined {
  if (config === undefined) return undefined;

  if (typeof config === 'string') {
    const parsed = parseJSON(config, 'deserialize: invalid JSON for config');
    if (!isExpandableObject(parsed)) {
      throw new Error(
        'deserialize: expected config to be a plain object, got ' +
          describeType(parsed),
      );
    }
    return parsed as UserConfig;
  }

  if (typeof config !== 'object') {
    throw new Error(
      'deserialize: expected config to be a string or object, got ' +
        typeof config,
    );
  }

  if (!isExpandableObject(config)) {
    throw new Error(
      'deserialize: expected config to be a plain object, got ' +
        describeType(config),
    );
  }

  return config;
}

function describeType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export default deserialize;
