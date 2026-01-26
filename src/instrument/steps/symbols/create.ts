export function createSymbol({ description = null } = {}) {
  return {
    category: 'symbol',
    kind: 'create',
    id: null, // TODO: reference-tracking symbols
    description
  };
}
