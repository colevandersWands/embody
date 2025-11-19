'use strict';

/* Variable Roles: Search Result Flags

Flags track whether search operations found results.
FLAG role: remembers if target was found during search.

Study with:
- ?variables to see flag changes during search
- ?trace to follow search termination logic
*/

// Search result flag
console.log('=== Search result flag ===');
let userFound = false;     // FLAG role: tracks search success
let foundUserId = 0;
let targetId = 1003;

console.log('Searching for user ID: ' + targetId);

// Simulate searching through user codes
for (let userId = 1001; userId <= 1005; userId++) {
    console.log('Checking user ID: ' + userId);
    
    if (userId === targetId) {
        userFound = true;
        foundUserId = userId;
        console.log('Target user found!');
        break;  // Stop searching when found
    }
}

// Use the flag to report results
if (userFound) {
    console.log('Search successful: Found user ' + foundUserId);
} else {
    console.log('Search failed: User ' + targetId + ' not found');
}

// Try searching for non-existent user
console.log('\nSearching for non-existent user...');
userFound = false;  // Reset flag
targetId = 9999;

for (let userId = 1001; userId <= 1005; userId++) {
    if (userId === targetId) {
        userFound = true;
        break;
    }
}

console.log('Result: ' + (userFound ? 'Found' : 'Not found'));

/*
How do search flags control loop termination and result reporting?
*/