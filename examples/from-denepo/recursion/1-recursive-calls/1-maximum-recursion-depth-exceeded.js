'use strict';

/**
 * Maximum Recursion Depth Exceeded
 *
 * If a function calls itself without any conditional checks,
 * it will continue calling itself until the stack overflows.
 */

const recursionError = depth => {
  console.log(depth);

  recursionError(depth + 1);

  // this line will never be reached
  return 'done recursing';
};

recursionError(0);
