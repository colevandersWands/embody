'use strict';

/* Operators: Comparison Operations

Demonstrates comparison operators and their return values.
Shows the difference between equality types and relational comparisons.

Study with:
- ?trace to see boolean result calculation
- Try different value combinations
*/

// Different test values - uncomment to explore
let a = 5;
let b = 10;
// let a = 'apple'; let b = 'banana';
// let a = true; let b = false;
// let a = null; let b = undefined;

console.log('a =', a, '(type:', typeof a, ')');
console.log('b =', b, '(type:', typeof b, ')');
console.log();

// Equality comparisons
let equal = a == b;
let strictEqual = a === b;
let notEqual = a != b;
let strictNotEqual = a !== b;

console.log('a == b:', equal, '(loose equality)');
console.log('a === b:', strictEqual, '(strict equality)');
console.log('a != b:', notEqual, '(loose inequality)');
console.log('a !== b:', strictNotEqual, '(strict inequality)');

// Relational comparisons
let greater = a > b;
let greaterEqual = a >= b;
let less = a < b;
let lessEqual = a <= b;

console.log('\nRelational comparisons:');
console.log('a > b:', greater);
console.log('a >= b:', greaterEqual);
console.log('a < b:', less);
console.log('a <= b:', lessEqual);

// String comparisons (lexicographic)
console.log('\nString comparisons:');
console.log('"apple" < "banana":', "apple" < "banana");
console.log('"10" < "2":', "10" < "2");
console.log('"10" < 2:', "10" < 2);

/*
Educational questions:
- When do comparison operators return true or false?
- How does JavaScript compare strings alphabetically?
- Why might "10" < "2" be true but "10" < 2 be false?
- When should you use === instead of ==?
*/