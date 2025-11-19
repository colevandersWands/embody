'use strict';

/* Scope: Temporal Dead Zone (TDZ)

let/const variables exist but cannot be accessed before declaration.
Shows the difference between var hoisting and let/const TDZ.

Study with:
- ?variables to see when variables become accessible
- ?trace to follow variable creation vs initialization timing
*/

// Temporal Dead Zone demonstration
console.log('=== Temporal Dead Zone ===');

console.log('Before declarations:');
console.log('  var exists: ' + (typeof hoistedVar !== 'undefined'));
console.log('  let exists: ' + (typeof hoistedLet !== 'undefined'));

// This works - var is hoisted and initialized with undefined
console.log('  hoistedVar value: ' + hoistedVar);

// This would throw ReferenceError - let is in TDZ
// console.log('  hoistedLet value: ' + hoistedLet);  // Uncomment to see error

var hoistedVar = 'Var declaration';
let hoistedLet = 'Let declaration';

console.log('After declarations:');
console.log('  hoistedVar: ' + hoistedVar);
console.log('  hoistedLet: ' + hoistedLet);

/*
Why do let/const have a Temporal Dead Zone but var doesn't?
*/