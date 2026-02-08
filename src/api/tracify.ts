/**
 * @file Chainable tracing API that throws on errors.
 *
 * Provides fluent interface for building trace configuration.
 * Type errors throw synchronously; record errors reject the Promise.
 *
 * @example
 * ```js
 * const steps = await tracify.tracer('chars').code('hello').steps;
 * const config = tracify.tracer('chars').resolvedConfig; // sync
 * ```
 */

import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import ArgumentInvalidError from '../errors/argument-invalid-error.js';
import TracerUnknownError from '../errors/tracer-unknown-error.js';
import tracers from '../tracers/index.js';
import metaSchema from '../tracers/meta.schema.json';
import type { MetaConfig, ResolvedConfig, StepCore } from '../tracers/types.js';
import deepClone from '../utils/deep-clone.js';

/**
 * Internal chain state for tracify.
 * Input fields (tracer, code, config) are readonly.
 * Cache fields (steps, resolvedConfig) are mutable for lazy computation.
 * Uses `| undefined` to satisfy exactOptionalPropertyTypes.
 */
type TracifyState = {
  readonly tracer?: string | undefined;
  readonly code?: string | undefined;
  readonly config?: unknown;
  readonly steps?: Promise<readonly StepCore[]> | undefined;
  readonly resolvedConfig?: ResolvedConfig | undefined;
};

/**
 * The chain object returned by tracify methods.
 * Uses .tracer(), .code(), .config() methods for chaining.
 * Steps are memoized - traced once on first access, cached thereafter.
 */
type TracifyChain = {
  tracer(tracerId: string): TracifyChain;
  code(source: string): TracifyChain;
  config(cfg: unknown): TracifyChain;
  readonly steps: Promise<readonly StepCore[]>;
  readonly resolvedConfig: ResolvedConfig;
};

/**
 * Creates a chain with the given state.
 * Each chain method returns a new chain, invalidating caches as needed.
 */
function tracifyChain(state: TracifyState = {}): TracifyChain {
  return {
    tracer(_tracer: string): TracifyChain {
      if (typeof _tracer !== 'string') {
        throw new ArgumentInvalidError(
          'tracer',
          `tracify.tracer(): expected a string, got ${typeof _tracer}`,
        );
      }
      if (_tracer === '') {
        throw new ArgumentInvalidError('tracer', 'tracify.tracer(): expected a non-empty string');
      }

      const tracerModule = tracers[_tracer];
      if (!tracerModule) {
        throw new TracerUnknownError(_tracer, { cause: { available: Object.keys(tracers) } });
      }

      // Invalidate cache when tracer changes (drops steps and resolvedConfig)
      return tracifyChain({
        ...state,
        tracer: _tracer,
        steps: undefined,
        resolvedConfig: undefined,
      });
    },

    code(_code: string): TracifyChain {
      if (typeof _code !== 'string') {
        throw new ArgumentInvalidError(
          'code',
          `tracify.code(): expected a string, got ${typeof _code}`,
        );
      }
      if (_code === '') {
        throw new ArgumentInvalidError('code', 'tracify.code(): expected a non-empty string');
      }

      // Invalidate steps cache when code changes (keep resolvedConfig)
      return tracifyChain({ ...state, code: _code, steps: undefined });
    },

    config(_config: unknown): TracifyChain {
      if (_config !== null && typeof _config !== 'object') {
        throw new ArgumentInvalidError(
          'config',
          `tracify.config(): expected an object, got ${typeof _config}`,
        );
      }

      // Invalidate cache when config changes
      return tracifyChain({
        ...state,
        config: deepClone(_config ?? {}),
        steps: undefined,
        resolvedConfig: undefined,
      });
    },

    get steps(): Promise<readonly StepCore[]> {
      if (state.steps) return state.steps.then(deepClone);

      // 1. Validate tracer
      if (state.tracer === undefined) {
        throw new ArgumentInvalidError(
          'tracer',
          'tracify: a tracer is required to generate trace steps',
        );
      }

      // 2. Validate code
      if (state.code === undefined) {
        throw new ArgumentInvalidError('code', 'tracify: code is required to generate trace steps');
      }

      // 3. Check tracer exists
      const tracerModule = tracers[state.tracer];
      if (!tracerModule) {
        throw new TracerUnknownError(state.tracer, { cause: { available: Object.keys(tracers) } });
      }

      // 4-6. Reuse cached config if available, otherwise prepare
      if (!state.resolvedConfig) {
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
        tracerModule?.verifyOptions?.(options);
        // eslint-ignore
        state.resolvedConfig = { meta, options };
      }

      // 7. Record (resolvedConfig is now guaranteed to exist)
      // eslint-ignore
      state.steps = tracerModule.record(state.code, state.resolvedConfig);

      return state.steps.then(deepClone);
    },

    get resolvedConfig(): ResolvedConfig {
      if (state.resolvedConfig) return deepClone(state.resolvedConfig);

      // 1. Validate tracer
      if (state.tracer === undefined) {
        throw new ArgumentInvalidError(
          'tracer',
          'tracify: tracer is required to access the resolved config',
        );
      }

      // 2. Check tracer exists
      const tracerModule = tracers[state.tracer];
      if (!tracerModule) {
        throw new TracerUnknownError(state.tracer, { cause: { available: Object.keys(tracers) } });
      }

      // 3. Prepare config (no code validation needed for config-only access)
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

      // 4. Semantic validation
      tracerModule?.verifyOptions?.(options);

      // 5. Cache and return
      const resolvedConfig: ResolvedConfig = { meta, options };
      // eslint-ignore
      state.resolvedConfig = resolvedConfig;

      return deepClone(resolvedConfig);
    },
  };
}

export default tracifyChain({});
