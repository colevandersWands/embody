import representValue from '../utils/represent-value.js';

type CommaOperatorEntry = {
  readonly category: 'operator';
  readonly kind: 'comma';
  readonly operator: ',';
  readonly operands?: readonly any[];
  readonly result?: any;
};

function createPureOperationEntry(
  {
    operands = [],
  }: {
    readonly operands?: readonly any[];
  } = {},
  {
    data,
  }: {
    readonly data: 'full' | 'types' | 'values' | 'raw' | false;
  } = {} as { readonly data: 'full' | 'types' | 'values' | 'raw' | false },
): CommaOperatorEntry {
  return {
    category: 'operator',
    kind: 'comma',
    operator: ',',
    ...(data !== false && {
      operands: operands.map((op) => representValue(op, data)),
      result: representValue(operands.at(-1), data),
    }),
  };
}

export default createPureOperationEntry;
