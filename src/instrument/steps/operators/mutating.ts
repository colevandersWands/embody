import representValue from '../utils/represent-value.js';

type MutatingOperatorParams = {
  readonly operator?: string;
  readonly target: string; // Variable name or property path
  readonly oldValue?: any;
  readonly newValue: any;
  readonly operand?: any; // For compound assignments (+=, -=, etc.)
}

type MutatingOperatorEntry = {
  readonly category: string;
  readonly kind: string;
  readonly operator: string;
  readonly target: string;
  readonly oldValue?: ReturnType<typeof representValue>;
  readonly newValue: ReturnType<typeof representValue>;
  readonly operand?: ReturnType<typeof representValue>;
}

/**
 * Factory for mutating operator step entries
 * Mutating operators change variable state (=, +=, -=, *=, /=, %=, ++, --, etc.)
 *
 * @param operator - The operator symbol
 * @param target - The variable name or property path being mutated
 * @param oldValue - The value before mutation (if applicable)
 * @param newValue - The value after mutation
 * @param operand - The right-hand operand for compound assignments
 * @returns Step entry object for a mutating operator
 */
export default function createMutatingOperator({
  operator = '',
  target,
  oldValue,
  newValue,
  operand
}: MutatingOperatorParams = {} as MutatingOperatorParams): MutatingOperatorEntry {
  const entry: MutatingOperatorEntry = {
    category: 'operator',
    kind: 'mutating',
    operator,
    target,
    newValue: representValue(newValue)
  };

  // Include old value for compound assignments and increment/decrement
  if (oldValue !== undefined) {
    entry.oldValue = representValue(oldValue);
  }

  // Include operand for compound assignments (+=, -=, etc.)
  if (operand !== undefined) {
    entry.operand = representValue(operand);
  }

  return entry;
}
