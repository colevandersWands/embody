/**
 * @file Internal chain builder for the embodify pipeline wrapper.
 *
 * Builds immutable chain links. No validation — callers are
 * responsible for parsing/expanding before passing.
 *
 * `_config` defaults to `createConfig({})` (always has a value).
 * `_code`, `_instrumented`, `_steps` default to `null`
 * (null = "not provided", drives cascade logic).
 *
 * Getters are pure — they compute fresh on each access
 * with no side effects or param reassignment.
 */

import createNarrowConfig from '../../configuring/create-narrow-config.js';
import createConfig from '../../configuring/create.js';
import type { ExpandedConfig, UserConfig } from '../../configuring/types.js';
import type { Step } from '../../types/api.js';
import deepMerge from '../../utils/deep-merge.js';
import filterStepsFunction from '../tracing/filter-steps.js';
import instrumentRecord from '../tracing/instrument-record.js';
import instrumentFunction from '../tracing/instrument.js';
import record from '../tracing/record.js';
import serialize from '../tracing/serialize.js';

import parseConfig from './parse-config.js';
import parseSteps from './parse-steps.js';
import resolveMethodConfig from './resolve-method-config.js';
import validateField from './validate-field.js';

/**
 * Internal chain state - holds the current pipeline data
 * Note: Uses null for "not provided" (different from undefined for "omitted")
 */
type ChainState = {
  readonly _code?: string | null | undefined;
  readonly _config?: ExpandedConfig | undefined;
  readonly _instrumented?: string | null | undefined;
  readonly _steps?: readonly unknown[] | null | undefined;
};

/**
 * Config input type - accepts object, JSON string, or null
 */
type ConfigInput = UserConfig | string | null;

/**
 * Input for set() method - one of code, instrumented, steps, or config
 * Index signature needed for dynamic key filtering in set() implementation
 */
type SetInput = {
  readonly code?: string;
  readonly instrumented?: string;
  readonly steps?: readonly unknown[] | string;
  readonly config?: ConfigInput;
  readonly [key: string]: unknown;
};

/**
 * Input for mergeConfig() method
 */
type MergeConfigInput = {
  readonly config?: ConfigInput;
};

/**
 * Input for instrument() method
 */
type InstrumentInput = {
  readonly config?: ConfigInput;
};

/**
 * Input for trace() method
 */
type TraceInput = {
  readonly code?: string;
  readonly instrumented?: string;
  readonly config?: ConfigInput;
};

/**
 * Input for filterSteps() method
 */
type FilterStepsInput = {
  readonly steps?: readonly unknown[] | string;
  readonly config?: ConfigInput;
};

/**
 * Builds an immutable chain chainLink with lazy-cascading getters
 * and pipeline methods. Each method returns a new chainLink.
 *
 * @param {object} [options] - Internal chain state
 * @returns {object} Chainable pipeline chainLink
 */
function chainEmbodify({
  _code = null,
  _config = createConfig({}),
  _instrumented = null,
  _steps = null,
}: ChainState = {}) {
  const chainLink = {
    // === Getters (cascade lazily, pure — no caching) ===

    /**
     * Source code string. Returns empty string if not set.
     * @type {string}
     */
    get code() {
      return _code ?? '';
    },

    /**
     * Expanded configuration object. Always has a value
     * (defaults to expanded empty config).
     * @type {object}
     */
    get config() {
      return _config;
    },

    /**
     * Instrumented code string. Cascades from code if available.
     * Computes fresh on each access (no caching).
     * @type {string}
     */
    get instrumented() {
      if (_instrumented !== null) return _instrumented;
      if (_code === null) return '';
      return instrumentFunction({ code: _code, config: _config }).instrumented;
    },

    /**
     * Trace steps array. Cascades from instrumented if available.
     * Instrumented takes precedence over code when both are set.
     * Computes fresh on each access (no caching).
     * @type {Array}
     */
    get steps() {
      if (_steps !== null) return _steps;
      if (_code === null && _instrumented === null) return [];
      if (_instrumented !== null) {
        return record({
          instrumented: _instrumented,
          config: _config,
        }).steps;
      }
      return instrumentRecord({ code: _code as string, config: _config }).steps;
    },

    /**
     * Serialized steps as JSON string.
     * @type {string}
     */
    get pickledSteps() {
      return serialize({ steps: chainLink.steps as readonly Step[] });
    },

    /**
     * Serialized config as JSON string.
     * @type {string}
     */
    get pickledConfig() {
      return JSON.stringify(_config);
    },

    // === .set() — single property setter ===

    /**
     * Sets one property at a time. Returns a new chainLink.
     *
     * - No recognized property → no-op (new chainLink, same state)
     * - One property → dispatch (set value, reset dependents)
     * - Multiple properties → throw
     *
     * Pickle-aware: config and steps accept JSON strings.
     *
     * @param {object} [input] - Property to set
     * @param {string} [input.code] - New source code
     * @param {string} [input.instrumented] - New instrumented code
     * @param {Array|string} [input.steps] - New steps (array or JSON)
     * @param {object|string} [input.config] - New config (object or JSON)
     * @returns {object} New chainable chainLink
     * @throws {Error} If multiple properties provided
     * @throws {Error} If provided value has wrong type
     */
    set(input: SetInput = {}) {
      const keys = ['code', 'instrumented', 'steps', 'config'].filter(
        (k) => input[k] !== undefined,
      );

      if (keys.length === 0) {
        return chainEmbodify({
          _code,
          _config,
          _instrumented,
          _steps,
        });
      }

      if (keys.length > 1) {
        throw new Error('set() accepts exactly one of: code, instrumented, steps, config');
      }

      const key = keys[0];

      if (key === 'code') {
        validateField('code', input.code);
        return chainEmbodify({
          _code: input.code,
          _config,
        });
      }

      if (key === 'instrumented') {
        validateField('instrumented', input.instrumented);
        return chainEmbodify({
          _instrumented: input.instrumented,
          _config,
        });
      }

      if (key === 'steps') {
        validateField('steps', input.steps);
        return chainEmbodify({
          _steps: parseSteps(input.steps),
          _config,
        });
      }

      if (key === 'config') {
        validateField('config', input.config);
        return chainEmbodify({
          _config: createConfig(parseConfig(input.config)),
          _code,
        });
      }

      // unreachable — keys filtered from fixed array
      throw new Error(`unexpected set key: ${key}`);
    },

    // === mergeConfig ===

    /**
     * Merges partial config on top of current config. Returns
     * a new chainLink. No-op if no config provided. Resets
     * instrumented and steps (config-dependent).
     *
     * When a preset is specified, the entire config is replaced
     * (preset = "give me this whole profile").
     *
     * @param {object} [options] - Merge options
     * @param {object|string} [options.config] - Partial config
     * @returns {object} New chainable chainLink
     */
    mergeConfig({ config: newCfg }: MergeConfigInput = {}) {
      if (newCfg === undefined) {
        return chainEmbodify({
          _code,
          _config,
          _instrumented,
          _steps,
        });
      }

      const parsed = parseConfig(newCfg);
      const narrow = createNarrowConfig(parsed);
      const merged = createConfig(deepMerge(_config, narrow));

      return chainEmbodify({
        _code,
        _config: merged,
        // _instrumented, _steps reset (not passed)
      });
    },

    // === Pipeline Methods ===

    /**
     * Instruments code for tracing. Uses chain code or defaults
     * to empty string. Config override merged narrowly.
     *
     * @param {object} [options] - Instrument options
     * @param {object|string} [options.config] - Config override
     * @returns {object} New chainable chainLink with instrumented code
     */
    instrument({ config: cfgOverride }: InstrumentInput = {}) {
      const resolvedCfg = resolveMethodConfig(cfgOverride, _config);
      const c = _code ?? '';
      const result = instrumentFunction({
        code: c,
        config: resolvedCfg,
      });

      return chainEmbodify({
        _code,
        _config: resolvedCfg,
        _instrumented: result.instrumented,
        // _steps reset (new instrumented)
      });
    },

    /**
     * Traces code execution. Smart routing:
     * - Instrumented override → uses directly
     * - Chain has instrumented (no code override) → reuses
     * - Otherwise → instruments code first
     *
     * Uses defaults when no code or instrumented available.
     * Config override merged narrowly.
     *
     * @param {object} [options] - Trace options
     * @param {string} [options.code] - Code override (XOR instrumented)
     * @param {string} [options.instrumented] - Instrumented override
     * @param {object|string} [options.config] - Config override
     * @returns {object} New chainable chainLink with steps
     * @throws {Error} If both code and instrumented overrides given
     */
    trace({ code: codeOvr, instrumented: instrOvr, config: cfgOvr }: TraceInput = {}) {
      if (codeOvr !== undefined && instrOvr !== undefined) {
        throw new Error('provide code or instrumented, not both');
      }

      const resolvedCfg = resolveMethodConfig(cfgOvr, _config);

      let instr;
      let codeUsed = _code;

      if (instrOvr !== undefined) {
        instr = instrOvr;
        codeUsed = null;
      } else if (_instrumented !== null && codeOvr === undefined) {
        instr = _instrumented;
      } else {
        const c = codeOvr === undefined ? (_code ?? '') : codeOvr;
        if (codeOvr !== undefined) codeUsed = codeOvr;
        const instrResult = instrumentFunction({
          code: c,
          config: resolvedCfg,
        });
        instr = instrResult.instrumented;
      }

      const recResult = record({
        instrumented: instr,
        config: resolvedCfg,
      });

      return chainEmbodify({
        _code: codeUsed,
        _config: resolvedCfg,
        _instrumented: instr,
        _steps: recResult.steps,
      });
    },

    /**
     * Filters trace steps. Uses chain steps (cascaded) or
     * override. Config override merged narrowly.
     *
     * @param {object} [options] - Filter options
     * @param {Array|string} [options.steps] - Steps override
     * @param {object|string} [options.config] - Config override
     * @returns {object} New chainable chainLink with filtered steps
     */
    filterSteps({ steps: stepsOvr, config: cfgOvr }: FilterStepsInput = {}) {
      const s = stepsOvr === undefined ? chainLink.steps : parseSteps(stepsOvr);

      const resolvedCfg = resolveMethodConfig(cfgOvr, _config);
      const result = filterStepsFunction({
        steps: s as readonly Step[],
        config: resolvedCfg,
      });

      return chainEmbodify({
        _code,
        _config: resolvedCfg,
        _instrumented,
        _steps: result.steps,
      });
    },
  };

  return chainLink;
}

export default chainEmbodify;
