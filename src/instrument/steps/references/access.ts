function access({
  value, // determined by value config - reference entry? copy entry?  details TBD
  id,
}: {
  readonly value?: any;
  readonly id?: any;
} = {}) {
  return {
    category: 'scope',
    event: 'access',
    value,
    id,
  };
}

export default access;
