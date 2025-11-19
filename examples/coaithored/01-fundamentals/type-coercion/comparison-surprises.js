'use strict';

/* Type Coercion: Comparison Surprises

Shows the difference between loose (==) and strict (===) equality.
Demonstrates how == can cause unexpected type conversions.

Study with:
- ?trace to see the conversion steps
- Try different test cases by commenting/uncommenting
*/

// Different test cases - uncomment to explore
let x = '5';
let y = 5;
// let x = true; let y = 1;
// let x = null; let y = undefined;
// let x = ''; let y = 0;

console.log('x =', x, '(type:', typeof x, ')');
console.log('y =', y, '(type:', typeof y, ')');
console.log();

// Loose equality (== allows coercion)
let looseEqual = x == y;
console.log('x == y:', looseEqual, '(loose equality)');

// Strict equality (=== no coercion)
let strictEqual = x === y;
console.log('x === y:', strictEqual, '(strict equality)');

// Other comparison operators
console.log('x > y:', x > y, '(greater than)');
console.log('x < y:', x < y, '(less than)');

// Surprising cases
console.log('\nSurprising comparisons:');
console.log('"0" == 0:', "0" == 0);
console.log('false == 0:', false == 0);
console.log('null == undefined:', null == undefined);
console.log('"" == 0:', "" == 0);

/*
Educational questions:
- Why does == sometimes return different results than ===?
- When would you want loose vs strict equality?
- Which comparison operators trigger coercion?
- How can you avoid comparison surprises?
*/