/**
 * @file Type map for the embody codebase
 *
 * This file provides a discoverable entry point for types.
 * Each namespace corresponds to a module with types.
 * For detailed type definitions, explore the source module.
 *
 * Usage:
 *   import * as types from './types.js';
 *   const step: types.langs.StepCore = { ... };
 *
 *   // Or destructured:
 *   import { api, langs } from './types.js';
 *   const result: api.TraceResult = { ... };
 */

export * as api from './api/types.js';
export * as errors from './errors/types.js';
export * as langs from './langs/types.js';
export * as charsLang from './langs/chars/types.js';
export * as configuring from './configuring/types.js';
