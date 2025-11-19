/**
 * @file Main config module exports for educational execution tracer
 *
 * Aggregates all configuration functionality into a single public API.
 * Each file exports exactly one thing matching its filename for clarity.
 *
 * @see README.md for complete documentation and usage examples
 */

// Type exports
export type {
  Config,
  ExpandedConfig,
  UserConfig,
  PresetName,
  Presets,
  DeclareConfig,
  VariablesConfig,
  FunctionsConfig,
  ControlFlowConfig,
  OperatorsConfig,
  ClosuresConfig,
  ScopesConfig,
  ErrorsConfig,
  CodeRangeConfig,
  AranConfig,
  DefaultExpansions
} from './types.js';

// Function and object exports
export { default as defaultConfig } from './defaults/trace.js';
export { default as presets } from './presets/index.js';
export { default as applyPreset } from './apply-preset.js';
export { default as expandShorthand } from './expand-shorthand.js';
export { default as createConfig } from './create.js';
