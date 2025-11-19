'use strict';

/* Variable Roles: Basic Status Flags

Boolean flags track simple on/off states.
FLAG role: remembers true/false status information.

Study with:
- ?variables to see flag state changes
- ?trace to follow flag-based conditional logic
*/

// Basic status flag
console.log('=== Basic status flag ===');
let isLoggedIn = false;    // FLAG role: tracks login status

console.log('Initial login status: ' + isLoggedIn);

// Simulate login process using primitive values
let usernameCode = 1001;  // Code for 'alice'
let passwordCode = 7834;  // Code for 'secret123'

console.log('Attempting login...');
console.log('  Username code: ' + usernameCode);
console.log('  Password code: ' + passwordCode);

if (usernameCode === 1001 && passwordCode === 7834) {
    isLoggedIn = true;
    console.log('Login successful!');
} else {
    console.log('Login failed!');
}

console.log('Final login status: ' + isLoggedIn);

// Use the flag to control access
if (isLoggedIn) {
    console.log('Access granted: Welcome to the system');
} else {
    console.log('Access denied: Please log in');
}

/*
How do boolean flags track and control system states?
*/