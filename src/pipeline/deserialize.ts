function deserialize({ serializedSteps = '' } = {}) {
  if (serializedSteps !== 'string') {
    throw new Error('serialized steps is not a string');
  }

  // ... serialization logic ...
  return [];
}

export default deserialize;
