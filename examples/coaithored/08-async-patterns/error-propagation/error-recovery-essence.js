'use strict';

/* Error Propagation: Error Recovery Essence

Error recovery pattern: try primary, fallback to secondary, default to cache.
Chain operations with error handling between each step.

Study with: ?trace to see fallback progression */

// Simulate operations that might fail
function primary() {
    return Math.random() > 0.5 
        ? Promise.resolve('primary data')
        : Promise.reject(new Error('Primary failed'));
}

function backup() {
    return Math.random() > 0.3
        ? Promise.resolve('backup data') 
        : Promise.reject(new Error('Backup failed'));
}

function cache() {
    return Promise.resolve('cached data'); // Always works
}

// Error recovery with fallbacks
async function fetchWithRecovery() {
    try {
        console.log('Trying primary...');
        return await primary();
    } catch (err) {
        console.log('Primary failed, trying backup...');
        try {
            return await backup();
        } catch (err) {
            console.log('Backup failed, using cache...');
            return await cache();
        }
    }
}

fetchWithRecovery().then(result => {
    console.log('Final result:', result);
});

/* Why have multiple fallback levels? */