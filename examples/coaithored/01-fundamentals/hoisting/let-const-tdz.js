'use strict';

/* Variables: Let/Const TDZ Overview

Temporal Dead Zone concepts have been split into focused examples:
- basic-let-const-tdz.js - core TDZ vs var differences
- function-scope-tdz.js - TDZ behavior within functions
- block-scope-tdz.js - TDZ in different block types
- tdz-error-patterns.js - common TDZ errors and solutions

Study with:
- Start with basic-let-const-tdz.js for core concepts
- ?trace to see TDZ timing and error patterns
*/

// Quick demonstration of TDZ concept
console.log('=== TDZ Core Concept ===');

// var is hoisted and initialized
console.log('var before declaration: ' + (typeof hoistedVar));
console.log('let before declaration: ' + (typeof hoistedLet));

var hoistedVar = 'Var value';
let hoistedLet = 'Let value';

console.log('After declarations:');
console.log('  hoistedVar: ' + hoistedVar);
console.log('  hoistedLet: ' + hoistedLet);

// Safe TDZ demonstration
function safeTDZDemo() {
    console.log('Demonstrating safe TDZ access...');
    
    let safeLet = 'Safe value';
    return safeLet;
}

console.log('Safe access: ' + safeTDZDemo());

/*
See the focused examples for detailed exploration of TDZ behavior.
*/