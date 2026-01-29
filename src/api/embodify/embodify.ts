/**
 * @file Public entry point for the embodify chainable pipeline wrapper.
 *
 * Validates user input (exclusive pair, type checks), parses/expands
 * values, then delegates to the internal chain builder.
 *
 * @example
 * ```js
 * // Simple trace
 * embodify({ code: 'let x = 5;' }).trace().steps;
 *
 * // Lazy cascade — steps computed on access
 * embodify({ code: 'let x = 5;' }).steps;
 *
 * // Branch and compare
 * const base = embodify({ code, config }).trace();
 * base.set({ config: overviewConfig }).steps;
 * base.set({ config: detailedConfig }).steps;
 * ```
 */

import createConfig from '../../configuring/create.js';

import chainEmbodify from './chain-embodify.js';
import parseConfig from './parse-config.js';
import parseSteps from './parse-steps.js';
import validateField from './validate-field.js';

/**
 * Creates a chainable pipeline wrapper for tracing JavaScript execution.
 *
 * All parameters are optional. String values for `config` and `steps`
 * are auto-parsed (JSON). No-arg or empty object gives all defaults.
 *
 * @param {object} [options] - Construction options
 * @param {string} [options.code] - Source code (XOR with instrumented)
 * @param {object|string} [options.config] - Config (object or JSON string)
 * @param {Array|string} [options.steps] - Steps (array or JSON string)
 * @param {string} [options.instrumented] - Pre-instrumented code (XOR with code)
 * @returns {object} Chainable pipeline link
 * @throws {Error} If both code and instrumented provided
 * @throws {Error} If a provided value has the wrong type
 */
function embodify({ code, config, steps, instrumented }: any = {}) {
  if (code !== undefined && instrumented !== undefined) {
    throw new Error('provide code or instrumented, not both');
  }

  if (code !== undefined) validateField('code', code);
  if (instrumented !== undefined) validateField('instrumented', instrumented);
  if (config !== undefined) validateField('config', config);
  if (steps !== undefined) validateField('steps', steps);

  return chainEmbodify({
    _code: code === undefined ? null : code,
    _config: config === undefined ? undefined : createConfig(parseConfig(config)),
    _steps: steps === undefined ? null : parseSteps(steps),
    _instrumented: instrumented === undefined ? null : instrumented,
  });
}

export default embodify;
