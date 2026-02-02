import dispatch from '../langs/dispatch.js';
import { TraceError } from '../langs/types.js';
import type { StepCore } from '../langs/types.js';

/**
 * Simple tracing function for quick usage.
 *
 * Returns just the trace steps array without metadata. Useful for simple
 * scripts or when you don't need the full trace metadata.
 *
 * @example
 * ```typescript
 * import { trace } from '@study-lenses/embody';
 *
 * // Trace with default events for the language
 * const steps = trace('chars', 'hello');
 *
 * // Trace with custom events
 * const steps = trace('chars', 'hello', { remove: ['l'], replace: {}, direction: 'lr' });
 * ```
 *
 * @param lang - Language identifier (e.g., 'chars', 'js', 'python')
 * @param code - Code/input to trace
 * @param events - Optional language-specific events configuration
 * @returns Array of trace steps
 * @throws {TraceError} LANG_UNKNOWN if language is not supported
 * @throws {TraceError} CONFIG_INVALID if code is not a string
 * @throws {TraceError} Language-specific errors from the record function
 */
function trace(
  lang: string,
  code: string,
  events?: unknown,
): readonly StepCore[] {
  // Validate lang parameter
  if (typeof lang !== 'string' || lang.trim() === '') {
    throw new TraceError('CONFIG_INVALID', 'trace: lang must be a non-empty string');
  }

  // Validate code parameter
  if (typeof code !== 'string') {
    throw new TraceError(
      'CONFIG_INVALID',
      `trace: expected code to be a string, got ${typeof code}`,
    );
  }

  // Find language module
  const langModule = dispatch[lang as keyof typeof dispatch];
  if (!langModule) {
    const available = Object.keys(dispatch).join(', ');
    throw new TraceError(
      'LANG_UNKNOWN',
      `trace: unknown language '${lang}'. Available: ${available}`,
    );
  }

  // Use default events if not provided
  const resolvedEvents = events ?? langModule.events;

  // Call the language's record function - it throws TraceError on failure
  // Each language module validates its own events
  return langModule.record(code, resolvedEvents);
}

export default trace;
