function createSymbol({ description }: { readonly description?: string } = {}) {
  return {
    category: 'symbol',
    kind: 'create',
    id: null, // TODO: reference-tracking symbols
    description,
  };
}

export default createSymbol;
