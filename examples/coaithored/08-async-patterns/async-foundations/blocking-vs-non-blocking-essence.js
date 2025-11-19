'use strict';

/* Async Foundations: Blocking vs Non-blocking Essence

Blocking = code waits until operation finishes before continuing.
Non-blocking = operation starts, code continues, callback handles result later.

Study with: ?trace to see execution flow differences */

console.log('1. Start');

// Blocking operation - everything waits
function doBlocking() {
    console.log('2. Blocking starts');
    const start = Date.now();
    while (Date.now() - start < 500) {
        // Block for 500ms - nothing else runs
    }
    console.log('3. Blocking done');
}

doBlocking(); // Must wait here
console.log('4. After blocking');

// Non-blocking operation - code continues immediately  
setTimeout(() => {
    console.log('6. Non-blocking callback executes');
}, 500);

console.log('5. After starting non-blocking');

/*
Output order:
1. Start
2. Blocking starts
3. Blocking done  
4. After blocking
5. After starting non-blocking
6. Non-blocking callback executes

Why does line 5 execute before the callback?
*/