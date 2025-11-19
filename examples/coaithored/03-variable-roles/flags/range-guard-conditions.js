'use strict';

/* Variable Roles: Range Guard Conditions

Guard flags validate ranges and boundaries.  
FLAG role: ensures values stay within valid limits.

Study with:
- ?variables to see range validation flags
- ?trace to follow boundary checking logic
*/

// Range validation guard
console.log('=== Range validation guard ===');
let isPositionValid = false;    // FLAG role: validates position is in range
let sequenceStart = 1;
let sequenceEnd = 5;
let requestedPosition = 7;

// Check if position is within valid range
if (requestedPosition >= sequenceStart && requestedPosition <= sequenceEnd) {
    isPositionValid = true;
}

console.log('Checking position validity...');
console.log('  requestedPosition: ' + requestedPosition);
console.log('  valid range: ' + sequenceStart + '-' + sequenceEnd);
console.log('  isPositionValid: ' + isPositionValid);

if (isPositionValid) {
    let value = requestedPosition * 10;
    console.log('Value at position ' + requestedPosition + ': ' + value);
} else {
    console.log('Error prevented: Position out of range');
}

/*
How do range guards protect against boundary violations?
*/