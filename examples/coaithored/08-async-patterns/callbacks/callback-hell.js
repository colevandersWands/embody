'use strict';

/* Async: Callback Hell

Demonstrates nested callbacks and the problems they create.
Shows the "pyramid of doom" and error handling complexity.

Study with:
- ?trace to see nested execution
- ?variables to see data flow through levels
*/

// Simulated async operations
function step1(callback) {
    console.log('Step 1: Starting process');
    setTimeout(() => {
        callback(null, 'step1_data');
    }, 100);
}

function step2(data, callback) {
    console.log('Step 2: Processing', data);
    setTimeout(() => {
        callback(null, data + '_step2');
    }, 100);
}

function step3(data, callback) {
    console.log('Step 3: Finalizing', data);
    setTimeout(() => {
        callback(null, data + '_complete');
    }, 100);
}

// Callback hell example
console.log('=== Callback Hell Example ===');
step1(function(err1, result1) {
    if (err1) {
        console.log('Error in step 1:', err1);
        return;
    }
    
    step2(result1, function(err2, result2) {
        if (err2) {
            console.log('Error in step 2:', err2);
            return;
        }
        
        step3(result2, function(err3, result3) {
            if (err3) {
                console.log('Error in step 3:', err3);
                return;
            }
            
            console.log('Final result:', result3);
            console.log('All steps completed!');
        });
    });
});

// Problems with callback hell:
// 1. Deep nesting (pyramid of doom)
// 2. Error handling repetition
// 3. Hard to read and maintain
// 4. Difficult to add steps or modify flow

console.log('\nCallback hell demonstrates why we need better async patterns!');

/*
Educational questions:
- Why is deeply nested code hard to read?
- How does error handling become repetitive?
- What makes callback hell difficult to maintain?
*/