export const state = ({ start = Date.now(), step = 0 }) => ({
  start,
  step,

  depth: {
    blocks: 0,
    callstack: 0,
    parenthesis: 0
  }
});
