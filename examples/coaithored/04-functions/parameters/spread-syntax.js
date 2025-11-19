'use strict';

/* Functions: Spread Syntax with Parameters Overview

Spread syntax concepts distilled to essence:
- spread-syntax-essence.js - unpacking arrays into function arguments
- (additional focused examples as needed)

Study with: Start with spread-syntax-essence.js */

// Quick demonstration of spread syntax
function quickDemo(a, b, c) {
    return a + b + c;
}

let values = [10, 20, 30];

// Without spread (manual)
console.log('Manual:', quickDemo(values[0], values[1], values[2])); // 60

// With spread (elegant)
console.log('Spread:', quickDemo(...values)); // 60

// Common use cases
console.log('Math.max:', Math.max(...[5, 2, 8, 1])); // 8
console.log('Array copy:', [...[1, 2, 3]]); // [1, 2, 3]
console.log('Array combine:', [...[1, 2], ...[3, 4]]); // [1, 2, 3, 4]

// Function call with spread
function greet(greeting, ...names) {
    return names.map(name => `${greeting}, ${name}!`);
}

let people = ['Alice', 'Bob'];
console.log('Greetings:', greet('Hello', ...people));

/* See essence files for detailed spread exploration */