/**
 * @file Traces character traversal for the chars test language.
 *
 * Processes any string as a sequence of characters, producing steps
 * based on direction configuration. Used for architecture validation.
 *
 * Error triggers for testing:
 * - PARSE_ERROR: input contains interrobang (‽)
 * - RUNTIME_ERROR: input contains any emoji
 * - LIMIT_EXCEEDED: input exceeds maxLength
 *
 * Note: OPTIONS_SCHEMA_INVALID and OPTIONS_SEMANTIC_INVALID are thrown
 * by /configuring and verify-options.ts respectively, not by record().
 */

import LimitExceededError from '../../errors/limit-exceeded-error.js';
import ParseError from '../../errors/parse-error.js';
import RuntimeError from '../../errors/runtime-error.js';
import type { MetaConfig, RecordResult } from '../types.js';

import type { CharClass, CharsOptions, CharsStep } from './types.js';

/** Regex to detect emoji characters */
const EMOJI_REGEX = /\p{Emoji}/u;

/**
 * Classifies a character into a character class.
 */
function getCharClass(char: string): CharClass {
  if (/[a-z]/.test(char)) return 'lowercase';
  if (/[A-Z]/.test(char)) return 'uppercase';
  if (/\d/.test(char)) return 'number';
  if (/[!-/:-@[-`{-~]/.test(char)) return 'punctuation';
  return 'other';
}

/**
 * Records execution trace for chars language (async for API consistency).
 * Treats input as a character sequence and produces steps for each character.
 *
 * Internally sync but returns Promise for consistency with async langs (e.g., Python).
 *
 * Contract: Receives FULLY FILLED config from /configuring — never partial,
 * never undefined fields. Langs can trust input completely and do pure tracing.
 *
 * @param code - Source string to trace
 * @param config - Configuration object with meta (execution limits) and options (lang-specific)
 * @returns Promise resolving to trace steps, one per character (after filtering)
 * @throws ParseError, RuntimeError, or LimitExceededError
 */
// eslint-disable-next-line @typescript-eslint/require-await -- Async for API consistency with genuinely async langs
async function record(
  code: string,
  config: { readonly meta: MetaConfig; readonly options: CharsOptions },
): Promise<RecordResult<CharsStep>> {
  const { meta, options } = config;

  // PARSE_ERROR: interrobang
  if (code.includes('‽')) {
    const index = code.indexOf('‽');
    throw new ParseError('Unexpected interrobang (‽)', { line: 1, column: index + 1 });
  }

  // RUNTIME_ERROR: emoji
  const emojiMatch = EMOJI_REGEX.exec(code);
  if (emojiMatch) {
    throw new RuntimeError(`Emoji not allowed: ${emojiMatch[0]}`, {
      line: 1,
      column: (emojiMatch.index ?? 0) + 1,
    });
  }

  // LIMIT_EXCEEDED: maxLength (lang-specific limit)
  if (options.maxLength !== undefined && code.length > options.maxLength) {
    throw new LimitExceededError(
      `Input length ${code.length} exceeds maxLength ${options.maxLength}`,
      'maxLength',
      code.length,
    );
  }

  // LIMIT_EXCEEDED: meta.max.steps (cross-lang limit)
  // For chars, input length is a proxy for max steps
  if (meta.max.steps !== null && code.length > meta.max.steps) {
    throw new LimitExceededError(
      `Input length ${code.length} exceeds max steps ${meta.max.steps}`,
      'steps',
      code.length,
    );
  }

  const chars = [...code];
  const isReverse = options.direction === 'rl';
  const { length } = chars;

  // Process a single position, returning step data or null if filtered
  function processPosition(
    position: number,
  ): { readonly loc: { readonly line: 1; readonly column: number }; readonly char: string } | null {
    const index = isReverse ? length - 1 - position : position;
    const originalChar = chars[index];

    // Filter by remove list
    if (options.remove.includes(originalChar)) return null;

    // Filter by character class
    const charClass = getCharClass(originalChar);
    if (!options.allowedCharClasses[charClass]) return null;

    const char = options.replace[originalChar] ?? originalChar;
    const column = position + 1;

    return { loc: { line: 1, column }, char };
  }

  // Step data type after filtering nulls
  type StepData = {
    readonly loc: { readonly line: 1; readonly column: number };
    readonly char: string;
  };

  // Type guard for filtering nulls
  function isStep(item: ReturnType<typeof processPosition>): item is StepData {
    return item !== null;
  }

  // Build steps immutably: map → filter → add step numbers
  const steps = chars
    .map((_, position) => processPosition(position))
    .filter((item) => isStep(item))
    .map((item, index) => ({ step: index + 1, ...item }));

  return { steps, config: { meta, options } };
}

export default record;
