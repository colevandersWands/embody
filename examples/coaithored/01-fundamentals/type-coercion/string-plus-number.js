'use strict';

/* Type Coercion: String + Number

Shows how JavaScript handles mixing strings and numbers.
Demonstrates automatic type conversion (coercion).

Study with:
- ?trace to see the coercion happening
- Try different combinations by commenting/uncommenting
*/

// Different test cases - uncomment to try
let a = '3';
let b = 4;
// let a = '10'; let b = 20;
// let a = 'hello'; let b = 5;
// let a = ''; let b = 7;

console.log('a =', a, '(type:', typeof a, ')');
console.log('b =', b, '(type:', typeof b, ')');
console.log();

// Addition with string and number
let result1 = a + b;
console.log('a + b =', result1, '(type:', typeof result1, ')');

// Subtraction forces number conversion
let result2 = a - b;
console.log('a - b =', result2, '(type:', typeof result2, ')');

// Multiplication forces number conversion
let result3 = a * b;
console.log('a * b =', result3, '(type:', typeof result3, ')');

/*
Educational questions:
- Why does + give '34' but - gives -1?
- Which operator concatenates vs converts?
- What happens with non-numeric strings?
- How can you force number conversion?
*/