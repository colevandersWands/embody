'use strict';

/* Scope: Global Variable Modification

Functions can modify global variables.
Shows const vs let/var modification rules.

Study with:
- ?variables to see global variables being modified
- ?trace to follow global state changes from functions
*/

// Global variables
var globalVar = 'Original var value';
let globalLet = 'Original let value';
const globalConst = 'Original const value';

function modifyGlobals() {
    console.log('Before modification:');
    console.log('  globalVar: ' + globalVar);
    console.log('  globalLet: ' + globalLet);
    
    // Modify global variables
    globalVar = 'Modified var value';
    globalLet = 'Modified let value';
    // globalConst = 'Cannot modify'; // TypeError: Assignment to constant variable
    
    console.log('After modification:');
    console.log('  globalVar: ' + globalVar);
    console.log('  globalLet: ' + globalLet);
}

// Test global modification
console.log('=== Global Variable Modification ===');
modifyGlobals();

console.log('Global state after function:');
console.log('  globalVar: ' + globalVar);
console.log('  globalLet: ' + globalLet);

/*
Why can functions modify global variables but not const ones?
*/