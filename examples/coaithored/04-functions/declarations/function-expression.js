'use strict';

/* Functions: Function Expression Overview

Function expression concepts distilled to essence:
- function-expression-essence.js - syntax and core behavior
- (additional focused examples as needed)

Study with: Start with essence - master syntax first */

// Overview demonstration
let greet = function(name) {
    return 'Hello, ' + name;
};

// Named function expression (for recursion/debugging)
let factorial = function fact(n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);  // 'fact' only available inside
};

// Function as value - can be passed around
function apply(fn, value) {
    return fn(value);
}

let result = apply(function(x) { return x * 2; }, 10);

console.log('Greet: ' + greet('World'));
console.log('5! = ' + factorial(5));
console.log('Applied: ' + result);

/* See focused examples for deep exploration */