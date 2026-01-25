export default function script({ event = null, file = null, bindings = null }) {
  return {
    category: 'scope',
    kind: 'script',
    event,
    file,
    bindings
  };
}
