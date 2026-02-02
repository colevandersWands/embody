/**
 * @file Chainable tracing pipeline with { ok, error } results.
 *
 * Builds immutable chain links for pipeline-style tracing.
 * Each method returns a new chain link with result accessible via getters.
 *
 * @example
 * ```js
 * const chain = chainEmbodify({ lang: 'chars', code: 'hello' });
 *
 * // Access result
 * if (chain.ok) {
 *   console.log(chain.steps);
 * } else {
 *   console.error(chain.error);
 * }
 *
 * // Chain with new code
 * const chain2 = chain.set({ code: 'world' });
 * ```
 */

import dispatch from '../../langs/dispatch.js';
import { TraceError } from '../../langs/types.js';
import type { StepCore } from '../../langs/types.js';

/**
 * Internal chain state
 */
type ChainState = {
  readonly lang: string;
  readonly code: string;
  readonly events: unknown;
  readonly _cachedResult?: ChainResult;
};

/**
 * Result type for chain operations
 */
type ChainResult =
  | { readonly ok: true; readonly steps: readonly StepCore[] }
  | { readonly ok: false; readonly error: TraceError };

/**
 * Input for set() method
 */
type SetInput = {
  readonly code?: string;
  readonly events?: unknown;
};

/**
 * Executes trace and returns result
 */
function executeTrace(lang: string, code: string, events: unknown): ChainResult {
  try {
    const langModule = dispatch[lang as keyof typeof dispatch];
    if (!langModule) {
      const available = Object.keys(dispatch).join(', ');
      return {
        ok: false,
        error: new TraceError(
          'LANG_UNKNOWN',
          `chainEmbodify: unknown language '${lang}'. Available: ${available}`,
        ),
      };
    }

    const resolvedEvents = events ?? langModule.events;
    const steps = langModule.record(code, resolvedEvents);
    return { ok: true, steps };
  } catch (error) {
    if (error instanceof TraceError) {
      return { ok: false, error };
    }
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: new TraceError('INTERNAL', message) };
  }
}

/**
 * Creates a chainable pipeline link for tracing.
 *
 * @param state - Chain state with lang, code, and optional events
 * @returns Chainable link with result getters and methods
 */
function chainEmbodify(state: ChainState) {
  // Lazy-compute result on first access
  function getResult(): ChainResult {
    if (state._cachedResult) return state._cachedResult;
    return executeTrace(state.lang, state.code, state.events);
  }

  const chainLink = {
    // === State Getters ===

    /** Language identifier */
    get lang() {
      return state.lang;
    },

    /** Source code/input */
    get code() {
      return state.code;
    },

    /** Events configuration */
    get events() {
      return state.events;
    },

    // === Result Getters ===

    /** Whether trace succeeded */
    get ok() {
      return getResult().ok;
    },

    /** Error if trace failed (undefined if ok) */
    get error(): TraceError | undefined {
      const result = getResult();
      return result.ok ? undefined : result.error;
    },

    /** Trace steps if succeeded (empty array if failed) */
    get steps(): readonly StepCore[] {
      const result = getResult();
      return result.ok ? result.steps : [];
    },

    /** Full result object */
    get result(): ChainResult {
      return getResult();
    },

    // === Chain Methods ===

    /**
     * Creates new chain with updated state.
     * Resets cached result since inputs changed.
     */
    set(input: SetInput) {
      return chainEmbodify({
        lang: state.lang,
        code: input.code ?? state.code,
        events: input.events ?? state.events,
      });
    },

    /**
     * Creates new chain with new code.
     */
    withCode(code: string) {
      return chainEmbodify({
        lang: state.lang,
        code,
        events: state.events,
      });
    },

    /**
     * Creates new chain with new events.
     */
    withEvents(events: unknown) {
      return chainEmbodify({
        lang: state.lang,
        code: state.code,
        events,
      });
    },
  };

  return chainLink;
}

export default chainEmbodify;
