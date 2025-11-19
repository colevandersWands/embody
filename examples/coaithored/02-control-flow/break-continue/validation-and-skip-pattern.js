'use strict';

/* Control Flow: Validation and Skip Pattern

Skip invalid items using continue statement.
Demonstrates filtering pattern within loops.

Study with:
- ?trace to see skip behavior for invalid items
- Compare processing count with and without skips
*/

// Validation and skip pattern
function processValidNumbers(start, end) {
    console.log('=== Processing valid numbers from ' + start + ' to ' + end + ' ===');
    let processedCount = 0;
    
    for (let num = start; num <= end; num++) {
        // Skip negative numbers
        if (num < 0) {
            console.log('Skipping negative: ' + num);
            continue;
        }
        
        // Skip numbers divisible by 5
        if (num % 5 === 0) {
            console.log('Skipping multiple of 5: ' + num);
            continue;
        }
        
        // Process valid number
        console.log('Processing valid: ' + num);
        processedCount++;
    }
    
    console.log('Total processed: ' + processedCount);
    return processedCount;
}

// Test validation pattern
processValidNumbers(-2, 12);

// Skip and accumulate pattern  
function sumValidNumbers(start, count) {
    console.log('=== Summing valid numbers ===');
    let sum = 0;
    let validCount = 0;
    
    for (let i = 0; i < count; i++) {
        let num = start + i;
        
        if (num <= 0) {
            console.log('Skipping non-positive: ' + num);
            continue;
        }
        
        console.log('Adding: ' + num);
        sum += num;
        validCount++;
    }
    
    console.log('Valid count: ' + validCount + ', Sum: ' + sum);
    return sum;
}

sumValidNumbers(-1, 5);

/*
How does the continue statement help filter invalid data?
*/