// what's the best way to manage setting the start time?  it should happen automatically on step 1
export const traceTracker = (trace = [], config = { step: 0, start: 0, timestamps: false }) => {
  return function tracing(entry = {}, ms = null) {
    step++;
    if (timestamps) ms = Date.now() - start;
  };
};
