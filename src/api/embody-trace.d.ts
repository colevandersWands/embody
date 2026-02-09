/**
 * Type definitions for embody-trace.cjs
 * ES5 callback-style API for embody execution tracing
 */

import type { StepCore } from '../tracers/types.js';
import type { MetaConfig } from '../configuring/types.js';

/**
 * Callback signature for embodyTrace
 */
export type EmbodyTraceCallback = (
  error: Error | null,
  result: {
    readonly steps: readonly StepCore[];
    readonly config: {
      readonly meta: MetaConfig;
      readonly options: Record<string, unknown>;
    };
    readonly tracer: string;
    readonly code: string;
  } | null,
) => void;

/**
 * Traces code execution using Node.js error-first callback pattern.
 * Pure ES5 implementation (except import/export).
 *
 * @param tracer - Tracer ID (e.g., 'txt:chars', 'js:klve')
 * @param code - Source code to trace
 * @param config - Optional config with meta and/or options (defaults to {})
 * @param callback - Error-first callback (err, result)
 *
 * @throws {ArgumentInvalidError} If callback is not a function (synchronous)
 *
 * @example
 * // With config
 * embodyTrace('txt:chars', 'hello', { meta: { max: { steps: 50 } } }, (err, result) => {
 *   if (err) throw err;
 *   console.log(result.steps);
 * });
 *
 * @example
 * // Without config
 * embodyTrace('txt:chars', 'hello', (err, result) => {
 *   if (err) throw err;
 *   console.log(result.steps);
 * });
 */
declare function embodyTrace(
  tracer: string,
  code: string,
  config: Record<string, unknown>,
  callback: EmbodyTraceCallback,
): void;

declare function embodyTrace(tracer: string, code: string, callback: EmbodyTraceCallback): void;

export default embodyTrace;
