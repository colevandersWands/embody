import type { UserConfig } from '../../configuring/types.js';
import type { Step } from '../../types/api.js';

/**
 * Serializes trace steps or configuration into a JSON string.
 *
 * Takes an array of steps or a config object and returns their JSON
 * representation. Used for persisting trace data or transmitting it
 * between systems. Pass exactly one of `steps` or `config`.
 *
 * @example
 * ```typescript
 * // Serialize steps
 * const json = serialize({ steps: [{}, {}] });
 * // json === '[{},{}]'
 *
 * // Serialize config
 * const json = serialize({ config: { presets: 'overview' } });
 * // json === '{"presets":"overview"}'
 * ```
 *
 * @param input - Object containing steps or config to serialize
 * @param input.steps - Array of trace steps to serialize
 * @param input.config - Configuration object to serialize
 * @returns JSON string representation of the provided field
 * @throws {Error} If neither steps nor config is provided
 * @throws {Error} If steps is provided but not an array
 * @throws {Error} If config is provided but not a plain object
 *
 * @since 1.0.0
 */

// Overload: steps → string
function serialize(input: { readonly steps: readonly Step[] }): string;
// Overload: config → string
function serialize(input: { readonly config: UserConfig }): string;

// Implementation
function serialize({
  steps,
  config,
}: { readonly steps?: readonly Step[]; readonly config?: UserConfig } = {}): string {
  if (steps !== undefined) {
    if (!Array.isArray(steps)) {
      throw new TypeError(`serialize: expected steps to be an array, got ${typeof steps}`);
    }
    return JSON.stringify(steps);
  }

  if (config !== undefined) {
    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
      throw new Error(
        `serialize: expected config to be a plain object, got ${config === null ? 'null' : (Array.isArray(config) ? 'array' : typeof config)}`,
      );
    }
    return JSON.stringify(config);
  }

  throw new Error('serialize: expected steps or config to be provided (neither given)');
}

export default serialize;
