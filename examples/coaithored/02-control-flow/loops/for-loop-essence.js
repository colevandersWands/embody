'use strict';

/* Control Flow: For Loops Essence

For loop = repeat code with counter. Three parts: initialization, condition, increment.
Loop continues while condition is true, updating counter each iteration.

Study with: ?variables to track loop counter changes */

// Basic for loop structure: for (init; condition; increment)
for (let i = 0; i < 3; i++) {
    console.log('Loop iteration:', i);
}

// Different counting patterns
for (let count = 5; count > 0; count--) {
    console.log('Countdown:', count);
}

// Using the counter in calculations
let sum = 0;
for (let i = 1; i <= 5; i++) {
    sum += i;  // Add current i to sum
    console.log('Added', i, 'sum is now', sum);
}

// Early exit with break
for (let num = 1; num <= 10; num++) {
    if (num === 4) {
        console.log('Found 4, stopping loop');
        break;  // Exit loop immediately
    }
    console.log('Number:', num);
}

/* How does the loop counter change in each iteration? */