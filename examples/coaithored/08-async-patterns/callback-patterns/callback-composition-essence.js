'use strict';

/* Callback Patterns: Callback Composition Essence

Named functions vs inline callbacks = readability and debuggability.
Compose callbacks to chain async operations without deep nesting.

Study with: ?trace to see execution flow through composition */

// Helper async functions  
function step1(data, callback) {
    setTimeout(() => callback(null, data + '-step1'), 50);
}

function step2(data, callback) {
    setTimeout(() => callback(null, data + '-step2'), 50);
}

// Problem: callback nesting
function nested(callback) {
    step1('start', (err, result1) => {
        step2(result1, (err, result2) => {
            callback(null, result2);
        });
    });
}

// Solution: named functions break the chain
function handleStep1(err, data) {
    step2(data, handleStep2);
}

function handleStep2(err, data) {
    console.log('Final result:', data);
}

// Use named functions
step1('start', handleStep1);

/* Why does naming callbacks improve async code? */