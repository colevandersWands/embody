/**
 * @file Type map for the embody codebase
 *
 * This file provides a discoverable entry point for types.
 * Each namespace corresponds to a module with types.
 * For detailed type definitions, explore the source module.
 *
 * Usage:
 *   import * as types from './types.js';
 *   const step: types.tracers.StepCore = { ... };
 *
 *   // Or destructured:
 *   import { api, tracers } from './types.js';
 *   const result: api.TraceResult = { ... };
 */

export * as api from './api/types.js';
export * as errors from './errors/types.js';
export * as tracers from './tracers/types.js';
export * as charsTracer from './tracers/txt-chars/types.js';
export * as configuring from './configuring/types.js';
