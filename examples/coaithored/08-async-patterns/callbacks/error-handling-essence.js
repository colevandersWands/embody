'use strict';

/* Async: Error Handling in Callbacks Essence

Error-first callback = function(error, result) pattern for async operations.
Error parameter comes first, data second. Check error before using result.

Study with: ?trace to see error vs success paths */

// Async operation with error-first callback
function riskyOperation(shouldFail, callback) {
    setTimeout(() => {
        if (shouldFail) {
            callback(new Error('Failed!'), null);
        } else {
            callback(null, 'Success!');
        }
    }, 100);
}

// Error-first pattern in action
riskyOperation(false, function(error, result) {
    if (error) {
        console.log('❌ Error:', error.message);
        return; // Stop processing on error
    }
    
    console.log('✓ Success:', result);
});

riskyOperation(true, function(error, result) {
    if (error) {
        console.log('❌ Error:', error.message);
        return; // Error path taken
    }
    
    console.log('✓ This never executes');
});

/* Why does error come first in the callback parameters? */