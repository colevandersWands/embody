/**
 * Validates a single field value by key. Throws if the value
 * has the wrong type. No-op if value is undefined.
 *
 * @param {string} key - Field name ('code', 'config', 'steps')
 * @param {*} value - Value to validate
 * @throws {Error} If value has the wrong type for the given key
 */
function validateField(key: string, value: any) {
  if (key === 'code' && typeof value !== 'string') {
    throw new Error('code must be a string');
  }
  if (
    key === 'config' &&
    typeof value !== 'string' &&
    (typeof value !== 'object' || value === null || Array.isArray(value))
  ) {
    throw new Error('config must be a plain object or JSON string');
  }
  if (key === 'steps' && typeof value !== 'string' && !Array.isArray(value)) {
    throw new Error('steps must be an array or JSON string');
  }
}

export default validateField;
