export default function access({
  value = null, // determined by value config - reference entry? copy entry?  details TBD
  id = null
} = {}) {
  return {
    category: 'scope',
    event: 'access',
    value,
    id
  };
}
