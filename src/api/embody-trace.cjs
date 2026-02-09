/* eslint-disable */

/**
 * @file Node.js callback-style API for embody execution tracing.
 * ES5-compatible implementation using error-first callbacks and CommonJS.
 */

// CommonJS imports
var ArgumentInvalidError = require('../errors/argument-invalid-error.js').default;
var TracerUnknownError = require('../errors/tracer-unknown-error.js').default;
var prepareConfig = require('../configuring/prepare-config.js').default;
var deepClone = require('../utils/deep-clone.js').default;
var tracers = require('../tracers/index.js').default;
var metaSchema = require('../tracers/meta.schema.json');

/**
 * Execute a code trace with Node.js error-first callback pattern.
 *
 * @param {string} tracer - Tracer ID (e.g., 'txt:chars', 'js:klve')
 * @param {string} code - Source code to trace
 * @param {object} [config={}] - Optional config with meta and/or options
 * @param {Function} callback - Error-first callback (err, result)
 * @returns {void}
 *
 * @example
 * // With config
 * embodyTrace('txt:chars', 'hello', {}, function(err, result) {
 *   if (err) throw err;
 *   console.log(result.steps);
 * });
 *
 * // Without config
 * embodyTrace('txt:chars', 'hello', function(err, result) {
 *   if (err) throw err;
 *   console.log(result.steps);
 * });
 */
function embodyTrace(tracer, code, config, callback) {
  // 1. Argument overloading detection
  if (typeof config === 'function') {
    callback = config;
    config = {};
  }

  // 2. Callback validation (sync throw)
  if (typeof callback !== 'function') {
    throw new ArgumentInvalidError(
      'callback',
      'embodyTrace: expected callback to be a function, got ' + typeof callback,
    );
  }

  // 3-7. Synchronous validation + config preparation
  var tracerModule, errors, finalError, userConfig, meta, options, resolvedConfig;

  errors = [];

  // 3. Tracer type validation
  if (typeof tracer !== 'string' || tracer.trim() === '') {
    errors.push(
      new ArgumentInvalidError('tracer', 'embodyTrace: tracer must be a non-empty string'),
    );
  }

  // 4. Tracer registry lookup (only if tracer is valid)
  if (errors.length === 0) {
    tracerModule = tracers[tracer];
    if (!tracerModule) {
      errors.push(
        new TracerUnknownError(tracer, {
          cause: { available: Object.keys(tracers) },
        }),
      );
    }
  }

  // 5. Code type validation
  if (typeof code !== 'string') {
    errors.push(
      new ArgumentInvalidError(
        'code',
        'embodyTrace: expected code to be a string, got ' + typeof code,
      ),
    );
  }
  // Note: empty code string is allowed (matches trace())

  // 6. Config type validation
  if (config !== null && typeof config !== 'object') {
    errors.push(
      new ArgumentInvalidError(
        'config',
        'embodyTrace: expected config to be an object, got ' + typeof config,
      ),
    );
  }

  // 7. Config preparation (only if no errors so far)
  if (errors.length === 0) {
    try {
      userConfig = deepClone(config) || {};

      // Prepare meta
      meta = prepareConfig(userConfig.meta || {}, metaSchema);

      // Prepare options (conditional on schema existence)
      if (tracerModule.optionsSchema) {
        options = prepareConfig(userConfig.options || {}, tracerModule.optionsSchema);
      } else {
        options = {};
      }

      // Semantic validation (optional)
      if (tracerModule.verifyOptions) {
        tracerModule.verifyOptions(options);
      }

      resolvedConfig = { meta: meta, options: options };
    } catch (error) {
      errors.push(error);
    }
  }

  // If any validation errors, aggregate and deliver asynchronously
  if (errors.length > 0) {
    if (errors.length === 1) {
      finalError = errors[0];
    } else {
      // AggregateError for multiple validation failures
      finalError = new AggregateError(errors, 'embodyTrace: multiple validation errors');
    }

    setTimeout(function deliverValidationError() {
      callback(finalError, null);
    }, 0);
    return;
  }

  // 8. Execute trace (async)
  tracerModule
    .record(code, resolvedConfig)
    .then(function onTraceSuccess(steps) {
      // Success - deliver result with resolved config + steps
      callback(null, {
        steps: steps,
        config: resolvedConfig,
        tracer: tracer,
        code: code,
      });
    })
    .catch(function onTraceError(error) {
      // Runtime error - deliver to callback
      callback(error, null);
    });
}

module.exports = embodyTrace;
