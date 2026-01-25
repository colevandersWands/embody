export default function module({ event = null, bindings = null, file = null }) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    file
  };
}
