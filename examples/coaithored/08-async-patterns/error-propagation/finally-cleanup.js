'use strict';

/* Error Propagation: Finally Cleanup Overview

Finally cleanup concepts distilled to essence:
- finally-cleanup-essence.js - guaranteed cleanup execution
- (additional focused examples as needed)

Study with: Start with finally-cleanup-essence.js */

// Quick demonstration of finally cleanup
async function quickCleanupDemo() {
    let resource = { name: 'temp-file', active: true };
    
    try {
        console.log('1. Starting operation with resource');
        
        // Simulate operation that might fail
        let shouldFail = Math.random() > 0.5;
        if (shouldFail) {
            throw new Error('Operation failed');
        }
        
        console.log('2. Operation succeeded');
        return 'success';
        
    } catch (error) {
        console.log('3. Error occurred:', error.message);
        return 'failed';
        
    } finally {
        // This ALWAYS runs - success or failure!
        console.log('4. Cleaning up resource');
        resource.active = false;
    }
}

// Cleanup happens regardless of outcome
quickCleanupDemo().then(result => console.log('Result:', result));

// Without finally (dangerous!)
function withoutFinally() {
    console.log('No cleanup guarantee - resources may leak!');
}

/* See essence files for detailed cleanup patterns */