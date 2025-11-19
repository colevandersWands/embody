'use strict';

/* Functions: Scope Interactions Overview

Scope interaction concepts distilled to essence:
- function-level-hoisting.js - inner function hoisting
- function-name-conflicts.js - name shadowing
- block-level-function-hoisting.js - block scope edge cases

Study with: Start with function-level-hoisting.js */

// Functions hoist within their scope
console.log('Before declaration: ' + test());

function test() {
    return 'Hoisted function';
}

// Inner scope can access outer
function outer() {
    function inner() {
        return test(); // Accesses outer scope
    }
    return inner();
}

console.log('Scope access: ' + outer());

/* See focused examples for detailed scope behavior */