'use strict';

/* Functions: Global Function Hoisting

Functions declared at global scope are hoisted completely.
Shows the difference between var and function hoisting behavior.

Study with:
- ?trace to see hoisting timing at global scope
- ?variables to track declaration vs initialization timing
*/

// Global scope hoisting demonstration
console.log('=== Global Function Hoisting ===');

// Function declarations are fully hoisted
console.log('Before declaration: ' + globalFunction());

// var declarations are hoisted but not initialized
console.log('Before declaration, globalVar: ' + globalVar);

// Actual declarations
var globalVar = 'Global variable';

function globalFunction() {
    return 'Global function result';
}

// After declarations
console.log('After declaration: ' + globalFunction());
console.log('After declaration, globalVar: ' + globalVar);

// Compare with let/const (not hoisted the same way)
console.log('letVar exists before declaration: ' + (typeof letVar !== 'undefined'));

let letVar = 'Let variable';
console.log('After declaration, letVar: ' + letVar);

/*
Why are function declarations fully hoisted while var is only partially hoisted?
*/