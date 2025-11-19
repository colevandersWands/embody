'use strict';

/* Async Foundations: Event Loop Basics

Demonstrates how the JavaScript event loop handles different
types of operations and their execution order.

Study with:
- ?trace to see event loop scheduling
- Run multiple times to see consistent ordering
*/

console.log('=== Event Loop Demonstration ===');

// Immediate execution (call stack)
console.log('1. Synchronous code starts');

// Macrotask (setTimeout callback queue)
setTimeout(() => {
    console.log('5. setTimeout callback (macrotask)');
}, 0);

// Microtask (Promise.resolve callback queue)
Promise.resolve().then(() => {
    console.log('4. Promise callback (microtask)');
});

// More synchronous code
console.log('2. More synchronous code');

// Another microtask
Promise.resolve().then(() => {
    console.log('6. Second Promise callback (microtask)');
});

// More synchronous code
console.log('3. Final synchronous code');

// Additional demonstration with nested callbacks
setTimeout(() => {
    console.log('7. First nested setTimeout');
    
    Promise.resolve().then(() => {
        console.log('8. Promise inside setTimeout');
    });
    
    setTimeout(() => {
        console.log('9. Nested setTimeout');
    }, 0);
}, 0);

/*
Expected execution order:
1. Synchronous code starts
2. More synchronous code  
3. Final synchronous code
4. Promise callback (microtask)
5. setTimeout callback (macrotask)
6. Second Promise callback (microtask) 
7. First nested setTimeout
8. Promise inside setTimeout
9. Nested setTimeout

Educational questions:
- Why do Promise callbacks run before setTimeout callbacks?
- What's the difference between microtasks and macrotasks?
- How does the event loop prioritize different operations?
*/