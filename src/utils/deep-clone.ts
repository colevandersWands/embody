/**
 * Deep clone utility for creating serializable copies of JavaScript values
 * Handles nested objects, arrays, and special types while avoiding circular references
 */

export default function deepClone(value: any, visited = new WeakSet()): any {
  // Primitives clone as-is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (visited.has(value)) {
    return '[Circular Reference]';
  }
  visited.add(value);

  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item, visited));
  }

  // Handle Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    value.forEach(item => {
      clonedSet.add(deepClone(item, visited));
    });
    return clonedSet;
  }

  // Handle Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    value.forEach((val, key) => {
      clonedMap.set(deepClone(key, visited), deepClone(val, visited));
    });
    return clonedMap;
  }

  // Handle functions (store as string representation)
  if (typeof value === 'function') {
    return {
      type: 'function',
      name: value.name || 'anonymous',
      stringified: value.toString().slice(0, 100) + (value.toString().length > 100 ? '...' : '')
    };
  }

  // Handle plain objects
  const clonedObj: any = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(value[key], visited);
    }
  }

  // Copy symbol properties if any
  const symbols = Object.getOwnPropertySymbols(value);
  for (const sym of symbols) {
    clonedObj[Symbol.keyFor(sym) || sym.toString()] = deepClone(value[sym], visited);
  }

  return clonedObj;
}