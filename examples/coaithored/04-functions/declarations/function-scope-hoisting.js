'use strict';

/* Functions: Function Scope Hoisting

Functions and variables hoist to their containing function scope.
Shows hoisting behavior within function boundaries.

Study with:
- ?trace to see function-level hoisting
- ?variables to track scope boundaries for hoisting
*/

function demonstrateFunctionScopeHoisting() {
    console.log('=== Function Scope Hoisting ===');
    
    // Function declarations hoist to function top
    console.log('Before declaration: ' + innerFunction());
    
    // var declarations hoist to function top (undefined)
    console.log('Before declaration, innerVar: ' + innerVar);
    
    // Actual declarations (in middle of function)
    var innerVar = 'Function-scoped variable';
    
    function innerFunction() {
        return 'Function-scoped function';
    }
    
    // After declarations
    console.log('After declaration: ' + innerFunction());
    console.log('After declaration, innerVar: ' + innerVar);
    
    // Nested function scope
    function nestedFunction() {
        console.log('From nested: ' + innerFunction());  // Can access outer function
        console.log('From nested, innerVar: ' + innerVar);
    }
    
    nestedFunction();
}

// Test function scope hoisting
demonstrateFunctionScopeHoisting();

/*
How does hoisting work within function scope boundaries?
*/