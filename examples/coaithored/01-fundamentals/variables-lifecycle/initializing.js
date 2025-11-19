'use strict';

/* Variables: Initialization

Compares declaring vs declaring+initializing variables.
Shows declare-then-assign vs declare-and-initialize patterns.

Study with:
- ?variables to see different initialization patterns
- ?trace to compare execution paths
*/

// Pattern 1: Declare then assign separately
let firstName;
firstName = 'Alice';

// Pattern 2: Declare and initialize together
let lastName = 'Johnson';

// Pattern 3: Multiple declarations with different patterns
let age;
let city = 'Paris';
let isStudent = true;

// Assign the uninitialized variable
age = 25;

console.log('firstName:', firstName);
console.log('lastName:', lastName);
console.log('age:', age);
console.log('city:', city);
console.log('isStudent:', isStudent);

// Compare both patterns
console.log('\nAll values initialized!');

/*
Educational questions:
- What's the difference between declaration and initialization?
- Which pattern is clearer for reading code?
- When might you declare without initializing?
- How does the ?trace lens show the difference?
*/