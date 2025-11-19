'use strict';

/* Variables: Declaration

Demonstrates declaring variables without initial values.
Shows that declared variables start with 'undefined'.

Study with:
- ?variables lens to see when variables are created
- ?trace to watch the declaration step-by-step
*/

// Declare variables without initial values
let animal;
let color;
let count;

// Check their initial values
console.log('animal:', animal, '(type:', typeof animal, ')');
console.log('color:', color, '(type:', typeof color, ')');
console.log('count:', count, '(type:', typeof count, ')');

// Now assign values
animal = 'cat';
color = 'orange';
count = 3;

console.log('After assignment:');
console.log('animal:', animal, '(type:', typeof animal, ')');
console.log('color:', color, '(type:', typeof color, ')');
console.log('count:', count, '(type:', typeof count, ')');

/*
Educational questions:
- What is the initial value of declared variables?
- What does 'undefined' mean?
- How does the ?variables lens show variable creation vs assignment?
- Why declare variables before using them?
*/