'use strict';

/* Scope: Accidental Global Variables

Forgetting var/let/const creates accidental global variables.
Strict mode helps prevent this dangerous behavior.

Study with:
- ?variables to see unintentional global variable creation
- ?trace to follow accidental global assignment
*/

// This function creates accidental globals (in non-strict mode)
function createAccidentalGlobal() {
    console.log('Creating accidental global...');
    
    // This would create a global variable in non-strict mode
    // accidentalGlobal = 'Oops, this is global!';
    
    // In strict mode, this throws an error instead
    try {
        eval('accidentalGlobal = "This would be global in non-strict mode"');
    } catch (error) {
        console.log('Strict mode prevented accidental global: ' + error.message);
    }
    
    // Proper way - explicitly declare variables
    let localVar = 'This stays local';
    console.log('Local variable: ' + localVar);
}

// Demonstrate prevention
console.log('=== Accidental Global Prevention ===');
createAccidentalGlobal();

// Check if accidental global was created
console.log('Accidental global exists: ' + (typeof accidentalGlobal !== 'undefined'));

/*
How does strict mode prevent accidental global variable creation?
*/