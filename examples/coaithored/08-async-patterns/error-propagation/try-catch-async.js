'use strict';

/* Error Propagation: Try-Catch with Async Overview

Try-catch async concepts distilled to essence:
- try-catch-async-essence.js - why try-catch fails with async
- (additional focused examples as needed)

Study with: Start with try-catch-async-essence.js */

// Sync error - try-catch works
try {
    throw new Error('Sync error');
} catch (err) {
    console.log('Caught sync:', err.message);
}

// Async error - try-catch fails
try {
    setTimeout(() => {
        console.log('This will create uncaught exception');
        // Commented out to prevent crash: throw new Error('Async error');
    }, 100);
} catch (err) {
    console.log('This never runs');
}

// Proper async error handling
function asyncTask(callback) {
    setTimeout(() => {
        try {
            let data = JSON.parse('{"valid": "json"}');
            callback(null, data);
        } catch (error) {
            callback(error, null); // Convert to callback error
        }
    }, 100);
}

asyncTask(function(err, result) {
    if (err) {
        console.log('Async error handled:', err.message);
    } else {
        console.log('Async success:', result);
    }
});

console.log('try-catch finished, async operations still pending');

/* See essence files for detailed async error handling exploration */