export default function block({
  event = null,
  bindings = null,
  structure = null, // for, if, while, ... null means free-floating block
  label = null
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    structure,
    label
  };
}
