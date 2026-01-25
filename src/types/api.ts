/**
 * @file Public API type definitions for the embody execution tracer
 *
 * This module defines the TypeScript types for all public-facing functions,
 * including overloaded signatures for curried functions, pipeline state types,
 * and the hybrid typing approach for object-threading patterns.
 */

import type { UserConfig, ExpandedConfig } from '../config/types';
import type { SpecificTraceEvent } from '../../types';

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
export interface TraceResult {
  code: string;
  config: ExpandedConfig;
  steps: Step[];
}

// ============================================================================
// Hybrid Pipeline Types (Common Patterns)
// ============================================================================

/**
 * Base type for pipeline inputs that require configuration.
 * Uses intersection types to compose pipeline stages.
 */
export type ConfiguredInput<T = {}> = T & { config: ExpandedConfig };

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
export interface EmbodyInput {
  config?: UserConfig;
  code?: string;
}

/**
 * Embody with both config and code - returns trace immediately
 */
export interface EmbodyBothParams {
  (input: { config: UserConfig; code: string }): TraceResult;
}

/**
 * Embody with only config - returns function expecting code
 */
export interface EmbodyWithConfig {
  (input: { config: UserConfig }): (input: { code: string }) => TraceResult;
}

/**
 * Embody with only code - returns function expecting config
 */
export interface EmbodyWithCode {
  (input: { code: string }): (input: { config?: UserConfig }) => TraceResult;
}

// --- squint function overloads ---

/**
 * Input type for the squint function
 */
export interface SquintInput {
  steps?: Step[];
  config?: UserConfig;
}

/**
 * Result of filtering steps with potential metadata about the filtering
 */
export interface FilterResult {
  steps: Step[];
  config: ExpandedConfig;
  metadata?: {
    requestedButNotPresent?: string[];
    totalFiltered?: number;
    filteringSummary?: Record<string, number>;
  };
}

/**
 * Squint with both steps and config - returns filtered result immediately
 */
export interface SquintBothParams {
  (input: { steps: Step[]; config: UserConfig }): FilterResult;
}

/**
 * Squint with only config - returns function expecting steps
 */
export interface SquintWithConfig {
  (input: { config: UserConfig }): (input: { steps: Step[] }) => FilterResult;
}

/**
 * Squint with only steps - returns function expecting config
 */
export interface SquintWithSteps {
  (input: { steps: Step[] }): (input: { config?: UserConfig }) => FilterResult;
}

// ============================================================================
// Internal Pipeline Functions
// ============================================================================

// --- fillConfig ---

export interface FillConfigInput {
  config?: UserConfig;
}

export interface FillConfigOutput {
  config: ExpandedConfig;
}

// --- instrument ---

export interface InstrumentInput extends ConfiguredInput<{
  code: string;
}> {}

export interface InstrumentOutput extends PipelineOutput<InstrumentInput, {
  instrumented: string;
}> {}

// --- record ---

export interface RecordInput extends ConfiguredInput<{
  instrumented: string;
}> {}

export interface RecordOutput extends PipelineOutput<RecordInput, {
  steps: Step[];
}> {}

// --- trace ---

export interface TraceInput extends ConfiguredInput<{
  code: string;
}> {}

export interface TraceOutput {
  code: string;
  config: ExpandedConfig;
  steps: Step[];
}

// --- filterSteps ---

export interface FilterStepsInput extends ConfiguredInput<{
  steps: Step[];
}> {}

export interface FilterStepsOutput {
  steps: Step[];
  config: ExpandedConfig;
  metadata?: {
    requestedButNotPresent?: string[];
    totalFiltered?: number;
    filteringSummary?: Record<string, number>;
  };
}

// ============================================================================
// Function Signatures with Overloads
// ============================================================================

/**
 * Main entry point for tracing JavaScript code execution.
 * Supports currying for performance optimization when reusing configurations.
 */
export interface EmbodyFunction {
  // All three overloads
  (input: { config: UserConfig; code: string }): TraceResult;
  (input: { config: UserConfig }): (input: { code: string }) => TraceResult;
  (input: { code: string }): (input: { config?: UserConfig }) => TraceResult;
}

/**
 * Post-processing filter for existing trace steps.
 * Supports currying for applying same filters to multiple traces.
 */
export interface SquintFunction {
  // All three overloads
  (input: { steps: Step[]; config: UserConfig }): FilterResult;
  (input: { config: UserConfig }): (input: { steps: Step[] }) => FilterResult;
  (input: { steps: Step[] }): (input: { config?: UserConfig }) => FilterResult;
}

/**
 * Simple default export for quick tracing without metadata
 */
export interface EmbodyTraceFunction {
  (code?: string, config?: UserConfig): Step[];
}

// ============================================================================
// Execution Limits (for record function)
// ============================================================================

/**
 * Limits that can be configured in the meta field of config
 */
export interface ExecutionLimits {
  maxSteps?: number;
  maxMemory?: number; // in MB
  maxRecursionDepth?: number;
  maxExecutionTime?: number; // in milliseconds
}

// ============================================================================
// Default Export - All API Types
// ============================================================================

/**
 * Complete collection of public API types for the embody library.
 * Exported as a single default object following codebase convention.
 */
const apiTypes = {
  // Re-export everything for type imports
  // Note: In TypeScript, we can't actually export types as values,
  // so this serves as documentation. Actual types must be imported
  // with `import type ApiTypes from './types/api'` and used as generics.
};

export default apiTypes;

// Type exports for TypeScript consumers
// These are available via: import type { Step, TraceResult, etc } from './types/api'
export type {
  // Core types
  Step,
  TraceResult,
  FilterResult,

  // Configuration
  UserConfig,
  ExpandedConfig,

  // Function signatures
  EmbodyFunction,
  SquintFunction,
  EmbodyTraceFunction,

  // Input/Output types
  EmbodyInput,
  SquintInput,
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

  // Execution limits
  ExecutionLimits,

  // Pipeline types
  ConfiguredInput,
  PipelineOutput
};