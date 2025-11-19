'use strict';

/* Async/Await: Error Handling Overview

Async error handling concepts distilled to essence:
- async-error-essence.js - try/catch with async/await
- (additional focused examples as needed)

Study with: Start with async-error-essence.js */

// Quick demonstration of async error handling
async function demo() {
    try {
        console.log('1. Before async operation');
        
        // Simulate operation that might fail
        await new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Demo error')), 100);
        });
        
        console.log('This never executes');
        
    } catch (error) {
        console.log('2. Caught async error:', error.message);
    }
    
    console.log('3. After error handling');
}

// Multiple async operations in try block
async function multipleOps() {
    try {
        await Promise.resolve('First success');
        await Promise.reject(new Error('Second fails'));
        await Promise.resolve('Third never reached');
    } catch (err) {
        console.log('Caught from multiple ops:', err.message);
    }
}

demo();
multipleOps();

/* See essence files for detailed error handling patterns */