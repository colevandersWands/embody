'use strict';

/* Scope: Basic Function Scope

Variables declared inside functions are isolated from the outside.
Function scope creates a private namespace for variables.

Study with:
- ?variables to see function-scoped variable isolation
- ?trace to follow variable access boundaries
*/

// Global variable for comparison
var globalVar = 'Global variable';

function demonstrateFunctionScope() {
    // These variables only exist within this function
    var functionVar = 'Function-scoped with var';
    let functionLet = 'Function-scoped with let';
    const functionConst = 'Function-scoped with const';
    
    console.log('Inside function:');
    console.log('  functionVar: ' + functionVar);
    console.log('  functionLet: ' + functionLet);
    console.log('  functionConst: ' + functionConst);
    console.log('  globalVar: ' + globalVar);  // Can access global
}

// Test function scope
console.log('=== Function Scope Isolation ===');
demonstrateFunctionScope();

console.log('Outside function:');
console.log('  globalVar: ' + globalVar);
console.log('  functionVar exists: ' + (typeof functionVar !== 'undefined'));
console.log('  functionLet exists: ' + (typeof functionLet !== 'undefined'));

/*
How does function scope isolate variables from the outside world?
*/