/**
 * @file Simple tracing function.
 *
 * All validation and config prep is SYNCHRONOUS — errors throw immediately.
 * Only the final record() call is async.
 */

import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import ArgumentInvalidError from '../errors/argument-invalid-error.js';
import TracerUnknownError from '../errors/tracer-unknown-error.js';
import dispatch from '../tracers/dispatch.js';
import metaSchema from '../tracers/meta.schema.json';
import type { MetaConfig, StepCore } from '../tracers/types.js';
import deepClone from '../utils/deep-clone.js';

/**
 * Traces code execution for a given tracer.
 *
 * All validation and config prep is SYNCHRONOUS — errors throw immediately.
 * Only the final record() call is async.
 *
 * @param tracer - Tracer identifier (e.g., 'chars', 'js:klve')
 * @param code - Code/input to trace
 * @param config - Optional config with { meta?, options? } structure
 * @returns Promise resolving to array of trace steps
 * @throws {ArgumentInvalidError} (sync) if tracer/code/config has wrong type
 * @throws {TracerUnknownError} (sync) if tracer not supported
 * @throws {OptionsInvalidError} (sync) if schema validation fails
 * @throws {OptionsSemanticInvalidError} (sync) if verifyOptions fails
 */
function trace(tracer: string, code: string, config?: unknown): Promise<readonly StepCore[]> {
  // 1. Validate tracer type (sync)
  if (typeof tracer !== 'string' || tracer.trim() === '') {
    throw new ArgumentInvalidError('tracer', 'trace: tracer must be a non-empty string');
  }

  // 2. Check tracer exists (sync)
  const tracerModule = dispatch[tracer];
  if (!tracerModule) {
    throw new TracerUnknownError(tracer, { cause: { available: Object.keys(dispatch) } });
  }

  // 3. Validate code type (sync)
  if (typeof code !== 'string') {
    throw new ArgumentInvalidError(
      'code',
      `trace: expected code to be a string, got ${typeof code}`,
    );
  }

  // 4. Validate config type (sync)
  if (config !== undefined && config !== null && typeof config !== 'object') {
    throw new ArgumentInvalidError(
      'config',
      `trace: expected config to be an object, got ${typeof config}`,
    );
  }

  // 5. Prepare meta config (sync)
  const userConfig = (deepClone(config) ?? {}) as {
    readonly meta?: unknown;
    readonly options?: unknown;
  };
  const meta = prepareConfig(userConfig.meta ?? {}, metaSchema as JSONSchema) as MetaConfig;

  // 6. Prepare tracer options (sync) — skip if tracer has no schema
  const options = tracerModule.schema
    ? prepareConfig(userConfig.options ?? {}, tracerModule.schema as JSONSchema)
    : {};

  // 7. Semantic validation (sync) — only if tracer exports verifyOptions
  tracerModule?.verifyOptions?.(options);

  // 8. Record (async) — returns steps directly
  return tracerModule.record(code, { meta, options });
}

export default trace;
