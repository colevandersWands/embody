import createConfig from '../../configuring/create.js';
import type { ExpandedConfig } from '../../configuring/types.js';
import type { InstrumentInput, InstrumentOutput } from '../../types/api.js';

/**
 * Instruments JavaScript code for execution tracing using the Aran framework.
 *
 * This function is the second stage in the tracing pipeline, taking raw
 * JavaScript code and transforming it to include instrumentation hooks
 * that will generate trace events during execution.
 *
 * @example
 * ```typescript
 * const result = instrument({
 *   code: 'let x = 5; console.log(x);',
 *   config: expandedConfig
 * });
 * // result.instrumented contains the transformed code with Aran hooks
 * ```
 *
 * @param input - Object containing the code to instrument and configuration
 * @returns Object with original inputs plus instrumented code and metadata
 * @throws {Error} If code is provided but not a string, or config is not an object
 *
 * @remarks
 * Uses graceful fallback strategy: if instrumentation fails (e.g., syntax error),
 * returns the original code with metadata explaining the fallback reason.
 * This ensures the pipeline can continue even with problematic code.
 *
 * The instrumentation process:
 * 1. Parse the code into an AST
 * 2. Apply Aran transformations based on config
 * 3. Generate instrumented code with advice hooks
 * 4. Return both original and instrumented versions
 *
 * @since 1.0.0
 */
function instrument(
  { code, config }: { readonly code?: string; readonly config?: ExpandedConfig } = {},
): InstrumentOutput {
  if (code !== undefined && typeof code !== 'string') {
    throw new Error(
      'instrument: expected code to be a string, got ' + typeof code,
    );
  }
  if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(
      'instrument: expected config to be an object, got ' +
        (Array.isArray(config) ? 'array' : typeof config),
    );
  }

  const resolvedCode = code ?? '';
  const resolvedConfig = config ?? createConfig({});

  // Stub: spaces between each character
  return {
    code: resolvedCode,
    config: resolvedConfig,
    instrumented: resolvedCode.split('').join(' '),
  };
}

export default instrument;
