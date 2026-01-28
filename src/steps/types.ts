/**
 * @file Type definitions for the steps module.
 *
 * Foundation types for step resolution and validation.
 * Re-exports Step from the core types for convenience.
 */

import type { Step } from '../types/api.js';

/**
 * Input type for resolveSteps.
 * Accepts JSON string, parsed Step array, or undefined.
 */
export type ResolveStepsInput = string | readonly Step[] | undefined;

/**
 * Output type for resolveSteps.
 * Returns validated Step array, or undefined when input was undefined.
 */
export type ResolveStepsOutput = readonly Step[] | undefined;

// Re-export Step for consumers that import from this module
export type { Step };
