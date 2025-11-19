'use strict';

/* Hello World: Personalized

Combines user input with template strings.
Demonstrates string concatenation and template literals.

Study with:
- ?trace to watch the prompt and string building
- ?variables to see how name and greeting are used
*/

// Get user's name
let name = prompt('What is your name?');
// let name = 'Alice';  // For testing without prompt
// let name = '';       // Test with empty input
// let name = null;     // Test with canceled prompt

// Handle different input cases
let greeting;
if (name === null || name === '') {
    greeting = 'Hello, Anonymous!';
} else {
    greeting = 'Hello, ' + name + '!';
}

console.log(greeting);
console.log('Name entered:', name);

/*
Educational questions:
- What happens when the user cancels the prompt?
- How does template string syntax work?
- What's the difference between null and empty string?
- How does the conditional logic handle different inputs?
*/