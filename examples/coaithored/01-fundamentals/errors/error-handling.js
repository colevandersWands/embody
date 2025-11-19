'use strict';

/* Errors: Error Handling

Demonstrates try-catch-finally for handling errors.
Shows how to catch and respond to errors gracefully.

Study with:
- ?trace to see error handling flow
- Try different error scenarios
*/

// Basic try-catch
console.log('=== Basic try-catch ===');
try {
    let result = riskyOperation();
    console.log('Success:', result);
} catch (error) {
    console.log('Caught error:', error.message);
}

function riskyOperation() {
    throw 'Something went wrong!';
}

// Try-catch-finally
console.log('\n=== Try-catch-finally ===');
try {
    console.log('Trying operation...');
    let data = JSON.parse('invalid json');
} catch (error) {
    console.log('JSON parsing failed');
} finally {
    console.log('Finally block always runs');
}

// Different error types
console.log('\n=== Specific error handling ===');
function handleDifferentErrors(input) {
    try {
        if (input === 'reference') {
            console.log(nonExistentVariable);
        } else if (input === 'type') {
            null.someMethod();
        } else if (input === 'custom') {
            throw 'Custom error message';
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            console.log('Reference error handled');
        } else if (error instanceof TypeError) {
            console.log('Type error handled');
        } else {
            console.log('Other error:', error.message);
        }
    }
}

handleDifferentErrors('reference');
handleDifferentErrors('type');
handleDifferentErrors('custom');

console.log('\nProgram continues after error handling');

/*
Educational questions:
- When should you use try-catch?
- What's the purpose of the finally block?
- How do you handle different types of errors?
*/