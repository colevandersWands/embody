'use strict';

/* Error Propagation: Error Recovery Overview

Error recovery concepts distilled to essence:
- error-recovery-essence.js - fallback chain pattern
- (additional focused examples as needed)

Study with: Start with error-recovery-essence.js */

// Quick demonstration of error recovery
async function quickRecoveryDemo() {
    try {
        // Primary operation
        throw new Error('Primary failed');
    } catch (primaryErr) {
        console.log('Primary error:', primaryErr.message);
        
        try {
            // Fallback operation
            return await Promise.resolve('fallback success');
        } catch (fallbackErr) {
            console.log('Fallback error:', fallbackErr.message);
            
            // Last resort
            return 'default value';
        }
    }
}

// Retry pattern
async function withRetry(operation, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (err) {
            console.log(`Attempt ${attempt} failed:`, err.message);
            if (attempt === maxRetries) throw err;
        }
    }
}

quickRecoveryDemo().then(result => console.log('Recovery result:', result));

/* See essence files for detailed recovery patterns */