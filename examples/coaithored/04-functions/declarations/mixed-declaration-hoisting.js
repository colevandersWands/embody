'use strict';

/* Functions: Mixed Declaration Hoisting

var hoists differently than let/const.
Shows temporal dead zone vs undefined behavior.

Study with:
- ?trace to see different hoisting behaviors
- ?variables to track TDZ vs hoisted undefined
*/

function demonstrateMixedHoisting() {
    console.log('=== Mixed Declaration Hoisting ===');
    
    // var is hoisted and initialized with undefined
    console.log('var before declaration: ' + mixedVar);
    
    // let/const are hoisted but in temporal dead zone
    try {
        console.log('let before declaration: ' + mixedLet);
    } catch (error) {
        console.log('let TDZ error: ' + error.name);
    }
    
    try {
        console.log('const before declaration: ' + mixedConst);
    } catch (error) {
        console.log('const TDZ error: ' + error.name);
    }
    
    // Actual declarations
    var mixedVar = 'Var variable';
    let mixedLet = 'Let variable';
    const mixedConst = 'Const variable';
    
    console.log('After declarations:');
    console.log('  mixedVar: ' + mixedVar);
    console.log('  mixedLet: ' + mixedLet);
    console.log('  mixedConst: ' + mixedConst);
}

// Test mixed declaration hoisting
demonstrateMixedHoisting();

/*
Why do var and let/const have different hoisting behaviors?
*/