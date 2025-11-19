'use strict';

/* Async Foundations: Callback Timing Essence

Callbacks execute after current code finishes, even with 0ms delay.
Event loop schedules callbacks: sync code first, then queued callbacks.

Study with: ?trace to see callback scheduling order */

console.log('1. Start');

// 0ms timeout - still waits for sync code
setTimeout(() => {
    console.log('4. Timeout (0ms) - after sync code');
}, 0);

// Longer timeout
setTimeout(() => {
    console.log('5. Timeout (50ms) - later');
}, 50);

// Synchronous code runs first
console.log('2. Middle');

// More sync code
for (let i = 0; i < 1000000; i++) {
    // Block for a moment
}

console.log('3. End of sync code');

/*
Output order:
1. Start
2. Middle  
3. End of sync code
4. Timeout (0ms) - after sync code
5. Timeout (50ms) - later

Why doesn't 0ms timeout run immediately after line 10?
*/