'use strict';

/* Scope: Loop Block Scope

Each loop iteration creates a new block scope.
Shows why let/const behave differently than var in loops.

Study with:
- ?variables to see new variables created each iteration
- ?trace to follow loop variable creation and access
*/

// Block scope in loops
console.log('=== Loop Block Scope ===');

for (let i = 0; i < 3; i++) {
    console.log('Iteration ' + i + ':');
    let iterationLet = 'Let variable ' + i;
    const iterationConst = i * 10;
    var iterationVar = 'Var variable ' + i;
    
    console.log('  iterationLet: ' + iterationLet);
    console.log('  iterationConst: ' + iterationConst);
    console.log('  iterationVar: ' + iterationVar);
}

console.log('After loop:');
console.log('  i exists: ' + (typeof i !== 'undefined'));
console.log('  iterationLet exists: ' + (typeof iterationLet !== 'undefined'));
console.log('  iterationConst exists: ' + (typeof iterationConst !== 'undefined'));
console.log('  iterationVar exists: ' + (typeof iterationVar !== 'undefined'));
console.log('  iterationVar final value: ' + iterationVar);

/*
How does each loop iteration create a new block scope?
*/