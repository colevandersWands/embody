/**
 * Tests for js-klve filter-steps function.
 *
 * Unit tests for post-execution filtering logic.
 */

import filterSteps, {
  fillConfig,
  buildNodeLookup,
  DEFAULT_FILTER_CONFIG,
} from '../filter-steps.js';
import type { RawStep } from '../types.js';

/** Sample raw steps for testing */
const sampleSteps: readonly RawStep[] = [
  {
    step: 1,
    category: 'init',
  },
  {
    step: 2,
    category: 'statement',
    type: 'VariableDeclaration',
    time: 'before',
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 12 } },
    scopes: [{}],
    dt: 0,
  },
  {
    step: 3,
    category: 'expression',
    type: 'NumericLiteral',
    time: 'after',
    loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 11 } },
    value: 42,
    dt: 1,
  },
  {
    step: 4,
    category: 'expression',
    type: 'BinaryExpression',
    time: 'before',
    loc: { start: { line: 2, column: 0 }, end: { line: 2, column: 5 } },
    dt: 0,
  },
  {
    step: 5,
    category: 'expression',
    type: 'BinaryExpression',
    time: 'after',
    loc: { start: { line: 2, column: 0 }, end: { line: 2, column: 5 } },
    value: 3,
    dt: 2,
  },
  {
    step: 6,
    category: 'expression',
    type: 'Identifier',
    time: 'after',
    loc: { start: { line: 3, column: 0 }, end: { line: 3, column: 1 } },
    value: 1,
    scopes: [{ x: 1 }],
    dt: 0,
  },
];

describe('filterSteps', () => {
  describe('default behavior', () => {
    it('keeps all steps with empty config', () => {
      const result = filterSteps(sampleSteps, {});
      expect(result.length).toBe(sampleSteps.length);
    });

    it('always keeps init step regardless of filters', () => {
      const result = filterSteps(sampleSteps, {
        timing: { before: false, after: false },
      });
      expect(result.some((s) => s.category === 'init')).toBe(true);
    });
  });

  describe('timing filter', () => {
    it('excludes before steps when timing.before is false', () => {
      const result = filterSteps(sampleSteps, {
        timing: { before: false },
      });
      expect(result.some((s) => s.time === 'before')).toBe(false);
    });

    it('excludes after steps when timing.after is false', () => {
      const result = filterSteps(sampleSteps, {
        timing: { after: false },
      });
      expect(result.some((s) => s.time === 'after')).toBe(false);
    });

    it('includes both when both are true', () => {
      const result = filterSteps(sampleSteps, {
        timing: { before: true, after: true },
      });
      expect(result.some((s) => s.time === 'before')).toBe(true);
      expect(result.some((s) => s.time === 'after')).toBe(true);
    });
  });

  describe('node type filter', () => {
    it('excludes VariableDeclaration when declarations.variable is false', () => {
      const result = filterSteps(sampleSteps, {
        nodes: { declarations: { variable: false } },
      });
      expect(result.some((s) => s.type === 'VariableDeclaration')).toBe(false);
    });

    it('excludes NumericLiteral when literals.numeric is false', () => {
      const result = filterSteps(sampleSteps, {
        nodes: { literals: { numeric: false } },
      });
      expect(result.some((s) => s.type === 'NumericLiteral')).toBe(false);
    });

    it('excludes BinaryExpression when operators.binary is false', () => {
      const result = filterSteps(sampleSteps, {
        nodes: { operators: { binary: false } },
      });
      expect(result.some((s) => s.type === 'BinaryExpression')).toBe(false);
    });

    it('excludes Identifier when access.identifier is false', () => {
      const result = filterSteps(sampleSteps, {
        nodes: { access: { identifier: false } },
      });
      expect(result.some((s) => s.type === 'Identifier')).toBe(false);
    });

    it('keeps types not explicitly disabled', () => {
      const result = filterSteps(sampleSteps, {
        nodes: { literals: { numeric: false } },
      });
      expect(result.some((s) => s.type === 'BinaryExpression')).toBe(true);
    });
  });

  describe('data field stripping', () => {
    it('strips scopes when data.scopes is false', () => {
      const result = filterSteps(sampleSteps, {
        data: { scopes: false },
      });
      expect(result.every((s) => !('scopes' in s))).toBe(true);
    });

    it('strips value when data.value is false', () => {
      const result = filterSteps(sampleSteps, {
        data: { value: false },
      });
      expect(result.every((s) => !('value' in s))).toBe(true);
    });

    it('strips dt when data.dt is false', () => {
      const result = filterSteps(sampleSteps, {
        data: { dt: false },
      });
      expect(result.every((s) => !('dt' in s))).toBe(true);
    });

    it('strips loc when data.loc is false', () => {
      const result = filterSteps(sampleSteps, {
        data: { loc: false },
      });
      expect(result.every((s) => !('loc' in s))).toBe(true);
    });

    it('keeps all data fields when all are true', () => {
      const result = filterSteps(sampleSteps, {
        data: { scopes: true, value: true, dt: true, loc: true, logs: true },
      });
      expect(result.some((s) => 'scopes' in s)).toBe(true);
      expect(result.some((s) => 'value' in s)).toBe(true);
    });
  });

  describe('combined filters', () => {
    it('applies both timing and node filters', () => {
      const result = filterSteps(sampleSteps, {
        timing: { before: false },
        nodes: { literals: { numeric: false } },
      });
      expect(result.some((s) => s.time === 'before')).toBe(false);
      expect(result.some((s) => s.type === 'NumericLiteral')).toBe(false);
    });

    it('applies node filters with data stripping', () => {
      const result = filterSteps(sampleSteps, {
        nodes: { declarations: { variable: false } },
        data: { scopes: false },
      });
      expect(result.some((s) => s.type === 'VariableDeclaration')).toBe(false);
      expect(result.every((s) => !('scopes' in s))).toBe(true);
    });
  });
});

describe('fillConfig', () => {
  it('fills missing top-level properties with defaults', () => {
    const result = fillConfig({});
    expect(result.nodes).toBeDefined();
    expect(result.timing).toBeDefined();
    expect(result.data).toBeDefined();
  });

  it('fills missing timing properties', () => {
    const result = fillConfig({ timing: {} });
    expect(result.timing.before).toBe(true);
    expect(result.timing.after).toBe(true);
  });

  it('preserves provided values', () => {
    const result = fillConfig({ timing: { before: false } });
    expect(result.timing.before).toBe(false);
    expect(result.timing.after).toBe(true);
  });

  it('fills missing data properties', () => {
    const result = fillConfig({ data: {} });
    expect(result.data.scopes).toBe(true);
    expect(result.data.value).toBe(true);
    expect(result.data.logs).toBe(true);
    expect(result.data.dt).toBe(true);
    expect(result.data.loc).toBe(true);
  });

  it('fills missing node categories', () => {
    const result = fillConfig({ nodes: {} });
    expect(result.nodes.declarations.variable).toBe(true);
    expect(result.nodes.loops.for).toBe(true);
    expect(result.nodes.literals.numeric).toBe(true);
  });
});

describe('buildNodeLookup', () => {
  it('maps AST types to their config values', () => {
    const lookup = buildNodeLookup(DEFAULT_FILTER_CONFIG.nodes);
    expect(lookup['VariableDeclaration']).toBe(true);
    expect(lookup['NumericLiteral']).toBe(true);
    expect(lookup['BinaryExpression']).toBe(true);
  });

  it('reflects config changes', () => {
    const modified = {
      ...DEFAULT_FILTER_CONFIG.nodes,
      literals: { ...DEFAULT_FILTER_CONFIG.nodes.literals, numeric: false },
    };
    const lookup = buildNodeLookup(modified);
    expect(lookup['NumericLiteral']).toBe(false);
    expect(lookup['StringLiteral']).toBe(true);
  });
});

describe('DEFAULT_FILTER_CONFIG', () => {
  it('has all timing enabled', () => {
    expect(DEFAULT_FILTER_CONFIG.timing.before).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.timing.after).toBe(true);
  });

  it('has all data fields enabled', () => {
    expect(DEFAULT_FILTER_CONFIG.data.scopes).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.data.value).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.data.logs).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.data.dt).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.data.loc).toBe(true);
  });

  it('has all node types enabled', () => {
    expect(DEFAULT_FILTER_CONFIG.nodes.declarations.variable).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.nodes.loops.for).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.nodes.loops.while).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.nodes.literals.numeric).toBe(true);
    expect(DEFAULT_FILTER_CONFIG.nodes.operators.binary).toBe(true);
  });
});
