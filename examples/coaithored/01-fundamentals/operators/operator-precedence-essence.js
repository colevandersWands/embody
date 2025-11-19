'use strict';

/* Operators: Operator Precedence Essence

Order of operations: () first, then * /, then + -, then comparisons, then logical.
When in doubt, use parentheses for clarity.

Study with: ?trace to see evaluation order */

// Precedence demo: * before +
console.log('2 + 3 * 4 =', 2 + 3 * 4); // 14 (not 20)
// Evaluated as: 2 + (3 * 4) = 2 + 12 = 14

// Parentheses override precedence
console.log('(2 + 3) * 4 =', (2 + 3) * 4); // 20
// Evaluated as: (5) * 4 = 20

// Division before subtraction
console.log('10 - 6 / 2 =', 10 - 6 / 2); // 7 (not 2)
// Evaluated as: 10 - (6 / 2) = 10 - 3 = 7

// Comparison before logical
console.log('5 > 3 && 2 < 4 =', 5 > 3 && 2 < 4); // true
// Evaluated as: (5 > 3) && (2 < 4) = true && true = true

// Complex expression
let result = 2 + 3 * 4 > 10 && 15 / 3 === 5;
// Steps: 3*4=12, 2+12=14, 14>10=true, 15/3=5, 5===5=true, true&&true=true
console.log('Complex result:', result); // true

// When in doubt, use parentheses
console.log('Clear with parens:', (2 + 3) * (4 + 1)); // 25

/* Why does * come before +? */