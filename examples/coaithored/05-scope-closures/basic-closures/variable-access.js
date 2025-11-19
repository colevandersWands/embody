'use strict';

/* Closures: Variable Access

Demonstrates how closures maintain access to outer variables
even after the outer function has returned.

Study with:
- ?variables to see persistent scope access
- ?trace to see outer function completion vs closure usage
*/

function createCounter() {
    let count = 0; // This variable persists in the closure
    
    function increment() {
        count++; // Modifies the closed-over variable
        console.log(`Count is now: ${count}`);
        return count;
    }
    
    console.log('Creating counter function');
    return increment;
}

// The outer function runs and returns
console.log('=== Outer Function Execution ===');
const counter = createCounter();
console.log('Outer function completed, returned counter');

// But the closure still has access to 'count'
console.log('\n=== Closure Access After Return ===');
counter(); // count = 1
counter(); // count = 2
counter(); // count = 3

console.log('The outer function is gone, but count persists!');

/*
Educational questions:
- How does count survive after createCounter returns?
- What happens to the outer function's scope?
- Why doesn't count reset between calls?
*/