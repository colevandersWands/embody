function module({
  event,
  bindings,
  file,
}: {
  readonly event?: string;
  readonly bindings?: any;
  readonly file?: string;
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    file,
  };
}

export default module;
