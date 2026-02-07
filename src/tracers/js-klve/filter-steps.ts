/**
 * @file Post-execution filtering for trace steps.
 *
 * Filters steps based on configuration, removing unwanted node types,
 * timing phases, and data fields.
 */

import { AST_TO_CONFIG } from './ast-map.js';
import type { RawStep, JsKlveFilterConfig, JsKlveNodeConfig, JsKlveStep } from './types.js';

/**
 * Fully resolved node config (all fields required, no undefined).
 */
type ResolvedNodeConfig = {
  readonly declarations: { readonly variable: boolean };
  readonly loops: { readonly for: boolean; readonly while: boolean };
  readonly conditionals: { readonly if: boolean; readonly ternary: boolean };
  readonly blocks: { readonly try: boolean; readonly expressionStatement: boolean };
  readonly calls: { readonly call: boolean; readonly new: boolean };
  readonly access: { readonly member: boolean; readonly identifier: boolean };
  readonly operators: {
    readonly binary: boolean;
    readonly unary: boolean;
    readonly logical: boolean;
    readonly assignment: boolean;
    readonly update: boolean;
    readonly sequence: boolean;
  };
  readonly literals: {
    readonly numeric: boolean;
    readonly string: boolean;
    readonly boolean: boolean;
    readonly array: boolean;
    readonly object: boolean;
  };
  readonly functions: { readonly arrow: boolean; readonly expression: boolean };
};

/**
 * Fully resolved filter config (all fields required, no undefined).
 */
type ResolvedFilterConfig = {
  readonly nodes: ResolvedNodeConfig;
  readonly timing: { readonly before: boolean; readonly after: boolean };
  readonly data: {
    readonly scopes: boolean;
    readonly value: boolean;
    readonly logs: boolean;
    readonly dt: boolean;
    readonly loc: boolean;
  };
};

/**
 * Default filter configuration (all enabled).
 */
const DEFAULT_FILTER_CONFIG: ResolvedFilterConfig = {
  nodes: {
    declarations: { variable: true },
    loops: { for: true, while: true },
    conditionals: { if: true, ternary: true },
    blocks: { try: true, expressionStatement: true },
    calls: { call: true, new: true },
    access: { member: true, identifier: true },
    operators: {
      binary: true,
      unary: true,
      logical: true,
      assignment: true,
      update: true,
      sequence: true,
    },
    literals: { numeric: true, string: true, boolean: true, array: true, object: true },
    functions: { arrow: true, expression: true },
  },
  timing: { before: true, after: true },
  data: { scopes: true, value: true, logs: true, dt: true, loc: true },
};

/**
 * Fills missing config values with defaults.
 */
function fillConfig(config: JsKlveFilterConfig): ResolvedFilterConfig {
  const d = DEFAULT_FILTER_CONFIG;

  return {
    nodes: fillNodes(config.nodes ?? {}),
    timing: {
      before: config.timing?.before ?? d.timing.before,
      after: config.timing?.after ?? d.timing.after,
    },
    data: {
      scopes: config.data?.scopes ?? d.data.scopes,
      value: config.data?.value ?? d.data.value,
      logs: config.data?.logs ?? d.data.logs,
      dt: config.data?.dt ?? d.data.dt,
      loc: config.data?.loc ?? d.data.loc,
    },
  };
}

/**
 * Fills missing node config values with defaults.
 */
function fillNodes(nodes: JsKlveNodeConfig): ResolvedNodeConfig {
  const d = DEFAULT_FILTER_CONFIG.nodes;

  return {
    declarations: {
      variable: nodes.declarations?.variable ?? d.declarations.variable,
    },
    loops: {
      for: nodes.loops?.for ?? d.loops.for,
      while: nodes.loops?.while ?? d.loops.while,
    },
    conditionals: {
      if: nodes.conditionals?.if ?? d.conditionals.if,
      ternary: nodes.conditionals?.ternary ?? d.conditionals.ternary,
    },
    blocks: {
      try: nodes.blocks?.try ?? d.blocks.try,
      expressionStatement: nodes.blocks?.expressionStatement ?? d.blocks.expressionStatement,
    },
    calls: {
      call: nodes.calls?.call ?? d.calls.call,
      new: nodes.calls?.new ?? d.calls.new,
    },
    access: {
      member: nodes.access?.member ?? d.access.member,
      identifier: nodes.access?.identifier ?? d.access.identifier,
    },
    operators: {
      binary: nodes.operators?.binary ?? d.operators.binary,
      unary: nodes.operators?.unary ?? d.operators.unary,
      logical: nodes.operators?.logical ?? d.operators.logical,
      assignment: nodes.operators?.assignment ?? d.operators.assignment,
      update: nodes.operators?.update ?? d.operators.update,
      sequence: nodes.operators?.sequence ?? d.operators.sequence,
    },
    literals: {
      numeric: nodes.literals?.numeric ?? d.literals.numeric,
      string: nodes.literals?.string ?? d.literals.string,
      boolean: nodes.literals?.boolean ?? d.literals.boolean,
      array: nodes.literals?.array ?? d.literals.array,
      object: nodes.literals?.object ?? d.literals.object,
    },
    functions: {
      arrow: nodes.functions?.arrow ?? d.functions.arrow,
      expression: nodes.functions?.expression ?? d.functions.expression,
    },
  };
}

/**
 * Builds a lookup table from filled node config.
 * Returns { ASTNodeType: boolean } for O(1) filtering.
 */
function buildNodeLookup(nodes: ResolvedNodeConfig): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  // Flatten nested config to { configPath: boolean }
  const flatConfig: Record<string, boolean> = {
    'declarations.variable': nodes.declarations.variable,
    'loops.for': nodes.loops.for,
    'loops.while': nodes.loops.while,
    'conditionals.if': nodes.conditionals.if,
    'conditionals.ternary': nodes.conditionals.ternary,
    'blocks.try': nodes.blocks.try,
    'blocks.expressionStatement': nodes.blocks.expressionStatement,
    'calls.call': nodes.calls.call,
    'calls.new': nodes.calls.new,
    'access.member': nodes.access.member,
    'access.identifier': nodes.access.identifier,
    'operators.binary': nodes.operators.binary,
    'operators.unary': nodes.operators.unary,
    'operators.logical': nodes.operators.logical,
    'operators.assignment': nodes.operators.assignment,
    'operators.update': nodes.operators.update,
    'operators.sequence': nodes.operators.sequence,
    'literals.numeric': nodes.literals.numeric,
    'literals.string': nodes.literals.string,
    'literals.boolean': nodes.literals.boolean,
    'literals.array': nodes.literals.array,
    'literals.object': nodes.literals.object,
    'functions.arrow': nodes.functions.arrow,
    'functions.expression': nodes.functions.expression,
  };

  // Invert: for each AST type, lookup its config value
  for (const [astType, configPath] of Object.entries(AST_TO_CONFIG)) {
    result[astType] = flatConfig[configPath] ?? true;
  }

  return result;
}

/**
 * Strips data fields from a step based on config.
 */
function stripData(step: RawStep, dataConfig: ResolvedFilterConfig['data']): JsKlveStep {
  const result: JsKlveStep = {
    step: step.step,
    category: step.category,
  };

  if (step.type !== undefined) {
    (result as { readonly type?: string }).type = step.type;
  }

  if (step.time !== undefined) {
    (result as { readonly time?: string }).time = step.time;
  }

  if (dataConfig.loc && step.loc !== undefined) {
    (result as { readonly loc?: typeof step.loc }).loc = step.loc;
  }

  if (dataConfig.dt && step.dt !== undefined) {
    (result as { readonly dt?: number }).dt = step.dt;
  }

  if (dataConfig.scopes && step.scopes !== undefined) {
    (result as { readonly scopes?: readonly Record<string, unknown>[] }).scopes = step.scopes;
  }

  if (dataConfig.value && step.value !== undefined) {
    (result as { readonly value?: unknown }).value = step.value;
  }

  if (dataConfig.logs && step.logs !== undefined) {
    (result as { readonly logs?: readonly (readonly unknown[])[] }).logs = step.logs;
  }

  return result;
}

/**
 * Filters steps based on configuration.
 *
 * @param steps - Raw steps from tracer
 * @param config - Filter configuration (partial, defaults applied)
 * @returns Filtered and stripped steps
 */
function filterSteps(
  steps: readonly RawStep[],
  config: JsKlveFilterConfig = {},
): readonly JsKlveStep[] {
  const filled = fillConfig(config);
  const nodeLookup = buildNodeLookup(filled.nodes);

  return steps
    .filter((step) => {
      // Always keep init step
      if (step.category === 'init') return true;

      // Check timing
      if (step.time && !filled.timing[step.time]) return false;

      // Check node type
      if (step.type && nodeLookup[step.type] === false) return false;

      return true;
    })
    .map((step) => stripData(step, filled.data));
}

export default filterSteps;
export { fillConfig, buildNodeLookup, DEFAULT_FILTER_CONFIG };
