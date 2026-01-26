/**
 * @file Preset aggregation for educational execution tracer
 * 
 * Barrel export that imports all individual preset files and re-exports them
 * as a single object to maintain API compatibility with existing code.
 * 
 * This allows the existing preset access pattern `presets[userConfig.preset]`
 * to continue working unchanged while organizing presets into individual files.
 * 
 * Structure:
 * - overview.ts: Beginner-friendly preset
 * - detailed.ts: Intermediate analysis (default)  
 * - exhaustive.ts: Advanced analysis with everything enabled
 * 
 * Each preset file exports only a configuration object (POJO) with no functions,
 * maintaining clear separation between data and logic.
 * 
 * @see README.md for complete preset documentation
 */

import { Presets } from '../types.js';

import detailed from './detailed.js';
import exhaustive from './exhaustive.js';
import overview from './overview.js';


/**
 * Aggregated presets object maintaining backward compatibility
 * Enables dynamic preset lookup: presets[userConfig.preset]
 */
const presets: Presets = {
  overview,
  detailed,
  exhaustive
};

export default presets;