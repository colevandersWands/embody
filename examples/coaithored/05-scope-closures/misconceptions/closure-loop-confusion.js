'use strict';

/* Misconception: Loop Variable Closure Confusion

MISCONCEPTION: "Each closure gets its own copy of loop variable"
REALITY: With var, all closures share the same variable

Study with:
- ?variables to see loop variable sharing vs isolation
- ?trace to see timing of closure creation vs execution
*/

console.log('=== Loop Closure Confusion ===');

// Problem: var creates shared variable
console.log('With var (problematic):');
var functionsWithVar = [];

for (var i = 0; i < 3; i++) {
    functionsWithVar.push(function() {
        return 'Function sees i = ' + i;  // All see final value: 3
    });
}

functionsWithVar[0](); // i = 3 (not 0!)
functionsWithVar[1](); // i = 3 (not 1!)
functionsWithVar[2](); // i = 3 (not 2!)

console.log('Result: ' + functionsWithVar[0]());
console.log('All functions share the same i variable!');

// Solution: let creates new variable each iteration
console.log('With let (correct):');
var functionsWithLet = [];

for (let j = 0; j < 3; j++) {
    functionsWithLet.push(function() {
        return 'Function sees j = ' + j;  // Each sees its own value
    });
}

console.log('Result: ' + functionsWithLet[0]());  // j = 0
console.log('Each function has its own j variable!');

/*
Why do var and let behave differently in loop closures?
*/