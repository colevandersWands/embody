/**
 * @file Public API type definitions for the embody execution tracer
 *
 * This module defines the TypeScript types for all public-facing functions,
 * including overloaded signatures for curried functions, pipeline state types,
 * and the hybrid typing approach for object-threading patterns.
 */

import type { StepCore } from '../tracers/types.js';

// ============================================================================
// Stub Types (placeholder until proper implementation in tracers/js/)
// ============================================================================

/**
 * User-provided configuration options.
 * Stub type - will be replaced when tracers/js/ is implemented.
 */
type UserConfig = Readonly<Record<string, unknown>>;

/**
 * Expanded configuration with all defaults filled.
 * Stub type - will be replaced when tracers/js/ is implemented.
 */
type ExpandedConfig = Readonly<Record<string, unknown>>;

/**
 * Specific trace event with all details.
 * Stub type - will be replaced when tracers/js/ is implemented.
 */
type SpecificTraceEvent = StepCore & Readonly<Record<string, unknown>>;

// ============================================================================
// Core Types
// ============================================================================

/**
 * A single step in the execution trace.
 * This is the primary unit of trace data returned by embody.
 */
// eslint-disable-next-line sonarjs/redundant-type-aliases -- Public API stability
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
export type ConfiguredInput<T = object> = T & { readonly config: ExpandedConfig };

/**
 * Base type for pipeline outputs that preserve input data.
 * Pipeline stages typically add new fields while preserving existing ones.
 */
export type PipelineOutput<TIn, TAdded> = TIn & TAdded;

// ============================================================================
// Main API Functions
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
export type EmbodyBothParameters = {
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

// --- record ---

export type RecordInput = ConfiguredInput<{
  readonly code: string;
}>;

export type RecordOutput = PipelineOutput<
  RecordInput,
  {
    readonly steps: readonly Step[];
  }
>;

// --- trace ---

export type TraceInput = ConfiguredInput<{
  readonly code: string;
}>;

export type TraceOutput = {
  readonly code: string;
  readonly config: ExpandedConfig;
  readonly steps: readonly Step[];
};

// ============================================================================
// Function Signatures with Overloads
// ============================================================================

/**
 * Main entry point for tracing JavaScript code execution.
 * Supports currying for performance optimization when reusing configurations.
 *
 * Config accepts UserConfig object or JSON string.
 */
export type EmbodyFunction = {
  // All three overloads - config can be object or JSON string
  (input: { readonly config: UserConfig | string; readonly code: string }): TraceResult;
  (input: {
    readonly config: UserConfig | string;
  }): (input: { readonly code: string }) => TraceResult;
  (input: {
    readonly code: string;
  }): (input: { readonly config?: UserConfig | string }) => TraceResult;
};

/**
 * Simple default export for quick tracing without metadata.
 * Config accepts UserConfig object or JSON string.
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
// Re-exports for public API consumers
// ============================================================================

export type { UserConfig, ExpandedConfig };
