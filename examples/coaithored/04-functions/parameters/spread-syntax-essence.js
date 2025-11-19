'use strict';

/* Functions: Spread Syntax Essence

Spread syntax (...) unpacks arrays into individual function arguments.
Think: array → individual elements. Opposite of rest parameters.

Study with: ?trace to see array expansion */

// Function that expects individual arguments
function add(a, b, c) {
    return a + b + c;
}

// Array with values
let numbers = [1, 2, 3];

// Traditional way (tedious)
console.log('Traditional:', add(numbers[0], numbers[1], numbers[2]));

// Spread syntax (elegant)
console.log('Spread:', add(...numbers)); // Same as add(1, 2, 3)

// Works with any iterable
let moreNumbers = [10, 20, 30, 40];
console.log('Max with spread:', Math.max(...moreNumbers));

// Copying arrays
let original = [1, 2, 3];
let copy = [...original]; // Creates new array
console.log('Copy:', copy);

// Combining arrays
let first = [1, 2];
let second = [3, 4];
let combined = [...first, ...second]; // [1, 2, 3, 4]
console.log('Combined:', combined);

/* When to use spread vs rest parameters? */