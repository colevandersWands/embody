import createConfig from '../../configuring/create.js';
import type { ExpandedConfig } from '../../configuring/types.js';
import type { FilterStepsInput, FilterStepsOutput } from '../../types/api.js';
import type { Step } from '../../types/api.js';

/**
 * Filters existing trace steps based on configuration settings.
 *
 * This function applies configuration filters to an existing trace,
 * allowing different analytical perspectives without re-execution.
 * It's the core implementation behind the `squint` function.
 *
 * @example
 * ```typescript
 * const result = filterSteps({
 *   steps: existingTrace,
 *   config: expandedConfig
 * });
 * // result.steps contains filtered trace events
 * ```
 *
 * @param input - Object containing steps to filter and configuration
 * @returns Object with filtered steps and config
 * @throws {Error} If steps is not an array, or config is not an object
 *
 * @remarks
 * The filtering applies the same configuration structure used for tracing,
 * but to post-process existing data.
 *
 * Filter logic respects the configuration hierarchy:
 * - If a category is disabled (e.g., `variables: false`), all its events are filtered out
 * - If specific filters are provided (e.g., `variables.filter: ['x']`), only matching events pass
 * - Multiple filter criteria are combined based on the configuration structure
 *
 * @since 1.0.0
 */
function filterSteps({
  steps,
  config,
}: { readonly steps?: readonly Step[]; readonly config?: ExpandedConfig } = {}): FilterStepsOutput {
  if (steps !== undefined && !Array.isArray(steps)) {
    throw new Error(`filterSteps: expected steps to be an array, got ${typeof steps}`);
  }
  if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(
      `filterSteps: expected config to be an object, got ${
        Array.isArray(config) ? 'array' : typeof config
      }`,
    );
  }

  const resolvedSteps = steps ?? ([] as readonly Step[]);
  const resolvedConfig = config ?? createConfig({});

  // TODO: Implement filtering logic based on config
  // For now, pass through unchanged
  return {
    steps: resolvedSteps,
    config: resolvedConfig,
  };
}

export default filterSteps;
