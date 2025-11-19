'use strict';

/* Errors: Runtime Errors

Demonstrates errors that occur during code execution.
Shows common runtime error types and when they happen.

Study with:
- ?trace to see when errors occur
- Try commenting/uncommenting different error examples
*/

// ReferenceError - using undefined variable
console.log('=== ReferenceError ===');
try {
    console.log(undefinedVariable);
} catch (error) {
    console.log('Caught:', error.name, '-', error.message);
}

// TypeError - wrong type operation
console.log('\n=== TypeError ===');
try {
    let number = 42;
    number.toUpperCase(); // Numbers don't have toUpperCase
} catch (error) {
    console.log('Caught:', error.name, '-', error.message);
}

// RangeError - value out of valid range
console.log('\n=== RangeError ===');
try {
    let array = new Array(-5); // Negative length not allowed
} catch (error) {
    console.log('Caught:', error.name, '-', error.message);
}

// TypeError - calling non-function
console.log('\n=== TypeError (not a function) ===');
try {
    let notAFunction = 'hello';
    notAFunction(); // Strings aren't callable
} catch (error) {
    console.log('Caught:', error.name, '-', error.message);
}

console.log('\nProgram continues after caught errors!');

/*
Educational questions:
- What's the difference between syntax and runtime errors?
- When do runtime errors occur?
- How can you handle runtime errors gracefully?
*/