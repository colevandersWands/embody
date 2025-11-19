'use strict';

/* Async Foundations: Synchronous vs Asynchronous

Demonstrates the difference between synchronous (blocking) and 
asynchronous (non-blocking) code execution.

Study with:
- ?trace to see execution order differences
- ?variables to see when values are available
*/

console.log('=== Synchronous Code ===');
console.log('1. Start synchronous operations');

// Synchronous operations execute in order
let result1 = 10 + 5;
console.log('2. Calculation result:', result1);

let result2 = result1 * 2;
console.log('3. Second calculation:', result2);

console.log('4. Synchronous operations complete');

console.log('\n=== Asynchronous Code ===');
console.log('5. Start asynchronous operations');

// setTimeout is asynchronous - doesn't block execution
setTimeout(function() {
    console.log('8. First async operation completed');
}, 100);

setTimeout(function() {
    console.log('9. Second async operation completed');
}, 50); // Shorter delay, but starts after first setTimeout

console.log('6. Async operations started');
console.log('7. Continuing with other code...');

// This runs before the setTimeout callbacks
console.log('10. More synchronous code');

/*
Expected output order:
1, 2, 3, 4, 5, 6, 7, 10, 9, 8

Educational questions:
- Why doesn't async code block the execution?
- What determines the order of async callbacks?
- How does JavaScript handle both sync and async code?
*/