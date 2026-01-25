import representValue from '../utils/represent-value.js';

interface ShortCircuitingOperatorParams {
  operator?: string;
  left: any;
  right?: any;
  result: any;
  rightEvaluated: boolean;
}

interface ShortCircuitingOperatorEntry {
  category: string;
  kind: string;
  operator: string;
  left: ReturnType<typeof representValue>;
  right?: ReturnType<typeof representValue>;
  result: ReturnType<typeof representValue>;
  rightEvaluated: boolean;
}

/**
 * Factory for short-circuiting operator step entries
 * Short-circuiting operators may skip evaluating the right operand based on the left operand
 * (&&, ||, ??, ?:)
 *
 * @param operator - The operator symbol
 * @param left - The left operand value
 * @param right - The right operand value (if evaluated)
 * @param result - The final result value
 * @param rightEvaluated - Whether the right operand was evaluated
 * @returns Step entry object for a short-circuiting operator
 */
export default function createShortCircuitingOperator({
  operator = '',
  left,
  right,
  result,
  rightEvaluated
}: ShortCircuitingOperatorParams): ShortCircuitingOperatorEntry {
  const entry: ShortCircuitingOperatorEntry = {
    category: 'operator',
    kind: 'short-circuiting',
    operator,
    left: representValue(left),
    result: representValue(result),
    rightEvaluated
  };

  // Only include right operand if it was evaluated
  if (rightEvaluated) {
    entry.right = representValue(right);
  }

  return entry;
}
