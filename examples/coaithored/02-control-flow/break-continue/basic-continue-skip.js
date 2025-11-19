'use strict';

/* Control Flow: Basic Continue Skip

Continue statement skips the rest of current iteration.
Shows basic filtering pattern with continue.

Study with:
- ?trace to see which iterations are skipped
- ?variables to track processing vs skipping
*/

// Basic continue in for loop
console.log('=== Processing only even numbers ===');
for (let i = 1; i <= 10; i++) {
    if (i % 2 !== 0) {
        console.log('Skipping odd number: ' + i);
        continue; // Skip rest of iteration for odd numbers
    }
    console.log('Processing even number: ' + i);
}

// Continue with multiple conditions
console.log('\n=== Multiple skip conditions ===');
for (let num = 1; num <= 8; num++) {
    // Skip multiples of 3
    if (num % 3 === 0) {
        console.log('Skipping multiple of 3: ' + num);
        continue;
    }
    
    // Skip number 7
    if (num === 7) {
        console.log('Skipping lucky number: ' + num);
        continue;
    }
    
    console.log('Processing: ' + num);
}

/*
How does continue skip the rest of the current iteration?
*/