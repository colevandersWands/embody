'use strict';

/* Error Propagation: Callback Error Handling Overview

Callback error handling concepts distilled to essence:
- callback-error-essence.js - (error, result) pattern basics
- (additional focused examples as needed)

Study with: Start with callback-error-essence.js */

// Quick demonstration of callback error handling
function fetchData(id, callback) {
    setTimeout(() => {
        if (id < 0) {
            callback(new Error('Invalid ID'), null);
        } else {
            callback(null, `data-${id}`);
        }
    }, 100);
}

// Error handling pattern
fetchData(1, (err, data) => {
    if (err) {
        console.log('Error:', err.message);
        return;
    }
    console.log('Success:', data);
});

// Chaining with error propagation
function processChain() {
    fetchData(2, (err, data) => {
        if (err) {
            console.log('Chain failed at step 1:', err.message);
            return;
        }
        
        // Next step in chain
        console.log('Step 1 complete:', data);
        console.log('Chain complete');
    });
}

processChain();

/* See essence files for detailed error handling patterns */