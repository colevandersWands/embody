'use strict';

/* Functions: Function Declarations

Basic function declaration syntax and hoisting behavior.
Functions organize code into reusable blocks.

Study with: ?trace to see function call flow */

// Basic function declaration
function greet(name) {
    return 'Hello, ' + name + '!';
}

// Function declarations are hoisted - this works!
console.log('Called before declaration: ' + sayHello('Alice'));

function sayHello(name) {
    return 'Hi, ' + name;
}

// Multiple parameters
function add(a, b) {
    return a + b;
}

console.log('Greet: ' + greet('World'));
console.log('Add: ' + add(5, 3));

/* Why do function declarations work before they appear? */