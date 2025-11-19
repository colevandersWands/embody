'use strict';

/* Promises: Promise Composition Overview

Promise composition concepts distilled to essence:
- promise-composition-essence.js - Promise.all() vs Promise.race()
- (additional focused examples as needed)

Study with: Start with promise-composition-essence.js */

// Quick demonstration of promise composition
function quickTask(name, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`${name} done (${delay}ms)`);
            resolve(name);
        }, delay);
    });
}

// Promise.all() waits for all
console.log('Promise.all() demo:');
Promise.all([
    quickTask('Task A', 100),
    quickTask('Task B', 200),
    quickTask('Task C', 150)
]).then(results => {
    console.log('All tasks done:', results); // All results in order
    // Total time: ~200ms (max delay)
});

// Promise.race() waits for first
console.log('\nPromise.race() demo:');
Promise.race([
    quickTask('Slow', 300),
    quickTask('Fast', 100),
    quickTask('Medium', 200)
]).then(winner => {
    console.log('First to finish:', winner); // 'Fast'
    // Total time: ~100ms (min delay)
});

/* See essence files for detailed composition patterns */