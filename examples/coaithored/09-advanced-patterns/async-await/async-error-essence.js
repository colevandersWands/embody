'use strict';

/* Async/Await: Error Handling Essence

Use try/catch with async/await instead of .catch() with promises.
Errors in await are caught by surrounding try/catch.

Study with: ?trace to see error propagation */

async function mightFail(shouldFail) {
    if (shouldFail) {
        throw new Error('Something went wrong');
    }
    return 'Success';
}

// Async error handling with try/catch
async function handleErrors() {
    try {
        let result1 = await mightFail(false);
        console.log('First call:', result1);
        
        let result2 = await mightFail(true); // This throws!
        console.log('This line never runs');
        
    } catch (error) {
        console.log('Caught error:', error.message);
    }
    
    console.log('Execution continues after try/catch');
}

// Promise error handling for comparison
function promiseVersion() {
    return mightFail(true)
        .then(result => console.log('Success:', result))
        .catch(error => console.log('Promise caught:', error.message));
}

handleErrors();
promiseVersion();

/* Why use try/catch over .catch()? */