'use strict';

/* Promises: Promise Chaining Essence

Chain promises with .then() - return value becomes next promise's input.
Return promise from .then() to continue chain. Flattens callback hell.

Study with: ?trace to see chain flow */

function step1() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Step 1 complete');
            resolve('data1');
        }, 100);
    });
}

function step2(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Step 2 complete with:', data);
            resolve(data + '-processed');
        }, 100);
    });
}

function step3(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Step 3 complete with:', data);
            resolve(data + '-final');
        }, 100);
    });
}

// Promise chain - each .then() returns value to next
step1()
    .then(result1 => {
        console.log('Got result1:', result1);
        return step2(result1); // Return promise for chaining
    })
    .then(result2 => {
        console.log('Got result2:', result2);
        return step3(result2); // Return promise for chaining
    })
    .then(finalResult => {
        console.log('Final result:', finalResult); // 'data1-processed-final'
    });

/* Why return promises from .then() handlers? */