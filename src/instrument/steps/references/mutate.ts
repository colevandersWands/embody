function access({
  value, // determined by value config - reference entry? copy entry?  details TBD
  update, // diff, or full thing - based on value config?  details TBD
  id,
}: {
  readonly value?: any;
  readonly update?: any;
  readonly id?: any;
} = {}) {
  return {
    category: 'scope',
    event: 'mutate',
    value,
    update,
    id,
  };
}

export default access;
