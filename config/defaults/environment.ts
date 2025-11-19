/**
 * @file Default configuration for educational execution tracer
 *
 * Provides the complete default configuration for how the trace environment is set up and how the trace is executed.
 *
 * @see README.md for comprehensive documentation
 */

import { Config } from '../types.js';

const defaultConfig: Config = {
  type: 'module', // module by default, can also be 'script'

  aran: {
    kind: null, // Code execution type. default to module for strict expectation.  infers from trace config's `type` if null
    globalDeclarativeRecord: 'emulate', // Global record mode (emulate protects advice)
    adviceGlobalVariable: '_TRACER_ADVICE_', // Global advice object name
    initialState: null, // Initial advice state
    mode: 'standalone', // Execution mode
    warning: false, // Warning handling
    path: '',
    root: ''
  }
};

export default defaultConfig;
