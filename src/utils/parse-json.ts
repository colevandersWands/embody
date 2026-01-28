/**
 * Wraps JSON.parse with a descriptive error message.
 *
 * Generic utility for safe JSON parsing with caller-controlled
 * error context. The caller provides an error prefix that identifies
 * where the parse was attempted, making errors self-documenting.
 *
 * @param value - JSON string to parse
 * @param errorPrefix - Context for error message
 *   (e.g., 'resolveSteps: invalid JSON for steps')
 * @returns Parsed value (type unknown — caller validates shape)
 * @throws {Error} `${errorPrefix} — ${parseError}` on invalid JSON
 *
 * @example
 * ```typescript
 * parseJSON('[1,2,3]', 'myFunc: invalid JSON for data')
 * // → [1, 2, 3]
 *
 * parseJSON('{bad}', 'myFunc: invalid JSON for data')
 * // → Error: 'myFunc: invalid JSON for data — Unexpected token ...'
 * ```
 */
function parseJSON(value: string, errorPrefix: string): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(
      errorPrefix + ' — ' + (error as Error).message,
    );
  }
}

export default parseJSON;
