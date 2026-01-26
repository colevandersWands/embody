import type { UserConfig } from './config/types.js';
import EMPTY from './constants/EMPTY.js';
import fillConfig from './pipeline/fill-config.js';
import filterSteps from './pipeline/filter-steps.js';
import type { Step, FilterResult } from './types/api.js';

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
 * ```
 *
 * @remarks
 * Squint is designed for post-processing workflows where you want to explore
 * different aspects of an execution without re-running the instrumentation.
 * The filtering includes metadata about what was requested but not present
 * in the trace, helping identify configuration mismatches.
 *
 * @since 1.0.0
 */

// Function overloads for proper type inference
function squint(input: { readonly steps: readonly Step[]; readonly config: UserConfig }): FilterResult;
function squint(input: { readonly config: UserConfig }): (input: { readonly steps: readonly Step[] }) => FilterResult;
function squint(input: { readonly steps: readonly Step[] }): (input: { readonly config?: UserConfig }) => FilterResult;

// Implementation with internal EMPTY handling
function squint({
  steps = EMPTY as any,
  config = EMPTY as any
}: {
  readonly steps?: readonly Step[] | typeof EMPTY;
  readonly config?: UserConfig | typeof EMPTY;
} = {}) {
  if (steps === EMPTY && config === EMPTY) {
    throw new Error('squint was called without steps or config');
  }

  if (steps === EMPTY) {
    const { config: cachedConfig } = fillConfig({ config: config as UserConfig });
    return function squintWithClosedConfig({
      steps = EMPTY as any
    }: {
      readonly steps: readonly Step[] | typeof EMPTY;
    } = {} as { readonly steps: readonly Step[] | typeof EMPTY }) {
      if (steps === EMPTY) {
        throw new Error('squint was called with a closed config, and no steps');
      }
      return filterSteps({ steps, config: cachedConfig });
    };
  }

  if (config === EMPTY) {
    return function squintWithClosedSteps({
      config = EMPTY as any
    }: {
      readonly config?: UserConfig | typeof EMPTY;
    } = {}) {
      if (config === EMPTY) {
        throw new Error('squint was called with a closed steps, and no config');
      }
      return filterSteps({
        steps,
        ...fillConfig({ config })
      });
    };
  }

  return filterSteps({ steps, ...fillConfig({ config }) });
}

export default squint;
