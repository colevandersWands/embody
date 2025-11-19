'use strict';

/* Variable Roles: Basic Counter Overview

Counter concepts distilled to essence:
- basic-counter-essence.js - counter initialization, increment, patterns
- (additional focused examples as needed)

Study with: Start with basic-counter-essence.js */

// Quick demonstration of counter role
console.log('Counter Role Demo:');

// COUNTER: tracks iterations/events
for (let i = 0; i < 3; i++) {  // i is COUNTER
    console.log('Loop ' + (i + 1) + ', counter value: ' + i);
}

// Manual counter management
let eventCount = 0;  // COUNTER starts at 0
let events = ['click', 'scroll', 'resize'];
for (let event of events) {
    eventCount++;  // COUNTER increments
    console.log('Event ' + eventCount + ': ' + event);
}

// Different counter patterns
console.log('Countdown from 3:');
for (let n = 3; n > 0; n--) {  // COUNTER decrements
    console.log(n);
}

console.log('Skip counting by 5s:');
for (let skip = 5; skip <= 15; skip += 5) {  // COUNTER by 5s
    console.log(skip);
}

/* See essence files for detailed counter exploration */