'use strict';

/* Variable Roles: Running Total

Demonstrates running total pattern where you track cumulative values.
Shows how running totals differ from simple accumulators.

Study with:
- ?variables to see running total progression
- ?trace to follow the cumulative calculation pattern
*/

// Basic running total for expenses
console.log('=== Daily expense tracking ===');
let runningTotal = 0;  // ACCUMULATOR role: tracks cumulative total

for (let day = 1; day <= 5; day++) {
    let expense = day * 8 + 12; // Generate daily expenses: 20, 28, 36, 44, 52
    runningTotal += expense;    // ACCUMULATOR: add to running total
    
    console.log('Day ' + day + ': $' + expense + ' (Total so far: $' + runningTotal + ')');
}
console.log('Week total: $' + runningTotal);

// Running average calculation
console.log('\n=== Running average ===');
let scoreSum = 0;     // ACCUMULATOR role: tracks sum for average
let testCount = 0;    // COUNTER role: tracks number of tests

for (let testScore = 85; testScore <= 95; testScore += 3) {
    testCount++;              // COUNTER: increment test number
    scoreSum += testScore;    // ACCUMULATOR: add to running sum
    let runningAverage = scoreSum / testCount;  // Calculate running average
    
    console.log('Test ' + testCount + ': Score ' + testScore + 
                ', Running average: ' + runningAverage);
}

// Running minimum and maximum
console.log('\n=== Running min/max ===');
let runningMin = 72;  // HOLDER role: tracks minimum so far
let runningMax = 72;  // HOLDER role: tracks maximum so far

for (let day = 1; day <= 6; day++) {
    let temp = 70 + (day % 3) * 2; // Generate temperatures: 72, 70, 72, 74, 70, 72
    
    if (temp < runningMin) runningMin = temp;  // HOLDER: update minimum
    if (temp > runningMax) runningMax = temp;  // HOLDER: update maximum
    
    console.log('Day ' + day + ': ' + temp + '°F (Range so far: ' + 
                runningMin + '°F - ' + runningMax + '°F)');
}

// Running count with conditions  
console.log('\n=== Running count of passing grades ===');
let passingCount = 0; // COUNTER role: tracks passing grades
let totalCount = 0;   // COUNTER role: tracks total grades processed

for (let grade = 70; grade <= 95; grade += 5) {
    totalCount++;              // COUNTER: increment total processed
    if (grade >= 75) {
        passingCount++;        // COUNTER: increment passing count
    }
    
    console.log('Grade: ' + grade + ', Passing so far: ' + passingCount + 
                '/' + totalCount);
}

/*
How does a running total differ from a final accumulator in tracking intermediate progress?
*/