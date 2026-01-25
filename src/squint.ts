import { EMPTY } from './utils/EMPTY';
import { filterSteps } from './exports/filter-steps';
import { fillConfig } from './exports/fill-config';

import type { UserConfig } from './config/types';
import type { Step, FilterResult } from './types/api';

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
export default function squint(input: { steps: Step[]; config: UserConfig }): FilterResult;
export default function squint(input: { config: UserConfig }): (input: { steps: Step[] }) => FilterResult;
export default function squint(input: { steps: Step[] }): (input: { config?: UserConfig }) => FilterResult;

// Implementation with internal EMPTY handling
export default function squint({ steps = EMPTY as any, config = EMPTY as any }: { steps?: Step[] | typeof EMPTY; config?: UserConfig | typeof EMPTY }) {
  if (steps === EMPTY && config === EMPTY) {
    throw new Error('squint was called without steps or config');
  }

  if (steps === EMPTY) {
    const { config: cachedConfig } = fillConfig({ config: config as UserConfig });
    return function squintWithClosedConfig({ steps = EMPTY as any }: { steps: Step[] | typeof EMPTY }) {
      if (steps === EMPTY) {
        throw new Error('squint was called with a closed config, and no steps');
      }
      return filterSteps({ steps: steps as Step[], config: cachedConfig });
    };
  }

  if (config === EMPTY) {
    return function squintWithClosedSteps({ config = EMPTY as any }: { config?: UserConfig | typeof EMPTY }) {
      if (config === EMPTY) {
        throw new Error('squint was called with a closed steps, and no config');
      }
      return filterSteps({ steps: steps as Step[], ...fillConfig({ config: config as UserConfig }) });
    };
  }

  return filterSteps({ steps: steps as Step[], ...fillConfig({ config: config as UserConfig }) });
}
