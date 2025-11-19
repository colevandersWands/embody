'use strict';

/* Async/Await: Async vs Promises Overview

Async vs Promise concepts distilled to essence:
- async-vs-promises-essence.js - syntax comparison for same behavior
- (additional focused examples as needed)

Study with: Start with async-vs-promises-essence.js */

// Quick comparison demonstration
function promiseStyle() {
    return Promise.resolve('promise result')
        .then(result => result.toUpperCase());
}

async function asyncStyle() {
    let result = await Promise.resolve('async result');
    return result.toUpperCase();
}

// Both approaches return promises
promiseStyle().then(result => console.log('Promise style:', result));
asyncStyle().then(result => console.log('Async style:', result));

// Error handling comparison
Promise.resolve('error test')
    .then(() => { throw new Error('Promise error'); })
    .catch(err => console.log('Caught with .catch():', err.message));

async function asyncError() {
    try {
        await Promise.resolve('error test');
        throw new Error('Async error');
    } catch (err) {
        console.log('Caught with try/catch:', err.message);
    }
}
asyncError();

/* See essence files for detailed comparison */