import deserialize from './tracing/deserialize.js';
import serialize from './tracing/serialize.js';
import type { Step } from '../types/api.js';

/**
 * Toggles between serialized (JSON string) and deserialized (array) step formats.
 *
 * Pickles is a bidirectional converter: pass an array of steps and get a JSON
 * string back, or pass a JSON string and get an array of steps back.
 *
 * @example
 * ```typescript
 * // Serialize: array → string
 * const { steps } = pickles({ steps: [{}, {}] });
 * // steps === '[{},{}]'
 *
 * // Deserialize: string → array
 * const { steps } = pickles({ steps: '[{},{}]' });
 * // steps === [{}, {}]
 * ```
 *
 * @param input - Object containing steps as either an array or JSON string
 * @returns Object with steps in the opposite format
 * @throws {Error} If steps is not provided
 * @throws {Error} If steps is not an array or string
 * @throws {Error} If steps is a string but invalid JSON
 *
 * @since 1.0.0
 */
function pickles(
  { steps }: { readonly steps?: readonly Step[] | string } = {},
): { readonly steps: string } | { readonly steps: readonly Step[] } {
  if (steps === undefined) {
    throw new Error(
      'pickles: expected steps to be provided (no steps given)',
    );
  }

  if (Array.isArray(steps)) {
    return { steps: serialize({ steps }) };
  }

  if (typeof steps === 'string') {
    return { steps: deserialize({ steps }).steps! };
  }

  throw new Error(
    'pickles: expected steps to be an array or string, got ' + typeof steps,
  );
}

export default pickles;
