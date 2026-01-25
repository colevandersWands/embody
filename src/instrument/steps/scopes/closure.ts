export default function closure({
  event = null,
  bindings = null,
  parentName = null,
  parentCall = null // ID reference to the enclosing function call entry
}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    parentName,
    parentCall
  };
}
