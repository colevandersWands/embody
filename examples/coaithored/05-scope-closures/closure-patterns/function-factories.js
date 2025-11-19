'use strict';

/* Closure Patterns: Function Factories

Demonstrates using closures to create specialized functions
with different behaviors based on their creation parameters.

Study with:
- ?variables to see parameter capture
- ?trace to see factory pattern execution
*/

// Factory for creating multiplier functions
function createMultiplier(factor) {
    // The factor is captured in the closure
    return function(number) {
        const result = number * factor;
        console.log(`${number} × ${factor} = ${result}`);
        return result;
    };
}

// Factory for creating validator functions
function createValidator(min, max) {
    // Both min and max are captured
    return function(value) {
        const isValid = value >= min && value <= max;
        console.log(`${value} is ${isValid ? 'valid' : 'invalid'} (range: ${min}-${max})`);
        return isValid;
    };
}

// Create specialized functions
console.log('=== Creating Specialized Functions ===');
const double = createMultiplier(2);
const triple = createMultiplier(3);
const ageValidator = createValidator(0, 120);
const percentValidator = createValidator(0, 100);

// Use the specialized functions
console.log('\n=== Using Multipliers ===');
double(5);  // 5 × 2 = 10
triple(4);  // 4 × 3 = 12

console.log('\n=== Using Validators ===');
ageValidator(25);    // valid
ageValidator(150);   // invalid
percentValidator(85); // valid
percentValidator(101); // invalid

/*
Educational questions:
- How does each function remember its creation parameters?
- What's the advantage of this pattern over global variables?
- How are the different multipliers independent?
*/