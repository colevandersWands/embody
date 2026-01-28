/**
 * @file Main entry point for the embody execution tracer
 *
 * This is the ONLY file in the codebase that exports multiple named exports.
 * All internal files follow the default-only export convention.
 * This exception exists to provide a flexible public API for consumers.
 */

import fillConfig from './api/tracing/fill-config.js';
import filterSteps from './api/tracing/filter-steps.js';
import instrument from './api/tracing/instrument.js';
import record from './api/tracing/record.js';
import instrumentRecord from './api/tracing/instrument-record.js';
import serialize from './api/tracing/serialize.js';
import deserialize from './api/tracing/deserialize.js';

import trace from './trace.js';

// ============================================================================
// Main Public API - Default Export
// ============================================================================

export default trace;

// ============================================================================
// Main Public API - Named Exports
// ============================================================================

export { default as embodify } from './api/embodify/embodify.js';
export { default as embody } from './api/embody.js';
export { default as squint } from './api/squint.js';
export { default as pickles } from './api/pickles.js';

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
 * Most users should use `embody` or `squint` wrappers instead of these pipeline functions.
 * These are exposed for educational tools that need fine-grained control
 * over the tracing process.
 */
export const tracing = {
  fillConfig,
  filterSteps,
  instrument,
  record,
  instrumentRecord,
  serialize,
  deserialize,
};

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
  FilterStepsOutput,
  SerializeInput,
  SerializeOutput,
  DeserializeInput,
  DeserializeOutput,
  PicklesInput,
  PicklesOutput,
} from './types/api.js';
