'use strict';

/* Scope: Switch Case Blocks

Switch cases can have their own block scopes.
Without blocks, variables leak between cases.

Study with:
- ?variables to see variable isolation between cases
- ?trace to follow variable creation in switch blocks
*/

// Switch case block scope
console.log('=== Switch Case Block Scope ===');

let caseValue = 2;

switch (caseValue) {
    case 1: {
        let caseVar = 'Case 1 variable';
        console.log('Case 1: ' + caseVar);
        break;
    }
    
    case 2: {
        let caseVar = 'Case 2 variable';  // Different variable, same name
        console.log('Case 2: ' + caseVar);
        break;
    }
    
    default: {
        let caseVar = 'Default variable';
        console.log('Default: ' + caseVar);
    }
}

// Without blocks, variables would leak between cases
switch (1) {
    case 1:
        var leakyVar = 'This leaks to the whole function';
        break;
    case 2:
        console.log('Case 2 can access: ' + leakyVar);
        break;
}

/*
Why do switch cases need explicit blocks for proper variable isolation?
*/