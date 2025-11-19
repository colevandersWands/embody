'use strict';

/* Misconceptions: Assignment vs Comparison Essence

Misconception: = compares values.
Reality: = assigns, === compares. Assignment returns the assigned value.

Study with: ?variables to see assignment effects */

let x = 10;

// Assignment (=) changes variable AND returns value
console.log('Assignment: (x = 5) returns', (x = 5)); // Returns 5, changes x
console.log('x is now:', x); // 5

// Comparison (===) checks equality, doesn't change variable
console.log('Comparison: (x === 5) returns', (x === 5)); // Returns true
console.log('x is still:', x); // Still 5

// Common bug: assignment in if statement
let score = 75;
if (score = 100) { // BUG! Assigns 100, always truthy
    console.log('This always runs! score is now:', score); // 100
}

// Correct: comparison in if statement
score = 75; // Reset
if (score === 100) { // Compares without changing
    console.log('This never runs');
} else {
    console.log('score is still:', score); // 75
}

// Why assignment returns value
let y = (x = 20); // x gets 20, y gets 20 (return value)
console.log('Chained assignment: x =', x, 'y =', y);

/* Why does assignment return a value? */