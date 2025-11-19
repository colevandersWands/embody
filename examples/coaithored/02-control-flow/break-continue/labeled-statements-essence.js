'use strict';

/* Control Flow: Labeled Statements Essence

Labels let you break/continue outer loops from inner loops.
Format: labelName: for... then break/continue labelName.

Study with: ?trace to see which loop is affected */

// Without label: break only affects inner loop
console.log('Without label (break only inner):');
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        if (i === 2 && j === 2) {
            console.log('Breaking inner at [' + i + '][' + j + ']');
            break; // Only breaks inner loop
        }
        console.log('[' + i + '][' + j + ']');
    }
}

// With label: break affects labeled loop
console.log('\nWith label (break outer):');
outerLoop: for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        if (i === 2 && j === 2) {
            console.log('Breaking outer at [' + i + '][' + j + ']');
            break outerLoop; // Breaks labeled outer loop
        }
        console.log('[' + i + '][' + j + ']');
    }
}

// Labeled continue (skip to next iteration of outer loop)
console.log('\nLabeled continue:');
skipLoop: for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        if (j === 2) {
            continue skipLoop; // Skip to next i iteration
        }
        console.log('[' + i + '][' + j + ']');
    }
}

/* When do you need labeled statements? */