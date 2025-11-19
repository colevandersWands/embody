'use strict';

/* Variable Roles: Basic Counter Essence

COUNTER role: variable that tracks loop iterations or counts events.
Starts at initial value, increments/decrements each iteration.

Study with: ?variables to see counter progression */

// Basic counter pattern
console.log('Basic counter:');
for (let i = 0; i < 4; i++) {  // i is COUNTER
    console.log('Count: ' + i);  // 0, 1, 2, 3
}

// Manual counter
console.log('\nManual counter:');
let count = 1;  // COUNTER starts at 1
while (count <= 3) {
    console.log('Manual count: ' + count);
    count++;  // COUNTER increments
}

// Countdown counter
console.log('\nCountdown:');
for (let countdown = 3; countdown > 0; countdown--) {  // COUNTER decrements
    console.log('T-minus: ' + countdown);
}

// Step counter
console.log('\nStep counter:');
for (let step = 0; step <= 6; step += 2) {  // COUNTER by 2s
    console.log('Even: ' + step);  // 0, 2, 4, 6
}

/* Why do counters usually start at 0? */