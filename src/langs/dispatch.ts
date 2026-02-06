/**
 * @file Language module dispatch registry.
 *
 * Maps language IDs to their record functions. Each lang module:
 * - Exports only `record` (options defaults are internal)
 * - Receives fully-filled config from API layer
 */

import charsRecord from './chars/record.js';
import type { MetaConfig, RecordResult, StepCore } from './types.js';

/**
 * Record function signature for dispatch (async).
 * Each lang accepts config with meta (execution limits) and options (lang-specific).
 * Returns Promise<RecordResult> containing both steps and resolved config.
 */
type RecordFunction = (
  code: string,
  config: { readonly meta: MetaConfig; readonly options: unknown },
) => Promise<RecordResult<StepCore>>;

/**
 * Dispatch registry mapping lang ID to record function.
 * Each lang receives fully-filled config from the API layer.
 *
 * Type assertion needed due to contravariance: each lang's specific
 * options type is a subtype of `unknown`, but TypeScript can't verify
 * this for function parameters without the assertion.
 */
const dispatch: Record<string, RecordFunction> = {
  chars: charsRecord as RecordFunction,
};

export default dispatch;
