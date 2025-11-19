'use strict';

/* Async/Await: Async Patterns Essence

Key pattern: Sequential vs Parallel execution.
Sequential: await each task. Parallel: start all, then await all.

Study with: ?trace to see timing differences */

function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Completed: ${value} (${ms}ms)`);
            resolve(value);
        }, ms);
    });
}

// Sequential: tasks run one after another (slow)
async function sequential() {
    console.log('Sequential start');
    let start = Date.now();
    
    let a = await delay(100, 'A');  // Wait 100ms
    let b = await delay(100, 'B');  // Then wait 100ms more
    let c = await delay(100, 'C');  // Then wait 100ms more
    
    console.log('Sequential time:', Date.now() - start, 'ms'); // ~300ms
    return [a, b, c];
}

// Parallel: tasks run at same time (fast)
async function parallel() {
    console.log('Parallel start');
    let start = Date.now();
    
    // Start all tasks immediately
    let promiseA = delay(100, 'X');
    let promiseB = delay(100, 'Y');
    let promiseC = delay(100, 'Z');
    
    // Wait for all to finish
    let results = await Promise.all([promiseA, promiseB, promiseC]);
    
    console.log('Parallel time:', Date.now() - start, 'ms'); // ~100ms
    return results;
}

sequential().then(r => console.log('Sequential:', r));
parallel().then(r => console.log('Parallel:', r));

/* When to use sequential vs parallel? */