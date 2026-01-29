import type { UserConfig } from '../configuring/types.js';
import type { TraceResult } from '../types/api.js';

import deserialize from './tracing/deserialize.js';
import fillConfig from './tracing/fill-config.js';
import instrumentRecord from './tracing/instrument-record.js';

/**
 * Main entry point for tracing JavaScript code execution.
 *
 * Embody instruments and executes JavaScript code to produce a detailed trace
 * of execution events. It supports three usage patterns through currying:
 *
 * @example
 * ```typescript
 * // 1. Both parameters - immediate execution
 * const trace = embody({ code: 'let x = 5', config: { preset: 'detailed' } });
 *
 * // 2. Config-first currying - reuse config for multiple traces
 * const tracer = embody({ config: { preset: 'overview' } });
 * const trace1 = tracer({ code: 'let x = 5' });
 * const trace2 = tracer({ code: 'const y = 10' });
 *
 * // 3. Code-first currying - apply different configs to same code
 * const codeTracer = embody({ code: 'let x = 5' });
 * const overview = codeTracer({ config: { preset: 'overview' } });
 * const detailed = codeTracer({ config: { preset: 'detailed' } });
 *
 * // 4. Pickle support - config as JSON string (auto-parsed)
 * const trace = embody({ code: 'let x = 5', config: '{"presets":"overview"}' });
 * ```
 *
 * @param input - Object containing code and/or config
 * @returns TraceResult if both provided, or curried function if one provided
 * @throws {Error} If neither code nor config is provided
 * @throws {Error} If code is provided but not a string
 * @throws {Error} If config is provided but not an object or string
 *
 * @remarks
 * The currying pattern enables performance optimization by caching expensive
 * configuration processing when the same config is used multiple times.
 *
 * Config accepts JSON strings (pickle support) which are auto-parsed.
 * Invalid JSON throws (consistent with all tracing functions).
 *
 * @since 1.0.0
 */

// Function overloads for proper type inference
function embody(input: {
  readonly config: UserConfig | string;
  readonly code: string;
}): TraceResult;
function embody(input: {
  readonly config?: UserConfig | string;
}): (input: { readonly code: string }) => TraceResult;
function embody(input: {
  readonly code: string;
}): (input: { readonly config?: UserConfig | string }) => TraceResult;

// Implementation with undefined checks (no EMPTY sentinel)
function embody({
  config,
  code,
}: {
  readonly config?: UserConfig | string;
  readonly code?: string;
} = {}) {
  // Type validation
  if (code !== undefined && typeof code !== 'string') {
    throw new Error(`embody: expected code to be a string, got ${typeof code}`);
  }
  if (config !== undefined && typeof config !== 'object' && typeof config !== 'string') {
    throw new Error(`embody: expected config to be an object or string, got ${typeof config}`);
  }
  if (
    config !== undefined &&
    typeof config === 'object' &&
    (config === null || Array.isArray(config))
  ) {
    throw new Error(
      `embody: expected config to be a plain object, got ${
        Array.isArray(config) ? 'array' : 'null'
      }`,
    );
  }

  // Pickle support: parse JSON string config, passthrough objects
  const resolvedConfig = deserialize({ config }).config;

  if (code === undefined && resolvedConfig === undefined) {
    throw new Error('embody: expected at least code or config to be provided');
  }

  if (code === undefined) {
    if (resolvedConfig === undefined) {
      // Unreachable (caught above), but satisfies TypeScript narrowing
      throw new Error('embody: expected at least code or config to be provided');
    }
    // Config-only: curry, cache expanded config
    const { config: cachedConfig } = fillConfig({ config: resolvedConfig });
    return function embodyWithClosedConfig({ code }: { readonly code?: string } = {}) {
      if (code === undefined) {
        throw new Error('embody: curried with config, but no code was provided');
      }
      if (typeof code !== 'string') {
        throw new TypeError(`embody: expected code to be a string, got ${typeof code}`);
      }
      return instrumentRecord({ code, config: cachedConfig });
    };
  }

  if (resolvedConfig === undefined) {
    // Code-only: curry, close over code
    return function embodyWithClosedCode({
      config,
    }: {
      readonly config?: UserConfig | string;
    } = {}) {
      const { config: innerConfig } = deserialize({ config });
      if (innerConfig === undefined) {
        throw new Error('embody: curried with code, but no config was provided');
      }
      return instrumentRecord({ code, ...fillConfig({ config: innerConfig }) });
    };
  }

  // Both provided: execute immediately
  return instrumentRecord({ code, ...fillConfig({ config: resolvedConfig }) });
}

export default embody;
