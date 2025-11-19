'use strict';

/* Control Flow: Continue Skip Overview

Continue skip concepts have been split into focused examples:
- basic-continue-skip.js - fundamental continue behavior in for loops
- continue-in-while-loops.js - continue with manual increment management

Study with:
- Start with basic-continue-skip.js for core concepts
- ?trace to see which iterations are skipped vs processed
*/

// Quick demonstration of continue concept
console.log('=== Continue Skip Core Concept ===');

for (let i = 1; i <= 6; i++) {
    if (i === 3 || i === 5) {
        console.log('Skipping: ' + i);
        continue; // Skip to next iteration
    }
    
    console.log('Processing: ' + i);
}

// Show continue vs break difference
console.log('\n=== Continue vs Break ===');

console.log('With continue (skips 3):');
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue; // Skip this iteration, continue with next
    }
    console.log('  Value: ' + i);
}

console.log('With break (stops at 3):');
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        break; // Exit loop completely
    }
    console.log('  Value: ' + i);
}

/*
See the focused examples for detailed exploration of continue behavior.
*/