'use strict';

/* Error Propagation: Finally Cleanup Essence

finally block runs regardless of success or failure.
Essential for cleaning up resources (files, connections, etc.).

Study with: ?trace to see cleanup always executes */

// Resource that needs cleanup
function openResource() {
    console.log('🔓 Resource opened');
    return { name: 'database', open: true };
}

function closeResource(resource) {
    console.log('🔒 Resource closed');
    resource.open = false;
}

// Async with finally cleanup
async function processWithCleanup(shouldFail) {
    let resource = null;
    
    try {
        resource = openResource();
        
        if (shouldFail) {
            throw new Error('Processing failed');
        }
        
        console.log('✅ Processing succeeded');
        return 'success';
        
    } catch (error) {
        console.log('❌ Error caught:', error.message);
        throw error; // Re-throw if needed
        
    } finally {
        // This ALWAYS runs - success or failure
        if (resource) {
            closeResource(resource);
        }
        console.log('🧹 Cleanup completed');
    }
}

// Test both paths
processWithCleanup(false).then(() => console.log('Done: success'));
processWithCleanup(true).catch(() => console.log('Done: failure'));

/* Why is finally crucial for resource management? */