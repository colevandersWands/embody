import representValue from '../utils/represent-value.js';

type MutatingOperatorParameters = {
  readonly operator?: string;
  readonly target: string; // Variable name or property path
  readonly oldValue?: any;
  readonly newValue: any;
  readonly operand?: any; // For compound assignments (+=, -=, etc.)
};

type MutatingOperatorEntry = {
  readonly category: string;
  readonly kind: string;
  readonly operator: string;
  readonly target: string;
  readonly oldValue?: ReturnType<typeof representValue>;
  readonly newValue: ReturnType<typeof representValue>;
  readonly operand?: ReturnType<typeof representValue>;
};

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
function createMutatingOperator(
  {
    operator = '',
    target,
    oldValue,
    newValue,
    operand,
  }: MutatingOperatorParameters = {} as MutatingOperatorParameters,
  {
    data,
  }: {
    readonly data: 'full' | 'types' | 'values' | 'raw' | false;
  } = {} as { readonly data: 'full' | 'types' | 'values' | 'raw' | false },
): MutatingOperatorEntry {
  return {
    category: 'operator',
    kind: 'mutating',
    operator,
    target,
    newValue: representValue(newValue, data),
    ...(oldValue !== undefined && { oldValue: representValue(oldValue, data) }),
    ...(operand !== undefined && { operand: representValue(operand, data) }),
  };
}

export default createMutatingOperator;
