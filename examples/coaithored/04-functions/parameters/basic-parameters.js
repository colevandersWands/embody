'use strict';

/* Functions: Basic Parameters

Parameters are local variables that receive argument values.
Parameters enable functions to work with different input data.

Study with:
- ?variables to see parameter scope and assignment
- ?trace to follow argument passing into parameters
*/

// Function with single parameter
function greetUser(name) {
    console.log('Hello, ' + name + '!');
    return 'Greeting for ' + name;
}

// Function with multiple parameters
function calculateSum(num1, num2) {
    console.log('Adding ' + num1 + ' + ' + num2);
    let result = num1 + num2;
    console.log('Sum is: ' + result);
    return result;
}

// Function parameters are local variables
function processNumber(value) {
    console.log('Original parameter: ' + value);
    value = value * 2;  // Modifying parameter doesn't affect original
    console.log('Modified parameter: ' + value);
    return value;
}

// Missing parameters become undefined
function testMissingParams(first, second, third) {
    console.log('first: ' + first);
    console.log('second: ' + second);  
    console.log('third: ' + third);
}

// Test parameter behavior
console.log('=== Testing Parameters ===');

let greeting = greetUser('Alice');
console.log('Result: ' + greeting);

let sum = calculateSum(10, 25);
console.log('Sum result: ' + sum);

let original = 5;
console.log('Before: original = ' + original);
let doubled = processNumber(original);
console.log('After: original = ' + original);
console.log('Returned: ' + doubled);

testMissingParams('one', 'two');  // Third parameter is undefined

/*
How do parameters become local variables that receive argument values?
*/