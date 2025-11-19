'use strict';

/* Control Flow: While Loops Overview

While loop concepts have been split into focused examples:
- basic-while-loop.js - fundamental while loop mechanics
- while-vs-do-while.js - comparing while and do-while behavior
- while-loop-patterns.js - common while loop usage patterns

Study with:
- Start with basic-while-loop.js for core concepts
- ?variables to track condition changes and loop control
*/

// Quick demonstration of while loop concept
console.log('=== While Loop Core Concept ===');

let counter = 0;

console.log('Starting while loop...');
while (counter < 3) {
    console.log('Iteration: ' + counter);
    counter++;
}

console.log('Loop finished, counter: ' + counter);

// Compare with do-while
let doCounter = 0;

console.log('Starting do-while loop...');
do {
    console.log('Do-while iteration: ' + doCounter);
    doCounter++;
} while (doCounter < 3);

console.log('Do-while finished, counter: ' + doCounter);

/*
See the focused examples for detailed exploration of while loops.
*/