'use strict';

/* Closures: Basic Closure

Demonstrates a function "closing over" variables from its outer scope.
Shows how inner functions remember their creation environment.

Study with:
- ?trace to see how closure captures variables
- ?variables to see persisted scope
*/

function createCounter() {
    let count = 0;  // This variable is "closed over"
    
    return function() {
        count++;  // Inner function can access and modify count
        console.log('Count is now:', count);
        return count;
    };
}

// Create two independent counters
let counter1 = createCounter();
let counter2 = createCounter();

console.log('Counter 1:');
counter1(); // 1
counter1(); // 2
counter1(); // 3

console.log('\nCounter 2 (independent):');
counter2(); // 1
counter2(); // 2

console.log('\nCounter 1 again:');
counter1(); // 4 - retained its state!

/*
Educational questions:
- How does the inner function access count after createCounter returns?
- Why do counter1 and counter2 have independent count values?
- What keeps the count variable alive?
*/