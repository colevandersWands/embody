import fillConfig from './tracing/fill-config.js';
import filterSteps from './tracing/filter-steps.js';
import deserialize from './tracing/deserialize.js';

import type { UserConfig } from '../configuring/types.js';
import type { Step, FilterResult } from '../types/api.js';

/**
 * Post-processing filter for existing trace steps.
 *
 * Squint applies configuration filters to an existing trace without re-executing
 * the code. This enables different analytical perspectives on the same execution
 * data. It supports three usage patterns through currying:
 *
 * @example
 * ```typescript
 * // 1. Both parameters - immediate filtering
 * const filtered = squint({
 *   steps: existingTrace,
 *   config: { variables: { filter: ['counter'] } }
 * });
 *
 * // 2. Config-first currying - apply same filter to multiple traces
 * const filter = squint({ config: { variables: { filter: ['x', 'y'] } } });
 * const filtered1 = filter({ steps: trace1 });
 * const filtered2 = filter({ steps: trace2 });
 *
 * // 3. Steps-first currying - apply different filters to same trace
 * const stepsFilter = squint({ steps: existingTrace });
 * const varsOnly = stepsFilter({ config: { variables: true, functions: false } });
 * const funcsOnly = stepsFilter({ config: { variables: false, functions: true } });
 *
 * // 4. Pickle support - steps and config as JSON strings
 * const filtered = squint({ steps: '[{},{}]', config: '{"presets":"overview"}' });
 * ```
 *
 * @param input - Object containing steps and/or config
 * @returns FilterResult if both provided, or curried function if one provided
 * @throws {Error} If neither steps nor config is provided
 * @throws {Error} If steps is provided but not an array or string
 * @throws {Error} If config is provided but not an object or string
 *
 * @remarks
 * Squint is designed for post-processing workflows where you want to explore
 * different aspects of an execution without re-running the instrumentation.
 *
 * Both steps and config accept JSON strings (pickle support).
 * Steps strings are auto-deserialized. Invalid JSON throws (consistent with all tracing functions).
 *
 * @since 1.0.0
 */

// Function overloads for proper type inference
function squint(input: {
  readonly steps: readonly Step[] | string;
  readonly config: UserConfig | string;
}): FilterResult;
function squint(input: {
  readonly config: UserConfig | string;
}): (input: { readonly steps: readonly Step[] | string }) => FilterResult;
function squint(input: {
  readonly steps: readonly Step[] | string;
}): (input: { readonly config?: UserConfig | string }) => FilterResult;

// Implementation with undefined checks (no EMPTY sentinel)
function squint({
  steps,
  config,
}: {
  readonly steps?: readonly Step[] | string;
  readonly config?: UserConfig | string;
} = {}) {
  // Type validation for steps
  if (
    steps !== undefined &&
    !Array.isArray(steps) &&
    typeof steps !== 'string'
  ) {
    throw new Error(
      'squint: expected steps to be an array or string, got ' + typeof steps,
    );
  }
  // Type validation for config
  if (
    config !== undefined &&
    typeof config !== 'object' &&
    typeof config !== 'string'
  ) {
    throw new Error(
      'squint: expected config to be an object or string, got ' + typeof config,
    );
  }
  if (
    config !== undefined &&
    typeof config === 'object' &&
    (config === null || Array.isArray(config))
  ) {
    throw new Error(
      'squint: expected config to be a plain object, got ' +
        (Array.isArray(config) ? 'array' : 'null'),
    );
  }

  // Pickle support: deserialize JSON strings, pass parsed values through
  const { steps: resolvedSteps, config: resolvedConfig } =
    deserialize({ steps, config });

  if (resolvedSteps === undefined && resolvedConfig === undefined) {
    throw new Error('squint: expected at least steps or config to be provided');
  }

  if (resolvedSteps === undefined) {
    if (resolvedConfig === undefined) {
      // Unreachable (caught above), but satisfies TypeScript narrowing
      throw new Error('squint: expected at least steps or config to be provided');
    }
    // Config-only: curry, cache expanded config
    const { config: cachedConfig } = fillConfig({ config: resolvedConfig });
    return function squintWithClosedConfig(
      { steps }: { readonly steps?: readonly Step[] | string } = {},
    ) {
      if (steps === undefined) {
        throw new Error('squint: curried with config, but no steps were provided');
      }
      const { steps: innerSteps } = deserialize({ steps });
      return filterSteps({ steps: innerSteps!, config: cachedConfig });
    };
  }

  if (resolvedConfig === undefined) {
    // Steps-only: curry, close over steps
    return function squintWithClosedSteps({
      config,
    }: {
      readonly config?: UserConfig | string;
    } = {}) {
      const { config: innerConfig } = deserialize({ config });
      if (innerConfig === undefined) {
        throw new Error('squint: curried with steps, but no config was provided');
      }
      return filterSteps({
        steps: resolvedSteps,
        ...fillConfig({ config: innerConfig }),
      });
    };
  }

  // Both provided: execute immediately
  return filterSteps({ steps: resolvedSteps, ...fillConfig({ config: resolvedConfig }) });
}

export default squint;
