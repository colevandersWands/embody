export default function functionScope({ event = null, name = null, bindings = null }) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    name,
    bindings
  };
}
