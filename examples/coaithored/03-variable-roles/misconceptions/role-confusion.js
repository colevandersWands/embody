'use strict';

/* Variable Roles: Misconceptions - Role Confusion

Common misconception: "All variables in loops are counters"
Reality: Variables have different roles - counter, accumulator, temporary, etc.

Study with:
- ?variables to see different variable role patterns
- ?trace to follow how each role has distinct update patterns
*/

console.log('=== Variable Role Confusion ===');

// Students might think ALL variables here are "counters"
// Actually they have very different roles!

let total = 0;        // ACCUMULATOR: builds up a sum
let count = 0;        // COUNTER: tracks iterations  
let maxPrice = 0;     // HOLDER: keeps track of maximum

// Process number sequence representing prices: 10, 25, 15, 30
for (let i = 1; i <= 4; i++) {              // i = COUNTER (index)
    let currentPrice = i * 5 + (i % 2) * 10; // TEMPORARY: calculated price
    
    console.log('Processing item ' + i + ' price: ' + currentPrice);
    
    total = total + currentPrice;    // ACCUMULATOR pattern: adds values
    count = count + 1;               // COUNTER pattern: regular increment
    
    if (currentPrice > maxPrice) {   // HOLDER pattern: conditional update
        maxPrice = currentPrice;
    }
}

console.log('Final total: ' + total);        // Sum of all prices
console.log('Final count: ' + count);        // Number of items processed  
console.log('Max price: ' + maxPrice);       // Highest price found

// Common beginner mistake: treating accumulator like counter
let brokenTotal = 0;
console.log('\nCommon mistake - treating accumulator like counter:');

for (let i = 1; i <= 4; i++) {
    console.log('Before: brokenTotal = ' + brokenTotal);
    brokenTotal++;  // WRONG! Incrementing instead of accumulating
    console.log('After increment: brokenTotal = ' + brokenTotal);
}

console.log('Broken result: ' + brokenTotal + ' (just counts iterations, not sum!)');

/*
Educational Analysis - Variable Role Patterns:
- COUNTER: increments by 1 each time (i, count)
- ACCUMULATOR: adds values together (total)  
- HOLDER: remembers best/worst value (maxPrice)
- TEMPORARY: holds current calculated value (currentPrice)

Each role has a distinct pattern of updates that educational tools can detect!
*/