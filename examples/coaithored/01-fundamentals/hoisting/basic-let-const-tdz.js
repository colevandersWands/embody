'use strict';

/* Variables: Basic Let/Const TDZ

let/const are hoisted but in Temporal Dead Zone.
Shows basic difference from var hoisting behavior.

Study with:
- ?trace to see when TDZ errors occur
- ?variables to see hoisting vs TDZ timing
*/

// Basic TDZ demonstration
console.log('=== Basic Temporal Dead Zone ===');

// var is hoisted and initialized with undefined
console.log('var before declaration: ' + varExample);

// let/const are hoisted but in TDZ - would throw ReferenceError
console.log('let exists but inaccessible: ' + (typeof letExample === 'undefined'));

// Actual declarations
var varExample = 'Var value';
let letExample = 'Let value';
const constExample = 'Const value';

console.log('After declarations:');
console.log('  varExample: ' + varExample);
console.log('  letExample: ' + letExample);
console.log('  constExample: ' + constExample);

// Demonstrate TDZ error safely
try {
    eval('console.log(unreachableLet)');
} catch (error) {
    console.log('TDZ error caught: ' + error.name);
}

let unreachableLet = 'Now accessible';

/*
Why do let/const have a Temporal Dead Zone but var doesn't?
*/