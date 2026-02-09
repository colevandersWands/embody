import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import ArgumentInvalidError from '../errors/argument-invalid-error.js';
import TracerUnknownError from '../errors/tracer-unknown-error.js';
import tracers from '../tracers/index.js';
import metaSchema from '../tracers/meta.schema.json';
import type { MetaConfig, ResolvedConfig, StepCore } from '../tracers/types.js';
import deepClone from '../utils/deep-clone.js';

/**
 * OOP-style tracer with lazy evaluation (rhymes with tracify).
 *
 * Each instance locks to one tracer at construction. Provides mutable setters
 * for code and config, and a lazy `.steps` getter that traces on first access.
 * Throws errors (ArgumentInvalidError, TracerUnknownError, etc.).
 *
 * @example
 * ```typescript
 * const tracer = new Tracer('txt:chars');
 * tracer.code = 'hello';
 * tracer.config = { meta: { max: { steps: 50 } } };
 * const steps = await tracer.steps; // Lazy trace on access
 * ```
 */
class Tracer {
  readonly #tracerId: string;
  readonly #record: (code: string, config: ResolvedConfig) => Promise<readonly StepCore[]>;
  readonly #optionsSchema: JSONSchema | undefined;
  readonly #verifyOptions: ((options: unknown) => void) | undefined;

  #code: string | undefined;
  #config: object | undefined;
  #resolvedConfig: ResolvedConfig | undefined;

  #steps: Promise<readonly StepCore[]> | undefined;

  /**
   * Creates a new Tracer instance locked to the specified tracer.
   *
   * @param tracerId - Tracer ID (e.g., 'txt:chars', 'js:klve')
   * @throws {ArgumentInvalidError} if tracerId is not a non-empty string
   * @throws {TracerUnknownError} if tracerId is not registered
   */
  constructor(tracerId: string) {
    // Validate tracerId type
    if (typeof tracerId !== 'string') {
      throw new ArgumentInvalidError(
        'tracerId',
        `Tracer constructor: expected string, got ${typeof tracerId}`,
      );
    }
    if (tracerId === '') {
      throw new ArgumentInvalidError('tracerId', 'Tracer constructor: expected non-empty string');
    }

    // Registry lookup
    const tracerEntry = tracers[tracerId];
    if (!tracerEntry) {
      throw new TracerUnknownError(tracerId, { cause: { available: Object.keys(tracers) } });
    }

    // Store tracer components (deep clone optionsSchema to prevent external mutation)
    this.#tracerId = tracerId;
    this.#record = tracerEntry.record;
    this.#optionsSchema = tracerEntry.optionsSchema
      ? deepClone(tracerEntry.optionsSchema)
      : undefined;
    this.#verifyOptions = tracerEntry.verifyOptions;

    // Initialize state
    this.#code = undefined;
    this.#config = undefined;
    this.#resolvedConfig = undefined;
    this.#steps = undefined;
  }

  // no tracer setter, each instance is locked into a single tracer after construction

  /**
   * Gets the tracer ID this instance is locked to.
   *
   * @returns The tracer ID (e.g., 'txt:chars')
   */
  get id(): string {
    return this.#tracerId;
  }

  /**
   * Sets the code to trace. Clears cached steps.
   *
   * @param value - Source code to trace
   * @throws {ArgumentInvalidError} if value is not a non-empty string
   */
  set code(value: string) {
    // Validate
    if (typeof value !== 'string') {
      throw new ArgumentInvalidError(
        'code',
        `Tracer.code setter: expected string, got ${typeof value}`,
      );
    }
    if (value === '') {
      throw new ArgumentInvalidError('code', 'Tracer.code setter: expected non-empty string');
    }

    // Set and clear cache
    this.#code = value;
    this.#steps = undefined;
  }

  /**
   * Gets the current code (or undefined if not set).
   *
   * @returns The code string, or undefined
   */
  get code(): string | undefined {
    return this.#code;
  }

  /**
   * Sets the trace configuration. Clears cached resolvedConfig and steps.
   *
   * @param value - Config object with meta and/or options
   * @throws {ArgumentInvalidError} if value is not an object (null is converted to {})
   */
  set config(value: unknown) {
    // Validate type
    if (value !== null && typeof value !== 'object') {
      throw new ArgumentInvalidError(
        'config',
        `Tracer.config setter: expected object, got ${typeof value}`,
      );
    }

    // Deep clone and store (convert null to {})
    this.#config = deepClone(value ?? {});

    // Clear dependent caches
    this.#resolvedConfig = undefined;
    this.#steps = undefined;
  }

  /**
   * Gets the current config (deep cloned to prevent external mutation).
   *
   * @returns The config object, or undefined if not set
   */
  get config(): object | undefined {
    return this.#config === undefined ? undefined : deepClone(this.#config);
  }

  /**
   * Gets the resolved config (user config merged with defaults). Computed lazily
   * on first access and cached. Returns deep clone to prevent external mutation.
   *
   * @returns The resolved config with meta and options
   * @throws Errors from prepareConfig or verifyOptions
   */
  get resolvedConfig(): ResolvedConfig {
    // Return cached if available
    if (this.#resolvedConfig) {
      return deepClone(this.#resolvedConfig);
    }

    // Compute from current config
    const userConfig = (this.#config ?? {}) as {
      readonly meta?: unknown;
      readonly options?: unknown;
    };

    // Prepare meta config
    const meta = prepareConfig(userConfig.meta ?? {}, metaSchema as JSONSchema) as MetaConfig;

    // Prepare options (skip if no schema)
    const options = this.#optionsSchema
      ? (prepareConfig(userConfig.options ?? {}, this.#optionsSchema) as Record<string, unknown>)
      : {};

    // Semantic validation
    this.#verifyOptions?.(options);

    // Cache and return
    this.#resolvedConfig = { meta, options };
    return deepClone(this.#resolvedConfig);
  }

  /**
   * Gets the trace steps (lazy evaluation). On first access, triggers trace
   * execution. Subsequent accesses return cached result. Each access returns
   * a deep clone to prevent mutation.
   *
   * **Cache invalidation:**
   * - Code changes clear steps cache (must re-trace)
   * - Config changes clear resolvedConfig + steps (must re-compute and re-trace)
   *
   * @returns Promise that resolves to steps array
   * @throws {ArgumentInvalidError} if code is not set
   * @throws Errors from tracer's record function (ParseError, RuntimeError, LimitExceededError, etc.)
   */
  get steps(): Promise<readonly StepCore[]> {
    // Return cached if available (deep clone the resolved array)
    if (this.#steps) {
      return this.#steps.then(deepClone);
    }

    // Validate required fields
    if (this.#code === undefined) {
      throw new ArgumentInvalidError('code', 'Tracer.steps: code is required to generate steps');
    }

    // Compute resolvedConfig (triggers lazy computation if needed)
    const config = this.resolvedConfig; // Uses getter, which clones

    // Record trace (async) - store promise directly
    this.#steps = this.#record(this.#code, config);

    // Return deep cloned result
    return this.#steps.then(deepClone);
  }
}

export default Tracer;
