'use strict';

/* Control Flow: Basic While Loop

While loops repeat based on a condition.
Condition is checked before each iteration.

Study with:
- ?variables to track condition changes
- ?trace to see condition evaluation timing
*/

// Basic while loop
console.log('=== Basic While Loop ===');
let count = 0;

while (count < 5) {
    console.log('Count is: ' + count);
    count++; // Important: update the condition variable
}

console.log('Final count: ' + count);

// While loop with different increment
console.log('\n=== Different increment ===');
let number = 2;

while (number <= 16) {
    console.log('Number: ' + number);
    number *= 2; // Double each time
}

console.log('Final number: ' + number);

// Countdown while loop
console.log('\n=== Countdown ===');
let countdown = 5;

while (countdown > 0) {
    console.log('T-minus: ' + countdown);
    countdown--;
}

console.log('Launch!');

/*
How does the while loop check the condition before each iteration?
*/