/**
 * @file Shared types for language modules.
 *
 * Defines the cross-language contract: StepCore fields that every
 * step must have, and the LangModule interface that every language
 * tracer must implement.
 */

/**
 * Error codes for trace errors.
 */
type TraceErrorCode =
  | 'LANG_UNKNOWN'
  | 'CONFIG_INVALID'
  | 'EVENTS_INVALID'
  | 'PARSE_ERROR'
  | 'RUNTIME_ERROR'
  | 'LIMIT_EXCEEDED'
  | 'INTERNAL';

/**
 * Structured error thrown by lang modules and the API layer.
 * Contains machine-readable code and human-readable message.
 *
 * Exception to no-classes rule: Error extension required for proper
 * stack traces, instanceof checks, and error handling semantics.
 */
// eslint-disable-next-line functional/no-classes
class TraceError extends Error {
  readonly code: TraceErrorCode;
  readonly loc: { readonly line: number; readonly column: number } | undefined;

  constructor(
    code: TraceErrorCode,
    message: string,
    loc?: { readonly line: number; readonly column: number },
  ) {
    super(message);
    // eslint-disable-next-line functional/no-this-expressions
    this.name = 'TraceError';
    // eslint-disable-next-line functional/no-this-expressions
    this.code = code;
    // eslint-disable-next-line functional/no-this-expressions
    this.loc = loc;
  }
}

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
 * Interface that every language module must implement.
 * Lang modules are data-only for config — they export `events`
 * (their defaults), and the API layer handles all merging.
 */
type LangModule<TEvents = unknown, TStep extends StepCore = StepCore> = {
  /**
   * Traces code execution and returns steps.
   * @param code - Source code to trace
   * @param config - Expanded configuration (already merged with defaults)
   * @returns Array of trace steps
   */
  readonly record: (code: string, config: TEvents) => readonly TStep[];
  /**
   * Default events configuration for this language.
   * Frozen at the dispatch layer to ensure immutability.
   */
  readonly events: TEvents;
};

export { TraceError };
export type { LangModule, StepCore, TraceErrorCode };
