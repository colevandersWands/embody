import parseJSON from '../utils/parse-json.js';

import type { Step, ResolveStepsInput, ResolveStepsOutput } from './types.js';
import validateSteps from './validate-steps.js';

/**
 * Resolves steps from a JSON string or validates an existing array.
 *
 * Three paths:
 * - undefined → returns undefined (not provided)
 * - string → JSON.parse + validateSteps
 * - array → validateSteps (passthrough with validation)
 *
 * @param steps - JSON string, Step array, or undefined
 * @returns Validated Step array or undefined
 * @throws {Error} If string is invalid JSON: `'resolveSteps: invalid JSON for steps — ...'`
 * @throws {Error} If parsed/provided value fails validation (delegated to validateSteps)
 * @throws {Error} If steps is not a string, array, or undefined: `'resolveSteps: expected steps to be a string or array, got ...'`
 *
 * @example
 * ```typescript
 * resolveSteps('[{},{}]')       // → [{}, {}]  (parsed + validated)
 * resolveSteps([{}, {}])        // → same reference (validated passthrough)
 * resolveSteps(undefined)       // → undefined
 * resolveSteps('{bad}')         // → throws (invalid JSON)
 * resolveSteps(42)              // → throws (wrong type)
 * ```
 */
function resolveSteps(steps: ResolveStepsInput): ResolveStepsOutput {
  if (steps === undefined) return undefined;

  if (typeof steps === 'string') {
    return validateSteps(parseJSON(steps, 'resolveSteps: invalid JSON for steps'));
  }

  if (Array.isArray(steps)) {
    return validateSteps(steps);
  }

  throw new Error(`resolveSteps: expected steps to be a string or array, got ${typeof steps}`);
}

export default resolveSteps;
