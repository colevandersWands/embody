'use strict';

/**
 * Callstack Countdown
 *
 * This recursive function calls itself a specific number of times, then returns 0.
 * Using a conditional statement, you can stop the recursion before there is an error.
 */

const callstackCountdown = depth => {
  /**
   * Recursively calls itself until the callstack depth is reached.
   * Each call prints the callstack countdown, then prints...
   *
   * Parameters:
   *   depth: number, greater than or equal to zero
   *
   * Returns -> 0, when the callstack depth is reached
   */

  if (depth === 0) {
    console.log('done!');
    return depth;
  }

  console.log(depth);
  return callstackCountdown(depth - 1);
};

callstackCountdown(3);
callstackCountdown(2);
callstackCountdown(1);
callstackCountdown(0);
