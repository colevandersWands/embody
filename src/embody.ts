import type { UserConfig } from './config/types.js';
import EMPTY from './constants/EMPTY.js';
import fillConfig from './pipeline/fill-config.js';
import trace from './pipeline/trace.js';
import type { TraceResult } from './types/api.js';

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
 * ```
 *
 * @remarks
 * The currying pattern enables performance optimization by caching expensive
 * configuration processing when the same config is used multiple times.
 *
 * @since 1.0.0
 */

// Function overloads for proper type inference
function embody(input: { readonly config: UserConfig; readonly code: string }): TraceResult;
function embody(input: { readonly config: UserConfig }): (input: { readonly code: string }) => TraceResult;
function embody(input: { readonly code: string }): (input: { readonly config?: UserConfig }) => TraceResult;

// Implementation with internal EMPTY handling
function embody({
  config = EMPTY as any,
  code = EMPTY as any,
}: {
  readonly config?: UserConfig | typeof EMPTY;
  readonly code?: string | typeof EMPTY;
} = {}) {
  if (config === EMPTY && code === EMPTY) {
    throw new Error('embody was called without code or config');
  }

  if (code === EMPTY) {
    const { config: cachedConfig } = fillConfig({ config: config as UserConfig });
    return function embodyWithClosedConfig({
      code = EMPTY as any,
    }: {
      readonly code: string | typeof EMPTY;
    } = {} as { readonly code: string | typeof EMPTY }) {
      if (code === EMPTY) {
        throw new Error('embody was called with a closed config, and no code');
      }
      return trace({ code, config: cachedConfig });
    };
  }

  if (config === EMPTY) {
    return function embodyWithClosedCode({
      config = EMPTY as any,
    }: {
      readonly config?: UserConfig | typeof EMPTY;
    } = {}) {
      if (config === EMPTY) {
        throw new Error('embody was called with a closed code, and no config');
      }
      return trace({ code, ...fillConfig({ config }) });
    };
  }

  return trace({ code, ...fillConfig({ config }) });
}

export default embody;
