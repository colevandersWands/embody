function script({
  event,
  file,
  bindings,
}: {
  readonly event?: string;
  readonly file?: string;
  readonly bindings?: any;
} = {}) {
  return {
    category: 'scope',
    kind: 'script',
    event,
    file,
    bindings,
  };
}

export default script;
