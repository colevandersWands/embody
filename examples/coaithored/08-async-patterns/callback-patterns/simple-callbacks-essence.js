'use strict';

/* Callback Patterns: Simple Callbacks Essence

Callback = function passed as argument to be called later.
Enables async operations: start task, continue other work, handle result when ready.

Study with: ?trace to see callback execution timing */

// Function that takes callback
function fetchData(callback) {
    console.log('1. Starting fetch...');
    
    setTimeout(() => {
        console.log('3. Data ready!');
        callback('Hello World'); // Call the callback
    }, 100);
    
    console.log('2. Fetch initiated (non-blocking)');
}

// Using the callback
fetchData(function(result) {
    console.log('4. Received:', result);
});

console.log('5. Code continues immediately');

/*
Execution order:
1. Starting fetch...
2. Fetch initiated (non-blocking)  
5. Code continues immediately
3. Data ready!
4. Received: Hello World

Why does line 5 execute before the callback?
*/