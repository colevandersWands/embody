'use strict';

/* Async/Await: Async vs Promises Essence

Same result, different syntax:
Promises use .then() chains, async/await uses linear code.

Study with: ?trace to see identical behavior */

function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Promise approach
function withPromises() {
    return delay(100, 'first')
        .then(result => {
            console.log('Promise:', result);
            return delay(100, 'second');
        })
        .then(result => {
            console.log('Promise:', result);
            return 'done';
        });
}

// Async/await approach (identical behavior)
async function withAsync() {
    let result1 = await delay(100, 'first');
    console.log('Async:', result1);
    let result2 = await delay(100, 'second');
    console.log('Async:', result2);
    return 'done';
}

withPromises().then(result => console.log('Promise result:', result));
withAsync().then(result => console.log('Async result:', result));

/* Which style is easier to read? */