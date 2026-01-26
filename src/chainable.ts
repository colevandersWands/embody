import EMPTY from './constants/EMPTY.js';
import deserialize from './pipeline/deserialize.js';
import fillConfig from './pipeline/fill-config.js';
import filterSteps from './pipeline/filter-steps.js';
import instrument from './pipeline/instrument.js';
import record from './pipeline/record.js';
import serialize from './pipeline/serialize.js';
import trace from './pipeline/trace.js';

function chainable({ code = EMPTY, config = EMPTY, steps = EMPTY } = {}) {
  return {
    deserialize() {},
    filterSteps() {},
    instrument() {},
    record() {},
    serialize() {},
    trace() {},

    code,
    config,
    steps
  };
}

export default chainable;

// usecases

chainable({ code, config }).trace().filterSteps({ otherconfig });
chainable({ code }).trace({ config }).filterSteps({ otherconfig });
chainable({ code }).trace({ config }).filterSteps({ otherconfig });
chainable().filterSteps({ otherconfig });
