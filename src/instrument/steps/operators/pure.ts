import representCoercion from '../utils/represent-coercion.js';
import representValue from '../utils/represent-value.js';

type PureOperatorEntry = {
  readonly category: 'operator';
  readonly kind: 'pure';
  readonly operator: string;
  readonly operands?: readonly any[];
  readonly result?: any;
  readonly coercion?: readonly any[];
};

/**
 * Factory for pure operator step entries
 * Pure operators produce values without side effects (e.g., +, -, *, ==, <, typeof, in, instanceof, void)
 *
 * @param params - Object containing operator, result, and operands
 * @param meta - Object containing configuration (data mode)
 * @returns Step entry object for a pure operator
 */
function createPureOperationEntry(
  {
    operator = '',
    result,
    operands = [],
  }: {
    readonly operator?: string;
    readonly result: any;
    readonly operands?: readonly any[];
  } = {} as {
    readonly operator?: string;
    readonly result: any;
    readonly operands?: readonly any[];
  },
  {
    data,
    coercion,
  }: {
    readonly data: 'full' | 'types' | 'values' | 'raw' | false;
    readonly coercion: boolean;
  } = {} as {
    readonly data: 'full' | 'types' | 'values' | 'raw' | false;
    readonly coercion: boolean;
  },
): PureOperatorEntry {
  return {
    category: 'operator',
    kind: 'pure',
    operator,
    ...(data !== false && {
      operands: operands.map((op) => representValue(op, data)),
      result: representValue(result, data),
      ...(coercion && { coercion: representCoercion(operator, operands, data) }),
    }),
  };
}

export default createPureOperationEntry;
