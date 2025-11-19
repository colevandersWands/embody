'use strict';

/* Functions: Basic Rest Parameters

Rest parameters (...) collect multiple arguments into an array.
ES6 feature for handling variable numbers of arguments.

Study with:
- ?variables to see rest parameter array creation
- ?trace to follow argument collection into array
*/

// Basic rest parameters
function sumNumbers(...numbers) {
    console.log('Rest parameter numbers: ' + numbers);
    console.log('Type: ' + typeof numbers);
    console.log('Is array: ' + Array.isArray(numbers));
    
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        console.log('Adding: ' + numbers[i]);
        sum += numbers[i];
    }
    
    console.log('Total sum: ' + sum);
    return sum;
}

// Test with different numbers of arguments
console.log('=== Basic Rest Parameters ===');

console.log('With 2 arguments:');
sumNumbers(10, 20);

console.log('With 4 arguments:');
sumNumbers(1, 2, 3, 4);

console.log('With no arguments:');
sumNumbers();

/*
How do rest parameters collect variable arguments into an array?
*/