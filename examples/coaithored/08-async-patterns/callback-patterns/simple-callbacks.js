'use strict';

/* Callback Patterns: Simple Callbacks Overview

Callback pattern concepts distilled to essence:
- simple-callbacks-essence.js - basic callback execution timing
- (additional focused examples as needed)

Study with: Start with simple-callbacks-essence.js */

// Advanced callback pattern with multiple callback types
function createAsyncService(serviceName, delay = 200) {
    return function(params, callback) {
        console.log(`${serviceName}: Starting operation with`, params);
        
        setTimeout(() => {
            const result = {
                service: serviceName,
                data: `Processed: ${JSON.stringify(params)}`,
                timestamp: Date.now()
            };
            
            console.log(`${serviceName}: Operation completed`);
            callback(result);
        }, delay);
        
        console.log(`${serviceName}: Request initiated (async)`);
    };
}

// Different services with callback patterns
const userService = createAsyncService('UserService', 150);
const dataProcessor = createAsyncService('DataProcessor', 100);
const validator = createAsyncService('Validator', 75);

// Complex callback chaining
function demonstrateCallbackChaining() {
    console.log('=== Callback Chaining Example ===');
    
    userService({ userId: 42 }, function(userResult) {
        console.log('Step 1: User data received');
        
        dataProcessor({ input: userResult.data }, function(processedResult) {
            console.log('Step 2: Data processed');
            
            validator({ data: processedResult.data }, function(validationResult) {
                console.log('Step 3: Validation complete');
                console.log('Final result:', validationResult.data);
            });
        });
    });
}

// Parallel callback execution
function demonstrateParallelCallbacks() {
    console.log('\n=== Parallel Callbacks Example ===');
    
    let completedCount = 0;
    const results = {};
    
    function handleCompletion(serviceName, result) {
        results[serviceName] = result;
        completedCount++;
        
        if (completedCount === 3) {
            console.log('All parallel operations completed:', 
                Object.keys(results).join(', '));
        }
    }
    
    userService({ id: 1 }, (result) => handleCompletion('user', result));
    dataProcessor({ data: 'test' }, (result) => handleCompletion('processor', result));
    validator({ input: 'validate' }, (result) => handleCompletion('validator', result));
}

// Callback with different function types
function demonstrateCallbackTypes() {
    console.log('\n=== Different Callback Types ===');
    
    // Named function callback
    function namedCallback(result) {
        console.log('Named callback result:', result.service);
    }
    
    // Anonymous function callback
    userService({ test: 'anonymous' }, function(result) {
        console.log('Anonymous callback result:', result.service);
    });
    
    // Arrow function callback
    userService({ test: 'arrow' }, (result) => {
        console.log('Arrow callback result:', result.service);
    });
    
    // Using named callback
    userService({ test: 'named' }, namedCallback);
}

demonstrateCallbackChaining();
demonstrateParallelCallbacks();
demonstrateCallbackTypes();

/* See essence files for focused callback pattern exploration */