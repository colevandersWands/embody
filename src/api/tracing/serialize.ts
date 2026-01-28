import type { Step } from '../../types/api.js';

/**
 * Serializes trace steps into a JSON string.
 *
 * Takes an array of steps and returns their JSON representation.
 * Used for persisting trace data or transmitting it between systems.
 *
 * @param input - Object containing steps to serialize
 * @param input.steps - Array of trace steps to serialize
 * @returns JSON string representation of the steps array
 * @throws {Error} If steps is not an array or is not provided
 */
function serialize({ steps }: { readonly steps?: readonly Step[] } = {}): string {
  if (!Array.isArray(steps)) {
    throw new Error(
      'serialize: expected steps to be an array' +
        (steps === undefined ? ' (no steps provided)' : ', got ' + typeof steps),
    );
  }

  return JSON.stringify(steps);
}

export default serialize;
