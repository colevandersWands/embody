/**
 * @file Curried tracing with events configuration.
 *
 * Returns a tracer function that can be reused with the same events config.
 * All results use the { ok, error } pattern for safe error handling.
 *
 * @example
 * ```js
 * // Create a tracer with custom events
 * const tracer = embodify('chars', { remove: ['a'], replace: {}, direction: 'lr' });
 *
 * // Trace multiple inputs with same events
 * const result1 = tracer('hello');
 * const result2 = tracer('world');
 *
 * if (result1.ok) console.log(result1.steps);
 * ```
 */

import { TraceError } from '../../langs/types.js';
import type { StepCore } from '../../langs/types.js';
import embody from '../embody.js';


/**
 * Result type for embodify tracers.
 */
type EmbodifyResult =
  | { readonly ok: true; readonly steps: readonly StepCore[] }
  | { readonly ok: false; readonly error: TraceError };

/**
 * A tracer function returned by embodify.
 */
type EmbodifyTracer = (code: string) => EmbodifyResult;

/**
 * Creates a curried tracer with pre-configured events.
 *
 * This is useful when you want to trace multiple code inputs with the
 * same events configuration. The tracer function is returned and can be
 * called multiple times efficiently.
 *
 * @param lang - Language identifier (e.g., 'chars', 'js', 'python')
 * @param events - Optional language-specific events configuration
 * @returns A tracer function that accepts code and returns EmbodifyResult
 *
 * @example
 * ```typescript
 * // Create tracer with default events
 * const tracer = embodify('chars');
 * const result = tracer('hello');
 *
 * // Create tracer with custom events
 * const customTracer = embodify('chars', { remove: ['x'], replace: {}, direction: 'rl' });
 * const result2 = customTracer('example');
 * ```
 */
function embodify(lang: string, events?: unknown): EmbodifyTracer {
  // Close over lang and events for reuse
  return function tracer(code: string): EmbodifyResult {
    return embody(lang, code, events);
  };
}

export default embodify;
