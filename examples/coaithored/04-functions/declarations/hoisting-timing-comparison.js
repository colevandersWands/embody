'use strict';

/* Functions: Hoisting Timing Comparison

Compare all function types and their hoisting behavior.
Timing differences matter for execution order.

Study with: ?trace to see precise timing differences */

console.log('=== Hoisting Timing Test ===');

// 1. Function declaration - hoisted completely
console.log('1. Declaration: ' + (typeof declaration));
console.log('   Can call: ' + declaration());

// 2. Var function expression - var hoisted, function not
console.log('2. Var expr: ' + (typeof varExpr));

// 3. Let function expression - TDZ
console.log('3. Let expr: ' + (typeof letExpr !== 'undefined'));

// Actual definitions (hoisted above in declaration case)
function declaration() {
    return 'declared';
}

var varExpr = function() {
    return 'var expressed';
};

let letExpr = function() {
    return 'let expressed';
};

console.log('After definitions:');
console.log('  declaration: ' + declaration());
console.log('  varExpr: ' + varExpr());
console.log('  letExpr: ' + letExpr());

/* Which hoisting pattern is most predictable? */