/**
 * @file Public API type definitions for the embody execution tracer
 *
 * This module defines the TypeScript types for all public-facing functions,
 * including overloaded signatures for curried functions, pipeline state types,
 * and the hybrid typing approach for object-threading patterns.
 */

import type { UserConfig, ExpandedConfig } from '../configuring/types.js';
import type { SpecificTraceEvent } from '../instrument/types.js';

// ============================================================================
// Core Types
// ============================================================================

/**
 * A single step in the execution trace.
 * This is the primary unit of trace data returned by embody.
 */
export type Step = SpecificTraceEvent;

/**
 * The result of a complete trace execution
 */
export type TraceResult = {
  readonly code: string;
  readonly config: ExpandedConfig;
  readonly steps: readonly Step[];
};

// ============================================================================
// Hybrid Pipeline Types (Common Patterns)
// ============================================================================

/**
 * Base type for pipeline inputs that require configuration.
 * Uses intersection types to compose pipeline stages.
 */
export type ConfiguredInput<T = {}> = T & { readonly config: ExpandedConfig };

/**
 * Base type for pipeline outputs that preserve input data.
 * Pipeline stages typically add new fields while preserving existing ones.
 */
export type PipelineOutput<TIn, TAdded> = TIn & TAdded;

// ============================================================================
// Main API Functions (embody and squint)
// ============================================================================

// --- embody function overloads ---

/**
 * Input type for the embody function
 */
export type EmbodyInput = {
  readonly config?: UserConfig;
  readonly code?: string;
};

/**
 * Embody with both config and code - returns trace immediately
 */
export type EmbodyBothParams = {
  (input: { readonly config: UserConfig; readonly code: string }): TraceResult;
};

/**
 * Embody with only config - returns function expecting code
 */
export type EmbodyWithConfig = {
  (input: { readonly config: UserConfig }): (input: { readonly code: string }) => TraceResult;
};

/**
 * Embody with only code - returns function expecting config
 */
export type EmbodyWithCode = {
  (input: { readonly code: string }): (input: { readonly config?: UserConfig }) => TraceResult;
};

// --- squint function overloads ---

/**
 * Input type for the squint function
 */
export type SquintInput = {
  readonly steps?: readonly Step[];
  readonly config?: UserConfig;
};

/**
 * Result of filtering steps
 */
export type FilterResult = {
  readonly steps: readonly Step[];
  readonly config: ExpandedConfig;
};

/**
 * Squint with both steps and config - returns filtered result immediately
 */
export type SquintBothParams = {
  (input: { readonly steps: readonly Step[]; readonly config: UserConfig }): FilterResult;
};

/**
 * Squint with only config - returns function expecting steps
 */
export type SquintWithConfig = {
  (input: {
    readonly config: UserConfig;
  }): (input: { readonly steps: readonly Step[] }) => FilterResult;
};

/**
 * Squint with only steps - returns function expecting config
 */
export type SquintWithSteps = {
  (input: {
    readonly steps: readonly Step[];
  }): (input: { readonly config?: UserConfig }) => FilterResult;
};

// ============================================================================
// Internal Pipeline Functions
// ============================================================================

// --- fillConfig ---

export type FillConfigInput = {
  readonly config?: UserConfig;
};

export type FillConfigOutput = {
  readonly config: ExpandedConfig;
};

// --- instrument ---

export type InstrumentInput = {} & ConfiguredInput<{
  readonly code: string;
}>;

export type InstrumentOutput = {} & PipelineOutput<
  InstrumentInput,
  {
    readonly instrumented: string;
  }
>;

// --- record ---

export type RecordInput = {} & ConfiguredInput<{
  readonly instrumented: string;
}>;

export type RecordOutput = {} & PipelineOutput<
  RecordInput,
  {
    readonly steps: readonly Step[];
  }
>;

// --- trace ---

export type TraceInput = {} & ConfiguredInput<{
  readonly code: string;
}>;

export type TraceOutput = {
  readonly code: string;
  readonly config: ExpandedConfig;
  readonly steps: readonly Step[];
};

// --- filterSteps ---

export type FilterStepsInput = {} & ConfiguredInput<{
  readonly steps: readonly Step[];
}>;

export type FilterStepsOutput = {
  readonly steps: readonly Step[];
  readonly config: ExpandedConfig;
};

// --- serialize ---

export type SerializeInput = { readonly steps: readonly Step[] } | { readonly config: UserConfig };

export type SerializeOutput = string;

// --- deserialize ---

export type DeserializeInput = {
  readonly steps?: string | readonly Step[] | undefined;
  readonly config?: string | UserConfig | undefined;
};

export type DeserializeOutput = {
  readonly steps: readonly Step[] | undefined;
  readonly config: UserConfig | undefined;
};

// --- pickles ---

export type PicklesInput = {
  readonly steps?: readonly Step[] | string;
  readonly config?: UserConfig | string;
};

export type PicklesOutput =
  | { readonly steps: string }
  | { readonly steps: readonly Step[] }
  | { readonly config: string }
  | { readonly config: UserConfig }
  | { readonly steps: string; readonly config: string }
  | { readonly steps: readonly Step[]; readonly config: UserConfig }
  | { readonly steps: string; readonly config: UserConfig }
  | { readonly steps: readonly Step[]; readonly config: string };

// ============================================================================
// Function Signatures with Overloads
// ============================================================================

/**
 * Main entry point for tracing JavaScript code execution.
 * Supports currying for performance optimization when reusing configurations.
 *
 * Config accepts UserConfig object or JSON string (pickle format).
 */
export type EmbodyFunction = {
  // All three overloads - config can be object or pickle string
  (input: { readonly config: UserConfig | string; readonly code: string }): TraceResult;
  (input: {
    readonly config: UserConfig | string;
  }): (input: { readonly code: string }) => TraceResult;
  (input: {
    readonly code: string;
  }): (input: { readonly config?: UserConfig | string }) => TraceResult;
};

/**
 * Post-processing filter for existing trace steps.
 * Supports currying for applying same filters to multiple traces.
 *
 * Steps and config can be objects or JSON strings (pickle format).
 */
export type SquintFunction = {
  // All three overloads - steps and config can be objects or pickle strings
  (input: {
    readonly steps: readonly Step[] | string;
    readonly config: UserConfig | string;
  }): FilterResult;
  (input: {
    readonly config: UserConfig | string;
  }): (input: { readonly steps: readonly Step[] | string }) => FilterResult;
  (input: {
    readonly steps: readonly Step[] | string;
  }): (input: { readonly config?: UserConfig | string }) => FilterResult;
};

/**
 * Simple default export for quick tracing without metadata.
 * Config accepts UserConfig object or JSON string (pickle format).
 */
export type EmbodyTraceFunction = {
  (code?: string, config?: UserConfig | string): readonly Step[];
};

// ============================================================================
// Execution Limits (for record function)
// ============================================================================

/**
 * Limits that can be configured in the meta field of config
 */
export type ExecutionLimits = {
  readonly maxSteps?: number;
  readonly maxMemory?: number; // in MB
  readonly maxRecursionDepth?: number;
  readonly maxExecutionTime?: number; // in milliseconds
};

// ============================================================================
// Re-exports from configuring module (for public API consumers)
// ============================================================================

export type { UserConfig, ExpandedConfig, PresetName } from '../configuring/types.js';
