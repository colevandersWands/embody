'use strict';

/* Functions: Function-Level Hoisting

Inner function declarations hoist to the top of their containing function.
Available throughout the entire function scope.

Study with: ?trace to see inner function hoisting */

function outer() {
    // This works! inner() is hoisted to top of outer()
    console.log('Called before declaration: ' + inner());
    
    function inner() {
        return 'Inner function result';
    }
    
    // Still works after declaration
    console.log('Called after declaration: ' + inner());
    
    // Nested functions can call each other
    function helper() {
        return main() + ' + helper';
    }
    
    function main() {
        return 'main';
    }
    
    console.log('Nested call: ' + helper());
}

outer();
console.log('Inner accessible outside: ' + (typeof inner !== 'undefined'));

/* Why do inner functions hoist within their parent? */