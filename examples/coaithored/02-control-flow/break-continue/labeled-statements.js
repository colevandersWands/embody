'use strict';

/* Control Flow: Labeled Statements Overview

Labeled statement concepts distilled to essence:
- labeled-statements-essence.js - break/continue with outer loop control
- (additional focused examples as needed)

Study with: Start with labeled-statements-essence.js */

// Quick demonstration of labeled statements
console.log('Finding target in nested loops:');

let target = 5;

searchLoop: for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
        let value = row + col;
        console.log('Checking [' + row + '][' + col + '] = ' + value);
        
        if (value === target) {
            console.log('Found ' + target + '! Breaking out of both loops.');
            break searchLoop; // Break outer loop by label
        }
    }
}

// Labeled continue example
console.log('\nSkipping problematic batches:');

batchLoop: for (let batch = 1; batch <= 3; batch++) {
    console.log('Processing batch ' + batch);
    
    for (let item = 1; item <= 3; item++) {
        if (batch === 2 && item === 2) {
            console.log('Problem in batch ' + batch + ', skipping to next batch');
            continue batchLoop; // Skip to next batch iteration
        }
        console.log('  Item ' + item + ' processed');
    }
}

/* See essence files for detailed labeled statement exploration */