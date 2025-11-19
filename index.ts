/**
 * @study-lenses/embody
 *
 * Give life to JavaScript code through execution tracing.
 * Part of the Study Lenses educational infrastructure.
 */

import type { Config, ExpandedConfig } from './config/types.js';
import { createConfig } from './config/index.js';
// TODO: Import Aran integration when implemented
// import { instrument } from './aran/instrument.js';
// import { execute } from './runtime/execute.js';

/**
 * Execution trace event representing a moment in code execution
 */
export interface TraceEvent {
  /** Unique identifier for this event */
  id: number;
  /** Type of event (variable.read, function.call, etc.) */
  type: string;
  /** Timestamp relative to trace start */
  timestamp: number;
  /** Source location in original code */
  location?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  /** Event-specific data */
  data: Record<string, unknown>;
  /** Parent scope or context */
  parentId?: number;
}

/**
 * Complete execution trace containing all events
 */
export interface ExecutionTrace {
  /** All events in execution order */
  events: TraceEvent[];
  /** Metadata about the trace session */
  metadata: {
    /** When the trace was created */
    created: Date;
    /** Configuration used for tracing */
    config: ExpandedConfig;
    /** Total execution time in ms */
    duration: number;
  };
}

/**
 * Give life to JavaScript code by tracing its execution.
 *
 * @param code - JavaScript code to embody
 * @param config - Optional configuration for what to trace
 * @returns Complete execution trace
 *
 * @example
 * ```javascript
 * import { embody } from '@study-lenses/embody';
 *
 * const code = `
 *   function greet(name) {
 *     return "Hello, " + name;
 *   }
 *   greet("World");
 * `;
 *
 * const trace = embody(code, {
 *   preset: 'detailed',
 *   functions: { calls: true, returns: true }
 * });
 *
 * // Analyze how the code came to life
 * trace.events.forEach(event => {
 *   console.log(`${event.type}: ${JSON.stringify(event.data)}`);
 * });
 * ```
 */
export function embody(code: string, config?: Config): ExecutionTrace {
  // Expand configuration with defaults
  const expandedConfig = createConfig(config);

  // TODO: Implement actual tracing with Aran
  // For now, return a placeholder trace
  console.warn('embody: Full implementation pending. Returning placeholder trace.');

  return {
    events: [
      {
        id: 1,
        type: 'trace.start',
        timestamp: 0,
        data: { code: code.slice(0, 100) + (code.length > 100 ? '...' : '') }
      },
      {
        id: 2,
        type: 'trace.end',
        timestamp: 1,
        data: { success: true }
      }
    ],
    metadata: {
      created: new Date(),
      config: expandedConfig,
      duration: 1
    }
  };
}

// Re-export configuration utilities
export { createConfig } from './config/index.js';
export type { Config, ExpandedConfig } from './config/types.js';

// Re-export reference tracker for advanced users
export { factory as createReferenceTracker } from './reference-tracker/index.js';

/**
 * Sister library for static analysis
 * @see https://github.com/colevandersWands/examine
 */
export const SISTER_LIBRARY = '@study-lenses/examine';
