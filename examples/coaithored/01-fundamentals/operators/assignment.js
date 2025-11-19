'use strict';

/* Operators: Assignment Operations

Demonstrates assignment operators and their compound forms.
Shows how assignment operators modify variables in place.

Study with:
- ?variables to track variable changes
- ?trace to see each assignment step
*/

// Start with initial values
let counter = 10;
let message = 'Hello';
let total = 100;

console.log('Initial values:');
console.log('counter:', counter);
console.log('message:', message);
console.log('total:', total);
console.log();

// Basic assignment
let newValue = 25;
counter = newValue;
console.log('After counter = newValue:', counter);

// Compound arithmetic assignments
counter += 5;  // equivalent to: counter = counter + 5
console.log('After counter += 5:', counter);

counter -= 3;  // equivalent to: counter = counter - 3
console.log('After counter -= 3:', counter);

counter *= 2;  // equivalent to: counter = counter * 2
console.log('After counter *= 2:', counter);

counter /= 4;  // equivalent to: counter = counter / 4
console.log('After counter /= 4:', counter);

counter %= 3;  // equivalent to: counter = counter % 3
console.log('After counter %= 3:', counter);

// String assignment
message += ' World';  // equivalent to: message = message + ' World'
console.log('After message += " World":', message);

// Assignment returns the assigned value
let x = 0;
let y = (x = 5) + 2;  // x gets 5, y gets 7
console.log('\nAssignment return value:');
console.log('x =', x, ', y =', y);

/*
Educational questions:
- What's the difference between = and +=?
- Why use compound assignments instead of separate operations?
- What value does an assignment expression return?
- How do compound assignments work with strings?
*/