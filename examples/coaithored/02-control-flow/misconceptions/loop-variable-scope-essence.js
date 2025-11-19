'use strict';

/* Misconceptions: Loop Variable Scope Essence

Misconception: Loop variables work the same with var and let.
Reality: var leaks outside, let is block-scoped. var can overwrite outer variables.

Study with: ?variables to see scope differences */

// var leaks outside loop
for (var i = 0; i < 3; i++) {
    console.log('var i:', i);
}
console.log('After loop, var i:', i); // 3 (leaked!)

// let stays in loop
for (let j = 0; j < 3; j++) {
    console.log('let j:', j);
}
// console.log('let j:', j); // ReferenceError

// Dangerous var pollution
var counter = 100;
console.log('Before loop:', counter); // 100

for (var counter = 0; counter < 3; counter++) {
    console.log('Loop counter:', counter);
}
console.log('After loop:', counter); // 3 (overwrote original!)

// Safe let scoping
let safeCounter = 100;
for (let safeCounter = 0; safeCounter < 3; safeCounter++) {
    console.log('Loop safeCounter:', safeCounter);
}
console.log('After loop:', safeCounter); // Still 100

/* Why does var leak from loops? */