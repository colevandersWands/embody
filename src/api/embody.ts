import { TraceError } from '../langs/types.js';
import type { StepCore } from '../langs/types.js';

import trace from './trace.js';


/**
 * Result type for embody - either success with steps or error with details.
 */
type EmbodyResult =
  | { readonly ok: true; readonly steps: readonly StepCore[] }
  | { readonly ok: false; readonly error: TraceError };

/**
 * Safe tracing function that returns result objects instead of throwing.
 *
 * Unlike `trace` which throws on errors, `embody` returns a result object
 * with `ok: true` and `steps` on success, or `ok: false` and `error` on failure.
 * This is useful for applications that need graceful error handling.
 *
 * @example
 * ```typescript
 * import { embody } from '@study-lenses/embody';
 *
 * const result = embody('chars', 'hello');
 * if (result.ok) {
 *   console.log(result.steps);
 * } else {
 *   console.error(result.error.code, result.error.message);
 * }
 * ```
 *
 * @param lang - Language identifier (e.g., 'chars', 'js', 'python')
 * @param code - Code/input to trace
 * @param events - Optional language-specific events configuration
 * @returns EmbodyResult with ok: true and steps, or ok: false and error
 */
function embody(lang: string, code: string, events?: unknown): EmbodyResult {
  try {
    const steps = trace(lang, code, events);
    return { ok: true, steps };
  } catch (error) {
    if (error instanceof TraceError) {
      return { ok: false, error };
    }
    // Wrap unexpected errors in TraceError
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: new TraceError('INTERNAL', message) };
  }
}

export default embody;
