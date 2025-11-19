'use strict';

/* Functions: Script-Level Hoisting

Function declarations are completely hoisted at script level.
Can be called before the declaration appears in code.

Study with:
- ?trace to see function availability before declaration
- ?variables to track function creation timing
*/

// Script-level function hoisting demonstration
console.log('=== Script-Level Function Hoisting ===');

// This works! Function is completely hoisted
console.log('Calling before declaration...');
let result1 = scriptFunction('Alice');
console.log('Result: ' + result1);

// Function declaration (hoisted to top)
function scriptFunction(name) {
    console.log('Script function called with: ' + name);
    return 'Hello from script level, ' + name + '!';
}

// Call again after declaration
console.log('Calling after declaration...');
let result2 = scriptFunction('Bob');
console.log('Result: ' + result2);

// Multiple function declarations
console.log('Testing multiple functions...');
console.log('First: ' + firstFunction());
console.log('Second: ' + secondFunction());

function firstFunction() {
    return 'First function result';
}

function secondFunction() {
    return 'Second function result';
}

/*
Why can function declarations be called before they appear in the code?
*/