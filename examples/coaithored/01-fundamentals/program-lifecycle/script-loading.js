'use strict';

/* Program Lifecycle: Script Loading

Demonstrates how JavaScript scripts are loaded and executed.
Shows the order of execution and global scope creation.

Study with:
- ?trace to see execution order
- ?variables to see when globals are created
*/

// Global variables created during script loading
console.log('1. Script starts loading');
var globalVar = 'Global variable';
let globalLet = 'Global let';

// Function declarations are hoisted
console.log('2. Before function declaration');
console.log('Can call hoisted function:', hoistedFunction());

function hoistedFunction() {
    return 'I was hoisted!';
}

console.log('3. After function declaration');

// Immediate execution
console.log('4. Immediate code execution');
console.log('  Multiple statements execute in order');
console.log('  Statement 1');
console.log('  Statement 2');
console.log('  Statement 3');

// Event listeners and async code
console.log('5. Setting up async behavior');
setTimeout(() => {
    console.log('7. Async code runs later');
}, 0);

console.log('6. Script loading complete');

// This code runs immediately when the script loads
(function() {
    console.log('8. IIFE runs immediately during script load');
})();

/*
Educational questions:
- In what order does JavaScript execute code?
- When are global variables created?
- How does hoisting affect script loading?
*/