'use strict';

/* Scope: Basic Global Scope

Global variables are accessible from anywhere in the program.
Variables declared at script level become global.

Study with:
- ?variables to see global variables accessible everywhere
- ?trace to follow global variable access from different contexts
*/

// Global variables (script level)
var globalVar = 'Global var variable';
let globalLet = 'Global let variable';
const globalConst = 'Global const variable';

// Global function
function globalFunction() {
    console.log('Global function called');
    return 'Function result';
}

// Function accessing global variables
function accessGlobals() {
    console.log('From function:');
    console.log('  globalVar: ' + globalVar);
    console.log('  globalLet: ' + globalLet);
    console.log('  globalConst: ' + globalConst);
    console.log('  globalFunction: ' + globalFunction());
}

// Test global access
console.log('=== Global Scope Access ===');
console.log('Direct access: ' + globalVar);
accessGlobals();

/*
How are global variables accessible from any function?
*/