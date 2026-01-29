function functionScope({
  event,
  name,
  bindings,
}: {
  readonly event?: string;
  readonly name?: string;
  readonly bindings?: any;
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    name,
    bindings,
  };
}

export default functionScope;
