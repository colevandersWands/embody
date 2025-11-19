'use strict';

/* Variables: Function Scope TDZ

TDZ behavior within function scope.
Shows how function boundaries affect TDZ.

Study with:
- ?trace to see TDZ within function execution
- ?variables to track function-scoped TDZ timing
*/

function demonstrateFunctionTDZ() {
    console.log('=== Function Scope TDZ ===');
    
    // var is accessible (undefined) within function
    console.log('functionVar before declaration: ' + functionVar);
    
    // let/const would throw ReferenceError if accessed
    console.log('About to declare variables...');
    
    var functionVar = 'Function var value';
    let functionLet = 'Function let value';
    const functionConst = 'Function const value';
    
    console.log('After declarations:');
    console.log('  functionVar: ' + functionVar);
    console.log('  functionLet: ' + functionLet);
    console.log('  functionConst: ' + functionConst);
    
    // Demonstrate safe TDZ check
    function checkTDZ() {
        try {
            eval('console.log(innerLet)');
        } catch (error) {
            console.log('Inner TDZ error: ' + error.name);
        }
        
        let innerLet = 'Inner let value';
        console.log('Inner let after declaration: ' + innerLet);
    }
    
    checkTDZ();
}

// Test function TDZ
demonstrateFunctionTDZ();

/*
How does function scope affect Temporal Dead Zone behavior?
*/