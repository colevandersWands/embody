import createConfig from '../../configuring/create.js';
import type { ExpandedConfig } from '../../configuring/types.js';
import type { TraceOutput } from '../../types/api.js';

import instrument from './instrument.js';
import record from './record.js';

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
 * @throws {Error} If code is provided but not a string, or config is not an object
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
function instrumentRecord({
  code,
  config,
}: { readonly code?: string; readonly config?: ExpandedConfig } = {}): TraceOutput {
  if (code !== undefined && typeof code !== 'string') {
    throw new Error(`instrumentRecord: expected code to be a string, got ${typeof code}`);
  }
  if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(
      `instrumentRecord: expected config to be an object, got ${
        Array.isArray(config) ? 'array' : typeof config
      }`,
    );
  }

  const resolvedCode = code ?? '';
  const resolvedConfig = config ?? createConfig({});

  const { instrumented } = instrument({ code: resolvedCode, config: resolvedConfig });
  const { steps } = record({ instrumented, config: resolvedConfig });

  return {
    code: resolvedCode,
    config: resolvedConfig,
    steps,
  };
}

export default instrumentRecord;
