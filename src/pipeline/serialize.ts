function serialize({ steps = [] } = {}) {
  if (!Array.isArray(steps)) {
    throw new Error('steps is not an array');
  }

  // ... serialization logic ...
  return '';
}

export default serialize;
