/**
 * @file Options schema invalid error class.
 *
 * Thrown when user-provided options don't match the lang's JSON Schema.
 */

import EmbodyError from './embody-error.js';

/**
 * Thrown when options don't match the lang's JSON Schema.
 *
 * @example
 * ```typescript
 * try {
 *   await trace('chars', 'ab', { options: { direction: 'invalid' } });
 * } catch (error) {
 *   if (error instanceof OptionsSchemaInvalidError) {
 *     console.log(error.path); // 'options.direction'
 *   }
 * }
 * ```
 */
class OptionsSchemaInvalidError extends EmbodyError {
  override readonly name = '(EmbodyError) OptionsSchemaInvalidError' as const;
  readonly path: string | undefined;

  constructor(message: string, path?: string, options?: ErrorOptions) {
    super(message, options);
    this.path = path;
  }
}

export default OptionsSchemaInvalidError;
