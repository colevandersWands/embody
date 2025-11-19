'use strict';

/* Variable Roles: Previous Value Holders

Demonstrates variables that remember the previous value for comparison.
Shows how tracking previous values enables change detection and trends.

Study with:
- ?variables to see current vs previous value tracking
- ?trace to follow how previous values are updated and used
*/

// Basic previous value tracking pattern
let currentValue = 10;    // HOLDER role: current state
let previousValue = 0;    // HOLDER role: previous state for comparison

console.log('Starting with: ' + currentValue);

// Demonstrate the previous value update pattern
for (let newValue = 15; newValue <= 25; newValue += 5) {
    previousValue = currentValue;  // HOLDER: save current as previous
    currentValue = newValue;       // HOLDER: update to new current
    
    let change = currentValue - previousValue;
    console.log('Changed from ' + previousValue + ' to ' + currentValue + 
                ' (change: ' + change + ')');
}

// Temperature change detection
console.log('\nTemperature monitoring:');
let currentTemp = 70;     // HOLDER role: current temperature
let previousTemp = 0;     // HOLDER role: previous temperature
let biggestJump = 0;      // ACCUMULATOR role: tracks largest change

for (let day = 1; day <= 5; day++) {
    previousTemp = currentTemp;              // HOLDER: save current as previous
    currentTemp = 65 + day * 3;             // HOLDER: simulate new temperature
    
    let tempChange = currentTemp - previousTemp;
    if (tempChange > biggestJump) {
        biggestJump = tempChange;            // ACCUMULATOR: track biggest change
    }
    
    console.log('Day ' + day + ': ' + currentTemp + '°F (change: +' + tempChange + '°F)');
}

console.log('Biggest temperature jump: ' + biggestJump + '°F');

/*
How do previous value holders enable change detection and trend analysis?
*/