import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import ArgumentInvalidError from '../errors/argument-invalid-error.js';
import type EmbodyError from '../errors/embody-error.js';
import InternalError from '../errors/internal-error.js';
import TracerUnknownError from '../errors/tracer-unknown-error.js';
import tracers from '../tracers/index.js';
import metaSchema from '../tracers/meta.schema.json';
import type { MetaConfig, ResolvedConfig, StepCore } from '../tracers/types.js';
import deepClone from '../utils/deep-clone.js';

/**
 * OOP-style tracer with explicit error handling (rhymes with embodify).
 *
 * Each instance locks to one tracer at construction. Provides mutable setters
 * for code and config, and an explicit `.trace()` method for execution.
 * Catches errors and stores them in `.ok`/`.error` state (never throws).
 *
 * **Constructor errors are fatal:** If the constructor fails (invalid tracer ID),
 * the instance is permanently in error state. Setters and `.trace()` become no-ops.
 *
 * @example
 * ```typescript
 * const embodier = new Embodier('txt:chars');
 * embodier.code = 'hello';
 * embodier.config = {};
 * await embodier.trace(); // Explicit execution, mutates instance
 * if (embodier.ok) {
 *   console.log(embodier.steps);
 * } else {
 *   console.error(embodier.error);
 * }
 * ```
 */
class Embodier {
  readonly #tracerId: string | undefined;
  readonly #record:
    | ((code: string, config: ResolvedConfig) => Promise<readonly StepCore[]>)
    | undefined;
  readonly #optionsSchema: JSONSchema | undefined;
  readonly #verifyOptions: ((options: unknown) => void) | undefined;

  #code: string | undefined;
  #config: object | undefined;
  #resolvedConfig: ResolvedConfig | undefined;

  #steps: readonly StepCore[] | undefined;

  #ok: boolean;
  #error: EmbodyError | undefined;

  /**
   * Creates a new Embodier instance locked to the specified tracer.
   * Catches errors instead of throwing (check `.ok` and `.error` after construction).
   *
   * **Constructor errors are fatal:** If this fails, the instance is permanently
   * in error state. Setters and `.trace()` become no-ops.
   *
   * @param tracerId - Tracer ID (e.g., 'txt:chars', 'js:klve')
   */
  constructor(tracerId: string) {
    try {
      // Validate tracerId type
      if (typeof tracerId !== 'string') {
        throw new ArgumentInvalidError(
          'tracerId',
          `Embodier constructor: expected string, got ${typeof tracerId}`,
        );
      }
      if (tracerId === '') {
        throw new ArgumentInvalidError(
          'tracerId',
          'Embodier constructor: expected non-empty string',
        );
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

      // Success state
      this.#ok = true;
      this.#error = undefined;
    } catch (error) {
      // Catch errors and store them
      this.#ok = false;
      if (error instanceof ArgumentInvalidError || error instanceof TracerUnknownError) {
        this.#error = error;
      } else {
        this.#error = new InternalError('Embodier constructor failed', { cause: error });
      }

      // Initialize undefined state on error
      this.#tracerId = undefined;
      this.#record = undefined;
      this.#optionsSchema = undefined;
      this.#verifyOptions = undefined;
      this.#code = undefined;
      this.#config = undefined;
      this.#resolvedConfig = undefined;
      this.#steps = undefined;
    }
  }

  /**
   * Gets the tracer ID this instance is locked to (or undefined if constructor failed).
   *
   * @returns The tracer ID (e.g., 'txt:chars'), or undefined
   */
  get id(): string | undefined {
    return this.#tracerId;
  }

  /**
   * Sets the code to trace. Clears cached steps. Catches errors and updates `.ok`/`.error`.
   * No-op if constructor failed (instance in permanent error state).
   *
   * @param value - Source code to trace
   */
  set code(value: string) {
    // Don't modify state if constructor failed
    if (this.#record === undefined) {
      return;
    }

    try {
      // Validate
      if (typeof value !== 'string') {
        throw new ArgumentInvalidError(
          'code',
          `Embodier.code setter: expected string, got ${typeof value}`,
        );
      }
      if (value === '') {
        throw new ArgumentInvalidError('code', 'Embodier.code setter: expected non-empty string');
      }

      // Set and clear cache
      this.#code = value;
      this.#steps = undefined;

      // Clear error if we just fixed the root cause
      if (this.#error instanceof ArgumentInvalidError && this.#error.field === 'code') {
        this.#ok = true;
        this.#error = undefined;
      }
    } catch (error) {
      this.#ok = false;
      if (error instanceof ArgumentInvalidError) {
        this.#error = error;
      } else {
        this.#error = new InternalError('Embodier.code setter failed', { cause: error });
      }
    }
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
   * Catches errors and updates `.ok`/`.error`. No-op if constructor failed.
   *
   * @param value - Config object with meta and/or options (null converted to {})
   */
  set config(value: unknown) {
    // Don't modify state if constructor failed
    if (this.#record === undefined) {
      return;
    }

    try {
      // Validate type
      if (value !== null && typeof value !== 'object') {
        throw new ArgumentInvalidError(
          'config',
          `Embodier.config setter: expected object, got ${typeof value}`,
        );
      }

      // Deep clone and store (convert null to {})
      this.#config = deepClone(value ?? {});

      // Clear dependent caches
      this.#resolvedConfig = undefined;
      this.#steps = undefined;

      // Clear error if we just fixed the root cause
      if (this.#error instanceof ArgumentInvalidError && this.#error.field === 'config') {
        this.#ok = true;
        this.#error = undefined;
      }
    } catch (error) {
      this.#ok = false;
      if (error instanceof ArgumentInvalidError) {
        this.#error = error;
      } else {
        this.#error = new InternalError('Embodier.config setter failed', { cause: error });
      }
    }
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
   * Gets the resolved config (user config merged with defaults). Returns undefined
   * if instance is in broken state (constructor failed). Computed lazily on first
   * access and cached. Returns deep clone to prevent external mutation.
   *
   * Always succeeds if constructor succeeded (uses schema defaults).
   *
   * @returns The resolved config with meta and options, or undefined if broken
   */
  get resolvedConfig(): ResolvedConfig | undefined {
    // Return undefined if constructor failed (broken instance)
    if (this.#record === undefined) {
      return undefined;
    }

    // Return cached if available
    if (this.#resolvedConfig) {
      return deepClone(this.#resolvedConfig);
    }

    // Compute from current config (always succeeds - uses defaults)
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
   * Gets the cached trace steps (sync getter, NOT a Promise like Tracer).
   * Returns undefined before `.trace()` is called or if trace failed.
   * Returns deep clone to prevent mutation.
   *
   * @returns The steps array, or undefined
   */
  get steps(): readonly StepCore[] | undefined {
    return this.#steps === undefined ? undefined : deepClone(this.#steps);
  }

  /**
   * Executes the trace and mutates instance state. Returns `Promise<void>`.
   * Catches errors and stores them in `.ok`/`.error` (never throws).
   * No-op if constructor failed (instance in permanent error state).
   *
   * **Cache invalidation:**
   * - Code changes clear steps (must re-trace)
   * - Config changes clear resolvedConfig + steps (must re-compute and re-trace)
   *
   * @returns Promise that resolves to void undefined
   */
  async trace(): Promise<void> {
    // Don't attempt trace if constructor failed
    if (this.#record === undefined) {
      return void undefined;
    }

    try {
      // Validate required fields
      if (this.#code === undefined) {
        throw new ArgumentInvalidError('code', 'Embodier.trace(): code is required to trace');
      }

      // Compute resolvedConfig
      const config = this.resolvedConfig;
      if (!config) {
        throw new InternalError('Embodier.trace(): failed to resolve config');
      }

      // Execute trace
      const result = await this.#record(this.#code, config);

      // Store results and set success state
      this.#steps = result;
      this.#ok = true;
      this.#error = undefined;

      return void undefined;
    } catch (error) {
      // Catch errors and store them
      this.#ok = false;
      this.#steps = undefined;

      if (error instanceof ArgumentInvalidError) {
        this.#error = error;
      } else {
        this.#error = new InternalError('Embodier.trace() failed', { cause: error });
      }

      return void undefined;
    }
  }

  /**
   * Gets the success state. `true` if no errors have occurred, `false` otherwise.
   *
   * @returns `true` if ok, `false` if error
   */
  get ok(): boolean {
    return this.#ok;
  }

  /**
   * Gets the error (if any). Only set when `.ok` is `false`.
   *
   * @returns The error, or undefined if ok
   */
  get error(): EmbodyError | undefined {
    return this.#error;
  }
}

export default Embodier;
