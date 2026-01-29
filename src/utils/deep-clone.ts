/**
 * Deep clone utility for creating serializable copies of JavaScript values
 * Handles nested objects, arrays, and special types while avoiding circular references
 *
 * @param value - The value to clone
 * @param visited - WeakSet to track visited objects (for circular reference detection)
 * @returns A deep copy of the input value
 */
function deepClone<T>(value: T, visited = new WeakSet<object>()): T {
  // Null clones as-is
  if (value === null) {
    return value;
  }

  // Handle functions (store as string representation)
  if (typeof value === 'function') {
    const function_ = value as unknown as (...arguments_: readonly unknown[]) => unknown;
    return {
      type: 'function',
      name: function_.name || 'anonymous',
      stringified:
        function_.toString().slice(0, 100) + (function_.toString().length > 100 ? '...' : ''),
    } as T;
  }

  // Primitives clone as-is
  if (typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (visited.has(value)) {
    return '[Circular Reference]' as T;
  }
  visited.add(value);

  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value) as T;
  }

  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item, visited)) as T;
  }

  // Handle Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    for (const item of value) {
      clonedSet.add(deepClone(item, visited));
    }
    return clonedSet as T;
  }

  // Handle Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    for (const [key, value_] of value.entries()) {
      clonedMap.set(deepClone(key, visited), deepClone(value_, visited));
    }
    return clonedMap as T;
  }

  // Handle plain objects
  const clonedObject: Record<string, unknown> = {};
  const valueObject = value as Record<string, unknown>;
  for (const key in valueObject) {
    if (Object.prototype.hasOwnProperty.call(valueObject, key)) {
      clonedObject[key] = deepClone(valueObject[key], visited);
    }
  }

  // Copy symbol properties if any
  const symbols = Object.getOwnPropertySymbols(value as object);
  for (const sym of symbols) {
    const symKey = Symbol.keyFor(sym) ?? sym.toString();
    clonedObject[symKey] = deepClone((value as Record<symbol, unknown>)[sym], visited);
  }

  return clonedObject as T;
}

export default deepClone;
