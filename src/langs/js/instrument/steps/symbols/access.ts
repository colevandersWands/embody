function accessSymbol({ description }: { readonly description?: string } = {}) {
  return {
    category: 'symbol',
    kind: 'access',
    id: null, // TODO: reference-tracking symbols
    description,
  };
}

export default accessSymbol;
