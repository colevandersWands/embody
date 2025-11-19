'use strict';

/* Scope: Nested Scope Access

Demonstrates how inner scopes can access outer scope variables.
Shows the scope chain in action.

Study with:
- ?variables to see scope chain
- ?trace to follow variable lookup
*/

let outerVar = 'Outer';

function outerFunction() {
    let middleVar = 'Middle';
    
    function innerFunction() {
        let innerVar = 'Inner';
        
        // Inner can see all outer scopes
        console.log('From inner function:');
        console.log('  innerVar:', innerVar);   // Own scope
        console.log('  middleVar:', middleVar); // Parent scope  
        console.log('  outerVar:', outerVar);   // Grandparent scope
    }
    
    innerFunction();
    
    // Outer cannot see inner
    console.log('\nFrom outer function:');
    console.log('  middleVar:', middleVar);
    console.log('  outerVar:', outerVar);
    console.log('  typeof innerVar:', typeof innerVar); // undefined
}

outerFunction();

/*
Educational questions:
- How does JavaScript find variables in nested scopes?
- Why can inner access outer but not vice versa?
- What is the scope chain?
*/