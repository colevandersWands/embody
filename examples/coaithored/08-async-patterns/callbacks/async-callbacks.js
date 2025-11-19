'use strict';

/* Async: Asynchronous Callbacks

Demonstrates callbacks with setTimeout for async behavior.
Shows how callbacks handle delayed execution.

Study with:
- ?trace to see execution order
- ?variables to see timing differences
*/

// Synchronous vs asynchronous execution
console.log('=== Sync vs Async Demo ===');
console.log('1. Starting');

// Asynchronous callback
setTimeout(function() {
    console.log('3. Async callback executed');
}, 1000);

console.log('2. Continuing synchronously');

// Simulating async operation
function fetchData(callback) {
    console.log('\nFetching data...');
    
    setTimeout(function() {
        let data = { users: ['Alice', 'Bob'], count: 2 };
        callback(data);
    }, 500);
    
    console.log('Fetch request sent');
}

function displayData(data) {
    console.log('Data received:', data);
    console.log(`Found ${data.count} users`);
}

// Using async callback
console.log('\n=== Async Data Fetch ===');
fetchData(displayData);
console.log('Fetch function returned');

// Multiple async operations
function loadUserProfile(userId, callback) {
    console.log(`\nLoading profile for user ${userId}`);
    
    setTimeout(() => {
        callback({
            id: userId,
            name: `User ${userId}`,
            email: `user${userId}@example.com`
        });
    }, 300);
}

loadUserProfile(123, function(profile) {
    console.log('Profile loaded:', profile);
});

/*
Educational questions:
- Why doesn't the async callback execute immediately?
- How do async callbacks affect program flow?
- What's the difference between sync and async callbacks?
*/