'use strict';

/* Promises: Promise Composition Essence

Promise.all() waits for all, Promise.race() waits for first.
all() fails if any fail, race() returns first to complete.

Study with: ?trace to see timing differences */

function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Completed: ${value} (${ms}ms)`);
            resolve(value);
        }, ms);
    });
}

// Promise.all() - wait for ALL to complete
console.log('Promise.all() demo:');
Promise.all([
    delay(100, 'first'),
    delay(200, 'second'),
    delay(150, 'third')
]).then(results => {
    console.log('All results:', results); // ['first', 'second', 'third']
    // Takes ~200ms (longest delay)
});

// Promise.race() - wait for FIRST to complete
console.log('\nPromise.race() demo:');
Promise.race([
    delay(300, 'slow'),
    delay(100, 'fast'),
    delay(200, 'medium')
]).then(winner => {
    console.log('Winner:', winner); // 'fast'
    // Takes ~100ms (shortest delay)
});

// Error handling
Promise.all([
    Promise.resolve('success'),
    Promise.reject(new Error('failure'))
]).catch(err => {
    console.log('all() failed:', err.message); // Fails if ANY fail
});

/* When to use all() vs race()? */