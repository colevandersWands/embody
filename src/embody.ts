import { EMPTY } from './utils/EMPTY';
import { fillConfig } from './exports/fill-config';
import { trace } from './exports/trace';

import type { UserConfig } from './config/types';
import type { TraceResult } from './types/api';

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
export default function embody(input: { config: UserConfig; code: string }): TraceResult;
export default function embody(input: { config: UserConfig }): (input: { code: string }) => TraceResult;
export default function embody(input: { code: string }): (input: { config?: UserConfig }) => TraceResult;

// Implementation with internal EMPTY handling
export default function embody({ config = EMPTY as any, code = EMPTY as any }: { config?: UserConfig | typeof EMPTY; code?: string | typeof EMPTY }) {
  if (config === EMPTY && code === EMPTY) {
    throw new Error('embody was called without code or config');
  }

  if (code === EMPTY) {
    const { config: cachedConfig } = fillConfig({ config: config as UserConfig });
    return function embodyWithClosedConfig({ code = EMPTY as any }: { code: string | typeof EMPTY }) {
      if (code === EMPTY) {
        throw new Error('embody was called with a closed config, and no code');
      }
      return trace({ code: code as string, config: cachedConfig });
    };
  }

  if (config === EMPTY) {
    return function embodyWithClosedCode({ config = EMPTY as any }: { config?: UserConfig | typeof EMPTY }) {
      if (config === EMPTY) {
        throw new Error('embody was called with a closed code, and no config');
      }
      return trace({ code: code as string, ...fillConfig({ config: config as UserConfig }) });
    };
  }

  return trace({ code: code as string, ...fillConfig({ config: config as UserConfig }) });
}
