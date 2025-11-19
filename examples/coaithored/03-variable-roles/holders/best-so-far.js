'use strict';

/* Variable Roles: Best So Far

Demonstrates "best so far" variables that track optimal values.
Shows how to find maximum, minimum, and best candidates during iteration.

Study with:
- ?variables to see best values being updated
- ?trace to follow the comparison and selection logic
*/

// Finding maximum value in sequence
let bestScore = 85; // Initialize with first value
let bestPosition = 1;

console.log('Starting with score: ' + bestScore + ' at position ' + bestPosition);

for (let position = 2; position <= 7; position++) {
    let currentScore = position * 12 + 13; // Generate test scores
    console.log('Checking position ' + position + ': ' + currentScore);
    
    if (currentScore > bestScore) {
        bestScore = currentScore;
        bestPosition = position;
        console.log('  New best: ' + bestScore + ' at position ' + bestPosition);
    } else {
        console.log('  Current best ' + bestScore + ' is still better');
    }
}

console.log('Best score: ' + bestScore + ' at position ' + bestPosition);

// Finding minimum value
let cheapestPrice = 120; // Start with first price
let cheapestDay = 1;

console.log('\nChecking prices...');
for (let day = 2; day <= 6; day++) {
    let todayPrice = 150 - day * 8; // Generate decreasing prices
    console.log('Day ' + day + ': $' + todayPrice);
    
    if (todayPrice < cheapestPrice) {
        cheapestPrice = todayPrice;
        cheapestDay = day;
        console.log('  New cheapest: $' + cheapestPrice + ' on day ' + cheapestDay);
    }
}

console.log('Cheapest: $' + cheapestPrice + ' on day ' + cheapestDay);

/*
Why initialize best-so-far with the first element instead of a default value?
*/