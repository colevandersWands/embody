'use strict';

/* Scope: Var Hoisting in Functions

var declarations are hoisted to the top of their function scope.
Shows the difference between declaration and initialization hoisting.

Study with:
- ?variables to see var hoisting within function scope
- ?trace to follow var declaration and initialization timing
*/

function demonstrateVarHoisting() {
    console.log('=== Var Hoisting in Function ===');
    
    console.log('Before var declaration:');
    console.log('  typeof hoistedVar: ' + typeof hoistedVar);  // undefined, not error
    console.log('  hoistedVar value: ' + hoistedVar);          // undefined
    
    if (true) {
        var hoistedVar = 'Declared in block';  // Hoisted to function top
        console.log('Inside block: ' + hoistedVar);
    }
    
    console.log('After block:');
    console.log('  hoistedVar: ' + hoistedVar);  // Still accessible - function scoped
    
    // Multiple var declarations of same name
    var hoistedVar = 'Redeclared';
    console.log('After redeclaration: ' + hoistedVar);
}

// Test var hoisting
demonstrateVarHoisting();

/*
Why does var hoist to function scope instead of block scope?
*/