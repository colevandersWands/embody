'use strict';

/* Scope: Global Scope Pollution

Too many global variables create naming conflicts.
Shows why minimizing globals improves code quality.

Study with:
- ?variables to see global namespace conflicts
- ?trace to follow unintended variable overwriting
*/

// Simulated global variables from different "modules"
var userName = 'John';
var userAge = 25;

function displayUserInfo() {
    console.log('User: ' + userName + ', Age: ' + userAge);
}

// Another "module" accidentally uses same global names
function processOrder() {
    console.log('Processing order...');
    
    // Accidentally overwrites global userName!
    userName = 'OrderBot';
    userAge = 0;
    
    console.log('Order processed by: ' + userName);
}

// Demonstrate global pollution
console.log('=== Global Scope Pollution ===');

console.log('Initial state:');
displayUserInfo();

console.log('After processing order:');
processOrder();

console.log('User info corrupted:');
displayUserInfo();  // Global state was accidentally modified!

/*
How does global scope pollution lead to unexpected behavior?
*/