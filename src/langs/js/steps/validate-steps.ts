import type { Step } from './types.js';

/**
 * Validates that a parsed value is a Step array.
 *
 * Checks two things:
 * 1. The value is an array
 * 2. Every element is a non-null object
 *
 * Used as the final validation gate for steps data, whether parsed
 * from JSON or received as an already-constructed array.
 *
 * @param parsed - Value to validate (typically from JSON.parse or direct input)
 * @returns The input cast as readonly Step[]
 * @throws {Error} If not an array: `'validateSteps: expected steps to be an array, got ...'`
 * @throws {Error} If any element is not an object: `'validateSteps: expected every step to be an object, got ... at index ...'`
 *
 * @example
 * ```typescript
 * validateSteps([{}, { type: 'declare' }])  // → same reference, typed as Step[]
 * validateSteps('hello')                     // → throws
 * validateSteps([1, 'two'])                  // → throws (element at index 0)
 * ```
 */
function validateSteps(parsed: unknown): readonly Step[] {
  if (!Array.isArray(parsed)) {
    throw new TypeError(`validateSteps: expected steps to be an array, got ${typeof parsed}`);
  }

  for (const [index, element] of parsed.entries()) {
    if (typeof element !== 'object' || element === null) {
      throw new Error(
        `validateSteps: expected every step to be an object, got ${
          element === null ? 'null' : typeof element
        } at index ${index}`,
      );
    }
  }

  return parsed as readonly Step[];
}

export default validateSteps;
