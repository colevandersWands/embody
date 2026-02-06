/**
 * @file Chainable tracing with immutable state management and recoverable validation.
 *
 * Creates chains that accumulate state through `.set()` and execute
 * through `.trace()`. Each operation returns a NEW chain (immutability).
 * Type errors are validated on every state change and can be fixed with `.set()`.
 *
 * @example
 * ```js
 * const chain = await embodify({ lang: 'chars' })
 *   .set({ code: 'hello' })
 *   .trace();
 *
 * if (chain.ok) console.log(chain.steps);
 * ```
 */

import ConfigInvalidError from '../errors/config-invalid-error.js';
import EmbodyError from '../errors/embody-error.js';
import InternalError from '../errors/internal-error.js';
import LangUnknownError from '../errors/lang-unknown-error.js';
import dispatch from '../langs/dispatch.js';
import type { ResolvedConfig, StepCore } from '../langs/types.js';
import deepClone from '../utils/deep-clone.js';

import prepareOptions from './prepare-options.js';

/**
 * Internal chain state.
 */
type ChainState = {
  readonly lang: unknown;
  readonly code: unknown;
  readonly config: unknown;
  readonly resolvedConfig: ResolvedConfig | undefined;
  readonly steps: readonly StepCore[] | null;
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined;
};

/**
 * Input for embodify and .set() method.
 */
type EmbodifyInput = {
  readonly lang?: unknown;
  readonly code?: unknown;
  readonly config?: unknown;
};

/**
 * Input for .trace() method - accepts all keys for error recovery.
 */
type TraceMethodInput = {
  readonly lang?: unknown;
  readonly code?: unknown;
  readonly config?: unknown;
};

/**
 * The chain object with getters and methods.
 * - `config`: what the user passed (deep cloned on access)
 * - `resolvedConfig`: resolved config with lang defaults (deep cloned on access)
 * - `steps`: trace steps (deep cloned on access)
 */
type EmbodifyChain = {
  readonly lang: unknown;
  readonly code: unknown;
  readonly config: unknown;
  readonly resolvedConfig: ResolvedConfig | undefined;
  readonly steps: readonly StepCore[] | null;
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined;
  readonly set: (input: EmbodifyInput) => EmbodifyChain;
  readonly trace: (input?: TraceMethodInput) => Promise<EmbodifyChain>;
};

/**
 * Validates all fields in state, returns combined error or undefined.
 * Checks ALL type problems and combines them into one message.
 */
function validateState(state: {
  readonly lang: unknown;
  readonly code: unknown;
  readonly config: unknown;
}): EmbodyError | undefined {
  const errors = [
    state.lang !== undefined && typeof state.lang !== 'string' ? 'lang must be string' : null,
    state.code !== undefined && typeof state.code !== 'string' ? 'code must be string' : null,
  ].filter((message): message is string => message !== null);

  if (errors.length === 0) return undefined;
  return new ConfigInvalidError('config', `embodify: type errors - ${errors.join(', ')}`);
}

/**
 * Performs the trace operation (async).
 */
async function performTrace(mergedState: {
  readonly lang: unknown;
  readonly code: unknown;
  readonly config: unknown;
}): Promise<EmbodifyChain> {
  // Validate merged state (can add errors OR clear old errors)
  const validationError = validateState(mergedState);
  if (validationError) {
    return embodifyChain({
      ...mergedState,
      resolvedConfig: undefined,
      steps: null,
      ok: false,
      error: validationError,
    });
  }

  const { lang, code, config } = mergedState;

  // Validate required fields (necessity errors - lazy)
  if (typeof lang !== 'string') {
    return embodifyChain({
      ...mergedState,
      resolvedConfig: undefined,
      steps: null,
      ok: false,
      error: new ConfigInvalidError('lang', 'embodify: lang is required'),
    });
  }

  if (typeof code !== 'string') {
    return embodifyChain({
      ...mergedState,
      resolvedConfig: undefined,
      steps: null,
      ok: false,
      error: new ConfigInvalidError('code', 'embodify: code is required'),
    });
  }

  // Find language module
  const langRecord = dispatch[lang];
  if (typeof langRecord !== 'function') {
    return embodifyChain({
      ...mergedState,
      resolvedConfig: undefined,
      steps: null,
      ok: false,
      error: new LangUnknownError(lang, { cause: { available: Object.keys(dispatch) } }),
    });
  }

  try {
    // Prepare both meta and options (fill defaults + verify)
    const userConfig = (config ?? {}) as {
      readonly meta?: Readonly<Record<string, unknown>>;
      readonly options?: Readonly<Record<string, unknown>>;
    };
    const { meta, options } = prepareOptions(lang, userConfig);

    // Call the language's record function with fully-filled config
    const result = await langRecord(code, { meta, options });
    return embodifyChain({
      ...mergedState,
      resolvedConfig: result.config,
      steps: result.steps,
      ok: true,
      error: undefined,
    });
  } catch (caughtError) {
    if (caughtError instanceof EmbodyError) {
      return embodifyChain({
        ...mergedState,
        resolvedConfig: undefined,
        steps: null,
        ok: false,
        error: caughtError,
      });
    }
    const message = caughtError instanceof Error ? caughtError.message : String(caughtError);
    return embodifyChain({
      ...mergedState,
      resolvedConfig: undefined,
      steps: null,
      ok: false,
      error: new InternalError(message),
    });
  }
}

/**
 * Creates an immutable chain for building up trace state.
 * Getters return deep cloned copies for immutability.
 * Type validation happens on every state change (recoverable).
 */
function embodifyChain(state: ChainState): EmbodifyChain {
  return {
    get lang() {
      return state.lang;
    },
    get code() {
      return state.code;
    },
    get config() {
      // Deep clone for immutability
      return state.config === undefined ? undefined : deepClone(state.config);
    },
    get resolvedConfig() {
      // Deep clone for immutability
      return state.resolvedConfig === undefined ? undefined : deepClone(state.resolvedConfig);
    },
    get steps() {
      // Deep clone for immutability
      return state.steps === null ? null : deepClone(state.steps);
    },
    get ok() {
      return state.ok;
    },
    get error() {
      return state.error;
    },
    set(input: EmbodifyInput): EmbodifyChain {
      // Build new state
      const newState = {
        lang: input.lang ?? state.lang,
        code: input.code ?? state.code,
        config: input.config ?? state.config,
      };

      // Validate the new state (recoverable - all errors combined)
      const validationError = validateState(newState);

      // Return new chain with validation result, invalidate trace result
      // ok = true means "valid so far" (no type errors)
      return embodifyChain({
        ...newState,
        resolvedConfig: undefined,
        steps: null,
        ok: validationError ? false : true,
        error: validationError,
      });
    },
    trace(input: TraceMethodInput = {}): Promise<EmbodifyChain> {
      // Merge input with current state (allows error recovery)
      const mergedState = {
        lang: input.lang ?? state.lang,
        code: input.code ?? state.code,
        config: input.config ?? state.config,
      };

      // Wrap in Promise to maintain async API for future async lang modules
      return Promise.resolve().then(() => performTrace(mergedState));
    },
  };
}

/**
 * Creates a new chain with optional initial state.
 * Type validation happens eagerly - errors can be fixed with .set().
 */
function embodify(input: EmbodifyInput = {}): EmbodifyChain {
  // Validate initial state
  const validationError = validateState({
    lang: input.lang,
    code: input.code,
    config: input.config,
  });

  // ok = true means "valid so far" (no type errors)
  return embodifyChain({
    lang: input.lang,
    code: input.code,
    config: input.config,
    resolvedConfig: undefined,
    steps: null,
    ok: validationError ? false : true,
    error: validationError,
  });
}

export default embodify;
