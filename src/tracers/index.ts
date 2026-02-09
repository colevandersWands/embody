/**
 * @file Tracer registry and barrel.
 *
 * Named exports: tracer namespaces for direct/tree-shakeable access.
 * Default export: registry Record<string, TracerEntry> for dynamic lookup.
 */

import * as jsKlve from './js-klve/index.js';
import * as chars from './txt-chars/index.js';
import type { TracerEntry } from './types.js';

// Barrel re-exports (tree-shakeable).
// eslint-disable-next-line unicorn/prefer-export-from -- local bindings needed for registry below
export { chars, jsKlve };

/**
 * Tracer registry mapping tracer ID to TracerEntry.
 * API layer looks up by tracer ID, then uses record/optionsSchema/verifyOptions.
 *
 * Type assertions needed due to contravariance: each tracer's specific
 * options type is a subtype of `unknown`, but TypeScript can't verify
 * this for function parameters without the assertion.
 */
const tracers: Record<string, TracerEntry> = {
  [chars.tracerId]: {
    record: chars.record as TracerEntry['record'],
    optionsSchema: chars.optionsSchema,
    verifyOptions: chars.verifyOptions as (options: unknown) => void,
  },
  [jsKlve.tracerId]: {
    record: jsKlve.record as TracerEntry['record'],
    optionsSchema: jsKlve.optionsSchema,
  },
};

export default tracers;
