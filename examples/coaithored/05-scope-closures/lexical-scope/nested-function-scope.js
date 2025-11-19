'use strict';

/* Scope: Nested Function Scope

Inner functions can access outer function variables.
Creates nested scopes with lexical (static) resolution.

Study with:
- ?variables to see nested scope access patterns
- ?trace to follow variable resolution up the scope chain
*/

function outerFunction(outerParam) {
    var outerVar = 'Outer function variable';
    
    function innerFunction(innerParam) {
        var innerVar = 'Inner function variable';
        
        console.log('Inside inner function:');
        console.log('  innerParam: ' + innerParam);
        console.log('  innerVar: ' + innerVar);
        console.log('  outerParam: ' + outerParam);      // Access outer parameter
        console.log('  outerVar: ' + outerVar);          // Access outer variable
    }
    
    console.log('Inside outer function:');
    console.log('  outerParam: ' + outerParam);
    console.log('  outerVar: ' + outerVar);
    // console.log('  innerVar: ' + innerVar);           // Error: not accessible
    
    innerFunction('Inner argument');
}

// Test nested function scope
console.log('=== Nested Function Scope ===');
outerFunction('Outer argument');

/*
How do inner functions access variables from outer function scopes?
*/