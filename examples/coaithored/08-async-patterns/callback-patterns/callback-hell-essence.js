'use strict';

/* Callback Patterns: Callback Hell Essence

Callback hell = deeply nested callbacks forming "pyramid of doom".
Each async operation depends on the previous one, creating nesting nightmare.

Study with: ?trace to see pyramid execution flow */

// Simple async operations
function step1(callback) {
    setTimeout(() => {
        console.log('Step 1 complete');
        callback('result1');
    }, 100);
}

function step2(data, callback) {
    setTimeout(() => {
        console.log('Step 2 complete');
        callback(data + '_step2');
    }, 100);
}

function step3(data, callback) {
    setTimeout(() => {
        console.log('Step 3 complete');
        callback(data + '_step3');
    }, 100);
}

// The callback hell - pyramid of doom
step1(function(result1) {
    console.log('Got:', result1);
    
    step2(result1, function(result2) {
        console.log('Got:', result2);
        
        step3(result2, function(result3) {
            console.log('Final result:', result3);
            // This is only 3 levels deep - imagine 10!
        });
    });
});

console.log('Code continues...');

/* Why do nested callbacks become unmaintainable? */