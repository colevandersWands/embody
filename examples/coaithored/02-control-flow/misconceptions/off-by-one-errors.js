'use strict';

/* Misconceptions: Off-by-One Errors Overview

Off-by-one error concepts distilled to essence:
- off-by-one-errors-essence.js - boundary condition mistakes
- (additional focused examples as needed)

Study with: Start with off-by-one-errors-essence.js */

// Multiple common off-by-one patterns
console.log('=== Common Off-by-One Patterns ===');

// Pattern 1: Range calculation
console.log('Sum from 10 to 12 (inclusive):');
let sum = 0;
for (let i = 10; i <= 12; i++) {  // Correct: includes 12
    sum += i;
    console.log(`Adding ${i}, sum: ${sum}`);
}

// Pattern 2: Array-like iteration 
console.log('\nProcess 3 items starting from 0:');
for (let i = 0; i < 3; i++) {  // Correct: 0, 1, 2
    console.log(`Item ${i}`);
}

// Pattern 3: Countdown
console.log('\nCountdown from 3 to 1:');
for (let i = 3; i >= 1; i--) {  // Correct: includes 1
    console.log(`Count: ${i}`);
}

// Pattern 4: Show the off-by-one mistake
console.log('\nCommon mistake - missing last number:');
for (let i = 1; i < 3; i++) {  // Wrong: only 1, 2 (missing 3)
    console.log(`Number: ${i}`);
}
console.log('Should have printed 1, 2, 3!');

console.log('\nRemember: < vs <= makes all the difference!');

/* See essence files for detailed off-by-one error exploration */