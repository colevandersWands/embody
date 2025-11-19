'use strict';

/* Functions: Function vs Var Hoisting

Function declarations vs var declarations hoisting behavior.
Shows difference between complete and partial hoisting.

Study with:
- ?trace to see different hoisting timings
- ?variables to compare function vs var availability
*/

function demonstrateHoistingDifferences() {
    console.log('=== Function vs Var Hoisting ===');
    
    // Function declarations are completely hoisted
    console.log('Function before declaration: ' + hoistedFunction());
    
    // var declarations are hoisted but undefined
    console.log('Var before declaration: ' + hoistedVar);
    
    // Function expression in var is also undefined initially
    console.log('Function expression before: ' + typeof hoistedFunctionExpr);
    
    // Actual declarations
    function hoistedFunction() {
        return 'Function declaration result';
    }
    
    var hoistedVar = 'Var value';
    
    var hoistedFunctionExpr = function() {
        return 'Function expression result';
    };
    
    // After declarations
    console.log('Function after declaration: ' + hoistedFunction());
    console.log('Var after declaration: ' + hoistedVar);
    console.log('Function expression after: ' + hoistedFunctionExpr());
}

// Test hoisting differences
demonstrateHoistingDifferences();

/*
Why are function declarations fully hoisted while var is only partially hoisted?
*/