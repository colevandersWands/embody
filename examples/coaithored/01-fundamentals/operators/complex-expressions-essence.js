'use strict';

/* Operators: Complex Expressions Essence

Complex expressions follow operator precedence: * / before + -.
Parentheses override precedence. Break down step by step.

Study with: ?trace to see evaluation order */

// Complex expression breakdown
console.log('Expression: 2 + 3 * 4 - 1');

// JavaScript evaluates: 2 + (3 * 4) - 1 = 2 + 12 - 1 = 13
let result1 = 2 + 3 * 4 - 1;
console.log('Result:', result1); // 13

// Parentheses change the order
console.log('\nExpression: (2 + 3) * (4 - 1)');

// JavaScript evaluates: (5) * (3) = 15
let result2 = (2 + 3) * (4 - 1);
console.log('Result:', result2); // 15

// Step-by-step breakdown
let step1 = 3 * 4;    // 12 (multiplication first)
let step2 = 2 + step1; // 14 (then addition)
let step3 = step2 - 1; // 13 (then subtraction)
console.log('\nStep by step: 2 +', step1, '- 1 =', step3);

// Comparison vs assignment confusion
let x = 5;
let comparison = (x == 5);  // true (comparison)
let assignment = (x = 10);  // 10 (assignment returns value)
console.log('Comparison:', comparison, 'Assignment:', assignment);

/* Why does * come before +? */