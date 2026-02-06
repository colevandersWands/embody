/**
 * @file Minimal chainable tracing API that throws on errors.
 *
 * Provides fluent interface for building trace configuration.
 * Type errors throw synchronously; semantic errors reject the Promise.
 *
 * @example
 * ```js
 * const steps = await tracify.lang('chars').code('hello').steps;
 * ```
 */

import ConfigInvalidError from '../errors/config-invalid-error.js';
import LangUnknownError from '../errors/lang-unknown-error.js';
import dispatch from '../langs/dispatch.js';
import type { ResolvedConfig, StepCore } from '../langs/types.js';
import deepClone from '../utils/deep-clone.js';

import prepareOptions from './prepare-options.js';

/**
 * Internal chain state for tracify.
 */
type TracifyState = {
  readonly lang: string | undefined;
  readonly code: string | undefined;
  readonly config: unknown;
};

/**
 * Cached trace result for memoization.
 */
type CachedResult = {
  readonly steps: readonly StepCore[];
  readonly resolvedConfig: ResolvedConfig;
};

/**
 * The chain object returned by tracify methods.
 * Uses .lang(), .code(), .config() methods for chaining.
 * Steps are memoized - traced once on first access, cached thereafter.
 * KISS: No .set() method - use .lang().code().config() instead.
 */
type TracifyChain = {
  // Chaining methods (return new chain)
  lang(langId: string): TracifyChain;
  code(source: string): TracifyChain;
  config(cfg: unknown): TracifyChain;
  // Result getters (async, deep cloned on access)
  readonly steps: Promise<readonly StepCore[]>;
  readonly resolvedConfig: Promise<ResolvedConfig>;
  readonly ok: true; // Always true (throws on error)
};

/**
 * Creates a new chain with the given state.
 * Deep clones config on entry to prevent caller mutations.
 * Memoizes trace result - computed once on first access.
 */
function tracifyChain(state: TracifyState): TracifyChain {
  // Deep clone config to prevent caller mutations
  const clonedConfig = state.config === undefined ? undefined : deepClone(state.config);
  const internalState = { ...state, config: clonedConfig };

  // Memoization: cache the trace result Promise
  let cachedPromise: Promise<CachedResult> | null = null;

  /**
   * Performs the actual trace operation (async).
   * Validates state, dispatches to lang module, returns result.
   */
  async function performTrace(): Promise<CachedResult> {
    const { lang, code, config } = internalState;

    if (typeof lang !== 'string') {
      throw new ConfigInvalidError('lang', 'tracify: lang is required');
    }

    if (typeof code !== 'string') {
      throw new ConfigInvalidError('code', 'tracify: code is required');
    }

    // Find language module
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

    // Call the language's record function with fully-filled config
    const result = await langRecord(code, { meta, options });

    return {
      steps: result.steps,
      resolvedConfig: result.config,
    };
  }

  /**
   * Executes the trace and caches the result Promise.
   * Returns Promise that rejects with EmbodyError subclass on failure.
   */
  function executeTrace(): Promise<CachedResult> {
    if (cachedPromise !== null) {
      return cachedPromise;
    }

    // Wrap in Promise to convert sync throws to rejections
    cachedPromise = Promise.resolve().then(performTrace);

    return cachedPromise;
  }

  return {
    lang(langId: string): TracifyChain {
      if (typeof langId !== 'string') {
        throw new ConfigInvalidError(
          'lang',
          `tracify.lang(): expected string, got ${typeof langId}`,
        );
      }
      return tracifyChain({ ...internalState, lang: langId });
    },
    code(source: string): TracifyChain {
      if (typeof source !== 'string') {
        throw new ConfigInvalidError(
          'code',
          `tracify.code(): expected string, got ${typeof source}`,
        );
      }
      return tracifyChain({ ...internalState, code: source });
    },
    config(cfg: unknown): TracifyChain {
      return tracifyChain({ ...internalState, config: cfg });
    },
    get steps(): Promise<readonly StepCore[]> {
      // Execute trace (memoized) and return deep clone
      return executeTrace().then((result) => deepClone(result.steps));
    },
    get resolvedConfig(): Promise<ResolvedConfig> {
      // Execute trace (memoized) and return deep clone
      return executeTrace().then((result) => deepClone(result.resolvedConfig));
    },
    get ok(): true {
      // Always true for tracify (it throws/rejects instead of returning ok: false)
      return true;
    },
  };
}

/**
 * Entry point for tracify - an object with chainable methods.
 */
const tracify: TracifyChain = tracifyChain({
  lang: undefined,
  code: undefined,
  config: undefined,
});

export default tracify;
