/**
 * @file Chainable tracing with immutable state management.
 *
 * Creates chains that accumulate state through `.set()` and execute
 * through `.trace()`. Each operation returns a NEW chain (immutability).
 * Smart cache invalidation: only invalidate what changed.
 *
 * @example
 * ```js
 * const chain = await embodify({ tracer: 'chars' })
 *   .set({ code: 'hello' })
 *   .trace();
 *
 * if (chain.ok) console.log(chain.steps);
 * ```
 */

import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import ArgumentInvalidError from '../errors/argument-invalid-error.js';
import EmbodyError from '../errors/embody-error.js';
import InternalError from '../errors/internal-error.js';
import TracerUnknownError from '../errors/tracer-unknown-error.js';
import tracers from '../tracers/index.js';
import metaSchema from '../tracers/meta.schema.json';
import type { MetaConfig, ResolvedConfig, StepCore } from '../tracers/types.js';
import deepClone from '../utils/deep-clone.js';

/**
 * Internal chain state.
 * Input fields are readonly; cache fields are mutable for lazy computation.
 * Uses `| undefined` to satisfy exactOptionalPropertyTypes.
 */
type EmbodifyState = {
  readonly tracer: string | undefined;
  readonly code: string | undefined;
  readonly config: object | undefined;
  readonly resolvedConfig?: ResolvedConfig | undefined; // Mutable for lazy caching
  readonly steps?: readonly StepCore[] | undefined; // undefined = not computed
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined;
};

/**
 * Input for embodify and .set() method.
 * TypeScript validates types; no runtime checks needed.
 */
type EmbodifyInput = {
  readonly tracer?: string;
  readonly code?: string;
  readonly config?: object;
};

/**
 * Input for .trace() method.
 * TypeScript validates types; no runtime checks needed.
 */
type TraceMethodInput = {
  readonly tracer?: string;
  readonly code?: string;
  readonly config?: object;
};

/**
 * The chain object with getters and methods.
 * - `config`: what the user passed (deep cloned on access)
 * - `resolvedConfig`: resolved config with tracer defaults (computed lazily, deep cloned on access)
 * - `steps`: trace steps (deep cloned on access)
 */
type EmbodifyChain = {
  readonly tracer: string | undefined;
  readonly code: string | undefined;
  readonly config: object | undefined;
  readonly resolvedConfig: ResolvedConfig | undefined;
  readonly steps: readonly StepCore[] | undefined;
  readonly ok: boolean | undefined;
  readonly error: EmbodyError | undefined;
  readonly set: (input: EmbodifyInput) => EmbodifyChain;
  readonly trace: (input?: TraceMethodInput) => Promise<EmbodifyChain>;
};

/**
 * Creates an immutable chain for building up trace state.
 * Getters return deep cloned copies for immutability.
 * Smart cache invalidation: only invalidate what changed.
 */
function embodifyChain(state: EmbodifyState): EmbodifyChain {
  return {
    get tracer() {
      return state.tracer;
    },
    get code() {
      return state.code;
    },
    get config() {
      return state.config === undefined ? undefined : deepClone(state.config);
    },
    get resolvedConfig() {
      // Lazy computation: compute if tracer is present and not cached
      if (state.resolvedConfig) {
        return deepClone(state.resolvedConfig);
      }

      // Can't compute without tracer
      if (state.tracer === undefined) {
        // eslint-disable-next-line unicorn/no-useless-undefined -- consistent returns
        return undefined;
      }

      // Can't compute if tracer is unknown
      const tracerModule = tracers[state.tracer];
      if (!tracerModule) {
        // eslint-disable-next-line unicorn/no-useless-undefined -- consistent returns
        return undefined;
      }

      // Compute and cache (mutable cache for lazy computation)
      const userConfig = (state.config ?? {}) as {
        readonly meta?: unknown;
        readonly options?: unknown;
      };
      const meta = prepareConfig(userConfig.meta ?? {}, metaSchema as JSONSchema) as MetaConfig;
      // Skip options prep if tracer has no schema
      const options = tracerModule.optionsSchema
        ? (prepareConfig(
            userConfig.options ?? {},
            tracerModule.optionsSchema as JSONSchema,
          ) as Record<string, unknown>)
        : {};

      // eslint-disable-next-line functional/immutable-data -- lazy caching
      state.resolvedConfig = { meta, options };
      return deepClone(state.resolvedConfig);
    },
    get steps() {
      return state.steps === undefined ? undefined : deepClone(state.steps);
    },
    get ok() {
      return state.ok;
    },
    get error() {
      return state.error;
    },

    /**
     * Sets one or more fields and returns a new chain with smart cache invalidation.
     *
     * **Cache invalidation rules**:
     * - Tracer change → clears config, resolvedConfig, steps (keeps code)
     * - Code change → clears steps only (keeps tracer, config, resolvedConfig)
     * - Config change → clears resolvedConfig, steps (keeps tracer, code)
     *
     * @param input - Fields to update (tracer, code, and/or config)
     * @returns New chain with updated fields and invalidated caches
     *
     * @example
     * const chain1 = embodify({ tracer: 'js:klve' })
     *   .set({ code: 'let x = 1;', config: {} });
     *
     * // Switch tracer, config is cleared
     * const chain2 = chain1.set({ tracer: 'chars', config: {} });
     */
    set(input: EmbodifyInput): EmbodifyChain {
      // Merge values
      const tracer = input.tracer ?? state.tracer;
      const code = input.code ?? state.code;
      // Config: when tracer changes, clear it (unless explicitly provided in input)
      const config =
        input.tracer !== undefined && input.config === undefined
          ? undefined
          : (input.config ?? state.config);

      // Detect what ACTUALLY changed (not just whether key was provided)
      const tracerChanged = tracer !== state.tracer;
      const codeChanged = code !== state.code;
      // For objects, compare JSON (config is small enough for this to be fast)
      const configChanged =
        input.config !== undefined && JSON.stringify(config) !== JSON.stringify(state.config);

      // Smart invalidation:
      // - tracer change: invalidate config, resolvedConfig, steps (keep code)
      // - config change: invalidate resolvedConfig, steps (keep tracer, code)
      // - code change: invalidate steps only (keep tracer, config, resolvedConfig)
      // - nothing changed: preserve all cached state
      const invalidateResolvedConfig = tracerChanged || configChanged;
      const invalidateSteps = tracerChanged || codeChanged || configChanged;

      return embodifyChain({
        tracer,
        code,
        config: config === undefined ? undefined : deepClone(config),
        resolvedConfig: invalidateResolvedConfig ? undefined : state.resolvedConfig,
        steps: invalidateSteps ? undefined : state.steps,
        ok: true,
        error: undefined,
      });
    },

    async trace(input: TraceMethodInput = {}): Promise<EmbodifyChain> {
      // 1. Merge input with current state
      const tracer = input.tracer ?? state.tracer;
      const code = input.code ?? state.code;
      const tracerChanged = tracer !== state.tracer;
      const configChanged =
        input.config !== undefined && JSON.stringify(input.config) !== JSON.stringify(state.config);
      const config = input.config ?? state.config;

      // 2. Validate tracer is present
      if (tracer === undefined) {
        return embodifyChain({
          tracer: undefined,
          code,
          config,
          resolvedConfig: undefined,
          steps: undefined,
          ok: false,
          error: new ArgumentInvalidError('tracer', 'embodify: tracer is required'),
        });
      }

      // 3. Validate code is present
      if (code === undefined) {
        return embodifyChain({
          tracer,
          code: undefined,
          config,
          resolvedConfig: undefined,
          steps: undefined,
          ok: false,
          error: new ArgumentInvalidError('code', 'embodify: code is required'),
        });
      }

      // 4. Find tracer module
      const tracerModule = tracers[tracer];
      if (!tracerModule) {
        return embodifyChain({
          tracer,
          code,
          config,
          resolvedConfig: undefined,
          steps: undefined,
          ok: false,
          error: new TracerUnknownError(tracer, { cause: { available: Object.keys(tracers) } }),
        });
      }

      try {
        // 5. Prepare config (reuse cached if unchanged)
        let resolvedConfig: ResolvedConfig;

        if (!state.resolvedConfig || tracerChanged || configChanged) {
          const userConfig = (config ?? {}) as {
            readonly meta?: Readonly<Record<string, unknown>>;
            readonly options?: Readonly<Record<string, unknown>>;
          };
          const meta = prepareConfig(userConfig.meta ?? {}, metaSchema as JSONSchema) as MetaConfig;
          // Skip options prep if tracer has no schema
          const options = tracerModule.optionsSchema
            ? (prepareConfig(
                userConfig.options ?? {},
                tracerModule.optionsSchema as JSONSchema,
              ) as Record<string, unknown>)
            : {};

          tracerModule?.verifyOptions?.(options);
          resolvedConfig = { meta, options };
        } else {
          // eslint-disable-next-line prefer-destructuring -- not destructuring, just accessing
          resolvedConfig = state.resolvedConfig;
        }

        // 6. Record trace steps
        const steps = await tracerModule.record(code, resolvedConfig);
        return embodifyChain({
          tracer,
          code,
          config,
          resolvedConfig,
          steps,
          ok: true,
          error: undefined,
        });
      } catch (caughtError) {
        if (caughtError instanceof EmbodyError) {
          return embodifyChain({
            tracer,
            code,
            config,
            resolvedConfig: undefined,
            steps: undefined,
            ok: false,
            error: caughtError,
          });
        }
        const message = caughtError instanceof Error ? caughtError.message : String(caughtError);
        return embodifyChain({
          tracer,
          code,
          config,
          resolvedConfig: undefined,
          steps: undefined,
          ok: false,
          error: new InternalError(message),
        });
      }
    },
  };
}

/**
 * Creates a new chain with optional initial state.
 * No validation at creation - validation happens on .trace().
 */
function embodify(input: EmbodifyInput = {}): EmbodifyChain {
  const { tracer, code, config } = input;

  return embodifyChain({
    tracer,
    code,
    config,
    resolvedConfig: undefined,
    steps: undefined,
    ok: true,
    error: undefined,
  });
}

export default embodify;
