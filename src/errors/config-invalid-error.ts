/**
 * @file Config invalid error class.
 *
 * Thrown when lang or code arguments have wrong types.
 */

import EmbodyError from './embody-error.js';

/**
 * Thrown when lang or code arguments have wrong types.
 *
 * @example
 * ```typescript
 * try {
 *   await trace(123, 'code'); // lang should be string
 * } catch (error) {
 *   if (error instanceof ConfigInvalidError) {
 *     console.log(error.field); // 'lang'
 *   }
 * }
 * ```
 */
class ConfigInvalidError extends EmbodyError {
  override readonly name = '(EmbodyError) ConfigInvalidError' as const;
  readonly field: string;

  constructor(field: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.field = field;
  }
}

export default ConfigInvalidError;
