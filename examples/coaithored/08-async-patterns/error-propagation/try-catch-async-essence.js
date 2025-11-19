'use strict';

/* Error Propagation: Try-Catch with Async Essence

try-catch only catches synchronous errors, not async ones.
Async errors escape the try-catch block because they execute later.

Study with: ?trace to see when errors happen vs when try-catch runs */

// Synchronous error - caught
try {
    throw new Error('Sync error');
} catch (err) {
    console.log('Caught sync error:', err.message); // This works
}

// Asynchronous error - NOT caught
try {
    setTimeout(() => {
        throw new Error('Async error'); // Uncaught exception!
    }, 100);
} catch (err) {
    console.log('This never runs'); // try-catch already finished
}

// Proper async error handling - use callbacks
function asyncTask(callback) {
    setTimeout(() => {
        try {
            let result = JSON.parse('invalid json'); // This will throw
            callback(null, result);
        } catch (error) {
            callback(error, null); // Convert throw to callback error
        }
    }, 100);
}

asyncTask(function(err, result) {
    if (err) {
        console.log('Properly handled async error:', err.message);
    }
});

/* Why can't try-catch handle async errors? */