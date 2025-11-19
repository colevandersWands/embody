'use strict';

/* Scope: Function Scope Overview

Function scope concepts have been split into focused examples:
- basic-function-scope.js - variable isolation within functions
- parameter-scope.js - how parameters create local scope
- nested-function-scope.js - inner functions accessing outer scope
- var-function-hoisting.js - var hoisting within function scope

Study with:
- Start with basic-function-scope.js for foundational concepts
- ?variables to see function scope boundaries in any example
*/

// Quick demonstration of core concept
console.log('=== Function Scope Core Concept ===');

function scopeExample() {
    var functionVariable = 'Only exists in this function';
    console.log('Inside function: ' + functionVariable);
}

scopeExample();

console.log('Outside function:');
console.log('  functionVariable exists: ' + (typeof functionVariable !== 'undefined'));

/*
See the focused examples for detailed exploration of function scope concepts.
*/
