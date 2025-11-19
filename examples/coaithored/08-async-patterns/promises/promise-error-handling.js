'use strict';

/* Promises: Promise Error Handling Overview

Promise error handling concepts distilled to essence:
- promise-error-essence.js - .catch() and error propagation
- (additional focused examples as needed)

Study with: Start with promise-error-essence.js */

// Quick demonstration of promise error handling
function taskThatMightFail(shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('Task failed'));
            } else {
                resolve('Task completed');
            }
        }, 100);
    });
}

// Basic .catch() usage
taskThatMightFail(true)
    .then(result => console.log('Success:', result))
    .catch(error => console.log('Error:', error.message));

// Error in chain
taskThatMightFail(false)
    .then(result => {
        console.log('First step:', result);
        throw new Error('Second step failed');
    })
    .then(result => console.log('This is skipped'))
    .catch(error => console.log('Chain error:', error.message));

// Error recovery
taskThatMightFail(true)
    .catch(error => 'Fallback result')
    .then(result => console.log('Recovered:', result));

/* See essence files for detailed error handling patterns */