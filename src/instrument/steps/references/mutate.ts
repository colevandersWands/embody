export default function access({
  value = null, // determined by value config - reference entry? copy entry?  details TBD
  update = null, // diff, or full thing - based on value config?  details TBD
  id = null
} = {}) {
  return {
    category: 'scope',
    event: 'mutate',
    value,
    update,
    id
  };
}
