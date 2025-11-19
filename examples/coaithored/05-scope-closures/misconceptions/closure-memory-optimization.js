'use strict';

/* Misconception: Closures Capture All Variables

MISCONCEPTION: "Closures capture all outer scope variables"
REALITY: Modern engines optimize to capture only referenced variables

Study with:
- ?variables to see which variables are actually captured
- ?trace to see closure optimization behavior
*/

function createOptimizedClosure() {
    let used = 'I am used in closure';
    let unused = 'I am not used in closure';
    let bigObject = 'Large data that takes memory';
    
    // Only 'used' should be captured by modern JS engines
    return function() {
        console.log('Closure accesses: ' + used);
        // unused and bigObject are not referenced
    };
}

console.log('=== Closure Memory Optimization ===');

const closure = createOptimizedClosure();
closure();

console.log('Modern engines optimize closures to capture only referenced variables');

// Counter-example: explicit reference captures variable
function createNonOptimizedClosure() {
    let used = 'Used variable';
    let alsoUsed = 'Also used variable';
    
    return function() {
        console.log('Using: ' + used + ' and ' + alsoUsed);
    };
}

/*
How do JavaScript engines optimize closure memory usage?
*/