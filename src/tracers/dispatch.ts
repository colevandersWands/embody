/**
 * @file Tracer module dispatch registry.
 *
 * Maps tracer IDs to their TracerEntry objects. Each entry contains:
 * - record: the tracing function
 * - schema: JSON Schema for options validation
 * - verifyOptions: optional semantic validation
 */

import charsRecord from './chars/record.js';
import charsSchema from './chars/schema.json';
import charsVerifyOptions from './chars/verify-options.js';
import jsKlveRecord from './js-klve/record.js';
import jsKlveSchema from './js-klve/schema.json';
import type { TracerEntry } from './types.js';

/**
 * Dispatch registry mapping tracer ID to TracerEntry.
 * API layer looks up by tracer ID, then uses record/schema/verifyOptions.
 *
 * Type assertions needed due to contravariance: each tracer's specific
 * options type is a subtype of `unknown`, but TypeScript can't verify
 * this for function parameters without the assertion.
 */
const dispatch: Record<string, TracerEntry> = {
  chars: {
    record: charsRecord as TracerEntry['record'],
    schema: charsSchema,
    verifyOptions: charsVerifyOptions as (options: unknown) => void,
  },
  'js:klve': {
    record: jsKlveRecord as TracerEntry['record'],
    schema: jsKlveSchema,
  },
};

export default dispatch;
