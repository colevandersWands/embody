'use strict';

/* Scope: Basic Block Scope

Block scope with let/const vs function scope with var.
Blocks are created by curly braces { }.

Study with:
- ?variables to see which variables exist outside blocks
- ?trace to follow variable creation and access
*/

// Basic block scope demonstration
console.log('=== Block Scope vs Function Scope ===');

if (true) {
    let blockLet = 'Block-scoped with let';
    const blockConst = 'Block-scoped with const';
    var functionVar = 'Function-scoped with var';
    
    console.log('Inside block:');
    console.log('  blockLet: ' + blockLet);
    console.log('  blockConst: ' + blockConst);
    console.log('  functionVar: ' + functionVar);
}

console.log('Outside block:');
console.log('  blockLet exists: ' + (typeof blockLet !== 'undefined'));
console.log('  blockConst exists: ' + (typeof blockConst !== 'undefined'));
console.log('  functionVar exists: ' + (typeof functionVar !== 'undefined'));
console.log('  functionVar value: ' + functionVar);  // var escaped the block!

/*
Why do let/const stay in blocks while var escapes to function scope?
*/