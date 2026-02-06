/**
 * @file Shared types for error classes.
 *
 * Contains type definitions used by multiple error classes.
 * Error classes themselves are in separate files (one per class).
 */

/**
 * Source code location for errors that occur at a specific point in code.
 *
 * Used by ParseError and RuntimeError to indicate where the error occurred.
 * Line and column are 1-indexed to match editor conventions.
 */
type SourceLoc = {
  /** 1-indexed line number (matches editor display) */
  readonly line: number;
  /** 1-indexed column number (matches editor display) */
  readonly column: number;
};

export type { SourceLoc };
