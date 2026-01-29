function closure({
  event,
  bindings,
  parentName,
  parentCall, // ID reference to the enclosing function call entry
}: {
  readonly event?: string;
  readonly bindings?: any;
  readonly parentName?: string;
  readonly parentCall?: any;
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    parentName,
    parentCall,
  };
}

export default closure;
