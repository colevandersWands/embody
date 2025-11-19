'use strict';

/* Promises: Promise Error Handling Essence

Use .catch() to handle promise rejections.
Errors skip subsequent .then() and go to next .catch().

Study with: ?trace to see error flow */

function mightReject(shouldFail) {
    return new Promise((resolve, reject) => {
        if (shouldFail) {
            reject(new Error('Failed'));
        } else {
            resolve('Success');
        }
    });
}

// Basic error handling
mightReject(true)
    .then(result => console.log('This skipped:', result))
    .catch(error => console.log('Caught:', error.message));

// Error propagation
mightReject(false)
    .then(result => {
        console.log('Step 1:', result);
        throw new Error('Step 2 failed'); // Manually throw
    })
    .then(result => console.log('This skipped')) // Skipped
    .catch(error => console.log('Caught thrown:', error.message));

// Error recovery
mightReject(true)
    .catch(error => {
        console.log('Recovered from:', error.message);
        return 'Default value'; // Recover with default
    })
    .then(result => console.log('Continued with:', result));

/* Why do errors skip .then() blocks? */