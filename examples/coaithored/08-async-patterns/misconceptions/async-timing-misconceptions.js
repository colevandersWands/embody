'use strict';

/* Misconceptions: Async Timing Misconceptions Overview

Async timing misconception concepts distilled to essence:
- async-timing-essence.js - setTimeout(0) and Promise timing order
- (additional focused examples as needed)

Study with: Start with async-timing-essence.js */

// Quick demonstration of timing misconceptions
console.log('Timing Misconceptions Demo:');

console.log('A. Sync before async');

// This doesn't run immediately despite 0ms!
setTimeout(() => console.log('D. setTimeout 0ms (macrotask)'), 0);

// This runs before setTimeout despite being "later"
Promise.resolve().then(() => console.log('C. Promise (microtask)'));

console.log('B. Sync after async setup');

// Common beginner misconception demo
function misconceptionDemo() {
    let result = 'initial';
    
    setTimeout(() => {
        result = 'updated';
        console.log('Inside timeout:', result);
    }, 0);
    
    console.log('Immediately after timeout setup:', result); // Still 'initial'!
}

misconceptionDemo();

/* See essence files for detailed timing exploration */