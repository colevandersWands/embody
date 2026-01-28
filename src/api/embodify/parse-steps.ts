import deserialize from '../tracing/deserialize.js';

/**
 * Parses steps from JSON string or passes through arrays.
 *
 * @param {Array|string} steps - Steps array or JSON string
 * @returns {Array} Parsed steps array
 */
function parseSteps(steps: any) {
  return deserialize({ steps }).steps;
}

export default parseSteps;
