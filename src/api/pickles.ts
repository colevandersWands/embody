import type { UserConfig } from '../configuring/types.js';
import type { Step } from '../types/api.js';

import deserialize from './tracing/deserialize.js';
import serialize from './tracing/serialize.js';

/**
 * Bidirectional toggle for trace steps and/or configuration.
 *
 * Each field toggles independently: arrays/objects serialize to JSON strings,
 * JSON strings deserialize to arrays/objects. Pass one or both fields.
 *
 * @example
 * ```typescript
 * // Steps: array → string
 * const { steps } = pickles({ steps: [{}, {}] });
 * // steps === '[{},{}]'
 *
 * // Steps: string → array
 * const { steps } = pickles({ steps: '[{},{}]' });
 * // steps === [{}, {}]
 *
 * // Config: object → string
 * const { config } = pickles({ config: { presets: 'overview' } });
 * // config === '{"presets":"overview"}'
 *
 * // Config: string → object
 * const { config } = pickles({ config: '{"presets":"overview"}' });
 * // config === { presets: 'overview' }
 *
 * // Both: toggle each independently
 * const result = pickles({ steps: [{}, {}], config: '{"presets":"overview"}' });
 * // result === { steps: '[{},{}]', config: { presets: 'overview' } }
 * ```
 *
 * @param input - Object containing steps and/or config to toggle
 * @param input.steps - Trace steps as array (→ string) or JSON string (→ array)
 * @param input.config - Config as object (→ string) or JSON string (→ object)
 * @returns Object with each provided field in the opposite format
 * @throws {Error} If neither steps nor config is provided
 * @throws {Error} If steps is provided but not an array or string
 * @throws {Error} If config is provided but not an object or string
 * @throws {Error} If a JSON string field contains invalid JSON
 *
 * @since 1.0.0
 */

// --- Steps-only overloads ---
function pickles(input: { readonly steps: readonly Step[] }): { readonly steps: string };
function pickles(input: { readonly steps: string }): { readonly steps: readonly Step[] };

// --- Config-only overloads ---
function pickles(input: { readonly config: UserConfig }): { readonly config: string };
function pickles(input: { readonly config: string }): { readonly config: UserConfig };

// --- Combined overloads ---
function pickles(input: { readonly steps: readonly Step[]; readonly config: UserConfig }): {
  readonly steps: string;
  readonly config: string;
};
function pickles(input: { readonly steps: string; readonly config: string }): {
  readonly steps: readonly Step[];
  readonly config: UserConfig;
};
function pickles(input: { readonly steps: readonly Step[]; readonly config: string }): {
  readonly steps: string;
  readonly config: UserConfig;
};
function pickles(input: { readonly steps: string; readonly config: UserConfig }): {
  readonly steps: readonly Step[];
  readonly config: string;
};

// Implementation
function pickles({
  steps,
  config,
}: {
  readonly steps?: readonly Step[] | string;
  readonly config?: UserConfig | string;
} = {}) {
  if (steps === undefined && config === undefined) {
    throw new Error('pickles: expected at least steps or config to be provided');
  }

  return {
    ...(steps === undefined ? {} : { steps: toggleSteps(steps) }),
    ...(config === undefined ? {} : { config: toggleConfig(config) }),
  };
}

/** Serialize array → string, or deserialize string → array */
function toggleSteps(steps: readonly Step[] | string): string | readonly Step[] {
  if (Array.isArray(steps)) {
    return serialize({ steps });
  }

  if (typeof steps === 'string') {
    const { steps: parsed } = deserialize({ steps });
    if (parsed === undefined) {
      throw new Error('pickles: deserialize returned undefined steps');
    }
    return parsed;
  }

  throw new Error(`pickles: expected steps to be an array or string, got ${typeof steps}`);
}

/** Serialize object → string, or deserialize string → object */
function toggleConfig(config: UserConfig | string): string | UserConfig {
  if (typeof config === 'string') {
    const { config: parsed } = deserialize({ config });
    if (parsed === undefined) {
      throw new Error('pickles: deserialize returned undefined config');
    }
    return parsed;
  }

  if (typeof config === 'object' && config !== null && !Array.isArray(config)) {
    return serialize({ config });
  }

  throw new Error(
    `pickles: expected config to be an object or string, got ${config === null ? 'null' : (Array.isArray(config) ? 'array' : typeof config)}`,
  );
}

export default pickles;
