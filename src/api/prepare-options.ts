/**
 * @file Prepares config for lang record functions.
 *
 * Orchestrates validation of both meta (execution limits) and options (lang-specific).
 * Uses /configuring for structural validation (expand → fill → validate),
 * then calls lang's verifyOptions for semantic validation.
 */

import prepareConfig from '../configuring/prepare-config.js';
import type { JSONSchema } from '../configuring/types.js';
import charsSchema from '../langs/chars/schema.json';
import charsVerifyOptions from '../langs/chars/verify-options.js';
import metaSchema from '../langs/meta.schema.json';
import type { MetaConfig } from '../langs/types.js';

/** Lookup table for lang schemas */
const langSchemas: Readonly<Record<string, JSONSchema>> = {
  chars: charsSchema as JSONSchema,
};

/** Lookup table for lang verifyOptions */
const langVerifyOptions: Readonly<Record<string, ((options: unknown) => void) | undefined>> = {
  chars: charsVerifyOptions as (options: unknown) => void,
};

/**
 * User-provided config structure (both meta and options may be partial or missing).
 */
type UserConfig = {
  readonly meta?: Readonly<Record<string, unknown>>;
  readonly options?: Readonly<Record<string, unknown>>;
};

/**
 * Prepared config structure (both meta and options are fully filled).
 */
type PreparedConfig = {
  readonly meta: MetaConfig;
  readonly options: Record<string, unknown>;
};

/**
 * Prepares config for a lang record function.
 *
 * 1. Validates meta config against meta.schema.json
 * 2. Validates options against lang's schema.json
 * 3. Calls verifyOptions for semantic validation (throws OptionsSemanticInvalidError)
 *
 * @param lang - Language identifier
 * @param userConfig - User-provided config (may have partial meta/options)
 * @returns Fully-filled config ready for record()
 * @throws OptionsSchemaInvalidError if structural validation fails (meta or options)
 * @throws OptionsSemanticInvalidError if semantic validation fails
 */
function prepareOptions(lang: string, userConfig: UserConfig | undefined): PreparedConfig {
  // Prepare meta config (execution limits)
  const filledMeta = prepareConfig(userConfig?.meta ?? {}, metaSchema as JSONSchema) as MetaConfig;

  // Prepare lang options
  const schema = langSchemas[lang];
  const verifyOptions = langVerifyOptions[lang];

  const filledOptions = schema
    ? (prepareConfig(userConfig?.options ?? {}, schema) as Record<string, unknown>)
    : (userConfig?.options ?? {});

  // Semantic validation: cross-field constraints
  if (verifyOptions) {
    verifyOptions(filledOptions);
  }

  return { meta: filledMeta, options: filledOptions };
}

export default prepareOptions;
