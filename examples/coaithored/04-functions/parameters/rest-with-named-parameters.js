'use strict';

/* Functions: Rest with Named Parameters

Combine named parameters with rest parameters.
Rest parameter must be the last parameter.

Study with:
- ?variables to see named vs rest parameter separation
- ?trace to follow parameter assignment order
*/

// Rest parameters with named parameters
function greetPeople(greeting, ...names) {
    console.log('Greeting: ' + greeting);
    console.log('Names to greet: ' + names);
    console.log('Number of names: ' + names.length);
    
    for (let i = 0; i < names.length; i++) {
        let message = greeting + ', ' + names[i] + '!';
        console.log('Message ' + (i + 1) + ': ' + message);
    }
}

// Test named + rest parameters
console.log('=== Named + Rest Parameters ===');

console.log('Single name:');
greetPeople('Hello', 'Alice');

console.log('Multiple names:');
greetPeople('Welcome', 'Bob', 'Charlie', 'Diana');

console.log('No names:');
greetPeople('Hi');

// Multiple named parameters with rest
function processData(operation, defaultValue, ...values) {
    console.log('Operation: ' + operation);
    console.log('Default: ' + defaultValue);
    console.log('Values: ' + values);
    
    if (values.length === 0) {
        return defaultValue;
    }
    
    return values.length;
}

console.log('Process result: ' + processData('count', 0, 1, 2, 3));

/*
How do named parameters work together with rest parameters?
*/