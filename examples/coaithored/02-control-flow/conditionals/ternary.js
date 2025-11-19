'use strict';

/* Control Flow: Ternary Operator

Demonstrates the conditional (ternary) operator for inline conditionals.
Shows compact conditional expressions and nested ternaries.

Study with:
- ?trace to see condition evaluation
- Compare ternary vs if-else equivalents
*/

// Different test values - uncomment to explore
let score = 85;
// let score = 95;
// let score = 65;
// let score = 45;

console.log('Testing score:', score);
console.log();

// Basic ternary operator
let result = score >= 70 ? 'Pass' : 'Fail';
console.log('Result:', result);

// Equivalent if-else (for comparison)
let resultIfElse;
if (score >= 70) {
    resultIfElse = 'Pass';
} else {
    resultIfElse = 'Fail';
}
console.log('Same result with if-else:', resultIfElse);

// Ternary in expressions
let message = 'You ' + (score >= 70 ? 'passed' : 'failed') + ' the test';
console.log('Message:', message);

// Multiple ternary conditions (nested)
let grade = score >= 90 ? 'A' :
           score >= 80 ? 'B' :
           score >= 70 ? 'C' :
           score >= 60 ? 'D' : 'F';
console.log('Grade:', grade);

// Ternary with different types
let bonus = score > 80 ? 100 : 0;
console.log('Bonus points:', bonus);

// Ternary for default values
let name = '';
let displayName = name ? name : 'Anonymous';
console.log('Display name:', displayName);

// Short-circuit with ternary
let isEligible = score >= 60;
let action = isEligible ? 'proceed to next level' : 'retake the test';
console.log('Recommended action:', action);

/*
Educational questions:
- When is ternary operator better than if-else?
- How do nested ternaries work left to right?
- Can ternary operators have side effects?
- What's the readability trade-off with complex ternaries?
*/