function block({
  event,
  bindings,
  structure, // for, if, while, ... null means free-floating block
  label,
}: {
  readonly event?: string;
  readonly bindings?: any;
  readonly structure?: string;
  readonly label?: string;
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    structure,
    label,
  };
}

export default block;
