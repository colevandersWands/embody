'use strict';

/* Control Flow: While Loop Patterns

Common patterns for using while loops effectively.
Shows typical use cases and best practices.

Study with:
- ?variables to see pattern variations
- ?trace to follow different loop strategies
*/

// Pattern 1: Processing until target found
console.log('=== Search pattern ===');
let searchValue = 7;
let current = 1;
let found = false;

while (current <= 10 && !found) {
    console.log('Checking: ' + current);
    
    if (current === searchValue) {
        found = true;
        console.log('Found target: ' + searchValue);
    } else {
        current++;
    }
}

// Pattern 2: Accumulating until limit reached
console.log('\n=== Accumulation pattern ===');
let sum = 0;
let value = 1;

while (sum < 20) {
    console.log('Adding ' + value + ' to sum ' + sum);
    sum += value;
    value++;
}

console.log('Final sum: ' + sum);

// Pattern 3: Processing with flag control
console.log('\n=== Flag control pattern ===');
let processing = true;
let step = 1;

while (processing) {
    console.log('Processing step: ' + step);
    
    if (step >= 5) {
        processing = false;
        console.log('Processing complete');
    } else {
        step++;
    }
}

/*
What are the most common while loop patterns in programming?
*/