'use strict';

/* Async/Await: Async Patterns Overview

Async pattern concepts distilled to essence:
- async-patterns-essence.js - sequential vs parallel execution
- (additional focused examples as needed)

Study with: Start with async-patterns-essence.js */

// Quick demonstration of timing patterns
async function demo() {
    // Sequential pattern (slower)
    console.log('Sequential demo:');
    let start = Date.now();
    await Promise.resolve().then(() => new Promise(r => setTimeout(r, 50)));
    await Promise.resolve().then(() => new Promise(r => setTimeout(r, 50)));
    console.log('Sequential time:', Date.now() - start, 'ms');
    
    // Parallel pattern (faster)
    console.log('Parallel demo:');
    start = Date.now();
    await Promise.all([
        Promise.resolve().then(() => new Promise(r => setTimeout(r, 50))),
        Promise.resolve().then(() => new Promise(r => setTimeout(r, 50)))
    ]);
    console.log('Parallel time:', Date.now() - start, 'ms');
    
    // Error handling pattern
    try {
        await Promise.reject(new Error('Demo error'));
    } catch (err) {
        console.log('Caught:', err.message);
    }
}

demo();

/* See essence files for detailed pattern exploration */