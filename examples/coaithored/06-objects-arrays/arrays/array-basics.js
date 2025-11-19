'use strict';

/* Arrays: Basic Array Creation

Demonstrates creating arrays and accessing elements.
Shows array literals and basic properties.

Study with:
- ?variables to see array structure
- ?trace to follow element access
*/

// Array literal
let fruits = ['apple', 'banana', 'orange'];
console.log('Fruits array:', fruits);

// Accessing elements by index
console.log('\nAccessing elements:');
console.log('First fruit:', fruits[0]);
console.log('Second fruit:', fruits[1]);
console.log('Last fruit:', fruits[fruits.length - 1]);

// Array properties
console.log('\nArray properties:');
console.log('Length:', fruits.length);
console.log('Type:', typeof fruits); // object!
console.log('Is array?', Array.isArray(fruits));

// Modifying elements
fruits[1] = 'grape';
console.log('\nAfter modification:', fruits);

// Adding elements
fruits[3] = 'mango';
console.log('After adding:', fruits);

// Mixed types in arrays
let mixed = [42, 'text', true, null];
console.log('\nMixed array:', mixed);

/*
Educational questions:
- Why is typeof array 'object'?
- What happens if you access an index that doesn't exist?
- Can arrays have gaps in their indices?
*/