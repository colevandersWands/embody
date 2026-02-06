import ConfigInvalidError from '../errors/config-invalid-error.js';
import EmbodyError from '../errors/embody-error.js';
import InternalError from '../errors/internal-error.js';
import LangUnknownError from '../errors/lang-unknown-error.js';
import dispatch from '../langs/dispatch.js';
import type { ResolvedConfig, StepCore } from '../langs/types.js';
import deepClone from '../utils/deep-clone.js';

import prepareOptions from './prepare-options.js';

/**
 * Success result from embody - returned when trace completes successfully.
 */
type EmbodySuccess = {
  readonly ok: true;
  readonly steps: readonly StepCore[];
  readonly lang: string;
  readonly code: string;
  readonly config: unknown;
  readonly resolvedConfig: ResolvedConfig;
};

/**
 * Error result from embody - returned when trace fails.
 */
type EmbodyFailure = {
  readonly ok: false;
  readonly error: EmbodyError;
  readonly lang: string;
  readonly code: string;
  readonly config: unknown;
};

/**
 * Final result type for embody after tracing.
 */
type EmbodyResult = EmbodySuccess | EmbodyFailure;

/**
 * Input for embody and closure calls.
 */
type EmbodyInput = {
  readonly lang?: string;
  readonly code?: string;
  readonly config?: unknown;
};

/**
 * State attached to embody closures (inspectable before trace).
 */
type EmbodyState = {
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined;
  readonly lang: unknown;
  readonly code: unknown;
  readonly config: unknown;
  readonly steps: undefined; // Closures haven't traced yet
};

/**
 * Callable closure with attached state properties.
 * Call to provide remaining pieces; inspect properties for current state.
 * Returns Promise<EmbodyResult> when completing, or EmbodyClosure when partial.
 */
type EmbodyClosure = EmbodyState &
  ((remaining: EmbodyInput) => Promise<EmbodyResult> | EmbodyClosure);

/**
 * Validates all fields and returns combined error or undefined.
 * Accumulates ALL type problems in one message (not recoverable).
 */
function validateInput(input: EmbodyInput): EmbodyError | undefined {
  const errors = [
    input.lang !== undefined && typeof input.lang !== 'string' ? 'lang must be string' : null,
    input.code !== undefined && typeof input.code !== 'string' ? 'code must be string' : null,
  ].filter((message): message is string => message !== null);

  if (errors.length === 0) return undefined;
  return new ConfigInvalidError('input', `embody: type errors - ${errors.join(', ')}`);
}

/**
 * Creates a "poisoned" closure that always returns the same error result.
 * Returns Promise<EmbodyFailure> to maintain async API.
 */
function createPoisonedClosure(
  state: { readonly lang: unknown; readonly code: unknown; readonly config: unknown },
  error: EmbodyError,
): EmbodyClosure {
  function poisonedClosure(_remaining: EmbodyInput): Promise<EmbodyFailure> {
    // Always return the error result wrapped in Promise - closure is poisoned
    return Promise.resolve({
      ok: false as const,
      error,
      lang: typeof state.lang === 'string' ? state.lang : '',
      code: typeof state.code === 'string' ? state.code : '',
      config: state.config,
    });
  }

  // Attach state properties to the closure
  // eslint-disable-next-line functional/immutable-data -- Intentional: decorating closure with state properties
  Object.defineProperties(poisonedClosure, {
    ok: { value: false, enumerable: true },
    error: { value: error, enumerable: true },
    lang: { value: state.lang, enumerable: true },
    code: { value: state.code, enumerable: true },
    config: { value: state.config, enumerable: true },
    steps: { value: undefined, enumerable: true }, // Closures haven't traced yet
  });

  return poisonedClosure as EmbodyClosure;
}

/**
 * Creates a valid partial closure waiting for more input.
 */
function createPartialClosure(captured: {
  readonly lang: string | undefined;
  readonly code: string | undefined;
  readonly config: unknown;
}): EmbodyClosure {
  // Deep clone config to prevent caller mutations
  const clonedConfig = captured.config === undefined ? undefined : deepClone(captured.config);
  const internalState = { ...captured, config: clonedConfig };

  // eslint-disable-next-line sonarjs/function-return-type -- Intentional: curried function returns result or closure
  function partialClosure(remaining: EmbodyInput = {}): Promise<EmbodyResult> | EmbodyClosure {
    // Check for duplicate keys (key already set, trying to set again)
    if (remaining.lang !== undefined && internalState.lang !== undefined) {
      return Promise.resolve({
        ok: false as const,
        error: new ConfigInvalidError('lang', "embody: 'lang' was already provided"),
        lang: internalState.lang,
        code: internalState.code ?? '',
        config: internalState.config,
      });
    }
    if (remaining.code !== undefined && internalState.code !== undefined) {
      return Promise.resolve({
        ok: false as const,
        error: new ConfigInvalidError('code', "embody: 'code' was already provided"),
        lang: internalState.lang ?? '',
        code: internalState.code,
        config: internalState.config,
      });
    }
    if (remaining.config !== undefined && internalState.config !== undefined) {
      return Promise.resolve({
        ok: false as const,
        error: new ConfigInvalidError('config', "embody: 'config' was already provided"),
        lang: internalState.lang ?? '',
        code: internalState.code ?? '',
        config: internalState.config,
      });
    }

    // Merge captured state with remaining input
    const mergedLang = remaining.lang ?? internalState.lang;
    const mergedCode = remaining.code ?? internalState.code;
    const mergedConfig = remaining.config === undefined ? internalState.config : remaining.config;

    // Check if we now have all three pieces
    const hasLang = typeof mergedLang === 'string';
    const hasCode = typeof mergedCode === 'string';
    const hasConfig = mergedConfig !== undefined;

    if (hasLang && hasCode && hasConfig) {
      // All three present - execute trace and return Promise
      return embodyTrace(mergedLang, mergedCode, mergedConfig);
    }

    // Still missing pieces - return another partial closure
    return createPartialClosure({ lang: mergedLang, code: mergedCode, config: mergedConfig });
  }

  // Attach state properties to the closure
  // ok = true means "valid so far" (no type errors)
  // eslint-disable-next-line functional/immutable-data -- Intentional: decorating closure with state properties
  Object.defineProperties(partialClosure, {
    ok: { value: true, enumerable: true },
    error: { value: undefined, enumerable: true },
    lang: { value: internalState.lang, enumerable: true },
    code: { value: internalState.code, enumerable: true },
    config: {
      value: internalState.config === undefined ? undefined : deepClone(internalState.config),
      enumerable: true,
    },
    steps: { value: undefined, enumerable: true }, // Closures haven't traced yet
  });

  return partialClosure as EmbodyClosure;
}

/**
 * Execute the actual trace and return Promise<EmbodyResult>.
 */
function embodyTrace(lang: string, code: string, config: unknown): Promise<EmbodyResult> {
  return Promise.resolve().then(() => performTrace(lang, code, config));
}

/**
 * Performs the actual trace operation (async).
 */
async function performTrace(lang: string, code: string, config: unknown): Promise<EmbodyResult> {
  try {
    // Find language module
    const langRecord = dispatch[lang];
    if (typeof langRecord !== 'function') {
      return {
        ok: false,
        error: new LangUnknownError(lang, {
          cause: { available: Object.keys(dispatch) },
        }),
        code,
        lang,
        config,
      };
    }

    // Prepare both meta and options (fill defaults + verify)
    const userConfig = (config === null ? {} : config) as {
      readonly meta?: Readonly<Record<string, unknown>>;
      readonly options?: Readonly<Record<string, unknown>>;
    };
    const { meta, options } = prepareOptions(lang, userConfig);

    // Call the language's record function with fully-filled config
    const result = await langRecord(code, { meta, options });

    // Deep clone steps and resolvedConfig for immutability
    return {
      ok: true,
      steps: deepClone(result.steps),
      code,
      lang,
      config,
      resolvedConfig: deepClone(result.config),
    };
  } catch (caughtError) {
    if (caughtError instanceof EmbodyError) {
      return { ok: false, error: caughtError, code, config, lang };
    }
    const message = caughtError instanceof Error ? caughtError.message : String(caughtError);
    const cause = caughtError instanceof Error ? caughtError : undefined;
    return { ok: false, error: new InternalError(message, { cause }), code, config, lang };
  }
}

/**
 * Safe tracing function with smart partial application and eager type validation.
 *
 * Returns Promise<EmbodyResult> when all three fields provided.
 * Returns EmbodyClosure (partial closure) when missing fields.
 * Type errors are caught eagerly and "poison" the closure.
 *
 * Config semantics:
 * - `null` = use defaults → triggers trace (returns Promise)
 * - `undefined` or missing = waiting → returns closure
 * - `{...}` = use this config → triggers trace (returns Promise)
 *
 * Deep clones config to prevent caller mutations affecting internal state.
 */
// eslint-disable-next-line sonarjs/function-return-type -- Intentional: curried function returns result or closure
function embody(input: EmbodyInput = {}): Promise<EmbodyResult> | EmbodyClosure {
  const { lang, code, config } = input;

  // Eager type validation - first error wins, creates poisoned closure
  const validationError = validateInput(input);
  if (validationError) {
    return createPoisonedClosure({ lang, code, config }, validationError);
  }

  // At this point, lang and code are either undefined or string (validated)
  const validLang = lang;
  const validCode = code;

  // Deep clone config on entry to prevent caller mutations
  const clonedConfig = config === undefined ? undefined : deepClone(config);

  // Check if we have all three required pieces (config can be null but not undefined)
  const hasLang = typeof validLang === 'string';
  const hasCode = typeof validCode === 'string';
  const hasConfig = clonedConfig !== undefined;

  if (hasLang && hasCode && hasConfig) {
    // All three present - execute trace and return Promise
    return embodyTrace(validLang, validCode, clonedConfig);
  }

  // Missing pieces - return partial closure with state properties
  return createPartialClosure({ lang: validLang, code: validCode, config: clonedConfig });
}

export default embody;
