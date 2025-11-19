'use strict';

/* Async: Error Handling in Callbacks Overview

Error handling concepts distilled to essence:
- error-handling-essence.js - error-first callback pattern
- (additional focused examples as needed)

Study with: Start with error-handling-essence.js */

// Comprehensive error-first callback implementation
function createAsyncOperation(name, delay = 300) {
    return function(shouldFail, callback) {
        console.log(`Starting ${name}...`);
        
        setTimeout(() => {
            if (shouldFail) {
                callback(new Error(`${name} operation failed`), null);
            } else {
                callback(null, `${name} completed successfully`);
            }
        }, delay);
    };
}

// Multiple operation types for demonstration
const fetchUserData = createAsyncOperation('User Data Fetch', 200);
const validateUser = createAsyncOperation('User Validation', 150);
const saveUserSession = createAsyncOperation('Session Save', 100);

// Complex error handling scenarios
function demonstrateErrorHandling() {
    console.log('=== Error Handling Scenarios ===');
    
    // Scenario 1: Success path
    fetchUserData(false, function(error, userData) {
        if (error) {
            console.log('❌ User fetch failed:', error.message);
            return;
        }
        
        console.log('✓ User data received:', userData);
        
        // Scenario 2: Nested operation with error
        validateUser(true, function(validationError, validation) {
            if (validationError) {
                console.log('❌ Validation failed:', validationError.message);
                return; // Stop chain on validation error
            }
            
            console.log('✓ Validation passed:', validation);
        });
    });
}

// Error recovery patterns
function demonstrateErrorRecovery() {
    console.log('\n=== Error Recovery Patterns ===');
    
    function attemptWithFallback(operation, fallbackOperation, callback) {
        operation(true, function(primaryError, primaryResult) {
            if (primaryError) {
                console.log('Primary operation failed, trying fallback...');
                fallbackOperation(false, callback);
            } else {
                callback(null, primaryResult);
            }
        });
    }
    
    const primaryOp = createAsyncOperation('Primary Service', 100);
    const fallbackOp = createAsyncOperation('Fallback Service', 100);
    
    attemptWithFallback(primaryOp, fallbackOp, function(error, result) {
        if (error) {
            console.log('❌ Both operations failed:', error.message);
        } else {
            console.log('✓ Operation succeeded (possibly via fallback):', result);
        }
    });
}

demonstrateErrorHandling();
demonstrateErrorRecovery();

/* See essence files for focused error handling exploration */