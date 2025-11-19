'use strict';

/* Type Coercion: Operator Precedence

Shows how operator precedence affects type coercion.
Demonstrates mixing arithmetic and string operations.

Study with:
- ?trace to see the order of operations
- Try parentheses to change the order
*/

// Different test values - uncomment to explore
let a = '2';
let b = 3;
let c = 4;
// let a = '10'; let b = 5; let c = 2;
// let a = 'Start'; let b = 1; let c = 2;

console.log('a =', a, '(type:', typeof a, ')');
console.log('b =', b, '(type:', typeof b, ')');
console.log('c =', c, '(type:', typeof c, ')');
console.log();

// Operator precedence affects coercion
let result1 = a + b * c;  // * has higher precedence
console.log('a + b * c =', result1, '(type:', typeof result1, ')');

// Parentheses change the order
let result2 = (a + b) * c;
console.log('(a + b) * c =', result2, '(type:', typeof result2, ')');

// Multiple additions - left to right
let result3 = a + b + c;
console.log('a + b + c =', result3, '(type:', typeof result3, ')');

// Subtraction forces number conversion
let result4 = a - b + c;
console.log('a - b + c =', result4, '(type:', typeof result4, ')');

// Mixed operations
let result5 = a + b - c;
console.log('a + b - c =', result5, '(type:', typeof result5, ')');

// Complex expression
let result6 = a + b * c - 1;
console.log('a + b * c - 1 =', result6, '(type:', typeof result6, ')');

/*
Educational questions:
- Why does precedence matter for type coercion?
- How does left-to-right evaluation affect string concatenation?
- When do parentheses change the result type?
- Which operators trigger string vs number conversion?
*/