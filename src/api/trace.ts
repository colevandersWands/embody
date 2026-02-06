import ConfigInvalidError from '../errors/config-invalid-error.js';
import LangUnknownError from '../errors/lang-unknown-error.js';
import dispatch from '../langs/dispatch.js';
import type { StepCore } from '../langs/types.js';

import prepareOptions from './prepare-options.js';

/**
 * Executes the trace after type validation.
 * Handles lang lookup, config preparation, and record call.
 */
async function executeTrace(
  lang: string,
  code: string,
  config: unknown,
): Promise<readonly StepCore[]> {
  const langRecord = dispatch[lang];
  if (typeof langRecord !== 'function') {
    throw new LangUnknownError(lang, {
      cause: { available: Object.keys(dispatch) },
    });
  }

  // Prepare both meta and options (fill defaults + verify)
  const userConfig = (config ?? {}) as {
    readonly meta?: Readonly<Record<string, unknown>>;
    readonly options?: Readonly<Record<string, unknown>>;
  };
  const { meta, options } = prepareOptions(lang, userConfig);

  // Pass fully-filled config to lang record function
  const result = await langRecord(code, { meta, options });
  return result.steps;
}

/**
 * Simple tracing function for quick usage. Async — returns Promise.
 *
 * Returns just the trace steps array without metadata. Useful for simple
 * scripts or when you don't need the full trace metadata.
 *
 * Type validation happens eagerly (throws sync). Semantic errors reject the Promise.
 *
 * @example
 * ```typescript
 * import { trace } from '@study-lenses/embody';
 *
 * // Trace with default options for the language
 * const steps = await trace('chars', 'hello');
 *
 * // Trace with custom options
 * const steps = await trace('chars', 'hello', { options: { direction: 'rl' } });
 * ```
 *
 * @param lang - Language identifier (e.g., 'chars', 'js', 'python')
 * @param code - Code/input to trace
 * @param config - Optional config with { meta?, options? } structure
 * @returns Promise resolving to array of trace steps
 * @throws {ConfigInvalidError} (sync) if lang/code is not a string
 * @throws {LangUnknownError} (async) if language is not supported
 * @throws {OptionsSemanticInvalidError} (async) if verifyOptions fails
 * @throws {ParseError|RuntimeError|LimitExceededError} (async) from the record function
 */
function trace(lang: string, code: string, config?: unknown): Promise<readonly StepCore[]> {
  // Type validation throws synchronously (before Promise creation)
  if (typeof lang !== 'string' || lang.trim() === '') {
    throw new ConfigInvalidError('lang', 'trace: lang must be a non-empty string');
  }

  if (typeof code !== 'string') {
    throw new ConfigInvalidError('code', `trace: expected code to be a string, got ${typeof code}`);
  }

  // Semantic validation and execution return Promise (rejects on error)
  return Promise.resolve().then(() => executeTrace(lang, code, config));
}

export default trace;
