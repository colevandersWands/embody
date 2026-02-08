/**
 * @file Safe tracing with Result pattern (ok/error) and partial application.
 *
 * Returns Promise<EmbodyResult> when all 3 fields provided.
 * Returns EmbodyClosure (callable with state properties) when fields missing.
 *
 * @example
 * ```js
 * // All at once
 * const result = await embody({ tracer: 'chars', code: 'ab', config: {} });
 * if (result.ok) console.log(result.steps);
 *
 * // Partial application
 * const withTracer = embody({ tracer: 'chars' });
 * const result = await withTracer({ code: 'ab', config: {} });
 * ```
 */

import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import EmbodyError from '../errors/embody-error.js';
import InternalError from '../errors/internal-error.js';
import TracerUnknownError from '../errors/tracer-unknown-error.js';
import tracers from '../tracers/index.js';
import metaSchema from '../tracers/meta.schema.json';
import type { MetaConfig, ResolvedConfig, StepCore } from '../tracers/types.js';
import deepClone from '../utils/deep-clone.js';

/**
 * Success result from embody - returned when trace completes successfully.
 */
type EmbodySuccess = {
  readonly ok: true;
  readonly steps: readonly StepCore[];
  readonly tracer: string;
  readonly code: string;
  readonly config: object | undefined;
  readonly resolvedConfig: ResolvedConfig;
};

/**
 * Error result from embody - returned when trace fails.
 */
type EmbodyFailure = {
  readonly ok: false;
  readonly error: EmbodyError;
  readonly tracer: string;
  readonly code: string;
  readonly config: object | undefined;
};

/**
 * Final result type for embody after tracing.
 */
type EmbodyResult = EmbodySuccess | EmbodyFailure;

/**
 * Input for embody and closure calls.
 * TypeScript validates types; no runtime checks needed.
 */
type EmbodyInput = {
  readonly tracer?: string;
  readonly code?: string;
  readonly config?: object;
};

/**
 * State attached to embody closures (inspectable before trace).
 */
type EmbodyState = {
  readonly ok: true;
  readonly error: undefined;
  readonly tracer: string | undefined;
  readonly code: string | undefined;
  readonly config: object | undefined;
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
 * Executes trace with prepared state.
 * Called by both embody() and closure() when all 3 fields are present.
 */
async function executeTrace(
  tracer: string,
  code: string,
  config: object | undefined,
): Promise<EmbodyResult> {
  // 1. Find tracer module
  const tracerModule = tracers[tracer];
  if (!tracerModule) {
    return {
      ok: false as const,
      error: new TracerUnknownError(tracer, { cause: { available: Object.keys(tracers) } }),
      tracer,
      code,
      config,
    };
  }

  try {
    // 2. Prepare config
    const userConfig = (config ?? {}) as {
      readonly meta?: Readonly<Record<string, unknown>>;
      readonly options?: Readonly<Record<string, unknown>>;
    };
    const meta = prepareConfig(userConfig.meta ?? {}, metaSchema as JSONSchema) as MetaConfig;
    // Skip options prep if tracer has no schema
    const options = tracerModule.optionsSchema
      ? (prepareConfig(userConfig.options ?? {}, tracerModule.optionsSchema as JSONSchema) as Record<
          string,
          unknown
        >)
      : {};

    // 3. Semantic validation
    tracerModule?.verifyOptions?.(options);

    // 4. Record
    const steps = await tracerModule.record(code, { meta, options });

    return {
      ok: true as const,
      steps: deepClone(steps),
      tracer,
      code,
      config,
      resolvedConfig: deepClone({ meta, options }),
    };
  } catch (caughtError) {
    if (caughtError instanceof EmbodyError) {
      return {
        ok: false as const,
        error: caughtError,
        tracer,
        code,
        config,
      };
    }
    const message = caughtError instanceof Error ? caughtError.message : String(caughtError);
    const cause = caughtError instanceof Error ? caughtError : undefined;
    return {
      ok: false as const,
      error: new InternalError(message, { cause }),
      tracer,
      code,
      config,
    };
  }
}

/**
 * Creates a closure with attached state properties.
 * Closure waits for remaining pieces before executing trace.
 */
function createClosure(state: {
  readonly tracer: string | undefined;
  readonly code: string | undefined;
  readonly config: object | undefined;
}): EmbodyClosure {
  // eslint-disable-next-line sonarjs/function-return-type -- Intentional: curried function returns result or closure
  function closure(remaining: EmbodyInput = {}): Promise<EmbodyResult> | EmbodyClosure {
    // 1. Merge state (later values overwrite earlier)
    const tracer = remaining.tracer ?? state.tracer;
    const code = remaining.code ?? state.code;
    const config = remaining.config === undefined ? state.config : deepClone(remaining.config);

    // 2. Check if all three present
    if (typeof tracer === 'string' && typeof code === 'string' && config !== undefined) {
      return executeTrace(tracer, code, config);
    }

    // 3. Still missing pieces - return another closure
    return createClosure({ tracer, code, config });
  }

  // Attach state properties for inspection
  // eslint-disable-next-line functional/immutable-data -- Intentional: decorating closure with state properties
  Object.defineProperties(closure, {
    ok: { value: true, enumerable: true },
    error: { value: undefined, enumerable: true },
    tracer: { value: state.tracer, enumerable: true },
    code: { value: state.code, enumerable: true },
    config: {
      get() {
        return state.config === undefined ? undefined : deepClone(state.config);
      },
      enumerable: true,
    },
    steps: { value: undefined, enumerable: true },
  });

  return closure as EmbodyClosure;
}

/**
 * Safe tracing with partial application. Result pattern (ok/error).
 *
 * Config semantics:
 * - `undefined` or missing = waiting → returns closure
 * - `{...}` = use this config → triggers trace (returns Promise)
 */
// eslint-disable-next-line sonarjs/function-return-type -- Intentional: curried function returns result or closure
function embody(input: EmbodyInput = {}): Promise<EmbodyResult> | EmbodyClosure {
  const { tracer, code, config } = input;

  // 1. Clone config at entry for immutability
  const clonedConfig = config === undefined ? undefined : deepClone(config);

  // 2. Check if all three present
  if (typeof tracer === 'string' && typeof code === 'string' && clonedConfig !== undefined) {
    return executeTrace(tracer, code, clonedConfig);
  }

  // 3. Missing pieces - return closure
  return createClosure({ tracer, code, config: clonedConfig });
}

export default embody;
