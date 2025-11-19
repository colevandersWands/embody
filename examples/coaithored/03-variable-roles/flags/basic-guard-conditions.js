'use strict';

/* Variable Roles: Basic Guard Conditions

Guard flags protect against invalid operations.
FLAG role: prevents unsafe operations from executing.

Study with:
- ?variables to see guard flags protecting operations
- ?trace to follow safety checks and their outcomes
*/

// Basic guard condition - division by zero protection
console.log('=== Division by zero guard ===');
let isDivisionSafe = false;    // FLAG role: protects division operation
let numerator = 10;
let denominator = 0;

// Check if division is safe
if (denominator !== 0) {
    isDivisionSafe = true;
}

console.log('Checking division safety...');
console.log('  numerator: ' + numerator);
console.log('  denominator: ' + denominator);
console.log('  isDivisionSafe: ' + isDivisionSafe);

if (isDivisionSafe) {
    let result = numerator / denominator;
    console.log('Result: ' + result);
} else {
    console.log('Error prevented: Cannot divide by zero');
}

/*
How do guard flags prevent unsafe operations from executing?
*/