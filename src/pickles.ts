import EMPTY from './constants/EMPTY';
import deserialize from './pipeline/deserialize';
import serialize from './pipeline/serialize';

function pickles({ steps = EMPTY } = {}) {
  if (Array.isArray(steps)) {
    return serialize(steps);
  }

  if (typeof steps === 'string') {
    return deserialize(steps);
  }

  throw new Error('steps must be either a string or an array');
}

export default pickles;
