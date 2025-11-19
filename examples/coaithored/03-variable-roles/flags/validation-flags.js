'use strict';

/* Variable Roles: Validation Flags

Multiple flags track different validation criteria.
FLAG role: each flag validates one specific requirement.

Study with:
- ?variables to see multiple flag validations
- ?trace to follow combined validation logic
*/

// Multiple validation flags
console.log('=== Multiple validation flags ===');
let isValidEmail = false;     // FLAG role: email format validation
let isValidPassword = false;  // FLAG role: password strength validation
let isAdult = false;         // FLAG role: age requirement validation

// Simulate form validation using primitive checks
let emailCode = 5;       // 5 = valid email format
let passwordLength = 8;  // Length check
let userAge = 25;        // Age check

console.log('Validating user input...');
console.log('  Email code: ' + emailCode);
console.log('  Password length: ' + passwordLength);
console.log('  User age: ' + userAge);

// Validate email (code 5 represents valid format)
if (emailCode === 5) {
    isValidEmail = true;
    console.log('  Email: Valid');
} else {
    console.log('  Email: Invalid');
}

// Validate password (minimum 8 characters)
if (passwordLength >= 8) {
    isValidPassword = true;
    console.log('  Password: Valid');
} else {
    console.log('  Password: Too short');
}

// Validate age (must be 18 or older)
if (userAge >= 18) {
    isAdult = true;
    console.log('  Age: Valid');
} else {
    console.log('  Age: Too young');
}

// Overall validation result
let canRegister = isValidEmail && isValidPassword && isAdult;
console.log('Registration allowed: ' + canRegister);

/*
How do multiple validation flags work together to ensure data quality?
*/