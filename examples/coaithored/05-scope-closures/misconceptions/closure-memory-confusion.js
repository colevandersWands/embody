'use strict';

/* Misconception: Closure Memory Confusion Overview

Closure misconceptions have been split into focused examples:
- closure-captures-variables.js - variables vs values capture
- closure-memory-optimization.js - selective variable capture  
- closure-loop-confusion.js - var vs let in loop closures
- closure-performance-myths.js - modern engine optimizations

Study with:
- Start with closure-captures-variables.js for core misconception
- ?variables to see closure behavior in any example
*/

// Quick demonstration of core misconception
console.log('=== Core Closure Misconception ===');

function demonstrateMisconception() {
    let variable = 'Original value';
    
    let closure = function() {
        return 'Closure sees: ' + variable;
    };
    
    variable = 'Changed value';  // This affects the closure!
    
    return closure;
}

let fn = demonstrateMisconception();
console.log(fn());  // Shows "Changed value", not "Original value"

/*
See the focused examples for detailed exploration of closure misconceptions.
*/
