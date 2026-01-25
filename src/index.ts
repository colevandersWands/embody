/**
 * @file Main entry point for the embody execution tracer
 *
 * This is the ONLY file in the codebase that exports multiple named exports.
 * All internal files follow the default-only export convention.
 * This exception exists to provide a flexible public API for consumers.
 */

import { createConfig } from './config';
import fillConfig from './exports/fill-config';
import filterSteps from './exports/filter-steps';
import instrument from './exports/instrument';
import record from './exports/record';
import trace from './exports/trace';

import type { UserConfig } from './config/types';
import type { Step } from './types/api';

// ============================================================================
// Main Public API - Named Exports
// ============================================================================

export { default as embody } from './embody';
export { default as squint } from './squint';

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core types
  Step,
  TraceResult,
  FilterResult,

  // Configuration types
  UserConfig,
  ExpandedConfig,
  PresetName,

  // Input/Output types for advanced usage
  FillConfigInput,
  FillConfigOutput,
  InstrumentInput,
  InstrumentOutput,
  RecordInput,
  RecordOutput,
  TraceInput,
  TraceOutput,
  FilterStepsInput,
  FilterStepsOutput
} from './types/api';

// ============================================================================
// Internal Pipeline Functions (Advanced Usage)
// ============================================================================

/**
 * Internal pipeline functions exposed for advanced use cases.
 *
 * These functions represent the individual stages of the tracing pipeline
 * and can be used directly for custom workflows or testing.
 *
 * @remarks
 * Most users should use `embody` or `squint` instead of these internals.
 * These are exposed for educational tools that need fine-grained control
 * over the tracing process.
 */
export const internals = {
  fillConfig,
  filterSteps,
  instrument,
  record,
  trace
};

// ============================================================================
// Simple Default Export
// ============================================================================

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
 * ```
 *
 * @param code - JavaScript code to trace
 * @param config - Optional configuration (uses defaults if not provided)
 * @returns Array of trace steps
 *
 * @since 1.0.0
 */
export default function embodyTrace(code: string = '', config: UserConfig = {}): Step[] {
  const expandedConfig = createConfig(config);
  const { steps } = trace({ code, config: expandedConfig });
  return steps;
}
