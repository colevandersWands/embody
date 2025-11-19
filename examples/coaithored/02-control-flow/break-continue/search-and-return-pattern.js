'use strict';

/* Control Flow: Search and Return Pattern

Search for a target value and return immediately when found.
Demonstrates early exit pattern for search operations.

Study with:
- ?trace to see search termination when target found
- Compare with exhaustive search patterns
*/

// Search and return pattern
function findTargetNumber(start, end, target) {
    console.log('=== Searching for number: ' + target + ' ===');
    
    for (let num = start; num <= end; num++) {
        console.log('Checking number: ' + num);
        
        if (num === target) {
            console.log('Found target: ' + target);
            return num;  // Immediate return when found
        }
    }
    
    console.log('Target ' + target + ' not found in range');
    return -1;  // Not found indicator
}

// Test search pattern
console.log('Result: ' + findTargetNumber(10, 20, 15));  // Found
console.log('Result: ' + findTargetNumber(10, 20, 25));  // Not found

// Search for first valid number pattern
function findFirstValid(start, count) {
    console.log('=== Finding first valid number ===');
    
    for (let i = 0; i < count; i++) {
        let num = start + i;
        console.log('Testing: ' + num);
        
        if (num % 3 !== 0) {  // Not divisible by 3
            console.log('First valid number: ' + num);
            return num;
        }
    }
    
    return -1;  // No valid number found
}

console.log('First valid: ' + findFirstValid(9, 5));

/*
When is the search-and-return pattern most effective?
*/