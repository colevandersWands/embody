'use strict';

/* Operators: Complex Expressions Overview

Complex expression concepts distilled to essence:
- complex-expressions-essence.js - precedence, parentheses, step-by-step
- (additional focused examples as needed)

Study with: Start with complex-expressions-essence.js */

// Quick demonstration of complex expressions
console.log('Complex Expressions Demo:');

// Precedence matters: * before +
let expr1 = 2 + 3 * 4;  // 2 + 12 = 14 (not 20!)
console.log('2 + 3 * 4 =', expr1);

// Parentheses override precedence
let expr2 = (2 + 3) * 4;  // 5 * 4 = 20
console.log('(2 + 3) * 4 =', expr2);

// Mixed operators
let complex = 10 - 2 * 3 + 1;  // 10 - 6 + 1 = 5
console.log('10 - 2 * 3 + 1 =', complex);

// Boolean logic complexity
let age = 25;
let hasLicense = true;
let canDrive = age >= 18 && hasLicense;  // true && true = true
console.log('Can drive:', canDrive);

// Assignment vs comparison
let x = 5;
console.log('Assignment (x = 10):', (x = 10)); // Returns 10, changes x
console.log('Comparison (x == 10):', (x == 10)); // Returns true

/* See essence files for detailed expression evaluation */