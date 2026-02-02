/**
 * @file Main entry point for the embody execution tracer
 *
 * This is the ONLY file in the codebase that exports multiple named exports.
 * All internal files follow the default-only export convention.
 * This exception exists to provide a flexible public API for consumers.
 */

import deserialize from './api/core/deserialize.js';
import fillConfig from './api/core/fill-config.js';
import record from './api/core/record.js';
import serialize from './api/core/serialize.js';

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core types
  Step,
  TraceResult,

  // Configuration types
  UserConfig,
  ExpandedConfig,
  PresetName,

  // Input/Output types for advanced usage
  FillConfigInput,
  FillConfigOutput,
  RecordInput,
  RecordOutput,
  TraceInput,
  TraceOutput,
  SerializeInput,
  SerializeOutput,
  DeserializeInput,
  DeserializeOutput,
  PicklesInput,
  PicklesOutput,
} from './types/api.js';

// ============================================================================
// Main Public API - Named Exports
// ============================================================================

export { default as embodify } from './api/embodify/embodify.js';
export { default as embody } from './api/embody.js';
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
 * Most users should use `embody` or `embodify` wrappers instead of these pipeline functions.
 * These are exposed for educational tools that need fine-grained control
 * over the tracing process.
 */
export const tracing = {
  fillConfig,
  record,
  serialize,
  deserialize,
};

// ============================================================================
// Main Public API - Default Export (simplest, minimal interface)
// ============================================================================

export { default } from './api/trace.js';
