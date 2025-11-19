'use strict';

/* Variable Roles: Guard Condition Flags Overview

Guard condition concepts have been split into focused examples:
- basic-guard-conditions.js - division by zero protection
- range-guard-conditions.js - boundary validation guards
- resource-guard-conditions.js - multi-condition safety checks

Study with:
- Start with basic-guard-conditions.js for core concepts
- ?variables to see FLAG role protecting operations
*/

// Quick demonstration of guard concept
console.log('=== Guard Condition Core Concept ===');

let isSafe = false;        // FLAG role: protects operation
let value = 5;

if (value > 0) {
    isSafe = true;         // Guard condition passed
}

console.log('Safety check: ' + isSafe);

if (isSafe) {
    console.log('Operation allowed: processing value ' + value);
} else {
    console.log('Operation blocked: value not safe');
}

/*
See the focused examples for detailed exploration of guard conditions.
*/
