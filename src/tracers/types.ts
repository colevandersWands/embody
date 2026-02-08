/**
 * @file Shared types for tracer modules.
 *
 * Defines the cross-tracer contract: StepCore fields that every
 * step must have, and the TracerModule interface that every
 * tracer must implement.
 *
 * Error classes are in /errors module — see src/errors/ for:
 * - EmbodyError (base class for instanceof catch-all)
 * - ParseError, RuntimeError, LimitExceededError (from tracers)
 * - ArgumentInvalidError, TracerUnknownError (from API layer)
 * - OptionsInvalidError, OptionsSemanticInvalidError (from /configuring)
 * - InternalError (catch-all wrapper)
 */

/**
 * ESTree-compliant source position.
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
type Position = {
  /** 1-indexed line number (ESTree standard) */
  readonly line: number;
  /** 0-indexed column number (ESTree standard) */
  readonly column: number;
};

/**
 * ESTree-compliant source location with start and end positions.
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
type SourceLocation = {
  /** Start position of the source range */
  readonly start: Position;
  /** End position of the source range */
  readonly end: Position;
};

/**
 * Core fields present in every step, regardless of language.
 * Enables visual correlation between steps and code/editor locations.
 */
type StepCore = {
  /** 1-indexed execution order */
  readonly step: number;
  /** ESTree-compliant source location (line 1-indexed, column 0-indexed) */
  readonly loc: SourceLocation;
};

/**
 * Execution limits within MetaConfig.
 * All limits use `null` to mean "unlimited" (JSON Schema can't represent Infinity).
 */
type MetaLimits = {
  /** Maximum trace steps; null = unlimited */
  readonly steps: number | null;
  /** Maximum loop iterations; null = unlimited */
  readonly iterations: number | null;
  /** Maximum call stack depth; null = unlimited */
  readonly callstack: number | null;
  /** Maximum execution time in ms; null = unlimited */
  readonly time: number | null;
};

/**
 * Cross-language execution limits and debugging options.
 * Validated against `meta.schema.json`.
 */
type MetaConfig = {
  /** Execution limits */
  readonly max: MetaLimits;
  /** Line range to trace [start, end]; null = full code */
  readonly range: readonly [number, number] | null;
  /** Whether to include timestamps in trace steps */
  readonly timestamps: boolean;
  /** Debug options */
  readonly debug: { readonly ast: boolean };
};

/**
 * Resolved config returned by record functions.
 * Contains both meta limits and tracer-specific options (all with defaults filled).
 */
type ResolvedConfig = {
  /** Execution limits (fully filled) */
  readonly meta: MetaConfig;
  /** Tracer-specific resolved options (with defaults filled) */
  readonly options: Record<string, unknown>;
};

/**
 * Tracer module record function signature (async).
 *
 * **Contract**: Receives FULLY FILLED config from /configuring — never partial,
 * never undefined fields. Tracers can trust input completely and do pure tracing.
 *
 * Returns just the steps array — config is fully prepared upstream, no need to return it.
 *
 * Async for consistency across all tracers:
 * - Some tracers (chars) are internally sync but return Promise for API consistency
 * - Other tracers (Python via Pyodide) are genuinely async
 *
 * @param TOptions - Tracer-specific options type (e.g., CharsOptions)
 * @param TStep - Tracer-specific step type extending StepCore
 */
type TracerModule<TOptions = unknown, TStep extends StepCore = StepCore> = (
  code: string,
  config: { readonly meta: MetaConfig; readonly options: TOptions },
) => Promise<readonly TStep[]>;

/**
 * Registry entry for a tracer module.
 * Each tracer exports these pieces via its barrel index.
 */
type TracerEntry<TStep extends StepCore = StepCore> = {
  /** The record function that traces code */
  readonly record: TracerModule<unknown, TStep>;
  /** JSON Schema for tracer-specific options (optional for simple tracers) */
  readonly optionsSchema?: Record<string, unknown>;
  /** Optional semantic validation for cross-field constraints */
  readonly verifyOptions?: (options: unknown) => void;
};

export type {
  TracerEntry,
  TracerModule,
  MetaConfig,
  MetaLimits,
  Position,
  ResolvedConfig,
  SourceLocation,
  StepCore,
};
