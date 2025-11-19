'use strict';

/* Promises: Promise Basics Essence

Promise = container for future value. Three states: pending → fulfilled/rejected.
then() for success, catch() for errors, chainable for sequences.

Study with: ?trace to see promise state transitions */

// Create a Promise that resolves after delay
function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });
}

// Basic promise usage
let promise = delay(100, 'success!');

promise
    .then(result => {
        console.log('Promise resolved:', result);
        return result.toUpperCase();
    })
    .then(upper => {
        console.log('Chained result:', upper);
    })
    .catch(error => {
        console.log('Error caught:', error.message);
    });

// Promise vs callback
function callbackApproach(callback) {
    setTimeout(() => callback('callback result'), 100);
}

callbackApproach(result => console.log('Callback:', result));
delay(100, 'promise result').then(result => console.log('Promise:', result));

/* Why are promises better than callbacks? */