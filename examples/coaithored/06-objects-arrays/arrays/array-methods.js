'use strict';

/* Arrays: Basic Methods

Demonstrates push, pop, shift, unshift methods.
Shows how arrays can be modified.

Study with:
- ?trace to see array mutations
- ?variables to track array changes
*/

let numbers = [10, 20, 30];
console.log('Initial array:', numbers);

// push - add to end
numbers.push(40);
console.log('After push(40):', numbers);

// pop - remove from end
let popped = numbers.pop();
console.log('After pop():', numbers);
console.log('Popped value:', popped);

// unshift - add to beginning
numbers.unshift(5);
console.log('After unshift(5):', numbers);

// shift - remove from beginning
let shifted = numbers.shift();
console.log('After shift():', numbers);
console.log('Shifted value:', shifted);

// Multiple values
numbers.push(40, 50, 60);
console.log('After push multiple:', numbers);

// Check length changes
console.log('Final length:', numbers.length);

/*
Educational questions:
- Which methods modify the original array?
- What do pop() and shift() return?
- How does push differ from array[index] = value?
*/