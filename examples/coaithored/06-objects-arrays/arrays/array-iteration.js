'use strict';

/* Arrays: Iteration Methods

Demonstrates forEach, map, filter, reduce.
Shows functional array processing.

Study with:
- ?trace to follow iteration
- ?variables to see transformations
*/

let numbers = [1, 2, 3, 4, 5];

// forEach - execute for each element
console.log('Using forEach:');
numbers.forEach(function(num, index) {
    console.log(`  Index ${index}: ${num}`);
});

// map - transform each element
let doubled = numbers.map(function(num) {
    return num * 2;
});
console.log('\nDoubled with map:', doubled);
console.log('Original unchanged:', numbers);

// filter - keep matching elements
let evens = numbers.filter(function(num) {
    return num % 2 === 0;
});
console.log('\nEvens with filter:', evens);

// reduce - combine into single value
let sum = numbers.reduce(function(total, num) {
    return total + num;
}, 0);
console.log('\nSum with reduce:', sum);

// Chaining methods
let result = numbers
    .filter(n => n > 2)
    .map(n => n * 3);
console.log('\nChained result:', result);

/*
Educational questions:
- Which methods return new arrays?
- What does reduce's second parameter do?
- How do these compare to for loops?
*/