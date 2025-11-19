'use strict';

/* Scope: Parameter Scope

Function parameters are scoped to the function.
Parameters act like local variables initialized with argument values.

Study with:
- ?variables to see parameter scope behavior
- ?trace to follow parameter assignment and access
*/

// Global variables with same names as parameters
var message = 'Global message';
var count = 'Global count';

function demonstrateParameterScope(message, count) {
    console.log('Inside function:');
    console.log('  message parameter: ' + message);
    console.log('  count parameter: ' + count);
    
    // Parameters shadow global variables with same names
    message = 'Modified parameter';
    count = 999;
    
    console.log('After modification:');
    console.log('  message parameter: ' + message);
    console.log('  count parameter: ' + count);
}

// Test parameter scope
console.log('=== Parameter Scope ===');
console.log('Before function call:');
console.log('  global message: ' + message);
console.log('  global count: ' + count);

demonstrateParameterScope('Hello World', 42);

console.log('After function call:');
console.log('  global message: ' + message);  // Unchanged
console.log('  global count: ' + count);      // Unchanged

/*
How do parameters create their own scope within functions?
*/