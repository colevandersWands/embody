'use strict';

/* Misconceptions: Async Timing Essence

Key misconception: setTimeout(fn, 0) runs immediately.
Reality: waits for call stack to empty. Promises beat setTimeout.

Study with: ?trace to see execution order */

console.log('1. Sync start');

setTimeout(() => console.log('4. setTimeout 0ms'), 0);

Promise.resolve().then(() => console.log('3. Promise'));

console.log('2. Sync end');

// Output order: 1, 2, 3, 4
// Why? Call stack empties first, then microtasks (Promise), then macrotasks (setTimeout)

// Common misconceptions:
console.log('WRONG: setTimeout(fn, 0) executes immediately');
console.log('RIGHT: waits for current execution to finish');

console.log('WRONG: Promise and setTimeout have same priority');  
console.log('RIGHT: Promise (microtask) beats setTimeout (macrotask)');

// Even 0ms delay doesn't make setTimeout immediate!
setTimeout(() => {
    console.log('5. Even this 0ms setTimeout waits');
}, 0);

/* Why doesn\'t 0ms mean immediate execution? */