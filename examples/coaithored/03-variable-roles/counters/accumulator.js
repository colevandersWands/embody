'use strict';

/* Variable Roles: Accumulator Overview

Accumulator concepts distilled to essence:
- accumulator-essence.js - sum, product, string accumulation patterns
- (additional focused examples as needed)

Study with: Start with accumulator-essence.js */

// Quick demonstration of accumulator role
console.log('Accumulator Role Demo:');

// ACCUMULATOR: builds up values over iterations
let total = 0;  // Starts with identity value
for (let price of [10, 25, 5]) {
    total += price;  // Accumulates each value
    console.log('Running total: ' + total);
}

// Different accumulation types
let message = '';
for (let part of ['Hello', ' ', 'World']) {
    message += part;
    console.log('Message: "' + message + '"');
}

let factorial = 1;
for (let n = 1; n <= 4; n++) {
    factorial *= n;
    console.log(n + '! = ' + factorial);
}

/* See essence files for detailed accumulator patterns */