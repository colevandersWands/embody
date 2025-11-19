'use strict';

/* Functions: Function Hoisting Overview

Function hoisting concepts have been split into focused examples:
- script-level-hoisting.js - global function hoisting behavior
- function-level-hoisting.js - hoisting within function scope
- function-vs-var-hoisting.js - comparing hoisting behaviors
- block-level-function-hoisting.js - complex block hoisting rules

Study with:
- Start with script-level-hoisting.js for basic concepts
- ?trace to see function hoisting timing and availability
*/

// Quick demonstration of function hoisting
console.log('=== Function Hoisting Core Concept ===');

// Function declarations are fully hoisted
console.log('Can call before declaration: ' + hoistedExample());

function hoistedExample() {
    return 'Function hoisted successfully';
}

// Compare with var (partially hoisted)
console.log('Var before declaration: ' + varExample);
console.log('Function expr before: ' + (typeof functionExpr));

var varExample = 'Var value';
var functionExpr = function() {
    return 'Function expression';
};

console.log('After declarations:');
console.log('  varExample: ' + varExample);
console.log('  functionExpr: ' + functionExpr());

/*
See the focused examples for detailed exploration of function hoisting.
*/