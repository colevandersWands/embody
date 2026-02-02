const defaultMetaConfig = {
  max: {
    // defaults to max value
    steps: Infinity,
    iterations: Infinity,
    callstack: Infinity,
    time: Infinity, // milliseconds
  },
  range: null /*
    if null or undefined or missing, full range
    if [num1, num2] -> from line num1 to line num2
    if [{line: w, char: x}, {line: y, char: z}] -> from that char to that char
  */,
  timestamps: false,
  debug: {
    ast: false, // attach each AST node to events
    // ... other values?
  },
};

export default defaultMetaConfig;
