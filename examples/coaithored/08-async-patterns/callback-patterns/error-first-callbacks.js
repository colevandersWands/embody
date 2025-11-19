'use strict';

/* Callback Patterns: Error-First Callbacks Overview

Error-first callback concepts distilled to essence:
- error-first-callbacks-essence.js - error parameter convention
- (additional focused examples as needed)

Study with: Start with error-first-callbacks-essence.js */

// Error-first callback pattern
function simulateAPI(request, callback) {
    setTimeout(() => {
        if (request === 'fail') {
            callback(new Error('API failed'), null);
        } else {
            callback(null, `Response for ${request}`);
        }
    }, 100);
}

// Success case
simulateAPI('user-data', function(err, data) {
    if (err) {
        console.log('Error:', err.message);
        return;
    }
    console.log('Success:', data);
});

// Error case
simulateAPI('fail', function(err, data) {
    if (err) {
        console.log('Caught error:', err.message);
        return;
    }
    console.log('This won\'t run');
});

// Chaining with error handling
simulateAPI('step1', function(err, data) {
    if (err) return console.log('Step 1 error:', err.message);
    
    simulateAPI('step2', function(err, result) {
        if (err) return console.log('Step 2 error:', err.message);
        
        console.log('All steps complete:', result);
    });
});

/* See essence files for detailed error-first callback exploration */