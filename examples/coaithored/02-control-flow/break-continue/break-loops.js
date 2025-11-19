'use strict';

/* Control Flow: Break in Loops Overview

Break statement concepts distilled to essence:
- break-loops-essence.js - basic break usage and early termination
- (additional focused examples as needed)

Study with: Start with break-loops-essence.js */

// Break for early termination
console.log('Finding first even number:');
for (let i = 1; i <= 10; i++) {
    console.log('Testing:', i);
    
    if (i % 2 === 0) {
        console.log('Found even:', i);
        break; // Exit loop immediately
    }
}

// Break in while loop
console.log('\nPassword simulation:');
let attempts = 0;
while (attempts < 5) {
    attempts++;
    console.log('Attempt', attempts);
    
    if (attempts === 3) {
        console.log('Access granted!');
        break; // Stop trying
    }
}

// Labeled break for nested loops
console.log('\nSearching grid:');
outer: for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
        console.log(`Position (${row},${col})`);
        
        if (row === 2 && col === 2) {
            console.log('Found center!');
            break outer; // Exit both loops
        }
    }
}

/* See essence files for detailed break exploration */