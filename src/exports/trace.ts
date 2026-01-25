import { createConfig } from '../config';
import { instrument } from './instrument';
import { record } from './record';

import type { TraceInput, TraceOutput } from '../types/api';
import type { ExpandedConfig } from '../config/types';

/**
 * Complete pipeline orchestrator for JavaScript code tracing.
 *
 * This function coordinates the entire tracing pipeline by sequentially
 * calling instrument and record functions, threading configuration through
 * each stage while preserving the original code in the output.
 *
 * @example
 * ```typescript
 * const result = trace({
 *   code: 'let x = 5; console.log(x);',
 *   config: expandedConfig
 * });
 * // result contains:
 * // - code: original source code
 * // - config: expanded configuration used
 * // - steps: array of trace events from execution
 * ```
 *
 * @param input - Object containing code to trace and configuration
 * @returns Object with original code, config, and trace steps
 *
 * @remarks
 * The trace function implements the object-threading pattern:
 * 1. Receives `{ code, config }`
 * 2. Calls `instrument({ code, config })` → extracts `instrumented`
 * 3. Calls `record({ instrumented, config })` → extracts `steps`
 * 4. Returns `{ code, config, steps }` preserving original inputs
 *
 * This is the main internal orchestrator called by `embody` after
 * configuration processing.
 *
 * @since 1.0.0
 */
export default function trace({
  code = '',
  config = createConfig({}) as ExpandedConfig
}: TraceInput): TraceOutput {
  const { instrumented } = instrument({ code, config });
  const { steps } = record({ instrumented, config });

  return {
    code,
    config,
    steps
  };
}
