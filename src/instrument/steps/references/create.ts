export default function create({
  value = null, // determined by value config - reference entry? copy entry?  details TBD
  id = null
}) {
  return {
    category: 'scope',
    event: 'create',
    value,
    id
  };
}
