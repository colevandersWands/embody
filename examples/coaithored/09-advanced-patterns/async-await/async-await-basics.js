'use strict';

/* Async/Await: Async/Await Basics Overview

Async/await basic concepts distilled to essence:
- async-await-basics-essence.js - core syntax and pause/resume behavior
- (additional focused examples as needed)

Study with: Start with async-await-basics-essence.js */

// Quick demonstration of async/await fundamentals
function createDelay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });
}

// async always returns Promise
async function basicAsync() {
    return 'wrapped in Promise.resolve()';
}

// await pauses execution 
async function useAwait() {
    console.log('Before await');
    let result = await createDelay(50, 'data');
    console.log('After await:', result);
    return result;
}

// Same logic, different readability
function promiseVersion() {
    return createDelay(50, 'data')
        .then(result => {
            console.log('Promise result:', result);
            return result;
        });
}

// Compare the approaches
basicAsync().then(value => console.log('Basic:', value));
useAwait().then(final => console.log('Await final:', final));
promiseVersion().then(final => console.log('Promise final:', final));

console.log('All async calls made, continuing synchronously...');

/* See essence files for detailed async/await exploration */