'use strict';

/* Operators: Operator Precedence Overview

Operator precedence concepts distilled to essence:
- operator-precedence-essence.js - order of operations and parentheses
- (additional focused examples as needed)

Study with: Start with operator-precedence-essence.js */

// Quick demonstration of operator precedence
console.log('Operator Precedence Demo:');

// Math operators follow standard precedence
console.log('2 + 3 * 4 =', 2 + 3 * 4); // 14 (multiplication first)
console.log('(2 + 3) * 4 =', (2 + 3) * 4); // 20 (parentheses first)

// Division before subtraction
console.log('12 - 8 / 2 =', 12 - 8 / 2); // 8 (division first)
console.log('(12 - 8) / 2 =', (12 - 8) / 2); // 2 (parentheses first)

// Comparison before logical
let a = 5, b = 3, c = 7;
console.log('a > b && c > a =', a > b && c > a); // true && true = true

// Assignment has low precedence
let x;
console.log('x = 2 + 3 =', (x = 2 + 3)); // 5 (addition before assignment)

// Complex but readable with parentheses
let result = (a + b) * (c - a) / 2;
console.log('Complex with parens:', result); // Clear intention

/* See essence files for detailed precedence exploration */