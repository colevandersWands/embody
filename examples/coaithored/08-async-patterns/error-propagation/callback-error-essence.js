'use strict';

/* Error Propagation: Callback Error Essence

Callback error pattern: (error, result) convention.
Check error first, handle if present, otherwise use result.

Study with: ?trace to see error propagation */

function mightFail(shouldFail, callback) {
    setTimeout(() => {
        if (shouldFail) {
            callback(new Error('Operation failed'), null);
        } else {
            callback(null, 'success');
        }
    }, 100);
}

function processData(data, callback) {
    if (!data) {
        callback(new Error('No data provided'), null);
        return;
    }
    callback(null, data.toUpperCase());
}

// Error handling chain
mightFail(false, (err, result) => {
    if (err) {
        console.log('First error:', err.message);
        return;
    }
    
    processData(result, (err, final) => {
        if (err) {
            console.log('Second error:', err.message);
            return;
        }
        
        console.log('Final result:', final);
    });
});

/* Why check error first in every callback? */