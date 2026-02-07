/**
 * @file Tracer unknown error class.
 *
 * Thrown when the requested tracer is not in the dispatch registry.
 */

import EmbodyError from './embody-error.js';

/**
 * Thrown when the requested tracer is not supported.
 *
 * @example
 * ```typescript
 * try {
 *   await trace('unknown-tracer', 'code');
 * } catch (error) {
 *   if (error instanceof TracerUnknownError) {
 *     console.log(error.tracer); // 'unknown-tracer'
 *   }
 * }
 * ```
 */
class TracerUnknownError extends EmbodyError {
  override readonly name = '(EmbodyError) TracerUnknownError' as const;
  readonly tracer: string;

  constructor(tracer: string, options?: ErrorOptions) {
    super(`Unknown tracer '${tracer}'`, options);
    this.tracer = tracer;
  }
}

export default TracerUnknownError;
