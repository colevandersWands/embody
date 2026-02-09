/**
 * @file Main entry point for the embody execution tracer
 *
 * This is the entry point in the codebase for exporting multiple named exports.
 * All internal files follow the default-only export convention.
 * This exception exists to provide a flexible public API for consumers.
 */

// ============================================================================
// Type Exports
// ============================================================================

export type { StepCore } from './tracers/types.js';

// ============================================================================
// Error Classes (for instanceof checks)
// ============================================================================

export { default as EmbodyError } from './errors/embody-error.js';
export { default as ArgumentInvalidError } from './errors/argument-invalid-error.js';
export { default as InternalError } from './errors/internal-error.js';
export { default as TracerUnknownError } from './errors/tracer-unknown-error.js';
export { default as LimitExceededError } from './errors/limit-exceeded-error.js';
export { default as OptionsInvalidError } from './errors/options-invalid-error.js';
export { default as OptionsSemanticInvalidError } from './errors/options-semantic-invalid-error.js';
export { default as ParseError } from './errors/parse-error.js';
export { default as RuntimeError } from './errors/runtime-error.js';

// ============================================================================
// Tracer Registry (for discovery, schema access, dynamic bundling)
// ============================================================================

export { default as tracers } from './tracers/index.js';
export { default as metaSchema } from './tracers/meta.schema.json';

// ============================================================================
// Main Public API - Named Exports
// ============================================================================

// Safe APIs (return {ok, error})
export { default as embody } from './api/embody.js';
export { default as embodify } from './api/embodify.js';

// Throwing APIs
export { default as trace } from './api/trace.js';
export { default as tracify } from './api/tracify.js';

// Class-based APIs
export { default as Tracer } from './api/Tracer.js';
export { default as Embodier } from './api/Embodier.js';

// Callback-style API (ES5 compatible)
// @ts-expect-error - .cjs file with separate .d.ts type definitions
export { default as embodyTrace } from './api/embody-trace.cjs';

// ============================================================================
// Main Public API - Default Export (simplest, minimal interface)
// ============================================================================

export { default } from './api/trace.js';
