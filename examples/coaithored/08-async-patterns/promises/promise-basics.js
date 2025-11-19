'use strict';

/* Promises: Promise Basics Overview

Promise basic concepts distilled to essence:
- promise-basics-essence.js - creation, then/catch, chaining
- (additional focused examples as needed)

Study with: Start with promise-basics-essence.js */

// Basic promise creation and consumption
function createPromise(success) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            success ? resolve('Success!') : reject(new Error('Failed!'));
        }, 100);
    });
}

// Success path
createPromise(true)
    .then(result => console.log('Resolved:', result))
    .catch(error => console.log('Error:', error.message));

// Error path  
createPromise(false)
    .then(result => console.log('Won\'t run'))
    .catch(error => console.log('Caught:', error.message));

// Promise chaining
createPromise(true)
    .then(result => result.toLowerCase())
    .then(lower => lower + ' chained')
    .then(final => console.log('Final:', final));

// Compare with callback approach
function callbackApproach(callback) {
    setTimeout(() => callback(null, 'callback done'), 100);
}

callbackApproach((err, result) => console.log('Callback:', result));

/* See essence files for detailed promise exploration */