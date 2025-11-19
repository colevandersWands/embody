'use strict';

/* Objects: Basic Object Creation

Demonstrates creating objects with literal notation.
Shows properties and accessing them.

Study with:
- ?variables to see object structure
- ?trace to follow property access
*/

// Object literal
let person = {
    name: 'Alice',
    age: 25,
    city: 'Paris'
};

console.log('Person object:', person);

// Accessing properties
console.log('\nDot notation:');
console.log('Name:', person.name);
console.log('Age:', person.age);

// Bracket notation
console.log('\nBracket notation:');
console.log('City:', person['city']);

// Dynamic property access
let property = 'age';
console.log('Dynamic access:', person[property]);

// Adding properties
person.email = 'alice@example.com';
console.log('\nAfter adding email:', person);

// Checking property existence
console.log('\nHas name?', 'name' in person);
console.log('Has phone?', 'phone' in person);

/*
Educational questions:
- What's the difference between dot and bracket notation?
- When do you need bracket notation?
- How are properties stored in objects?
*/