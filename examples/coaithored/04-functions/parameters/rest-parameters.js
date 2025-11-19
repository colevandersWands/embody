'use strict';

/* Functions: Rest Parameters Overview

Rest parameter concepts have been split into focused examples:
- basic-rest-parameters.js - collecting arguments into arrays
- rest-with-named-parameters.js - combining named and rest parameters
- rest-vs-arguments.js - modern rest vs legacy arguments object

Study with:
- Start with basic-rest-parameters.js for core concepts
- ?variables to see rest parameter array creation
*/

// Quick demonstration of rest parameters
console.log('=== Rest Parameters Core Concept ===');

function collectArguments(...args) {
    console.log('Received ' + args.length + ' arguments');
    console.log('Arguments array: ' + args);
    
    return args.length;
}

console.log('With 2 args: ' + collectArguments('a', 'b'));
console.log('With 4 args: ' + collectArguments(1, 2, 3, 4));

// Demonstrate rest position requirement
function mixedParameters(first, second, ...rest) {
    console.log('First: ' + first);
    console.log('Second: ' + second);
    console.log('Rest: ' + rest);
}

mixedParameters('one', 'two', 'three', 'four');

/*
See the focused examples for detailed exploration of rest parameters.
*/