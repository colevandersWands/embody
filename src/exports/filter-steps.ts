import { createConfig } from '../config';

import type { FilterStepsInput, FilterStepsOutput } from '../types/api';
import type { ExpandedConfig } from '../config/types';
import type { Step } from '../types/api';

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
 * // result.metadata contains information about the filtering process
 * ```
 *
 * @param input - Object containing steps to filter and configuration
 * @returns Object with filtered steps, config, and optional metadata
 *
 * @remarks
 * The filtering applies the same configuration structure used for tracing,
 * but to post-process existing data. If the configuration requests events
 * that weren't captured in the original trace, the metadata field will
 * indicate what was requested but not present.
 *
 * Filter logic respects the configuration hierarchy:
 * - If a category is disabled (e.g., `variables: false`), all its events are filtered out
 * - If specific filters are provided (e.g., `variables.filter: ['x']`), only matching events pass
 * - Multiple filter criteria are combined based on the configuration structure
 *
 * @since 1.0.0
 */
export default function filterSteps({ steps = [] as Step[], config = createConfig({}) as ExpandedConfig }: FilterStepsInput): FilterStepsOutput {
  // TODO: Implement actual filtering logic based on config
  // Current stub implementation for development

  // Will eventually return metadata about filtering
  // For now, pass through unchanged
  return {
    steps,
    config,
    // metadata will be populated when filtering is implemented
    // e.g., metadata: { requestedButNotPresent: ['asyncEvents'], totalFiltered: 10 }
  };
}
