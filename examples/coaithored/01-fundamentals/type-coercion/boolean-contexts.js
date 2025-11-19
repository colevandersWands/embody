'use strict';

/* Type Coercion: Boolean Contexts

Shows how JavaScript converts values to booleans in conditionals.
Demonstrates truthy vs falsy values and boolean coercion rules.

Study with:
- ?trace to see the boolean conversion
- Try different test values by commenting/uncommenting
*/

// Test different values - uncomment to explore
let testValue = '';
// let testValue = 'hello';
// let testValue = 0;
// let testValue = 42;
// let testValue = null;
// let testValue = undefined;
// let testValue = [];
// let testValue = {};

console.log('Testing value:', testValue, '(type:', typeof testValue, ')');
console.log();

// Boolean conversion in if statement
if (testValue) {
    console.log('✓ Value is truthy');
} else {
    console.log('✗ Value is falsy');
}

// Explicit boolean conversion
let explicitBoolean = Boolean(testValue);
console.log('Boolean(testValue):', explicitBoolean);

// Double negation trick
let doubleNegation = !!testValue;
console.log('!!testValue:', doubleNegation);

// All falsy values in JavaScript
console.log('\nAll falsy values:');
console.log('false:', !!false);
console.log('0:', !!0);
console.log('-0:', !!-0);
console.log('"":', !!"");
console.log('null:', !!null);
console.log('undefined:', !!undefined);
console.log('NaN:', !!NaN);

/*
Educational questions:
- Which values are falsy in JavaScript?
- How does if() convert values to booleans?
- What's the difference between Boolean() and !!?
- Why might empty arrays and objects be truthy?
*/