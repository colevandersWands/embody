'use strict';

/* Async: Basic Callbacks

Demonstrates functions passed to other functions.
Shows how callbacks enable asynchronous execution.

Study with:
- ?trace to see callback execution timing
- ?variables to see function passing
*/

// Simple callback example
function greetUser(name, callback) {
    console.log(`Hello, ${name}!`);
    callback();
}

function afterGreeting() {
    console.log('Greeting completed');
}

// Using the callback
console.log('Before greeting');
greetUser('Alice', afterGreeting);
console.log('After greeting call');

// Callback with parameters
function processData(data, onSuccess, onError) {
    console.log('Processing data:', data);
    
    if (data && data.length > 0) {
        onSuccess('Data processed successfully');
    } else {
        onError('No data to process');
    }
}

// Success callback
function handleSuccess(message) {
    console.log('✓ Success:', message);
}

// Error callback
function handleError(error) {
    console.log('❌ Error:', error);
}

console.log('\n=== Processing valid data ===');
processData(['item1', 'item2'], handleSuccess, handleError);

console.log('\n=== Processing invalid data ===');
processData([], handleSuccess, handleError);

/*
Educational questions:
- What makes a function a "callback"?
- How do callbacks enable flexible program flow?
- When are callbacks executed?
*/