import createConfig from './configuring/create.js';
import instrumentRecord from './api/tracing/instrument-record.js';
import deserialize from './api/tracing/deserialize.js';

import type { Step } from './types/api.js';
import type { UserConfig } from './configuring/types.js';

/**
 * Simple tracing function for quick usage without metadata.
 *
 * This is a convenience wrapper that returns just the trace steps array
 * without the configuration or original code. Useful for simple scripts
 * or when you don't need the full trace metadata.
 *
 * @example
 * ```typescript
 * import embodyTrace from '@study-lenses/embody';
 *
 * const steps = embodyTrace('let x = 5; console.log(x);');
 * console.log(steps); // Array of trace events
 *
 * // With JSON string config (pickle support)
 * const steps = embodyTrace('let x = 5', '{"presets":"overview"}');
 * ```
 *
 * @param code - JavaScript code to trace (defaults to empty string)
 * @param config - Optional configuration object or JSON string (uses defaults if not provided)
 * @returns Array of trace steps
 * @throws {Error} If code is provided but not a string
 * @throws {Error} If config is provided but not an object or string
 *
 * @since 1.0.0
 */
function trace(code: string = '', config: UserConfig | string = {}): readonly Step[] {
  // Type validation
  if (typeof code !== 'string') {
    throw new Error(
      'trace: expected code to be a string, got ' + typeof code,
    );
  }
  if (
    typeof config !== 'object' &&
    typeof config !== 'string'
  ) {
    throw new Error(
      'trace: expected config to be an object or string, got ' + typeof config,
    );
  }
  if (
    typeof config === 'object' &&
    (config === null || Array.isArray(config))
  ) {
    throw new Error(
      'trace: expected config to be a plain object, got ' +
        (Array.isArray(config) ? 'array' : 'null'),
    );
  }

  // Pickle support: parse JSON string config, passthrough objects
  const resolvedConfig = deserialize({ config }).config ?? {};

  const expandedConfig = createConfig(resolvedConfig);
  const { steps } = instrumentRecord({ code, config: expandedConfig });
  return steps;
}

export default trace;
