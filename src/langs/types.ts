/**
 * @file Shared types for language modules.
 *
 * Defines the cross-language contract: StepCore fields that every
 * step must have, and the LangModule interface that every language
 * tracer must implement.
 *
 * Error classes are in /errors module — see src/errors/ for:
 * - EmbodyError (base class for instanceof catch-all)
 * - ParseError, RuntimeError, LimitExceededError (from langs)
 * - ConfigInvalidError, LangUnknownError (from API layer)
 * - OptionsSchemaInvalidError, OptionsSemanticInvalidError (from /configuring)
 * - InternalError (catch-all wrapper)
 */

/**
 * Core fields present in every step, regardless of language.
 * Enables visual correlation between steps and code/editor locations.
 */
type StepCore = {
  /** 1-indexed execution order */
  readonly step: number;
  /** Source location */
  readonly loc: {
    /** 1-indexed line number (matches editor) */
    readonly line: number;
    /** 1-indexed column number (matches editor) */
    readonly column: number;
  };
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
 * Contains both meta limits and lang-specific options (all with defaults filled).
 */
type ResolvedConfig = {
  /** Execution limits (fully filled) */
  readonly meta: MetaConfig;
  /** Lang-specific resolved options (with defaults filled) */
  readonly options: Record<string, unknown>;
};

/**
 * Result returned by record functions.
 * Contains both steps and the resolved config that was used.
 */
type RecordResult<TStep extends StepCore = StepCore> = {
  /** The trace steps */
  readonly steps: readonly TStep[];
  /** The resolved config (with lang defaults filled) */
  readonly config: ResolvedConfig;
};

/**
 * Lang module record function signature (async).
 *
 * **Contract**: Receives FULLY FILLED config from /configuring — never partial,
 * never undefined fields. Langs can trust input completely and do pure tracing.
 *
 * What langs export:
 * - `schema.json` — JSON Schema for options (REQUIRED)
 * - `record` — This function (REQUIRED)
 * - `verifyOptions` — Semantic validation (OPTIONAL)
 *
 * Async for consistency across all langs:
 * - Some langs (chars) are internally sync but return Promise for API consistency
 * - Other langs (Python via Pyodide) are genuinely async
 *
 * @param TOptions - Lang-specific options type (e.g., CharsOptions)
 * @param TStep - Lang-specific step type extending StepCore
 */
type LangModule<TOptions = unknown, TStep extends StepCore = StepCore> = (
  code: string,
  config: { readonly meta: MetaConfig; readonly options: TOptions },
) => Promise<RecordResult<TStep>>;

export type { LangModule, MetaConfig, MetaLimits, RecordResult, ResolvedConfig, StepCore };
