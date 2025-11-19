'use strict';

/* Variable Roles: Current Value Holders

Demonstrates holder variables that store the "current" item or state.
Shows how current value patterns simplify tracking active elements.

Study with:
- ?variables to see current value changes
- ?trace to follow how current values are updated and used
*/

// Current value in number processing
let currentNumber = 0;
let currentSum = 0;

for (let value = 10; value <= 50; value += 10) {
    currentNumber = value; // Hold current value being processed
    currentSum += currentNumber;
    console.log('Processing: ' + currentNumber + ', sum: ' + currentSum);
}

// Current player in rotation
let currentPlayerCode = 1001; // 1001=Alice, 1002=Bob, 1003=Charlie
let round = 1;

console.log('\nRound ' + round + ': Player ' + currentPlayerCode + ' turn');

// Move to next player
currentPlayerCode = 1002;
console.log('Now: Player ' + currentPlayerCode + ' turn');

// Current maximum tracker
let currentMax = 0;
let testValue = 0;

for (let num = 15; num <= 45; num += 5) {
    testValue = num;
    if (testValue > currentMax) {
        currentMax = testValue; // Hold new maximum
    }
    console.log('Tested: ' + testValue + ', max so far: ' + currentMax);
}

/*
How do current value holders simplify tracking active elements during processing?
*/