import representValue from '../utils/represent-value.js';
import representCoercion from '../utils/represent-coercion.js';

interface PureOperatorEntry {
  category: 'operator';
  kind: 'pure';
  operator: string;
  operands?: any[];
  result?: any;
  coercion?: any[];
}

/**
 * Factory for pure operator step entries
 * Pure operators produce values without side effects (e.g., +, -, *, ==, <, typeof, in, instanceof, void)
 *
 * @param params - Object containing operator, result, and operands
 * @param meta - Object containing configuration (data mode)
 * @returns Step entry object for a pure operator
 */
export default function createPureOperationEntry(
  {
    operator = '',
    result,
    operands = []
  }: {
    operator?: string;
    result: any;
    operands?: any[];
  },
  {
    data,
    coercion
  }: {
    data: 'full' | 'types' | 'values' | 'raw' | false;
    coercion: boolean;
  }
): PureOperatorEntry {
  // Create basic entry structure
  const entry: PureOperatorEntry = {
    category: 'operator',
    kind: 'pure',
    operator
  };

  // Early return if data is false - no value representation needed
  if (data === false) {
    return entry;
  }

  // Add value properties since data were requested
  entry.operands = operands.map(op => representValue(op, data));
  entry.result = representValue(result, data);

  if (coercion) {
    entry.coercion = representCoercion(operator, operands, data);
  }

  return entry;
}
