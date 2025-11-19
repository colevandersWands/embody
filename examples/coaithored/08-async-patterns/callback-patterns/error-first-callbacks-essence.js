'use strict';

/* Callback Patterns: Error-First Callbacks Essence

Error-first callback convention: callback(error, result).
If error: callback(error, null). If success: callback(null, result).

Study with: ?trace to see error vs success paths */

// Function using error-first callback convention
function fetchData(url, callback) {
    setTimeout(() => {
        if (url.includes('invalid')) {
            callback(new Error('Invalid URL'), null); // Error case
        } else {
            callback(null, `Data from ${url}`);       // Success case
        }
    }, 100);
}

// Always check error first
fetchData('valid-url', function(err, data) {
    if (err) {
        console.log('Error:', err.message);
        return; // Stop execution on error
    }
    
    console.log('Success:', data);
});

// Error case
fetchData('invalid-url', function(err, data) {
    if (err) {
        console.log('Caught error:', err.message); // This runs
        return;
    }
    
    console.log('This won\'t run');
});

// Rule: error parameter always comes first
// Pattern: if (err) { handle error; return; }
// Benefit: consistent error handling across all async operations

/* Why does the error come first in the callback? */