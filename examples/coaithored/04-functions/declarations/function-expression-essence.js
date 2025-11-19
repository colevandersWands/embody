'use strict';

/* Functions: Function Expression Essence

Functions as values - can be assigned, passed, returned.
Not hoisted like declarations.

Study with: ?trace to see expression evaluation timing */

// Function expression assigned to variable
let greet = function(name) {
    return 'Hello, ' + name;
};

console.log(greet('World'));

// Named function expression (name for recursion)
let factorial = function fact(n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);  // Can use 'fact' internally
};

console.log('5! = ' + factorial(5));

// Function as value - can be passed
function apply(fn, value) {
    return fn(value);
}

let result = apply(function(x) { return x * 2; }, 10);
console.log('Applied: ' + result);

/* When use expression vs declaration? */