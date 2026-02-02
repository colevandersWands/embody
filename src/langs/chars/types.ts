/**
 * @file Types for the chars test language module.
 *
 * Chars is a minimal language for architecture validation.
 * It treats any string as a grid of characters and produces
 * steps for each character based on traversal configuration.
 */

import type { StepCore } from '../types.js';

/**
 * Traversal direction: left-to-right or right-to-left.
 */
type Direction = 'lr' | 'rl';

/**
 * Configuration for chars tracing behavior.
 */
type CharsEvents = {
  /** Characters to exclude from output steps */
  readonly remove: readonly string[];
  /** Character substitutions (original → replacement) */
  readonly replace: Readonly<Record<string, string>>;
  /** Traversal direction */
  readonly direction: Direction;
  /** Optional max length for testing LIMIT_EXCEEDED */
  readonly maxLength?: number;
};

/**
 * A single trace step for the chars language.
 * Extends StepCore with the character at this position.
 */
type CharsStep = StepCore & {
  /** The character at this position (after replacement, if any) */
  readonly char: string;
};

export type { CharsEvents, CharsStep, Direction };
