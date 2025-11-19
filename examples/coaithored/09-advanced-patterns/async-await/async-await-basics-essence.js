'use strict';

/* Async/Await: Async/Await Basics Essence

async functions return promises. await pauses execution until promise resolves.
Makes async code look synchronous, easier to read than .then() chains.

Study with: ?trace to see pause/resume behavior */

function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Completed: ${value} (${ms}ms)`);
            resolve(value);
        }, ms);
    });
}

// async function always returns a Promise
async function basicAsync() {
    console.log('Inside async function');
    return 'result'; // Wrapped in Promise.resolve()
}

// await pauses execution until Promise resolves
async function useAwait() {
    console.log('Start');
    
    let result1 = await delay(100, 'first');
    console.log('Got:', result1); // Waits for promise
    
    let result2 = await delay(100, 'second');
    console.log('Got:', result2); // Waits for promise
    
    return result1 + ' and ' + result2;
}

// Call async functions
basicAsync().then(result => console.log('Basic result:', result));
useAwait().then(final => console.log('Final:', final));

console.log('This runs immediately (async is non-blocking)');

/* Why is await only allowed in async functions? */