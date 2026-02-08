/**
 * @file Main entry point for js-klve tracer.
 *
 * Adapts the tracer to embody's TracerModule interface.
 * Signature: record(code, { meta, options })
 */

import LimitExceededError from '../../errors/limit-exceeded-error.js';
import ParseError from '../../errors/parse-error.js';
import RuntimeError from '../../errors/runtime-error.js';
import type { MetaConfig } from '../types.js';

import filterSteps from './filter-steps.js';
import trace from './tracer.js';
import type { JsKlveOptions, JsKlveStep } from './types.js';

/**
 * Records execution trace for JavaScript code.
 *
 * Uses Babel to instrument code, executes it, and returns step-by-step
 * trace data. Applies post-execution filtering based on options.
 *
 * @param code - JavaScript source code to trace
 * @param config - Configuration object with meta (limits) and options (filter)
 * @returns Promise resolving to filtered trace steps
 * @throws ParseError if code has syntax errors
 * @throws RuntimeError if code has runtime errors
 * @throws LimitExceededError if trace exceeds meta.max.steps or meta.max.time
 */
async function record(
  code: string,
  config: { readonly meta: MetaConfig; readonly options: JsKlveOptions },
): Promise<readonly JsKlveStep[]> {
  const { meta, options } = config;

  // Trace the code with limits enforced during execution
  let rawSteps;
  try {
    rawSteps = await trace(code, {
      maxSteps: meta.max.steps,
      maxTime: meta.max.time,
    });
  } catch (error) {
    // Let embody errors pass through (LimitExceededError from report())
    if (error instanceof LimitExceededError) {
      throw error;
    }

    // Convert Babel syntax errors to ParseError
    if (error instanceof SyntaxError) {
      // Extract location from Babel error message if possible
      const match = (error.message ?? '').match(/\((\d+):(\d+)\)/);
      const loc = match
        ? { line: Number.parseInt(match[1], 10), column: Number.parseInt(match[2], 10) }
        : { line: 1, column: 0 };
      throw new ParseError(error.message, loc);
    }

    // Re-throw other errors as RuntimeError
    if (error instanceof Error) {
      throw new RuntimeError(error.message, { line: 1, column: 0 });
    }

    throw error;
  }

  // Apply filter configuration from options
  const filteredSteps = filterSteps(rawSteps, options.filter ?? {});

  // Renumber steps to start at 1 (tracer uses 0-indexed internally)
  const renumberedSteps = filteredSteps.map((step, index) => ({
    ...step,
    step: index + 1,
  }));

  return renumberedSteps;
}

export default record;
