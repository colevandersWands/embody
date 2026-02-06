/**
 * @file Lang unknown error class.
 *
 * Thrown when the requested language is not in the dispatch registry.
 */

import EmbodyError from './embody-error.js';

/**
 * Thrown when the requested language is not supported.
 *
 * @example
 * ```typescript
 * try {
 *   await trace('unknown-lang', 'code');
 * } catch (error) {
 *   if (error instanceof LangUnknownError) {
 *     console.log(error.lang); // 'unknown-lang'
 *   }
 * }
 * ```
 */
class LangUnknownError extends EmbodyError {
  override readonly name = '(EmbodyError) LangUnknownError' as const;
  readonly lang: string;

  constructor(lang: string, options?: ErrorOptions) {
    super(`Unknown language '${lang}'`, options);
    this.lang = lang;
  }
}

export default LangUnknownError;
