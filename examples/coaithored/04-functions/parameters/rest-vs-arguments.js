'use strict';

/* Functions: Rest vs Arguments Object

Rest parameters vs traditional arguments object.
Shows modern ES6 approach vs legacy pattern.

Study with:
- ?variables to see rest array vs arguments object
- ?trace to compare access patterns
*/

// Traditional arguments object
function oldWaySum() {
    console.log('=== Arguments Object (Legacy) ===');
    console.log('arguments: ' + arguments);
    console.log('Type: ' + typeof arguments);
    console.log('Is array: ' + Array.isArray(arguments));
    console.log('Length: ' + arguments.length);
    
    let sum = 0;
    for (let i = 0; i < arguments.length; i++) {
        console.log('Adding: ' + arguments[i]);
        sum += arguments[i];
    }
    
    return sum;
}

// Modern rest parameters
function newWaySum(...numbers) {
    console.log('=== Rest Parameters (Modern) ===');
    console.log('numbers: ' + numbers);
    console.log('Type: ' + typeof numbers);
    console.log('Is array: ' + Array.isArray(numbers));
    console.log('Length: ' + numbers.length);
    
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        console.log('Adding: ' + numbers[i]);
        sum += numbers[i];
    }
    
    return sum;
}

// Compare both approaches
console.log('Old way result: ' + oldWaySum(1, 2, 3));
console.log('New way result: ' + newWaySum(1, 2, 3));

/*
What are the advantages of rest parameters over the arguments object?
*/