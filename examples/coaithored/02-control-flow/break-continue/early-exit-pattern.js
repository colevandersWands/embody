'use strict';

/* Control Flow: Early Exit Pattern

Stop processing when a condition is met using break.
Demonstrates termination pattern for efficiency.

Study with:
- ?trace to see early termination behavior
- Compare with complete processing patterns
*/

// Early exit on limit reached
function processUntilLimit(start, maxValue) {
    console.log('=== Processing until limit: ' + maxValue + ' ===');
    let processed = 0;
    
    for (let num = start; num <= start + 20; num++) {
        console.log('Processing: ' + num);
        processed++;
        
        if (num >= maxValue) {
            console.log('Limit reached at: ' + num);
            break;  // Early exit
        }
    }
    
    console.log('Total processed: ' + processed);
    return processed;
}

// Test early exit
processUntilLimit(5, 8);

// Early exit on error condition
function processUntilError(start, count) {
    console.log('=== Processing until error ===');
    let successCount = 0;
    
    for (let i = 0; i < count; i++) {
        let value = start + i;
        console.log('Processing: ' + value);
        
        // Simulate error condition (divisible by 7)
        if (value % 7 === 0) {
            console.log('Error condition at: ' + value);
            break;
        }
        
        successCount++;
    }
    
    console.log('Successfully processed: ' + successCount);
    return successCount;
}

processUntilError(10, 10);

/*
When is early exit more efficient than complete processing?
*/