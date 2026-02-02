/**
 * @file Traces character traversal for the chars test language.
 *
 * Processes any string as a sequence of characters, producing steps
 * based on direction configuration. Used for architecture validation.
 *
 * Error triggers for testing:
 * - EVENTS_INVALID: missing or wrong type for remove/replace/direction
 * - PARSE_ERROR: input contains interrobang (‽)
 * - RUNTIME_ERROR: input contains any emoji
 * - LIMIT_EXCEEDED: input exceeds maxLength
 */

import { TraceError } from '../types.js';

import type { CharsEvents, CharsStep } from './types.js';

/** Regex to detect emoji characters */
const EMOJI_REGEX = /\p{Emoji}/u;

/**
 * Validates the events configuration.
 * Collects all field errors and throws EVENTS_INVALID with combined message.
 */
function validateEvents(config: unknown): asserts config is CharsEvents {
  if (config === null || typeof config !== 'object') {
    throw new TraceError('EVENTS_INVALID', 'events must be an object');
  }

  const c = config as Record<string, unknown>;
  const errors: string[] = [];

  if (!Array.isArray(c.remove)) {
    errors.push('remove must be an array');
  }

  if (c.replace === null || typeof c.replace !== 'object') {
    errors.push('replace must be an object');
  }

  if (c.direction !== 'lr' && c.direction !== 'rl') {
    errors.push(`direction must be 'lr' or 'rl', got '${c.direction}'`);
  }

  if (errors.length > 0) {
    throw new TraceError('EVENTS_INVALID', `Invalid events: ${errors.join('; ')}`);
  }
}

/**
 * Records execution trace for chars language.
 * Treats input as a character sequence and produces steps for each character.
 *
 * @param code - Source string to trace
 * @param config - Expanded chars configuration (events merged with defaults)
 * @returns Array of trace steps, one per character (after filtering)
 * @throws TraceError with appropriate code for validation/parse/runtime errors
 */
function record(code: string, config: CharsEvents): readonly CharsStep[] {
  // Validate events structure
  validateEvents(config);

  // PARSE_ERROR: interrobang
  if (code.includes('‽')) {
    const index = code.indexOf('‽');
    throw new TraceError('PARSE_ERROR', 'Unexpected interrobang (‽)', {
      line: 1,
      column: index + 1,
    });
  }

  // RUNTIME_ERROR: emoji
  const emojiMatch = EMOJI_REGEX.exec(code);
  if (emojiMatch) {
    throw new TraceError('RUNTIME_ERROR', `Emoji not allowed: ${emojiMatch[0]}`, {
      line: 1,
      column: (emojiMatch.index ?? 0) + 1,
    });
  }

  // LIMIT_EXCEEDED: maxLength
  if (config.maxLength !== undefined && code.length > config.maxLength) {
    throw new TraceError(
      'LIMIT_EXCEEDED',
      `Input length ${code.length} exceeds maxLength ${config.maxLength}`,
    );
  }

  const chars = [...code];
  const isReverse = config.direction === 'rl';
  const { length } = chars;

  const steps: CharsStep[] = [];
  let stepNumber = 1;

  for (let position = 0; position < length; position += 1) {
    const index = isReverse ? length - 1 - position : position;
    const originalChar = chars[index];

    if (config.remove.includes(originalChar)) {
      continue;
    }

    const char = config.replace[originalChar] ?? originalChar;

    const column = position + 1;
    steps.push({
      step: stepNumber,
      loc: { line: 1, column },
      char,
    });

    stepNumber += 1;
  }

  return steps;
}

export default record;
