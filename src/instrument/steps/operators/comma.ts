import representValue from '../utils/represent-value.js';

export default function createPureOperationEntry(
  {
    operands = []
  }: {
    readonly operands?: readonly any[];
  } = {},
  {
    data
  }: {
    readonly data: 'full' | 'types' | 'values' | 'raw' | false;
  } = {} as { readonly data: 'full' | 'types' | 'values' | 'raw' | false }
): CommaOperatorEntry {
  const entry: CommaOperatorEntry = {
    category: 'operator',
    kind: 'comma',
    operator: ','
  };

  // Early return if data is false - no value representation needed
  if (data === false) {
    return entry;
  }

  // Add value properties since data were requested
  entry.operands = operands.map(op => representValue(op, data));
  entry.result = representValue(operands[operands.length - 1], data);

  return entry;
}
