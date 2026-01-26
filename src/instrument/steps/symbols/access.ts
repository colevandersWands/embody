export function accessSymbol({ description = null } = {}) {
  return {
    category: 'symbol',
    kind: 'access',
    id: null, // TODO: reference-tracking symbols
    description
  };
}
