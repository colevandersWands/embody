'use strict';

/* Variable Roles: Resource Guard Conditions

Guard flags check resource availability before access.
FLAG role: ensures resources are ready for use.

Study with:
- ?variables to see resource availability checks
- ?trace to follow multi-condition guard logic
*/

// Resource availability guard
console.log('=== Resource availability guard ===');
let isServerAvailable = true;      // FLAG role: server status
let isUserAuthenticated = false;   // FLAG role: user access status
let canProcessRequest = false;     // FLAG role: combined authorization

// Simulate authentication check
console.log('Checking user authentication...');
let userCode = 0;    // 0 = not authenticated, 1001 = authenticated
let serverCode = 1;  // 1 = available, 0 = unavailable

if (userCode === 1001) {
    isUserAuthenticated = true;
}

if (serverCode === 1) {
    isServerAvailable = true;
}

// Combined guard condition
if (isUserAuthenticated && isServerAvailable) {
    canProcessRequest = true;
}

console.log('Resource check results:');
console.log('  isUserAuthenticated: ' + isUserAuthenticated);
console.log('  isServerAvailable: ' + isServerAvailable);
console.log('  canProcessRequest: ' + canProcessRequest);

if (canProcessRequest) {
    console.log('Processing request...');
} else {
    console.log('Error prevented: Resources not ready');
}

/*
How do multiple guard flags work together to ensure safety?
*/