'use strict';

/* Operators: Arithmetic Operations

Demonstrates basic arithmetic operators and their behavior.
Shows how JavaScript handles different number types and edge cases.

Study with:
- ?variables to track operand values
- ?trace to see calculation steps
*/

// Different test values - uncomment to explore
let x = 10;
let y = 3;
// let x = 7.5; let y = 2.2;
// let x = -5; let y = 3;
// let x = 0; let y = 5;

console.log('x =', x);
console.log('y =', y);
console.log();

// Basic arithmetic operations
let addition = x + y;
let subtraction = x - y;
let multiplication = x * y;
let division = x / y;
let remainder = x % y;
let exponentiation = x ** y;

console.log('Addition: x + y =', addition);
console.log('Subtraction: x - y =', subtraction);
console.log('Multiplication: x * y =', multiplication);
console.log('Division: x / y =', division);
console.log('Remainder: x % y =', remainder);
console.log('Exponentiation: x ** y =', exponentiation);

// Special cases
console.log('\nSpecial cases:');
console.log('Division by zero: 5 / 0 =', 5 / 0);
console.log('Zero divided by zero: 0 / 0 =', 0 / 0);
console.log('Negative remainder: -10 % 3 =', -10 % 3);
console.log('Infinity arithmetic: Infinity + 1 =', Infinity + 1);

/*
Educational questions:
- What happens when you divide by zero?
- How does the % operator work with negative numbers?
- Why does 0.1 + 0.2 not equal 0.3?
- When would you use ** instead of Math.pow()?
*/